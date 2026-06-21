const boardElement = document.querySelector("#board");
const scoreElement = document.querySelector("#score");
const bestScoreElement = document.querySelector("#best-score");
const restartButton = document.querySelector("#restart-button");
const message = document.querySelector("#message");
const messageTitle = document.querySelector("#message-title");
const messageCopy = document.querySelector("#message-copy");
const messageButton = document.querySelector("#message-button");
const statusText = document.querySelector("#status-text");
const roomCodeInput = document.querySelector("#room-code");
const createRoomButton = document.querySelector("#create-room-button");
const joinRoomButton = document.querySelector("#join-room-button");
const activeRoom = document.querySelector("#active-room");
const activeRoomCode = document.querySelector("#active-room-code");
const copyRoomButton = document.querySelector("#copy-room-button");
const playersList = document.querySelector("#players-list");
const playerCount = document.querySelector("#player-count");
const globalList = document.querySelector("#global-list");
const globalCount = document.querySelector("#global-count");
const connectionStatus = document.querySelector("#connection-status");
const accountForm = document.querySelector("#account-form");
const accountNameInput = document.querySelector("#account-name");
const accountPinInput = document.querySelector("#account-pin");
const registerButton = document.querySelector("#register-button");
const logoutButton = document.querySelector("#logout-button");
const accountTitle = document.querySelector("#account-title");
const accountStatus = document.querySelector("#account-status");
const profileStrip = document.querySelector("#profile-strip");
const profileName = document.querySelector("#profile-name");
const profileLevel = document.querySelector("#profile-level");
const profilePoints = document.querySelector("#profile-points");
const profileBest = document.querySelector("#profile-best");

const socket = io();
const size = 4;
const totalCells = size * size;
const bestKey = "web2-multiplayer-2048-best-score";
const tokenKey = "class-arcade-token";
const nameKey = "class-arcade-name";
const text = {
  ready: "已经进入房间，开始挑战吧。本局结束或重新开始时会结算平台积分。",
  waiting: "先登录账号，再创建或加入房间。",
  wonTitle: "你合成了 2048",
  wonCopy: "还能继续冲更高分，排行榜会实时更新。",
  wonStatus: "已经合成 2048，可以继续玩。",
  overTitle: "游戏结束",
  overStatus: "没有可移动的方块了，积分已结算。",
};

let board = [];
let score = 0;
let bestScore = Number(localStorage.getItem(bestKey)) || 0;
let won = false;
let gameFinished = false;
let touchStartX = 0;
let touchStartY = 0;
let currentRoomCode = "";
let currentPlayerId = "";
let moves = 0;
let token = localStorage.getItem(tokenKey) || "";
let profile = null;
let currentGameId = createGameId();
let gameSettled = false;

function createEmptyBoard() {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function setupBoardMarkup() {
  boardElement.innerHTML = "";

  for (let index = 0; index < totalCells; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.setAttribute("aria-hidden", "true");
    boardElement.appendChild(cell);
  }
}

function createGameId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function hasAccount() {
  return Boolean(token && profile);
}

function setConnectionStatus(label, mode) {
  connectionStatus.textContent = label;
  connectionStatus.classList.toggle("is-online", mode === "online");
  connectionStatus.classList.toggle("is-offline", mode === "offline");
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.ok === false) {
    throw new Error(data.message || "请求失败");
  }

  return data;
}

async function loadSession() {
  accountNameInput.value = localStorage.getItem(nameKey) || "";
  await refreshLeaderboard();

  if (!token) {
    renderAccount(null);
    return;
  }

  try {
    const data = await apiRequest("/api/me");
    renderAccount(data.profile);
  } catch {
    token = "";
    localStorage.removeItem(tokenKey);
    renderAccount(null);
  }
}

function renderAccount(nextProfile) {
  profile = nextProfile;

  if (!profile) {
    accountTitle.textContent = "登录后累计积分";
    accountStatus.textContent = "昵称加口令即可进入。";
    profileStrip.hidden = true;
    accountForm.hidden = false;
    createRoomButton.disabled = true;
    joinRoomButton.disabled = true;
    statusText.textContent = text.waiting;
    return;
  }

  localStorage.setItem(nameKey, profile.name);
  accountNameInput.value = profile.name;
  accountTitle.textContent = `欢迎，${profile.name}`;
  accountStatus.textContent = "账号已登录，2048 本局成绩会结算为平台积分。";
  profileName.textContent = profile.name;
  profileLevel.textContent = String(profile.level);
  profilePoints.textContent = String(profile.totalPoints);
  profileBest.textContent = String(profile.stats.game2048.highScore);
  profileStrip.hidden = false;
  accountForm.hidden = true;
  createRoomButton.disabled = false;
  joinRoomButton.disabled = false;
  statusText.textContent = currentRoomCode ? text.ready : "可以创建房间，或输入房间号加入同学。";
}

