const crypto = require("crypto");
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { createEmptyStore, createStorePersistence } = require("./db");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "public");
const dataDirectory = process.env.DATA_DIR || path.join(__dirname, "data");
const usersPath = path.join(dataDirectory, "users.json");
const persistence = createStorePersistence({ dataDirectory, usersPath });
const rooms = new Map();
const duelLoops = new Map();
const DUEL_WIDTH = 800;
const DUEL_HEIGHT = 480;
const DUEL_DURATION_MS = 180000;
const DUEL_PADDLE_HEIGHT = 112;
const DUEL_PADDLE_SPEED = 420;
const DUEL_PADDLE_X = 42;
const DUEL_BALL_RADIUS = 11;
const DUEL_TICK_INTERVAL_MS = 1000 / 24;
const DUEL_BROADCAST_INTERVAL_MS = 1000 / 18;
const LEADERBOARD_ENTRY_MIN_POINTS = 1;
const UNUSED_ACCOUNT_TTL_MS = 3 * 60 * 60 * 1000;
const UNUSED_ACCOUNT_CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
const ZERO_POINT_ACCOUNT_SESSION_GRACE_MS = 30 * 60 * 1000;

app.use(express.json({ limit: "32kb" }));
app.use(express.static(publicPath));

let store = createEmptyStore();
let lastUnusedAccountCleanupAt = 0;

app.use((_request, _response, next) => {
  cleanupUnusedAccounts();
  next();
});

app.get("/health", (_request, response) => {
  response.json({ ok: true, storage: persistence.getStorageMode() });
});

app.post("/api/auth/register", (request, response) => {
  const name = normalizeName(request.body?.name);
  const pin = normalizePin(request.body?.pin);

  if (!name || !pin) {
    response.status(400).json({ ok: false, message: "昵称和口令都要填写" });
    return;
  }

  if (findUserByName(name)) {
    response.status(409).json({ ok: false, message: "这个昵称已经被注册" });
    return;
  }

  const pinHash = hashPin(pin);
  const user = {
    id: crypto.randomUUID(),
    name,
    pinSalt: pinHash.salt,
    pinHash: pinHash.hash,
    totalPoints: 0,
    createdAt: Date.now(),
    settledGames: [],
    recentResults: [],
    stats: createDefaultStats(),
  };

  store.users.push(user);
  const token = createSession(user.id);
  saveStore();

  response.json({ ok: true, token, profile: getPublicProfile(user) });
});

app.post("/api/auth/login", (request, response) => {
  const name = normalizeName(request.body?.name);
  const pin = normalizePin(request.body?.pin);
  const user = findUserByName(name);

  if (!user || !verifyPin(pin, user)) {
    response.status(401).json({ ok: false, message: "昵称或口令不正确" });
    return;
  }

  ensureUserShape(user);
  const token = createSession(user.id);
  saveStore();

  response.json({ ok: true, token, profile: getPublicProfile(user) });
});

app.post("/api/auth/logout", requireAuth, (request, response) => {
  const token = getTokenFromRequest(request);
  store.sessions = store.sessions.filter((session) => session.token !== token);
  saveStore();
  cleanupUnusedAccounts({ force: true });
  response.json({ ok: true });
});

app.get("/api/me", requireAuth, (request, response) => {
  response.json({ ok: true, profile: getPublicProfile(request.user) });
});

app.get("/api/leaderboard", (_request, response) => {
  response.json({ ok: true, players: getGlobalLeaderboard() });
});

app.post("/api/games/2048/results", requireAuth, (request, response) => {
  const gameId = String(request.body?.gameId || "").trim();
  const score = clampInteger(request.body?.score, 0, 999999999);
  const bestTile = clampInteger(request.body?.bestTile, 0, 999999999);
  const moves = clampInteger(request.body?.moves, 0, 999999999);
  const won = Boolean(request.body?.won || bestTile >= 2048);
  const user = request.user;

  ensureUserShape(user);

  if (!gameId) {
    response.status(400).json({ ok: false, message: "缺少本局编号" });
    return;
  }

  if (user.settledGames.includes(gameId)) {
    response.json({
      ok: true,
      duplicate: true,
      award: { points: 0, score, bestTile, moves, won },
      profile: getPublicProfile(user),
      leaderboard: getGlobalLeaderboard(),
    });
    return;
  }

  const award = calculate2048Award({ score, bestTile, moves, won });
  const gameStats = user.stats.games["2048"];

  user.totalPoints += award.points;
  user.stats.gamesPlayed += 1;
  user.stats.lastPlayedAt = Date.now();
  gameStats.plays += 1;
  gameStats.totalScore += score;
  gameStats.highScore = Math.max(gameStats.highScore, score);
  gameStats.bestTile = Math.max(gameStats.bestTile, bestTile);
  gameStats.wins += won ? 1 : 0;
  gameStats.lastScore = score;
  gameStats.lastPlayedAt = Date.now();
  user.settledGames.push(gameId);
  user.settledGames = user.settledGames.slice(-120);
  user.recentResults.unshift({
    game: "2048",
    score,
    bestTile,
    moves,
    won,
    points: award.points,
    playedAt: Date.now(),
  });
  user.recentResults = user.recentResults.slice(0, 12);
  saveStore();

  response.json({
    ok: true,
    award,
    profile: getPublicProfile(user),
    leaderboard: getGlobalLeaderboard(),
  });
});

