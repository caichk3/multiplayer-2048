const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "public");
const rooms = new Map();

app.use(express.static(publicPath));

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

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

function makePlayer(id, name) {
  return {
    id,
    name: name || "玩家",
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

function getPublicRoom(room) {
  const players = Array.from(room.players.values())
    .map((player) => ({
      id: player.id,
      name: player.name,
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

io.on("connection", (socket) => {
  socket.on("room:create", ({ name } = {}, callback) => {
    const roomCode = createRoomCode();
    const room = ensureRoom(roomCode);
    const player = makePlayer(socket.id, String(name || "").trim().slice(0, 14));

    room.players.set(socket.id, player);
    socket.data.roomCode = roomCode;
    socket.join(roomCode);

    if (typeof callback === "function") {
      callback({ ok: true, room: getPublicRoom(room), playerId: socket.id });
    }

    sendRoomUpdate(roomCode);
  });

  socket.on("room:join", ({ roomCode, name } = {}, callback) => {
    const normalizedCode = String(roomCode || "").trim().toUpperCase();
    const room = rooms.get(normalizedCode);

    if (!room) {
      if (typeof callback === "function") {
        callback({ ok: false, message: "没有找到这个房间" });
      }
      return;
    }

    const player = makePlayer(socket.id, String(name || "").trim().slice(0, 14));

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

  socket.on("disconnect", () => {
    const roomCode = socket.data.roomCode;
    const room = rooms.get(roomCode);

    if (!room) {
      return;
    }

    room.players.delete(socket.id);
    sendRoomUpdate(roomCode);
    cleanEmptyRoom(roomCode);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Multiplayer 2048 is running on port ${PORT}`);
});