async function loginAccount() {
  await submitAuth("/api/auth/login");
}

async function registerAccount() {
  await submitAuth("/api/auth/register");
}

async function submitAuth(path) {
  const name = accountNameInput.value.trim();
  const pin = accountPinInput.value.trim();

  if (!name || pin.length < 4) {
    accountStatus.textContent = "昵称要填写，口令至少 4 位。";
    return;
  }

  accountStatus.textContent = "正在处理账号...";

  try {
    const data = await apiRequest(path, {
      method: "POST",
      body: JSON.stringify({ name, pin }),
    });
    token = data.token;
    localStorage.setItem(tokenKey, token);
    accountPinInput.value = "";
    renderAccount(data.profile);
    await refreshLeaderboard(data.leaderboard);
  } catch (error) {
    accountStatus.textContent = error.message;
  }
}

async function logoutAccount() {
  try {
    if (token) {
      await apiRequest("/api/auth/logout", { method: "POST", body: "{}" });
    }
  } catch {
    // Local logout should still work even if the server session is already gone.
  }

  token = "";
  profile = null;
  currentRoomCode = "";
  currentPlayerId = "";
  activeRoom.hidden = true;
  socket.emit("room:leave");
  localStorage.removeItem(tokenKey);
  renderPlayers({ players: [] });
  renderAccount(null);
}

function getBestTile() {
  return Math.max(...board.flat(), 0);
}

function emitPlayerUpdate() {
  if (!currentRoomCode) {
    return;
  }

  socket.emit("player:update", {
    score,
    bestTile: getBestTile(),
    moves,
    status: gameFinished ? "finished" : "playing",
  });
}

function startGame(options = {}) {
  if (options.settlePrevious !== false) {
    settleCurrentGame("restart");
  }

  board = createEmptyBoard();
  score = 0;
  won = false;
  gameFinished = false;
  moves = 0;
  currentGameId = createGameId();
  gameSettled = false;
  message.classList.add("is-hidden");
  statusText.textContent = currentRoomCode ? text.ready : hasAccount() ? "可以创建房间，或输入房间号加入同学。" : text.waiting;
  addRandomTile();
  addRandomTile();
  render();

  if (options.notify !== false) {
    socket.emit("player:restart");
    emitPlayerUpdate();
  }
}

function addRandomTile() {
  const emptyCells = [];

  board.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (value === 0) {
        emptyCells.push({ row: rowIndex, column: columnIndex });
      }
    });
  });

  if (emptyCells.length === 0) {
    return;
  }

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomCell.row][randomCell.column] = Math.random() < 0.9 ? 2 : 4;
}

function render() {
  const cells = boardElement.querySelectorAll(".cell");

  board.flat().forEach((value, index) => {
    const cell = cells[index];
    cell.textContent = value === 0 ? "" : value;
    cell.className = "cell";

    if (value > 0) {
      cell.classList.add(value <= 2048 ? `tile-${value}` : "tile-super");
    }
  });

  scoreElement.textContent = score;
  bestScoreElement.textContent = getBestTile();
}

function slideRow(row) {
  const numbers = row.filter(Boolean);
  const result = [];
  let gained = 0;

  for (let index = 0; index < numbers.length; index += 1) {
    if (numbers[index] === numbers[index + 1]) {
      const merged = numbers[index] * 2;
      result.push(merged);
      gained += merged;
      index += 1;
    } else {
      result.push(numbers[index]);
    }
  }

  while (result.length < size) {
    result.push(0);
  }

  return { row: result, gained };
}

function rotateBoardRight(matrix) {
  return matrix[0].map((_, columnIndex) =>
    matrix.map((row) => row[columnIndex]).reverse(),
  );
}

function rotateBoardLeft(matrix) {
  return matrix[0].map((_, columnIndex) =>
    matrix.map((row) => row[size - 1 - columnIndex]),
  );
}

function reverseRows(matrix) {
  return matrix.map((row) => [...row].reverse());
}

function boardsEqual(first, second) {
  return JSON.stringify(first) === JSON.stringify(second);
}