app.post("/api/games/minesweeper-3d/results", requireAuth, (request, response) => {
  const gameId = String(request.body?.gameId || "").trim();
  const won = Boolean(request.body?.won);
  const revealed = clampInteger(request.body?.revealed, 0, 999999);
  const totalSafe = clampInteger(request.body?.totalSafe, 1, 999999);
  const flags = clampInteger(request.body?.flags, 0, 999999);
  const seconds = clampInteger(request.body?.seconds, 0, 86400);
  const user = request.user;

  ensureUserShape(user);

  if (!gameId) {
    response.status(400).json({ ok: false, message: "缺少本局编号" });
    return;
  }

  if (user.settledGames.includes(gameId)) {
    response.json({
      ok: true,
      duplicate: true,
      award: { points: 0, won, revealed, totalSafe, flags, seconds },
      profile: getPublicProfile(user),
      leaderboard: getGlobalLeaderboard(),
    });
    return;
  }

  const award = calculateMinesweeperAward({
    won,
    revealed,
    totalSafe,
    flags,
    seconds,
  });
  const gameStats = user.stats.games.minesweeper3d;

  user.totalPoints += award.points;
  user.stats.gamesPlayed += 1;
  user.stats.lastPlayedAt = Date.now();
  gameStats.plays += 1;
  gameStats.wins += won ? 1 : 0;
  gameStats.bestClearCount = Math.max(gameStats.bestClearCount, revealed);
  gameStats.bestTime =
    won && (gameStats.bestTime === 0 || seconds < gameStats.bestTime)
      ? seconds
      : gameStats.bestTime;
  gameStats.lastResult = won ? "won" : "lost";
  gameStats.lastRevealed = revealed;
  gameStats.lastPlayedAt = Date.now();
  user.settledGames.push(gameId);
  user.settledGames = user.settledGames.slice(-160);
  user.recentResults.unshift({
    game: "minesweeper3d",
    won,
    revealed,
    totalSafe,
    flags,
    seconds,
    points: award.points,
    playedAt: Date.now(),
  });
  user.recentResults = user.recentResults.slice(0, 12);
  saveStore();

  response.json({
    ok: true,
    award,
    profile: getPublicProfile(user),
    leaderboard: getGlobalLeaderboard(),
  });
});

app.post("/api/games/flappy/results", requireAuth, (request, response) => {
  const gameId = String(request.body?.gameId || "").trim();
  const score = clampInteger(request.body?.score, 0, 999999);
  const bestScore = clampInteger(request.body?.bestScore, 0, 999999);
  const seconds = clampInteger(request.body?.seconds, 0, 86400);
  const user = request.user;

  ensureUserShape(user);

  if (!gameId) {
    response.status(400).json({ ok: false, message: "缺少本局编号" });
    return;
  }

  if (user.settledGames.includes(gameId)) {
    response.json({
      ok: true,
      duplicate: true,
      award: { points: 0, score, bestScore, seconds },
      profile: getPublicProfile(user),
      leaderboard: getGlobalLeaderboard(),
    });
    return;
  }

  const award = calculateFlappyAward({ score, seconds });
  const gameStats = user.stats.games.flappy;

  user.totalPoints += award.points;
  user.stats.gamesPlayed += 1;
  user.stats.lastPlayedAt = Date.now();
  gameStats.plays += 1;
  gameStats.totalScore += score;
  gameStats.bestScore = Math.max(gameStats.bestScore, score, bestScore);
  gameStats.bestTime =
    score > 0 && (gameStats.bestTime === 0 || seconds > gameStats.bestTime)
      ? seconds
      : gameStats.bestTime;
  gameStats.lastScore = score;
  gameStats.lastPlayedAt = Date.now();
  user.settledGames.push(gameId);
  user.settledGames = user.settledGames.slice(-180);
  user.recentResults.unshift({
    game: "flappy",
    score,
    bestScore: gameStats.bestScore,
    seconds,
    points: award.points,
    playedAt: Date.now(),
  });
  user.recentResults = user.recentResults.slice(0, 12);
  saveStore();

  response.json({
    ok: true,
    award,
    profile: getPublicProfile(user),
    leaderboard: getGlobalLeaderboard(),
  });
});

app.post("/api/games/dodge/results", requireAuth, (request, response) => {
  const gameId = String(request.body?.gameId || "").trim();
  const seconds = clampNumber(request.body?.seconds, 0, 86400);
  const grazes = clampInteger(request.body?.grazes, 0, 999999);
  const bestTime = clampNumber(request.body?.bestTime, 0, 86400);
  const user = request.user;

  ensureUserShape(user);

  if (!gameId) {
    response.status(400).json({ ok: false, message: "缺少本局编号" });
    return;
  }

  if (user.settledGames.includes(gameId)) {
    response.json({
      ok: true,
      duplicate: true,
      award: { points: 0, seconds, grazes, bestTime },
      profile: getPublicProfile(user),
      leaderboard: getGlobalLeaderboard(),
    });
    return;
  }

  const award = calculateDodgeAward({ seconds, grazes });
  const gameStats = user.stats.games.dodge;

  user.totalPoints += award.points;
  user.stats.gamesPlayed += 1;
  user.stats.lastPlayedAt = Date.now();
  gameStats.plays += 1;
  gameStats.totalTime += seconds;
  gameStats.bestTime = Math.max(gameStats.bestTime, seconds, bestTime);
  gameStats.bestGrazes = Math.max(gameStats.bestGrazes, grazes);
  gameStats.lastTime = seconds;
  gameStats.lastGrazes = grazes;
  gameStats.lastPlayedAt = Date.now();
  user.settledGames.push(gameId);
  user.settledGames = user.settledGames.slice(-200);
  user.recentResults.unshift({
    game: "dodge",
    seconds,
    grazes,
    bestTime: gameStats.bestTime,
    points: award.points,
    playedAt: Date.now(),
  });
  user.recentResults = user.recentResults.slice(0, 12);
  saveStore();

  response.json({
    ok: true,
    award,
    profile: getPublicProfile(user),
    leaderboard: getGlobalLeaderboard(),
  });
});

