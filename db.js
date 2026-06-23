const fs = require("fs");
const path = require("path");

const APP_STATE_KEY = "main";
const CREATE_APP_STATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS app_state (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT NOW()
  )
`;

function createEmptyStore() {
  return {
    users: [],
    sessions: [],
  };
}

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch (_error) {
    return null;
  }
}

function normalizeStore(value) {
  const parsed =
    typeof value === "string"
      ? safeParseJson(value) || createEmptyStore()
      : value || createEmptyStore();

  return {
    users: Array.isArray(parsed.users) ? parsed.users : [],
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
  };
}

function getSslPreference(connectionString) {
  const explicitSetting = String(process.env.DATABASE_SSL || "").trim().toLowerCase();

  if (explicitSetting === "true") {
    return true;
  }

  if (explicitSetting === "false") {
    return false;
  }

  const sslMode = String(process.env.PGSSLMODE || "").trim().toLowerCase();

  if (["require", "verify-ca", "verify-full"].includes(sslMode)) {
    return true;
  }

  if (["disable", "allow", "prefer"].includes(sslMode)) {
    return false;
  }

  try {
    const parsedUrl = new URL(connectionString);
    const urlSslMode = String(parsedUrl.searchParams.get("sslmode") || "")
      .trim()
      .toLowerCase();

    if (["require", "verify-ca", "verify-full"].includes(urlSslMode)) {
      return true;
    }

    if (["disable", "allow", "prefer"].includes(urlSslMode)) {
      return false;
    }
  } catch (_error) {
    return null;
  }

  return null;
}

function getConnectionOptions(connectionString) {
  const sslPreference = getSslPreference(connectionString);

  if (sslPreference === true) {
    return [
      {
        connectionString,
        ssl: { rejectUnauthorized: false },
      },
    ];
  }

  if (sslPreference === false) {
    return [{ connectionString }];
  }

  return [
    { connectionString },
    {
      connectionString,
      ssl: { rejectUnauthorized: false },
    },
  ];
}

function createStorePersistence(options = {}) {
  const dataDirectory = options.dataDirectory || path.join(__dirname, "data");
  const usersPath = options.usersPath || path.join(dataDirectory, "users.json");
  const logger = options.logger || console;
  const databaseUrl = String(process.env.DATABASE_URL || "").trim();
  let Pool = null;
  let pool = null;
  let databaseReady = false;
  let databaseDisabled = false;
  let storageMode = "json";
  let writeQueue = Promise.resolve();

  if (databaseUrl) {
    try {
      ({ Pool } = require("pg"));
    } catch (error) {
      databaseDisabled = true;
      logger.warn?.(
        `[db] PostgreSQL driver is not installed, using local JSON storage instead. ${error.message}`,
      );
    }
  }

  async function loadStoreFromFile() {
    await fs.promises.mkdir(dataDirectory, { recursive: true });

    try {
      const raw = await fs.promises.readFile(usersPath, "utf8");
      return normalizeStore(raw);
    } catch (error) {
      if (error.code === "ENOENT") {
        return createEmptyStore();
      }

      try {
        const brokenPath = `${usersPath}.broken-${Date.now()}`;
        await fs.promises.copyFile(usersPath, brokenPath);
      } catch (_copyError) {
        // Ignore backup errors and fall back to a clean store.
      }

      return createEmptyStore();
    }
  }

  async function saveStoreToFile(snapshot) {
    await fs.promises.mkdir(dataDirectory, { recursive: true });
    await fs.promises.writeFile(usersPath, JSON.stringify(snapshot, null, 2));
  }

  async function ensureDatabase() {
    if (!databaseUrl || !Pool || databaseDisabled) {
      return false;
    }

    if (databaseReady && pool) {
      return true;
    }

    let lastError = null;

    for (const connectionOptions of getConnectionOptions(databaseUrl)) {
      const candidatePool = new Pool(connectionOptions);

      try {
        await candidatePool.query("SELECT 1");
        await candidatePool.query(CREATE_APP_STATE_TABLE_SQL);
        pool = candidatePool;
        databaseReady = true;
        storageMode = "postgres";
        return true;
      } catch (error) {
        lastError = error;
        await candidatePool.end().catch(() => {});
      }
    }

    throw lastError || new Error("Unable to connect to PostgreSQL.");
  }

  function disableDatabase(error, context) {
    databaseDisabled = true;
    databaseReady = false;
    storageMode = "json";

    if (pool) {
      const currentPool = pool;
      pool = null;
      currentPool.end().catch(() => {});
    }

    if (error) {
      logger.error?.(`[db] ${context}. Falling back to local JSON storage. ${error.message}`);
    }
  }

  async function loadStoreFromDatabase() {
    await ensureDatabase();

    const result = await pool.query(
      "SELECT value FROM app_state WHERE key = $1 LIMIT 1",
      [APP_STATE_KEY],
    );

    if (result.rows.length > 0) {
      return normalizeStore(result.rows[0].value);
    }

    const seededStore = await loadStoreFromFile();
    const initialStore =
      seededStore.users.length > 0 || seededStore.sessions.length > 0
        ? seededStore
        : createEmptyStore();

    await saveStoreToDatabase(initialStore);
    return initialStore;
  }

  async function saveStoreToDatabase(snapshot) {
    await ensureDatabase();
    await pool.query(
      `
        INSERT INTO app_state (key, value, updated_at)
        VALUES ($1, $2::jsonb, NOW())
        ON CONFLICT (key)
        DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `,
      [APP_STATE_KEY, JSON.stringify(snapshot)],
    );
  }

  async function loadStore() {
    if (databaseUrl && Pool && !databaseDisabled) {
      try {
        return await loadStoreFromDatabase();
      } catch (error) {
        disableDatabase(error, "Failed to initialize PostgreSQL");
      }
    }

    return loadStoreFromFile();
  }

  async function saveStore(nextStore) {
    const snapshot = normalizeStore(nextStore);

    writeQueue = writeQueue.catch(() => {}).then(async () => {
      if (databaseUrl && Pool && !databaseDisabled) {
        try {
          await saveStoreToDatabase(snapshot);
          await saveStoreToFile(snapshot);
          return;
        } catch (error) {
          disableDatabase(error, "Failed to save PostgreSQL state");
        }
      }

      await saveStoreToFile(snapshot);
    });

    return writeQueue;
  }

  return {
    createEmptyStore,
    loadStore,
    saveStore,
    getStorageMode() {
      return storageMode;
    },
  };
}

module.exports = {
  createEmptyStore,
  createStorePersistence,
  normalizeStore,
};
