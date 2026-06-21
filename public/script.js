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
const profileMinesweeperWins = document.querySelector("#profile-minesweeper-wins");
const gameCards = Array.from(document.querySelectorAll(".game-card[data-game]"));
const roomPanel = document.querySelector("#room-panel");
const game2048Panel = document.querySelector("#game-2048");
const gameMinesweeperPanel = document.querySelector("#game-minesweeper3d");
const minefieldElement = document.querySelector("#minefield");
const mineStatusText = document.querySelector("#mine-status-text");
const mineRestartButton = document.querySelector("#mine-restart-button");
const mineDifficultySelect = document.querySelector("#mine-difficulty");
const mineRemainingElement = document.querySelector("#mine-remaining");
const mineTimeElement = document.querySelector("#mine-time");
const mineRevealedElement = document.querySelector("#mine-revealed");
const mineFlagsElement = document.querySelector("#mine-flags");
const mineLayersElement = document.querySelector("#mine-layers");
const mineShapeSizeElement = document.querySelector("#mine-shape-size");

const socket = io();
const GAME_2048 = "2048";
const GAME_MINESWEEPER = "minesweeper3d";
const size = 4;
const totalCells = size * size;
const bestKey = "web2-multiplayer-2048-best-score";
const tokenKey = "class-arcade-token";
const nameKey = "class-arcade-name";
const currentGameKey = "class-arcade-current-game";
const mineDifficultyKey = "class-arcade-minesweeper-difficulty";
const mineDifficulties = {
  easy: {
    label: "入门",
    layers: 3,
    rows: 5,
    cols: 5,
    activeCells: 44,
    mines: 7,
  },
  normal: {
    label: "标准",
    layers: 4,
    rows: 6,
    cols: 6,
    activeCells: 82,
    mines: 16,
  },
  hard: {
    label: "困难",
    layers: 5,
    rows: 7,
    cols: 7,
    activeCells: 132,
    mines: 31,
  },
  expert: {
    label: "专家",
    layers: 6,
    rows: 8,
    cols: 8,
    activeCells: 196,
    mines: 52,
  },
};
const text = {
  ready: "已经进入房间，开始挑战吧。本局结束或重新开始时会结算平台积分。",
  waiting: "先登录账号，再创建或加入房间。",
  wonTitle: "你合成了 2048",
  wonCopy: "还能继续冲更高分，排行榜会实时更新。",
  wonStatus: "已经合成 2048，可以继续玩。",
  overTitle: "游戏结束",
  overStatus: "没有可移动的方块了，积分已结算。",
  minesReady: "左键翻开，右键或长按插旗。",
  minesWin: "3D 扫雷完成，积分已结算。",
  minesLose: "踩到雷了，积分已结算。",
};

let currentGame = localStorage.getItem(currentGameKey) || GAME_2048;
let profile = null;
let token = localStorage.getItem(tokenKey) || "";

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
let current2048GameId = createGameId();
let current2048Settled = false;

let mineBoard = [];
let mineGameId = createGameId();
let mineStartedAt = 0;
let mineSeconds = 0;
let mineTimerId = null;
let mineGameOver = false;
let mineGameWon = false;
let mineRevealed = 0;
let mineFlags = 0;
let mineActiveCells = 0;
let mineCount = 0;
let mineSafeCells = 0;
let mineDifficulty = localStorage.getItem(mineDifficultyKey) || "normal";
let mineSettled = false;
let mineTouchTimerId = null;
let mineTouchTarget = null;
let mineTouchLongPressed = false;
let mineIgnoreClickUntil = 0;

if (!mineDifficulties[mineDifficulty]) {
  mineDifficulty = "normal";
}