app.post("/api/games/untangle/results", requireAuth, (request, response) => {
  const gameId = String(request.body?.gameId || "").trim();
  const won = Boolean(request.body?.won);
  const difficulty = normalizeUntangleDifficulty(request.body?.difficulty);
  const movesUsed = clampInteger(request.body?.movesUsed, 0, 999999);
  const movesLimit = clampInteger(request.body?.movesLimit, 1, 999999);
  const intersections = clampInteger(request.body?.intersections, 0, 999999);
  const initialIntersections = clampInteger(request.body?.initialIntersections, 0, 999999);
  const seconds = clampInteger(request.body?.seconds, 0, 86400);
  const nodes = clampInteger(request.body?.nodes, 0, 999999);
  const edges = clampInteger(request.body?.edges, 0, 999999);
  const user = request.user;

  ensureUserShape(user);

  if (!gameId) {
    response.status(400).json({ ok: false, message: "缺少本局编号" });
    return;
  }

  if (user.settledGames.includes(gameId)) {
    response.json({
      ok: true,
      duplicate: true,
      award: {
        points: 0,
        won,
        difficulty,
        movesUsed,
        movesLimit,
        intersections,
        seconds,
      },
      profile: getPublicProfile(user),
      leaderboard: getGlobalLeaderboard(),
    });
    return;
  }

  const award = calculateUntangleAward({
    won,
    difficulty,
    movesUsed,
    movesLimit,
    intersections,
    initialIntersections,
    seconds,
  });
  const gameStats = user.stats.games.untangle;
  const movesLeft = Math.max(0, movesLimit - movesUsed);

  user.totalPoints += award.points;
  user.stats.gamesPlayed += 1;
  user.stats.lastPlayedAt = Date.now();
  gameStats.plays += 1;
  gameStats.wins += won ? 1 : 0;
  gameStats.bestMovesLeft = won ? Math.max(gameStats.bestMovesLeft, movesLeft) : gameStats.bestMovesLeft;
  gameStats.bestTime =
    won && (gameStats.bestTime === 0 || seconds < gameStats.bestTime)
      ? seconds
      : gameStats.bestTime;
  gameStats.bestDifficulty = won ? difficulty : gameStats.bestDifficulty;
  gameStats.lastResult = won ? "won" : "lost";
  gameStats.lastIntersections = intersections;
  gameStats.lastPlayedAt = Date.now();
  user.settledGames.push(gameId);
  user.settledGames = user.settledGames.slice(-220);
  user.recentResults.unshift({
    game: "untangle",
    won,
    difficulty,
    movesUsed,
    movesLimit,
    movesLeft,
    intersections,
    initialIntersections,
    seconds,
    nodes,
    edges,
    points: award.points,
    playedAt: Date.now(),
  });
  user.recentResults = user.recentResults.slice(0, 12);
  saveStore();

  response.json({
    ok: true,
    award,
    profile: getPublicProfile(user),
    leaderboard: getGlobalLeaderboard(),
  });
});

function saveStore() {
  persistence.saveStore(store).catch((error) => {
    console.error(`[db] Failed to save user store: ${error.message}`);
  });
}

function cleanupUnusedAccounts(options = {}) {
  const now = Date.now();

  if (!options.force && now - lastUnusedAccountCleanupAt < UNUSED_ACCOUNT_CLEANUP_INTERVAL_MS) {
    return 0;
  }

  lastUnusedAccountCleanupAt = now;
  const beforeCount = store.users.length;
  const removedIds = new Set();

  store.users = store.users.filter((user) => {
    ensureUserShape(user);
    const totalPoints = Number(user.totalPoints) || 0;
    const createdAt = Number(user.createdAt) || now;
    const hasPlayed = Number(user.stats.gamesPlayed) > 0 || user.recentResults.length > 0;
    const hasRecentSession = hasRecentSessionForUser(user.id, now);
    const shouldRemoveZeroPoint = totalPoints <= 0 && !hasRecentSession;
    const shouldRemoveUnused = !hasPlayed && now - createdAt >= UNUSED_ACCOUNT_TTL_MS;
    const shouldRemove = shouldRemoveZeroPoint || shouldRemoveUnused;

    if (shouldRemove) {
      removedIds.add(user.id);
    }

    return !shouldRemove;
  });

  if (removedIds.size === 0) {
    return 0;
  }

  store.sessions = store.sessions.filter((session) => !removedIds.has(session.userId));
  saveStore();
  console.log(`[cleanup] Removed ${beforeCount - store.users.length} unused account(s).`);
  return removedIds.size;
}

function hasRecentSessionForUser(userId, now = Date.now()) {
  return store.sessions.some((session) => {
    if (session.userId !== userId) {
      return false;
    }

    const seenAt = Number(session.lastSeenAt || session.createdAt || 0);
    return seenAt > 0 && now - seenAt < ZERO_POINT_ACCOUNT_SESSION_GRACE_MS;
  });
}

function createDefaultStats() {
  return {
    gamesPlayed: 0,
    lastPlayedAt: null,
    games: {
      "2048": {
        plays: 0,
        wins: 0,
        totalScore: 0,
        highScore: 0,
        bestTile: 0,
        lastScore: 0,
        lastPlayedAt: null,
      },
      minesweeper3d: {
        plays: 0,
        wins: 0,
        bestTime: 0,
        bestClearCount: 0,
        lastResult: "",
        lastRevealed: 0,
        lastPlayedAt: null,
      },
      flappy: {
        plays: 0,
        totalScore: 0,
        bestScore: 0,
        bestTime: 0,
        lastScore: 0,
        lastPlayedAt: null,
      },
      dodge: {
        plays: 0,
        totalTime: 0,
        bestTime: 0,
        bestGrazes: 0,
        lastTime: 0,
        lastGrazes: 0,
        lastPlayedAt: null,
      },
      paddleduel: {
        plays: 0,
        wins: 0,
        draws: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        lastResult: "",
        lastPlayedAt: null,
      },
      untangle: {
        plays: 0,
        wins: 0,
        bestTime: 0,
        bestMovesLeft: 0,
        bestDifficulty: "",
        lastResult: "",
        lastIntersections: 0,
        lastPlayedAt: null,
      },
      sokoban: {
        plays: 0,
        wins: 0,
        bestTime: 0,
        bestSteps: 0,
        lastLevel: 0,
        lastSteps: 0,
        lastPlayedAt: null,
      },
    },
  };
}