function move(direction) {
  if (gameFinished) {
    return;
  }

  const previousBoard = board.map((row) => [...row]);
  let workingBoard = board.map((row) => [...row]);

  if (direction === "right") {
    workingBoard = reverseRows(workingBoard);
  }

  if (direction === "up") {
    workingBoard = rotateBoardLeft(workingBoard);
  }

  if (direction === "down") {
    workingBoard = rotateBoardRight(workingBoard);
  }

  let gainedThisMove = 0;
  workingBoard = workingBoard.map((row) => {
    const result = slideRow(row);
    gainedThisMove += result.gained;
    return result.row;
  });

  if (direction === "right") {
    workingBoard = reverseRows(workingBoard);
  }

  if (direction === "up") {
    workingBoard = rotateBoardRight(workingBoard);
  }

  if (direction === "down") {
    workingBoard = rotateBoardLeft(workingBoard);
  }

  if (boardsEqual(previousBoard, workingBoard)) {
    return;
  }

  board = workingBoard;
  score += gainedThisMove;
  moves += 1;
  updateBestScore();
  addRandomTile();
  render();
  checkGameState();
  emitPlayerUpdate();
}

function updateBestScore() {
  if (score <= bestScore) {
    return;
  }

  bestScore = score;
  localStorage.setItem(bestKey, String(bestScore));
}

function checkGameState() {
  if (!won && board.flat().includes(2048)) {
    won = true;
    showMessage(text.wonTitle, text.wonCopy, false);
    statusText.textContent = text.wonStatus;
    return;
  }

  if (!canMove()) {
    gameFinished = true;
    showMessage(text.overTitle, `最终分数：${score}`, true);
    statusText.textContent = text.overStatus;
    settleCurrentGame("finished");
  }
}

function canMove() {
  if (board.flat().includes(0)) {
    return true;
  }

  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const value = board[row][column];
      const right = board[row][column + 1];
      const down = board[row + 1]?.[column];

      if (value === right || value === down) {
        return true;
      }
    }
  }

  return false;
}

function showMessage(title, copy, lockGame) {
  messageTitle.textContent = title;
  messageCopy.textContent = copy;
  message.classList.remove("is-hidden");
  gameFinished = lockGame;
}

function hideMessageAndContinue() {
  if (!gameFinished) {
    message.classList.add("is-hidden");
  } else {
    startGame();
  }
}

async function settleCurrentGame(reason) {
  if (!hasAccount() || gameSettled || moves === 0) {
    return;
  }

  gameSettled = true;

  try {
    const data = await apiRequest("/api/games/2048/results", {
      method: "POST",
      body: JSON.stringify({
        gameId: currentGameId,
        score,
        bestTile: getBestTile(),
        moves,
        won,
        reason,
      }),
    });

    renderAccount(data.profile);
    await refreshLeaderboard(data.leaderboard);
    statusText.textContent = `本局获得 ${data.award.points} 积分。`;
    emitPlayerUpdate();
  } catch (error) {
    statusText.textContent = error.message;
    gameSettled = false;
  }
}

function getDirectionFromKey(key) {
  const directions = {
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right",
    ArrowUp: "up",
    w: "up",
    W: "up",
    ArrowDown: "down",
    s: "down",
    S: "down",
  };

  return directions[key];
}

function handleKeyDown(event) {
  const direction = getDirectionFromKey(event.key);

  if (!direction) {
    return;
  }

  event.preventDefault();
  if (!gameFinished) {
    message.classList.add("is-hidden");
  }
  move(direction);
}

function handleTouchStart(event) {
  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

function handleTouchEnd(event) {
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;
  const minimumSwipe = 28;

  if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < minimumSwipe) {
    return;
  }

  if (!gameFinished) {
    message.classList.add("is-hidden");
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    move(deltaX > 0 ? "right" : "left");
  } else {
    move(deltaY > 0 ? "down" : "up");
  }
}

function setRoom(room, playerId) {
  currentRoomCode = room.code;
  currentPlayerId = playerId;
  roomCodeInput.value = room.code;
  activeRoomCode.textContent = room.code;
  activeRoom.hidden = false;
  statusText.textContent = text.ready;
  renderPlayers(room);
  startGame();
}

function createRoom() {
  if (!hasAccount()) {
    accountStatus.textContent = "先登录账号再创建房间。";
    return;
  }

  createRoomButton.disabled = true;

  socket.emit("room:create", { token }, (response) => {
    createRoomButton.disabled = false;

    if (!response?.ok) {
      statusText.textContent = response?.message || "创建房间失败";
      return;
    }

    setRoom(response.room, response.playerId);
  });
}

function joinRoom() {
  if (!hasAccount()) {
    accountStatus.textContent = "先登录账号再加入房间。";
    return;
  }

  joinRoomButton.disabled = true;
  const roomCode = roomCodeInput.value.trim().toUpperCase();

  if (!roomCode) {
    statusText.textContent = "先输入房间号";
    joinRoomButton.disabled = false;
    return;
  }

  socket.emit("room:join", { roomCode, token }, (response) => {
    joinRoomButton.disabled = false;

    if (!response?.ok) {
      statusText.textContent = response?.message || "加入房间失败";
      return;
    }

    setRoom(response.room, response.playerId);
  });
}