function createGameId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createEmptyBoard() {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function createMineCell() {
  return {
    active: false,
    mine: false,
    adjacent: 0,
    open: false,
    flagged: false,
  };
}

function createMineBoard() {
  const config = getMineDifficulty();

  return Array.from({ length: config.layers }, () =>
    Array.from({ length: config.rows }, () =>
      Array.from({ length: config.cols }, () => createMineCell()),
    ),
  );
}

function getMineDifficulty() {
  return mineDifficulties[mineDifficulty] || mineDifficulties.normal;
}

function setMineDifficulty(value) {
  if (!mineDifficulties[value]) {
    return;
  }

  mineDifficulty = value;
  localStorage.setItem(mineDifficultyKey, mineDifficulty);
  mineDifficultySelect.value = mineDifficulty;
  startMinesweeperGame();
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

function setupMinesweeperMarkup() {
  const config = getMineDifficulty();
  minefieldElement.innerHTML = "";

  for (let layer = 0; layer < config.layers; layer += 1) {
    const layerWrap = document.createElement("section");
    layerWrap.className = "mine-layer";

    const head = document.createElement("div");
    head.className = "mine-layer-head";
    head.innerHTML = `<span>第 ${layer + 1} 层</span><span>${config.rows} x ${config.cols}</span>`;

    const grid = document.createElement("div");
    grid.className = "mine-grid";
    grid.style.setProperty("--mine-cols", String(config.cols));

    for (let row = 0; row < config.rows; row += 1) {
      for (let column = 0; column < config.cols; column += 1) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "mine-cell";
        button.dataset.layer = String(layer);
        button.dataset.row = String(row);
        button.dataset.column = String(column);
        button.setAttribute(
          "aria-label",
          `第 ${layer + 1} 层 第 ${row + 1} 行 第 ${column + 1} 列`,
        );
        grid.appendChild(button);
      }
    }

    layerWrap.append(head, grid);
    minefieldElement.appendChild(layerWrap);
  }
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
  setActiveGame(currentGame, { persist: false });
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
    profileMinesweeperWins.textContent = "0";
    updateRoomActions();
    return;
  }

  localStorage.setItem(nameKey, profile.name);
  accountNameInput.value = profile.name;
  accountTitle.textContent = `欢迎，${profile.name}`;
  accountStatus.textContent = "账号已登录，2048 和扫雷的成绩都会结算为平台积分。";
  profileName.textContent = profile.name;
  profileLevel.textContent = String(profile.level);
  profilePoints.textContent = String(profile.totalPoints);
  profileBest.textContent = String(profile.stats.game2048.highScore);
  profileMinesweeperWins.textContent = String(profile.stats.minesweeper3d.wins);
  profileStrip.hidden = false;
  accountForm.hidden = true;
  createRoomButton.disabled = false;
  joinRoomButton.disabled = false;
  updateRoomActions();
}

function updateRoomActions() {
  const show2048 = currentGame === GAME_2048;
  roomPanel.hidden = !show2048;
  game2048Panel.classList.toggle("is-hidden", !show2048);
  gameMinesweeperPanel.classList.toggle("is-hidden", show2048);

  gameCards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.game === currentGame);
  });

  if (show2048) {
    statusText.textContent = currentRoomCode ? text.ready : hasAccount() ? "可以创建房间，或输入房间号加入同学。" : text.waiting;
  } else {
    mineStatusText.textContent = mineGameOver
      ? mineGameWon
        ? text.minesWin
        : text.minesLose
      : getMineReadyText();
  }
}

function getMineReadyText() {
  const config = getMineDifficulty();
  return `${config.label}难度：随机形状 ${mineActiveCells || config.activeCells} 格，${mineCount || config.mines} 颗雷。${text.minesReady}`;
}