function ensureUserShape(user) {
  user.totalPoints = Number(user.totalPoints) || 0;
  user.settledGames = Array.isArray(user.settledGames) ? user.settledGames : [];
  user.recentResults = Array.isArray(user.recentResults) ? user.recentResults : [];
  user.stats = user.stats || createDefaultStats();
  user.stats.gamesPlayed = Number(user.stats.gamesPlayed) || 0;
  user.stats.games = user.stats.games || {};
  user.stats.games["2048"] = {
    ...createDefaultStats().games["2048"],
    ...(user.stats.games["2048"] || {}),
  };
  user.stats.games.minesweeper3d = {
    ...createDefaultStats().games.minesweeper3d,
    ...(user.stats.games.minesweeper3d || {}),
  };
  user.stats.games.flappy = {
    ...createDefaultStats().games.flappy,
    ...(user.stats.games.flappy || {}),
  };
  user.stats.games.dodge = {
    ...createDefaultStats().games.dodge,
    ...(user.stats.games.dodge || {}),
  };
  user.stats.games.paddleduel = {
    ...createDefaultStats().games.paddleduel,
    ...(user.stats.games.paddleduel || {}),
  };
  user.stats.games.untangle = {
    ...createDefaultStats().games.untangle,
    ...(user.stats.games.untangle || {}),
  };
  user.stats.games.sokoban = {
    ...createDefaultStats().games.sokoban,
    ...(user.stats.games.sokoban || {}),
  };
}

function normalizeName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 14);
}

function normalizePin(pin) {
  const normalized = String(pin || "").trim();

  if (normalized.length < 4 || normalized.length > 20) {
    return "";
  }

  return normalized;
}

function normalizeUntangleDifficulty(value) {
  const normalized = String(value || "").trim();

  return ["easy", "normal", "hard", "expert"].includes(normalized) ? normalized : "normal";
}

function findUserByName(name) {
  return store.users.find(
    (user) => user.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
  );
}

function hashPin(pin, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto
    .pbkdf2Sync(String(pin), salt, 120000, 32, "sha256")
    .toString("hex");

  return { salt, hash };
}

function verifyPin(pin, user) {
  if (!pin || !user?.pinSalt || !user?.pinHash) {
    return false;
  }

  const candidate = hashPin(pin, user.pinSalt).hash;
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(user.pinHash));
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  store.sessions.push({
    token,
    userId,
    createdAt: Date.now(),
  });
  store.sessions = store.sessions.slice(-300);
  return token;
}

function getTokenFromRequest(request) {
  const header = request.get("authorization") || "";

  if (header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }

  return "";
}

function getUserByToken(token) {
  const session = store.sessions.find((entry) => entry.token === token);

  if (!session) {
    return null;
  }

  const user = store.users.find((entry) => entry.id === session.userId);

  if (!user) {
    return null;
  }

  session.lastSeenAt = Date.now();
  ensureUserShape(user);
  return user;
}

function requireAuth(request, response, next) {
  const user = getUserByToken(getTokenFromRequest(request));

  if (!user) {
    response.status(401).json({ ok: false, message: "请先登录账号" });
    return;
  }

  request.user = user;
  next();
}

function getLevel(points) {
  return Math.max(1, Math.floor(Math.sqrt(Math.max(points, 0) / 90)) + 1);
}

function getPublicProfile(user) {
  ensureUserShape(user);
  const game2048 = user.stats.games["2048"];
  const minesweeper3d = user.stats.games.minesweeper3d;
  const flappy = user.stats.games.flappy;
  const dodge = user.stats.games.dodge;
  const paddleduel = user.stats.games.paddleduel;
  const untangle = user.stats.games.untangle;

  return {
    id: user.id,
    name: user.name,
    totalPoints: user.totalPoints,
    level: getLevel(user.totalPoints),
    createdAt: user.createdAt,
    stats: {
      gamesPlayed: user.stats.gamesPlayed,
      game2048: {
        plays: game2048.plays,
        wins: game2048.wins,
        highScore: game2048.highScore,
        bestTile: game2048.bestTile,
        lastScore: game2048.lastScore,
      },
      minesweeper3d: {
        plays: minesweeper3d.plays,
        wins: minesweeper3d.wins,
        bestTime: minesweeper3d.bestTime,
        bestClearCount: minesweeper3d.bestClearCount,
        lastResult: minesweeper3d.lastResult,
        lastRevealed: minesweeper3d.lastRevealed,
      },
      flappy: {
        plays: flappy.plays,
        totalScore: flappy.totalScore,
        bestScore: flappy.bestScore,
        bestTime: flappy.bestTime,
        lastScore: flappy.lastScore,
      },
      dodge: {
        plays: dodge.plays,
        totalTime: dodge.totalTime,
        bestTime: dodge.bestTime,
        bestGrazes: dodge.bestGrazes,
        lastTime: dodge.lastTime,
        lastGrazes: dodge.lastGrazes,
      },
      paddleduel: {
        plays: paddleduel.plays,
        wins: paddleduel.wins,
        draws: paddleduel.draws,
        goalsFor: paddleduel.goalsFor,
        goalsAgainst: paddleduel.goalsAgainst,
        lastResult: paddleduel.lastResult,
      },
      untangle: {
        plays: untangle.plays,
        wins: untangle.wins,
        bestTime: untangle.bestTime,
        bestMovesLeft: untangle.bestMovesLeft,
        bestDifficulty: untangle.bestDifficulty,
        lastResult: untangle.lastResult,
        lastIntersections: untangle.lastIntersections,
      },
    },
    recentResults: user.recentResults.slice(0, 6),
  };
}

function getGlobalLeaderboard() {
  return store.users
    .map((user) => getPublicProfile(user))
    .filter((player) => player.totalPoints > LEADERBOARD_ENTRY_MIN_POINTS)
    .sort((first, second) => {
      if (second.totalPoints !== first.totalPoints) {
        return second.totalPoints - first.totalPoints;
      }

      return second.stats.game2048.highScore - first.stats.game2048.highScore;
    })
    .slice(0, 20);
}