function getStatusText(player) {
  if (!player.connected) {
    return "离线";
  }

  if (player.status === "finished") {
    return "已结束";
  }

  return "进行中";
}

function renderPlayers(room) {
  const players = room.players || [];
  playerCount.textContent = `${players.length} 人`;
  playersList.innerHTML = "";

  if (players.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "还没有进入房间";
    playersList.appendChild(empty);
    return;
  }

  players.forEach((player, index) => {
    const item = document.createElement("li");
    const isMe = player.id === currentPlayerId;
    item.className = isMe ? "player-row is-me" : "player-row";

    const rank = document.createElement("span");
    rank.className = "rank";
    rank.textContent = String(index + 1);

    const info = document.createElement("div");
    const name = document.createElement("span");
    name.className = "player-name";
    name.textContent = isMe ? `${player.name}（我）` : player.name;

    const meta = document.createElement("span");
    meta.className = "player-meta";
    meta.textContent = `${getStatusText(player)} · Lv.${player.level || 1} · 最高块 ${player.bestTile || 0} · ${player.moves || 0} 步`;

    info.append(name, meta);

    const scoreBox = document.createElement("div");
    scoreBox.className = "player-score";
    const scoreValue = document.createElement("strong");
    scoreValue.textContent = String(player.score || 0);
    const scoreLabel = document.createElement("span");
    scoreLabel.textContent = `${player.totalPoints || 0} 总分`;
    scoreBox.append(scoreValue, scoreLabel);

    item.append(rank, info, scoreBox);
    playersList.appendChild(item);
  });
}

async function refreshLeaderboard(players) {
  if (Array.isArray(players)) {
    renderGlobalLeaderboard(players);
    return;
  }

  try {
    const data = await apiRequest("/api/leaderboard", { headers: {} });
    renderGlobalLeaderboard(data.players || []);
  } catch {
    renderGlobalLeaderboard([]);
  }
}

function renderGlobalLeaderboard(players) {
  globalCount.textContent = `${players.length} 人`;
  globalList.innerHTML = "";

  if (players.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-state";
    empty.textContent = "暂无积分";
    globalList.appendChild(empty);
    return;
  }

  players.forEach((player, index) => {
    const item = document.createElement("li");
    item.className = profile?.id === player.id ? "player-row is-me" : "player-row";

    const rank = document.createElement("span");
    rank.className = "rank";
    rank.textContent = String(index + 1);

    const info = document.createElement("div");
    const name = document.createElement("span");
    name.className = "player-name";
    name.textContent = profile?.id === player.id ? `${player.name}（我）` : player.name;

    const meta = document.createElement("span");
    meta.className = "player-meta";
    meta.textContent = `Lv.${player.level} · 2048 最高 ${player.stats.game2048.highScore} · ${player.stats.gamesPlayed} 局`;

    info.append(name, meta);

    const scoreBox = document.createElement("div");
    scoreBox.className = "player-score";
    const scoreValue = document.createElement("strong");
    scoreValue.textContent = String(player.totalPoints);
    const scoreLabel = document.createElement("span");
    scoreLabel.textContent = "积分";
    scoreBox.append(scoreValue, scoreLabel);

    item.append(rank, info, scoreBox);
    globalList.appendChild(item);
  });
}

async function copyRoomCode() {
  if (!currentRoomCode) {
    return;
  }

  try {
    await navigator.clipboard.writeText(currentRoomCode);
    copyRoomButton.textContent = "已复制";
  } catch {
    copyRoomButton.textContent = "复制失败";
  }

  window.setTimeout(() => {
    copyRoomButton.textContent = "复制";
  }, 1200);
}

socket.on("connect", () => {
  setConnectionStatus("已连接", "online");
});

socket.on("disconnect", () => {
  setConnectionStatus("已断开", "offline");
});

socket.on("room:update", (room) => {
  if (room.code !== currentRoomCode) {
    return;
  }

  renderPlayers(room);
});

accountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginAccount();
});
registerButton.addEventListener("click", registerAccount);
logoutButton.addEventListener("click", logoutAccount);
createRoomButton.addEventListener("click", createRoom);
joinRoomButton.addEventListener("click", joinRoom);
copyRoomButton.addEventListener("click", copyRoomCode);
restartButton.addEventListener("click", () => startGame());
messageButton.addEventListener("click", hideMessageAndContinue);
document.addEventListener("keydown", handleKeyDown);
boardElement.addEventListener("touchstart", handleTouchStart, { passive: true });
boardElement.addEventListener("touchend", handleTouchEnd);
roomCodeInput.addEventListener("input", () => {
  roomCodeInput.value = roomCodeInput.value.toUpperCase();
});

setupBoardMarkup();
startGame({ notify: false, settlePrevious: false });
loadSession();