function setActiveGame(gameId, options = {}) {
  currentGame = [GAME_2048, GAME_MINESWEEPER].includes(gameId)
    ? gameId
    : GAME_2048;

  if (options.persist !== false) {
    localStorage.setItem(currentGameKey, currentGame);
  }

  updateRoomActions();
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

async function loginAccount() {
  await submitAuth("/api/auth/login");
}

async function registerAccount() {
  await submitAuth("/api/auth/register");
}

async function logoutAccount() {
  try {
    if (token) {
      await apiRequest("/api/auth/logout", {
        method: "POST",
        body: "{}",
      });
    }
  } catch {
    // local logout still proceeds
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

function update2048StatsDisplay() {
  scoreElement.textContent = score;
  bestScoreElement.textContent = get2048BestTile();
}

function get2048BestTile() {
  return Math.max(...board.flat(), 0);
}

function emit2048PlayerUpdate() {
  if (!currentRoomCode || currentGame !== GAME_2048) {
    return;
  }

  socket.emit("player:update", {
    score,
    bestTile: get2048BestTile(),
    moves,
    status: gameFinished ? "finished" : "playing",
  });
}

function start2048Game(options = {}) {
  if (options.settlePrevious !== false) {
    settle2048Game("restart");
  }

  board = createEmptyBoard();
  score = 0;
  won = false;
  gameFinished = false;
  moves = 0;
  current2048GameId = createGameId();
  current2048Settled = false;
  message.classList.add("is-hidden");
  statusText.textContent = currentRoomCode ? text.ready : hasAccount() ? "可以创建房间，或输入房间号加入同学。" : text.waiting;
  add2048RandomTile();
  add2048RandomTile();
  render2048Board();

  if (options.notify !== false) {
    socket.emit("player:restart");
    emit2048PlayerUpdate();
  }
}

function add2048RandomTile() {
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

function render2048Board() {
  const cells = boardElement.querySelectorAll(".cell");

  board.flat().forEach((value, index) => {
    const cell = cells[index];
    cell.textContent = value === 0 ? "" : value;
    cell.className = "cell";

    if (value > 0) {
      cell.classList.add(value <= 2048 ? `tile-${value}` : "tile-super");
    }
  });

  update2048StatsDisplay();
}

function slide2048Row(row) {
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

function rotate2048Right(matrix) {
  return matrix[0].map((_, columnIndex) =>
    matrix.map((row) => row[columnIndex]).reverse(),
  );
}

function rotate2048Left(matrix) {
  return matrix[0].map((_, columnIndex) =>
    matrix.map((row) => row[size - 1 - columnIndex]),
  );
}

function reverse2048Rows(matrix) {
  return matrix.map((row) => [...row].reverse());
}

function boardsEqual(first, second) {
  return JSON.stringify(first) === JSON.stringify(second);
}

function move2048(direction) {
  if (gameFinished) {
    return;
  }

  const previousBoard = board.map((row) => [...row]);
  let workingBoard = board.map((row) => [...row]);

  if (direction === "right") {
    workingBoard = reverse2048Rows(workingBoard);
  }

  if (direction === "up") {
    workingBoard = rotate2048Left(workingBoard);
  }

  if (direction === "down") {
    workingBoard = rotate2048Right(workingBoard);
  }

  let gainedThisMove = 0;
  workingBoard = workingBoard.map((row) => {
    const result = slide2048Row(row);
    gainedThisMove += result.gained;
    return result.row;
  });

  if (direction === "right") {
    workingBoard = reverse2048Rows(workingBoard);
  }

  if (direction === "up") {
    workingBoard = rotate2048Right(workingBoard);
  }

  if (direction === "down") {
    workingBoard = rotate2048Left(workingBoard);
  }

  if (boardsEqual(previousBoard, workingBoard)) {
    return;
  }

  board = workingBoard;
  score += gainedThisMove;
  moves += 1;
  update2048BestScore();
  add2048RandomTile();
  render2048Board();
  check2048GameState();
  emit2048PlayerUpdate();
}

function update2048BestScore() {
  if (score <= bestScore) {
    return;
  }

  bestScore = score;
  localStorage.setItem(bestKey, String(bestScore));
}

function check2048GameState() {
  if (!won && board.flat().includes(2048)) {
    won = true;
    showMessage(text.wonTitle, text.wonCopy, false);
    statusText.textContent = text.wonStatus;
    return;
  }

  if (!can2048Move()) {
    gameFinished = true;
    showMessage(text.overTitle, `最终分数：${score}`, true);
    statusText.textContent = text.overStatus;
    settle2048Game("finished");
  }
}

function can2048Move() {
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
    start2048Game();
  }
}

async function settle2048Game(reason) {
  if (!hasAccount() || current2048Settled || moves === 0) {
    return;
  }

  current2048Settled = true;

  try {
    const data = await apiRequest("/api/games/2048/results", {
      method: "POST",
      body: JSON.stringify({
        gameId: current2048GameId,
        score,
        bestTile: get2048BestTile(),
        moves,
        won,
        reason,
      }),
    });

    renderAccount(data.profile);
    await refreshLeaderboard(data.leaderboard);
    statusText.textContent = `本局获得 ${data.award.points} 积分。`;
    emit2048PlayerUpdate();
  } catch (error) {
    statusText.textContent = error.message;
    current2048Settled = false;
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
  if (currentGame !== GAME_2048) {
    return;
  }

  const direction = getDirectionFromKey(event.key);

  if (!direction) {
    return;
  }

  event.preventDefault();
  if (!gameFinished) {
    message.classList.add("is-hidden");
  }
  move2048(direction);
}

function handleTouchStart(event) {
  if (currentGame !== GAME_2048) {
    return;
  }

  const touch = event.changedTouches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

function handleTouchEnd(event) {
  if (currentGame !== GAME_2048) {
    return;
  }

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
    move2048(deltaX > 0 ? "right" : "left");
  } else {
    move2048(deltaY > 0 ? "down" : "up");
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
  updateRoomActions();
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

function getRoomPlayerStatusText(player) {
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
    meta.textContent = `${getRoomPlayerStatusText(player)} · Lv.${player.level || 1} · 最高块 ${player.bestTile || 0} · ${player.moves || 0} 步`;

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
    meta.textContent = `Lv.${player.level} · 2048 最高 ${player.stats.game2048.highScore} · 扫雷 ${player.stats.minesweeper3d.wins} 胜`;

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

function renderMinesweeperStats() {
  const config = getMineDifficulty();
  mineRemainingElement.textContent = String(Math.max(0, mineCount - mineFlags));
  mineTimeElement.textContent = String(mineSeconds);
  mineRevealedElement.textContent = String(mineRevealed);
  mineFlagsElement.textContent = String(mineFlags);
  mineLayersElement.textContent = String(config.layers);
  mineShapeSizeElement.textContent = String(mineActiveCells);
}

function startMineTimer() {
  if (mineTimerId) {
    return;
  }

  if (!mineStartedAt) {
    mineStartedAt = Date.now();
  }

  mineTimerId = window.setInterval(() => {
    mineSeconds = Math.floor((Date.now() - mineStartedAt) / 1000);
    renderMinesweeperStats();
  }, 1000);
}

function stopMineTimer() {
  if (mineTimerId) {
    window.clearInterval(mineTimerId);
    mineTimerId = null;
  }
}

function initializeMinesweeperBoard() {
  const config = getMineDifficulty();
  setupMinesweeperMarkup();
  mineBoard = createMineBoard();
  mineGameId = createGameId();
  mineStartedAt = 0;
  mineSeconds = 0;
  mineGameOver = false;
  mineGameWon = false;
  mineRevealed = 0;
  mineFlags = 0;
  mineActiveCells = Math.min(config.activeCells, config.layers * config.rows * config.cols);
  mineCount = Math.min(config.mines, Math.max(1, mineActiveCells - 1));
  mineSafeCells = mineActiveCells - mineCount;
  mineSettled = false;
  stopMineTimer();

  const shape = generateMineShape(config, mineActiveCells);
  const positions = Array.from(shape).map(parseMineKey);

  positions.forEach((position) => {
    mineBoard[position.layer][position.row][position.column].active = true;
  });

  for (let count = 0; count < mineCount; count += 1) {
    const index = Math.floor(Math.random() * positions.length);
    const position = positions.splice(index, 1)[0];
    mineBoard[position.layer][position.row][position.column].mine = true;
  }

  for (let layer = 0; layer < config.layers; layer += 1) {
    for (let row = 0; row < config.rows; row += 1) {
      for (let column = 0; column < config.cols; column += 1) {
        const cell = mineBoard[layer][row][column];

        if (cell.active) {
          cell.adjacent = countMineNeighbors(layer, row, column);
        }
      }
    }
  }

  renderMinesweeperBoard();
}

function generateMineShape(config, targetSize) {
  const start = {
    layer: Math.floor(config.layers / 2),
    row: Math.floor(config.rows / 2),
    column: Math.floor(config.cols / 2),
  };
  const active = new Set([mineCellKey(start.layer, start.row, start.column)]);
  const frontier = new Map();

  addOrthogonalFrontier(start, config, active, frontier);

  while (active.size < targetSize && frontier.size > 0) {
    const options = Array.from(frontier.values());
    const next = options[Math.floor(Math.random() * options.length)];
    const key = mineCellKey(next.layer, next.row, next.column);
    frontier.delete(key);

    if (active.has(key)) {
      continue;
    }

    active.add(key);
    addOrthogonalFrontier(next, config, active, frontier);
  }

  return active;
}

function addOrthogonalFrontier(position, config, active, frontier) {
  getOrthogonalMineNeighbors(position.layer, position.row, position.column).forEach((next) => {
    if (!isMineInBounds(next.layer, next.row, next.column, config)) {
      return;
    }

    const key = mineCellKey(next.layer, next.row, next.column);

    if (!active.has(key)) {
      frontier.set(key, next);
    }
  });
}

function getOrthogonalMineNeighbors(layer, row, column) {
  return [
    { layer: layer - 1, row, column },
    { layer: layer + 1, row, column },
    { layer, row: row - 1, column },
    { layer, row: row + 1, column },
    { layer, row, column: column - 1 },
    { layer, row, column: column + 1 },
  ];
}

function parseMineKey(key) {
  const [layer, row, column] = key.split("-").map(Number);
  return { layer, row, column };
}

function countMineNeighbors(layer, row, column) {
  let count = 0;

  for (let layerDelta = -1; layerDelta <= 1; layerDelta += 1) {
    for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) {
      for (let columnDelta = -1; columnDelta <= 1; columnDelta += 1) {
        if (layerDelta === 0 && rowDelta === 0 && columnDelta === 0) {
          continue;
        }

        const nextLayer = layer + layerDelta;
        const nextRow = row + rowDelta;
        const nextColumn = column + columnDelta;

        if (!isMineInBounds(nextLayer, nextRow, nextColumn)) {
          continue;
        }

        const nextCell = mineBoard[nextLayer][nextRow][nextColumn];

        if (nextCell.active && nextCell.mine) {
          count += 1;
        }
      }
    }
  }

  return count;
}

function isMineInBounds(layer, row, column, config = getMineDifficulty()) {
  return (
    layer >= 0 &&
    layer < config.layers &&
    row >= 0 &&
    row < config.rows &&
    column >= 0 &&
    column < config.cols
  );
}

function mineCellKey(layer, row, column) {
  return `${layer}-${row}-${column}`;
}

function getMineCell(layer, row, column) {
  return mineBoard[layer]?.[row]?.[column] || null;
}

function renderMinesweeperBoard() {
  const buttons = minefieldElement.querySelectorAll(".mine-cell");

  buttons.forEach((button) => {
    const layer = Number(button.dataset.layer);
    const row = Number(button.dataset.row);
    const column = Number(button.dataset.column);
    const cell = getMineCell(layer, row, column);

    if (!cell) {
      return;
    }

    button.className = "mine-cell";
    button.disabled = mineGameOver || !cell.active;
    button.textContent = "";

    if (!cell.active) {
      button.classList.add("is-void");
      button.setAttribute("aria-label", "空洞");
      return;
    }

    if (cell.open) {
      button.classList.add("is-open");

      if (cell.mine) {
        button.classList.add("is-mine-revealed");
        button.textContent = "X";
      } else if (cell.adjacent > 0) {
        button.textContent = String(cell.adjacent);
      }
    } else if (cell.flagged) {
      button.classList.add("is-flagged");
      button.textContent = "F";
    }

    if (mineGameOver && cell.mine && !cell.open) {
      button.classList.add("is-mine");
      button.textContent = "M";
    }
  });

  renderMinesweeperStats();

  mineStatusText.textContent = mineGameOver
    ? mineGameWon
      ? text.minesWin
      : text.minesLose
    : getMineReadyText();
}

function toggleMineFlag(layer, row, column) {
  if (mineGameOver) {
    return;
  }

  const cell = getMineCell(layer, row, column);

  if (!cell || !cell.active || cell.open) {
    return;
  }

  cell.flagged = !cell.flagged;
  mineFlags += cell.flagged ? 1 : -1;
  renderMinesweeperBoard();
}

function revealMineArea(layer, row, column) {
  const queue = [{ layer, row, column }];
  const seen = new Set();

  while (queue.length > 0) {
    const current = queue.shift();
    const key = mineCellKey(current.layer, current.row, current.column);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);

    const cell = getMineCell(current.layer, current.row, current.column);

    if (!cell || !cell.active || cell.open || cell.flagged) {
      continue;
    }

    cell.open = true;
    mineRevealed += 1;

    if (cell.adjacent === 0 && !cell.mine) {
      for (let layerDelta = -1; layerDelta <= 1; layerDelta += 1) {
        for (let rowDelta = -1; rowDelta <= 1; rowDelta += 1) {
          for (let columnDelta = -1; columnDelta <= 1; columnDelta += 1) {
            if (layerDelta === 0 && rowDelta === 0 && columnDelta === 0) {
              continue;
            }

            const nextLayer = current.layer + layerDelta;
            const nextRow = current.row + rowDelta;
            const nextColumn = current.column + columnDelta;

            if (!isMineInBounds(nextLayer, nextRow, nextColumn)) {
              continue;
            }

            const nextCell = getMineCell(nextLayer, nextRow, nextColumn);

            if (nextCell && nextCell.active && !nextCell.open && !nextCell.flagged) {
              queue.push({ layer: nextLayer, row: nextRow, column: nextColumn });
            }
          }
        }
      }
    }
  }
}

function finishMinesweeperGame(wonState) {
  if (mineGameOver) {
    return;
  }

  mineGameOver = true;
  mineGameWon = wonState;
  stopMineTimer();
  renderMinesweeperBoard();
  settleMinesweeperGame(wonState ? "won" : "lost");
}

function checkMinesweeperWin() {
  if (mineRevealed >= mineSafeCells) {
    finishMinesweeperGame(true);
  }
}

function openMineCell(layer, row, column) {
  if (mineGameOver || currentGame !== GAME_MINESWEEPER) {
    return;
  }

  const cell = getMineCell(layer, row, column);

  if (!cell || !cell.active || cell.open || cell.flagged) {
    return;
  }

  if (!mineStartedAt) {
    startMineTimer();
  }

  if (cell.mine) {
    cell.open = true;
    finishMinesweeperGame(false);
    return;
  }

  revealMineArea(layer, row, column);
  renderMinesweeperBoard();
  checkMinesweeperWin();
}

function startMinesweeperGame(options = {}) {
  if (options.settlePrevious !== false) {
    settleMinesweeperGame("restart");
  }

  initializeMinesweeperBoard();

  if (options.notify !== false) {
    mineStatusText.textContent = getMineReadyText();
  }
}

async function settleMinesweeperGame(reason) {
  if (
    !hasAccount() ||
    mineSettled ||
    (mineRevealed === 0 && mineFlags === 0 && mineStartedAt === 0)
  ) {
    return;
  }

  mineSettled = true;
  const seconds = mineStartedAt ? Math.floor((Date.now() - mineStartedAt) / 1000) : mineSeconds;

  try {
    const data = await apiRequest("/api/games/minesweeper-3d/results", {
      method: "POST",
      body: JSON.stringify({
        gameId: mineGameId,
        won: mineGameWon,
        revealed: mineRevealed,
        totalSafe: mineSafeCells,
        flags: mineFlags,
        seconds,
        reason,
      }),
    });

    renderAccount(data.profile);
    await refreshLeaderboard(data.leaderboard);
    mineStatusText.textContent = `本局获得 ${data.award.points} 积分。`;
  } catch (error) {
    mineStatusText.textContent = error.message;
    mineSettled = false;
  }
}

function handleMineClick(event) {
  if (currentGame !== GAME_MINESWEEPER) {
    return;
  }

  if (Date.now() < mineIgnoreClickUntil) {
    return;
  }

  const button = event.target.closest(".mine-cell");

  if (!button || button.disabled) {
    return;
  }

  const layer = Number(button.dataset.layer);
  const row = Number(button.dataset.row);
  const column = Number(button.dataset.column);
  openMineCell(layer, row, column);
}

function handleMineContextMenu(event) {
  if (currentGame !== GAME_MINESWEEPER) {
    return;
  }

  const button = event.target.closest(".mine-cell");

  if (!button) {
    return;
  }

  event.preventDefault();
  const layer = Number(button.dataset.layer);
  const row = Number(button.dataset.row);
  const column = Number(button.dataset.column);
  toggleMineFlag(layer, row, column);
}

function clearMineTouchHold() {
  if (mineTouchTimerId) {
    window.clearTimeout(mineTouchTimerId);
    mineTouchTimerId = null;
  }

  mineTouchTarget = null;
  mineTouchLongPressed = false;
}

function handleMineTouchStart(event) {
  if (currentGame !== GAME_MINESWEEPER) {
    return;
  }

  const button = event.target.closest(".mine-cell");

  if (!button) {
    return;
  }

  clearMineTouchHold();
  mineTouchTarget = button;
  mineTouchLongPressed = false;
  mineTouchTimerId = window.setTimeout(() => {
    mineTouchTimerId = null;
    mineTouchLongPressed = true;
    const layer = Number(button.dataset.layer);
    const row = Number(button.dataset.row);
    const column = Number(button.dataset.column);
    toggleMineFlag(layer, row, column);
    mineIgnoreClickUntil = Date.now() + 400;
  }, 420);
}

function handleMineTouchEnd(event) {
  if (currentGame !== GAME_MINESWEEPER) {
    return;
  }

  const button = event.target.closest(".mine-cell") || mineTouchTarget;

  if (!button) {
    clearMineTouchHold();
    return;
  }

  if (mineTouchTimerId) {
    window.clearTimeout(mineTouchTimerId);
    mineTouchTimerId = null;
  }

  if (mineTouchLongPressed) {
    mineIgnoreClickUntil = Date.now() + 400;
    mineTouchLongPressed = false;
    mineTouchTarget = null;
    return;
  }

  if (Date.now() >= mineIgnoreClickUntil) {
    const layer = Number(button.dataset.layer);
    const row = Number(button.dataset.row);
    const column = Number(button.dataset.column);
    openMineCell(layer, row, column);
  }

  mineIgnoreClickUntil = Date.now() + 250;
  mineTouchTarget = null;
}

function handleMineTouchMove() {
  clearMineTouchHold();
}

function handleMineTouchCancel() {
  clearMineTouchHold();
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
restartButton.addEventListener("click", () => start2048Game());
mineRestartButton.addEventListener("click", () => startMinesweeperGame());
mineDifficultySelect.addEventListener("change", () => {
  setMineDifficulty(mineDifficultySelect.value);
});
messageButton.addEventListener("click", hideMessageAndContinue);
gameCards.forEach((card) => {
  card.addEventListener("click", () => setActiveGame(card.dataset.game));
});
document.addEventListener("keydown", handleKeyDown);
boardElement.addEventListener("touchstart", handleTouchStart, { passive: true });
boardElement.addEventListener("touchend", handleTouchEnd);
roomCodeInput.addEventListener("input", () => {
  roomCodeInput.value = roomCodeInput.value.toUpperCase();
});
minefieldElement.addEventListener("click", handleMineClick);
minefieldElement.addEventListener("contextmenu", handleMineContextMenu);
minefieldElement.addEventListener("touchstart", handleMineTouchStart, { passive: true });
minefieldElement.addEventListener("touchend", handleMineTouchEnd);
minefieldElement.addEventListener("touchmove", handleMineTouchMove, { passive: true });
minefieldElement.addEventListener("touchcancel", handleMineTouchCancel);

setupBoardMarkup();
mineDifficultySelect.value = mineDifficulty;
setupMinesweeperMarkup();
board = createEmptyBoard();
mineBoard = createMineBoard();
initializeMinesweeperBoard();
start2048Game({ notify: false, settlePrevious: false });
loadSession();