function calculate2048Award({ score, bestTile, moves, won }) {
  const scorePoints = Math.floor(score / 12);
  const tilePoints = bestTile > 0 ? Math.floor(Math.log2(bestTile)) * 8 : 0;
  const efficiencyBonus =
    score > 0 && moves > 0 ? Math.max(0, Math.floor(score / Math.max(moves, 1))) : 0;
  const winBonus = won ? 300 : 0;

  return {
    points: Math.max(0, scorePoints + tilePoints + efficiencyBonus + winBonus),
    score,
    bestTile,
    moves,
    won,
  };
}

function calculateMinesweeperAward({ won, revealed, totalSafe, flags, seconds }) {
  const progress = Math.min(1, revealed / Math.max(totalSafe, 1));
  const revealPoints = Math.floor(revealed * 3);
  const progressBonus = Math.floor(progress * 120);
  const flagPoints = Math.min(flags, 18) * 2;
  const winBonus = won ? 260 : 0;
  const speedBonus = won ? Math.max(0, 180 - seconds) : 0;

  return {
    points: Math.max(0, revealPoints + progressBonus + flagPoints + winBonus + speedBonus),
    won,
    revealed,
    totalSafe,
    flags,
    seconds,
  };
}

function calculateFlappyAward({ score, seconds }) {
  const scorePoints = score * 28;
  const survivalBonus = Math.min(220, seconds * 4);
  const milestoneBonus = Math.floor(score / 5) * 80;

  return {
    points: Math.max(0, scorePoints + survivalBonus + milestoneBonus),
    score,
    seconds,
  };
}

function calculateDodgeAward({ seconds, grazes }) {
  const survivalPoints = Math.floor(seconds * 15);
  const grazePoints = grazes * 12;
  const milestoneBonus = Math.floor(seconds / 15) * 90;

  return {
    points: Math.max(0, survivalPoints + grazePoints + milestoneBonus),
    seconds,
    grazes,
  };
}

function calculateUntangleAward({
  won,
  difficulty,
  movesUsed,
  movesLimit,
  intersections,
  initialIntersections,
  seconds,
}) {
  const difficultyBase = {
    easy: 90,
    normal: 170,
    hard: 300,
    expert: 460,
  };
  const basePoints = difficultyBase[difficulty] || difficultyBase.normal;
  const movesLeft = Math.max(0, movesLimit - movesUsed);
  const solvedRatio =
    initialIntersections > 0
      ? Math.max(0, Math.min(1, (initialIntersections - intersections) / initialIntersections))
      : won
        ? 1
        : 0;
  const progressPoints = Math.floor(basePoints * 0.36 * solvedRatio);
  const winBonus = won ? basePoints : 0;
  const moveBonus = won ? movesLeft * 9 : 0;
  const speedBonus = won ? Math.max(0, 160 - seconds) : 0;

  return {
    points: Math.max(0, progressPoints + winBonus + moveBonus + speedBonus),
    won,
    difficulty,
    movesUsed,
    movesLimit,
    movesLeft,
    intersections,
    initialIntersections,
    seconds,
  };
}

function clampInteger(value, minimum, maximum) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return minimum;
  }

  return Math.min(maximum, Math.max(minimum, parsed));
}

function clampNumber(value, minimum, maximum) {
  const parsed = Number.parseFloat(value);

  if (!Number.isFinite(parsed)) {
    return minimum;
  }

  return Math.min(maximum, Math.max(minimum, parsed));
}

function createRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let index = 0; index < 5; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  if (rooms.has(code)) {
    return createRoomCode();
  }

  return code;
}

function makePlayer(id, user) {
  const profile = getPublicProfile(user);

  return {
    id,
    accountId: profile.id,
    name: profile.name,
    level: profile.level,
    totalPoints: profile.totalPoints,
    score: 0,
    bestTile: 0,
    moves: 0,
    status: "playing",
    connected: true,
    joinedAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function createDuelState() {
  return {
    active: false,
    ended: false,
    gameId: "",
    startedAt: 0,
    endsAt: 0,
    lastTick: 0,
    players: {
      left: null,
      right: null,
    },
    inputs: {
      left: 0,
      right: 0,
    },
    paddles: {
      left: 0.5,
      right: 0.5,
    },
    ball: {
      x: DUEL_WIDTH / 2,
      y: DUEL_HEIGHT / 2,
      vx: 0,
      vy: 0,
    },
    servingSide: "",
    waitingForServe: false,
    lastBroadcastAt: 0,
    score: {
      left: 0,
      right: 0,
    },
    winner: "",
    settled: false,
  };
}

function ensureRoom(roomCode) {
  if (!rooms.has(roomCode)) {
    rooms.set(roomCode, {
      code: roomCode,
      createdAt: Date.now(),
      players: new Map(),
      duel: createDuelState(),
    });
  }

  return rooms.get(roomCode);
}

function leaveCurrentRoom(socket) {
  const roomCode = socket.data.roomCode;
  const room = rooms.get(roomCode);

  if (!room) {
    return;
  }

  room.players.delete(socket.id);
  handleDuelPlayerLeave(room, socket.id);
  socket.leave(roomCode);
  sendRoomUpdate(roomCode);
  cleanEmptyRoom(roomCode);
  socket.data.roomCode = "";
}

function getPublicRoom(room) {
  const players = Array.from(room.players.values())
    .map((player) => ({
      id: player.id,
      accountId: player.accountId,
      name: player.name,
      level: player.level,
      totalPoints: player.totalPoints,
      score: player.score,
      bestTile: player.bestTile,
      moves: player.moves,
      status: player.status,
      connected: player.connected,
      joinedAt: player.joinedAt,
      updatedAt: player.updatedAt,
    }))
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      if (second.bestTile !== first.bestTile) {
        return second.bestTile - first.bestTile;
      }

      return first.joinedAt - second.joinedAt;
    });

  return {
    code: room.code,
    players,
    playerCount: players.length,
    duel: getPublicDuelState(room),
  };
}

