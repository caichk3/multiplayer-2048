const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "public");
const dataDirectory = process.env.DATA_DIR || path.join(__dirname, "data");
const usersPath = path.join(dataDirectory, "users.json");
const rooms = new Map();

app.use(express.json({ limit: "32kb" }));
app.use(express.static(publicPath));

let store = loadStore();

app.get("/health", (_request, response) => {
  response.json({ ok: true });
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

app.post("/api/games/sokoban/results", requireAuth, (request, response) => {
  const gameId = String(request.body?.gameId || "").trim();
  const won = Boolean(request.body?.won);
  const level = clampInteger(request.body?.level, 0, 9999);
  const steps = clampInteger(request.body?.steps, 0, 999999);
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
      award: { points: 0, won, level, steps, seconds },
      profile: getPublicProfile(user),
      leaderboard: getGlobalLeaderboard(),
    });
    return;
  }

  const award = calculateSokobanAward({ won, level, steps, seconds });
  const gameStats = user.stats.games.sokoban;

  user.totalPoints += award.points;
  user.stats.gamesPlayed += 1;
  user.stats.lastPlayedAt = Date.now();
  gameStats.plays += 1;
  gameStats.wins += won ? 1 : 0;
  gameStats.bestSteps =
    won && (gameStats.bestSteps === 0 || steps < gameStats.bestSteps)
      ? steps
      : gameStats.bestSteps;
  gameStats.bestTime =
    won && (gameStats.bestTime === 0 || seconds < gameStats.bestTime)
      ? seconds
      : gameStats.bestTime;
  gameStats.lastLevel = level;
  gameStats.lastSteps = steps;
  gameStats.lastPlayedAt = Date.now();
  user.settledGames.push(gameId);
  user.settledGames = user.settledGames.slice(-180);
  user.recentResults.unshift({
    game: "sokoban",
    won,
    level,
    steps,
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

function loadStore() {
  fs.mkdirSync(dataDirectory, { recursive: true });

  if (!fs.existsSync(usersPath)) {
    return { users: [], sessions: [] };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(usersPath, "utf8"));
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    };
  } catch (error) {
    const brokenPath = `${usersPath}.broken-${Date.now()}`;
    fs.copyFileSync(usersPath, brokenPath);
    return { users: [], sessions: [] };
  }
}

function saveStore() {
  fs.mkdirSync(dataDirectory, { recursive: true });
  fs.writeFileSync(usersPath, JSON.stringify(store, null, 2));
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
  const sokoban = user.stats.games.sokoban;

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
      sokoban: {
        plays: sokoban.plays,
        wins: sokoban.wins,
        bestTime: sokoban.bestTime,
        bestSteps: sokoban.bestSteps,
        lastLevel: sokoban.lastLevel,
        lastSteps: sokoban.lastSteps,
      },
    },
    recentResults: user.recentResults.slice(0, 6),
  };
}

function getGlobalLeaderboard() {
  return store.users
    .map((user) => getPublicProfile(user))
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

function calculateSokobanAward({ won, level, steps, seconds }) {
  if (!won) {
    return {
      points: 0,
      won,
      level,
      steps,
      seconds,
    };
  }

  const difficulty = level + 1;
  const levelBonus = difficulty * 70 + Math.max(0, difficulty - 4) * 35;
  const clearBonus = 180;
  const stepBonus = Math.max(0, 220 - steps * 2);
  const speedBonus = Math.max(0, 150 - seconds);

  return {
    points: Math.max(0, levelBonus + clearBonus + stepBonus + speedBonus),
    won,
    level,
    steps,
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

function ensureRoom(roomCode) {
  if (!rooms.has(roomCode)) {
    rooms.set(roomCode, {
      code: roomCode,
      createdAt: Date.now(),
      players: new Map(),
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
    rooms.delete(roomCode);
  }
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

  socket.on("room:leave", () => {
    leaveCurrentRoom(socket);
  });

  socket.on("disconnect", () => {
    leaveCurrentRoom(socket);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Arcade server is running on port ${PORT}`);
});