function sendRoomUpdate(roomCode) {
  const room = rooms.get(roomCode);

  if (!room) {
    return;
  }

  io.to(roomCode).emit("room:update", getPublicRoom(room));
}

function cleanEmptyRoom(roomCode) {
  const room = rooms.get(roomCode);

  if (room && room.players.size === 0) {
    stopDuelLoop(roomCode);
    rooms.delete(roomCode);
  }
}

function syncDuelPlayers(room) {
  const duel = room.duel || createDuelState();
  room.duel = duel;
  const connectedPlayers = Array.from(room.players.values()).sort(
    (first, second) => first.joinedAt - second.joinedAt,
  );
  const hasPlayer = (player) => player && room.players.has(player.id);

  if (!hasPlayer(duel.players.left)) {
    duel.players.left = null;
    duel.inputs.left = 0;
  }

  if (!hasPlayer(duel.players.right)) {
    duel.players.right = null;
    duel.inputs.right = 0;
  }

  connectedPlayers.forEach((player) => {
    if (!duel.players.left && duel.players.right?.id !== player.id) {
      duel.players.left = player;
    } else if (!duel.players.right && duel.players.left?.id !== player.id) {
      duel.players.right = player;
    }
  });
}

function getPublicDuelPlayer(player) {
  if (!player) {
    return null;
  }

  return {
    id: player.id,
    accountId: player.accountId,
    name: player.name,
    level: player.level,
  };
}

function getPublicDuelState(room) {
  syncDuelPlayers(room);
  const duel = room.duel;
  const now = Date.now();

  return {
    active: duel.active,
    ended: duel.ended,
    timeLeft: duel.active ? Math.max(0, (duel.endsAt - now) / 1000) : duel.ended ? 0 : DUEL_DURATION_MS / 1000,
    width: DUEL_WIDTH,
    height: DUEL_HEIGHT,
    players: {
      left: getPublicDuelPlayer(duel.players.left),
      right: getPublicDuelPlayer(duel.players.right),
    },
    paddles: duel.paddles,
    ball: duel.ball,
    score: duel.score,
    winner: duel.winner,
    servingSide: duel.servingSide,
    waitingForServe: duel.waitingForServe,
  };
}

function sendDuelUpdate(roomCode, options = {}) {
  const room = rooms.get(roomCode);

  if (!room) {
    return;
  }

  if (room.duel && !options.force) {
    const now = Date.now();

    if (now - room.duel.lastBroadcastAt < DUEL_BROADCAST_INTERVAL_MS) {
      return;
    }

    room.duel.lastBroadcastAt = now;
  }

  io.to(roomCode).emit("duel:update", getPublicDuelState(room));
}

function prepareDuelServe(duel, servingSide = Math.random() > 0.5 ? "left" : "right") {
  duel.servingSide = servingSide;
  duel.waitingForServe = true;
  duel.inputs.left = 0;
  duel.inputs.right = 0;
  attachDuelBallToServer(duel);
}

function attachDuelBallToServer(duel) {
  const side = duel.servingSide || "left";
  const direction = side === "left" ? 1 : -1;

  duel.ball = {
    x: side === "left"
      ? DUEL_PADDLE_X + DUEL_BALL_RADIUS + 16
      : DUEL_WIDTH - DUEL_PADDLE_X - DUEL_BALL_RADIUS - 16,
    y: duel.paddles[side] * DUEL_HEIGHT,
    vx: 0,
    vy: 0,
  };
}

function serveDuelBall(roomCode, socketId) {
  const room = rooms.get(roomCode);

  if (!room || !room.duel?.active) {
    return { ok: false, message: "本局还没有开始" };
  }

  syncDuelPlayers(room);
  const duel = room.duel;
  const side =
    duel.players.left?.id === socketId
      ? "left"
      : duel.players.right?.id === socketId
        ? "right"
        : "";

  if (!duel.waitingForServe) {
    return { ok: false, message: "现在不需要开球" };
  }

  if (side !== duel.servingSide) {
    return { ok: false, message: "这次由对手开球" };
  }

  const direction = side === "left" ? 1 : -1;
  const speed = 285 + Math.min(90, (duel.score.left + duel.score.right) * 10);
  const angle = (Math.random() * 0.56 - 0.28) * Math.PI;
  duel.waitingForServe = false;
  duel.ball.vx = Math.cos(angle) * speed * direction;
  duel.ball.vy = Math.sin(angle) * speed;
  duel.lastTick = Date.now();
  sendDuelUpdate(roomCode, { force: true });
  return { ok: true };
}

function startDuel(roomCode, socketId) {
  const room = rooms.get(roomCode);

  if (!room) {
    return { ok: false, message: "没有找到房间" };
  }

  syncDuelPlayers(room);
  const duel = room.duel;
  const isParticipant = [duel.players.left?.id, duel.players.right?.id].includes(socketId);

  if (duel.active) {
    return { ok: false, message: "本局正在进行中" };
  }

  if (!isParticipant) {
    return { ok: false, message: "只有对战双方可以开始" };
  }

  if (!duel.players.left || !duel.players.right) {
    return { ok: false, message: "需要 2 位玩家才能开始" };
  }

  duel.active = true;
  duel.ended = false;
  duel.gameId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  duel.startedAt = Date.now();
  duel.endsAt = duel.startedAt + DUEL_DURATION_MS;
  duel.lastTick = duel.startedAt;
  duel.inputs.left = 0;
  duel.inputs.right = 0;
  duel.paddles.left = 0.5;
  duel.paddles.right = 0.5;
  duel.score.left = 0;
  duel.score.right = 0;
  duel.winner = "";
  duel.settled = false;
  duel.lastBroadcastAt = 0;
  prepareDuelServe(duel);
  ensureDuelLoop(roomCode);
  sendRoomUpdate(roomCode);
  sendDuelUpdate(roomCode, { force: true });
  return { ok: true };
}

function ensureDuelLoop(roomCode) {
  if (duelLoops.has(roomCode)) {
    return;
  }

  const intervalId = setInterval(() => tickDuel(roomCode), DUEL_TICK_INTERVAL_MS);
  duelLoops.set(roomCode, intervalId);
}

function stopDuelLoop(roomCode) {
  const intervalId = duelLoops.get(roomCode);

  if (intervalId) {
    clearInterval(intervalId);
    duelLoops.delete(roomCode);
  }
}

function tickDuel(roomCode) {
  const room = rooms.get(roomCode);

  if (!room || !room.duel?.active) {
    stopDuelLoop(roomCode);
    return;
  }

  const duel = room.duel;
  const now = Date.now();
  const delta = Math.min(0.05, (now - duel.lastTick) / 1000 || 1 / 30);
  duel.lastTick = now;

  if (duel.waitingForServe) {
    stepDuelPaddles(duel, delta);
    attachDuelBallToServer(duel);
    sendDuelUpdate(roomCode);
    return;
  }

  const scored = stepDuel(duel, delta);

  if (now >= duel.endsAt) {
    finishDuel(roomCode);
    return;
  }

  sendDuelUpdate(roomCode, { force: scored });
}

function stepDuel(duel, delta) {
  stepDuelPaddles(duel, delta);

  duel.ball.x += duel.ball.vx * delta;
  duel.ball.y += duel.ball.vy * delta;

  if (duel.ball.y <= DUEL_BALL_RADIUS || duel.ball.y >= DUEL_HEIGHT - DUEL_BALL_RADIUS) {
    duel.ball.y = Math.max(DUEL_BALL_RADIUS, Math.min(DUEL_HEIGHT - DUEL_BALL_RADIUS, duel.ball.y));
    duel.ball.vy *= -1;
  }

  bounceDuelPaddle(duel, "left");
  bounceDuelPaddle(duel, "right");

  if (duel.ball.x < -DUEL_BALL_RADIUS) {
    duel.score.right += 1;
    prepareDuelServe(duel, "left");
    return true;
  } else if (duel.ball.x > DUEL_WIDTH + DUEL_BALL_RADIUS) {
    duel.score.left += 1;
    prepareDuelServe(duel, "right");
    return true;
  }

  return false;
}

function stepDuelPaddles(duel, delta) {
  duel.paddles.left = clampUnit(
    duel.paddles.left + (duel.inputs.left * DUEL_PADDLE_SPEED * delta) / DUEL_HEIGHT,
  );
  duel.paddles.right = clampUnit(
    duel.paddles.right + (duel.inputs.right * DUEL_PADDLE_SPEED * delta) / DUEL_HEIGHT,
  );
}

function bounceDuelPaddle(duel, side) {
  const paddleX = side === "left" ? DUEL_PADDLE_X : DUEL_WIDTH - DUEL_PADDLE_X;
  const paddleY = duel.paddles[side] * DUEL_HEIGHT;
  const movingTowardPaddle = side === "left" ? duel.ball.vx < 0 : duel.ball.vx > 0;
  const overlapsX =
    Math.abs(duel.ball.x - paddleX) <= DUEL_BALL_RADIUS + 10;
  const overlapsY =
    Math.abs(duel.ball.y - paddleY) <= DUEL_PADDLE_HEIGHT / 2 + DUEL_BALL_RADIUS;

  if (!movingTowardPaddle || !overlapsX || !overlapsY) {
    return;
  }

  const hitOffset = (duel.ball.y - paddleY) / (DUEL_PADDLE_HEIGHT / 2);
  const speed = Math.min(430, Math.hypot(duel.ball.vx, duel.ball.vy) + 9);
  const direction = side === "left" ? 1 : -1;

  duel.ball.vx = speed * direction;
  duel.ball.vy = hitOffset * 210;
  duel.ball.x = paddleX + direction * (DUEL_BALL_RADIUS + 12);
}

function clampUnit(value) {
  const half = DUEL_PADDLE_HEIGHT / DUEL_HEIGHT / 2;
  return Math.min(1 - half, Math.max(half, value));
}

function handleDuelPlayerLeave(room, socketId) {
  const duel = room.duel;

  if (!duel) {
    return;
  }

  const wasLeft = duel.players.left?.id === socketId;
  const wasRight = duel.players.right?.id === socketId;

  if (duel.active && (wasLeft || wasRight)) {
    duel.score[wasLeft ? "right" : "left"] += 1;
    finishDuel(room.code, wasLeft ? "right" : "left");
  }

  if (wasLeft) {
    duel.players.left = null;
    duel.inputs.left = 0;
  }

  if (wasRight) {
    duel.players.right = null;
    duel.inputs.right = 0;
  }
}

function finishDuel(roomCode, forcedWinner = "") {
  const room = rooms.get(roomCode);

  if (!room || !room.duel) {
    return;
  }

  const duel = room.duel;
  duel.active = false;
  duel.ended = true;
  duel.winner = forcedWinner || (duel.score.left > duel.score.right ? "left" : duel.score.right > duel.score.left ? "right" : "");
  stopDuelLoop(roomCode);
  awardDuelResults(room);
  sendRoomUpdate(roomCode);
  io.to(roomCode).emit("duel:ended", { state: getPublicDuelState(room) });
}

function awardDuelResults(room) {
  const duel = room.duel;

  if (!duel || duel.settled) {
    return;
  }

  duel.settled = true;
  ["left", "right"].forEach((side) => {
    const player = duel.players[side];

    if (!player) {
      return;
    }

    const user = store.users.find((entry) => entry.id === player.accountId);

    if (!user) {
      return;
    }

    ensureUserShape(user);
    const opposite = side === "left" ? "right" : "left";
    const goalsFor = duel.score[side];
    const goalsAgainst = duel.score[opposite];
    const result = duel.winner ? (duel.winner === side ? "won" : "lost") : "draw";
    const award = calculateDuelAward({ result, goalsFor, goalsAgainst });
    const stats = user.stats.games.paddleduel;

    user.totalPoints += award.points;
    user.stats.gamesPlayed += 1;
    user.stats.lastPlayedAt = Date.now();
    stats.plays += 1;
    stats.wins += result === "won" ? 1 : 0;
    stats.draws += result === "draw" ? 1 : 0;
    stats.goalsFor += goalsFor;
    stats.goalsAgainst += goalsAgainst;
    stats.lastResult = result;
    stats.lastPlayedAt = Date.now();
    user.recentResults.unshift({
      game: "paddleduel",
      result,
      goalsFor,
      goalsAgainst,
      points: award.points,
      playedAt: Date.now(),
    });
    user.recentResults = user.recentResults.slice(0, 12);

    const profile = getPublicProfile(user);
    player.totalPoints = profile.totalPoints;
    player.level = profile.level;
  });

  saveStore();
}

function calculateDuelAward({ result, goalsFor, goalsAgainst }) {
  const basePoints = 80;
  const goalPoints = goalsFor * 65;
  const defenseBonus = Math.max(0, 4 - goalsAgainst) * 18;
  const resultBonus = result === "won" ? 260 : result === "draw" ? 140 : 40;

  return {
    points: basePoints + goalPoints + defenseBonus + resultBonus,
    result,
    goalsFor,
    goalsAgainst,
  };
}

function getSocketUser(token) {
  return getUserByToken(String(token || ""));
}

io.on("connection", (socket) => {
  socket.on("room:create", ({ token } = {}, callback) => {
    const user = getSocketUser(token);

    if (!user) {
      if (typeof callback === "function") {
        callback({ ok: false, message: "请先登录账号" });
      }
      return;
    }

    leaveCurrentRoom(socket);
    const roomCode = createRoomCode();
    const room = ensureRoom(roomCode);
    const player = makePlayer(socket.id, user);

    room.players.set(socket.id, player);
    socket.data.roomCode = roomCode;
    socket.join(roomCode);

    if (typeof callback === "function") {
      callback({ ok: true, room: getPublicRoom(room), playerId: socket.id });
    }

    sendRoomUpdate(roomCode);
  });

  socket.on("room:join", ({ roomCode, token } = {}, callback) => {
    const user = getSocketUser(token);
    const normalizedCode = String(roomCode || "").trim().toUpperCase();
    const room = rooms.get(normalizedCode);

    if (!user) {
      if (typeof callback === "function") {
        callback({ ok: false, message: "请先登录账号" });
      }
      return;
    }

    if (!room) {
      if (typeof callback === "function") {
        callback({ ok: false, message: "没有找到这个房间" });
      }
      return;
    }

    leaveCurrentRoom(socket);
    const player = makePlayer(socket.id, user);

    room.players.set(socket.id, player);
    socket.data.roomCode = normalizedCode;
    socket.join(normalizedCode);

    if (typeof callback === "function") {
      callback({ ok: true, room: getPublicRoom(room), playerId: socket.id });
    }

    sendRoomUpdate(normalizedCode);
  });

  socket.on("player:update", (payload = {}) => {
    const roomCode = socket.data.roomCode;
    const room = rooms.get(roomCode);

    if (!room || !room.players.has(socket.id)) {
      return;
    }

    const player = room.players.get(socket.id);
    const user = store.users.find((entry) => entry.id === player.accountId);

    if (user) {
      const profile = getPublicProfile(user);
      player.level = profile.level;
      player.totalPoints = profile.totalPoints;
    }

    player.score = Number(payload.score) || 0;
    player.bestTile = Number(payload.bestTile) || 0;
    player.moves = Number(payload.moves) || 0;
    player.status = payload.status === "finished" ? "finished" : "playing";
    player.updatedAt = Date.now();
    sendRoomUpdate(roomCode);
  });

  socket.on("player:restart", () => {
    const roomCode = socket.data.roomCode;
    const room = rooms.get(roomCode);

    if (!room || !room.players.has(socket.id)) {
      return;
    }

    const player = room.players.get(socket.id);
    player.score = 0;
    player.bestTile = 0;
    player.moves = 0;
    player.status = "playing";
    player.updatedAt = Date.now();
    sendRoomUpdate(roomCode);
  });

  socket.on("duel:start", (_payload = {}, callback) => {
    const roomCode = socket.data.roomCode;
    const result = startDuel(roomCode, socket.id);

    if (typeof callback === "function") {
      callback(result);
    }
  });

  socket.on("duel:serve", (_payload = {}, callback) => {
    const roomCode = socket.data.roomCode;
    const result = serveDuelBall(roomCode, socket.id);

    if (typeof callback === "function") {
      callback(result);
    }
  });

  socket.on("duel:input", (payload = {}) => {
    const roomCode = socket.data.roomCode;
    const room = rooms.get(roomCode);

    if (!room?.duel) {
      return;
    }

    syncDuelPlayers(room);
    const duel = room.duel;
    const side =
      duel.players.left?.id === socket.id
        ? "left"
        : duel.players.right?.id === socket.id
          ? "right"
          : "";

    if (!side) {
      return;
    }

    duel.inputs[side] = Math.max(-1, Math.min(1, Number(payload.direction) || 0));
  });

  socket.on("room:leave", () => {
    leaveCurrentRoom(socket);
  });

  socket.on("disconnect", () => {
    leaveCurrentRoom(socket);
  });
});

async function bootstrap() {
  try {
    store = await persistence.loadStore();
    store.users.forEach((user) => ensureUserShape(user));
    cleanupUnusedAccounts({ force: true });
    server.listen(PORT, "0.0.0.0", () => {
      console.log(
        `Arcade server is running on port ${PORT} with ${persistence.getStorageMode()} storage`,
      );
    });
  } catch (error) {
    console.error(`[db] Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

bootstrap();
