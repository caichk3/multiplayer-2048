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
const roomGameLabel = document.querySelector("#room-game-label");
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
const profileFlappyBest = document.querySelector("#profile-flappy-best");
const gameCards = Array.from(document.querySelectorAll(".game-card[data-game]"));
const roomPanel = document.querySelector("#room-panel");
const game2048Panel = document.querySelector("#game-2048");
const gameMinesweeperPanel = document.querySelector("#game-minesweeper3d");
const gameFlappyPanel = document.querySelector("#game-flappy");
const gameDuelPanel = document.querySelector("#game-paddleduel");
const mineStatusText = document.querySelector("#mine-status-text");
const mineRestartButton = document.querySelector("#mine-restart-button");
const mineExpandButton = document.querySelector("#mine-expand-button");
const mineDifficultySelect = document.querySelector("#mine-difficulty");
const mineRemainingElement = document.querySelector("#mine-remaining");
const mineTimeElement = document.querySelector("#mine-time");
const mineRevealedElement = document.querySelector("#mine-revealed");
const mineFlagsElement = document.querySelector("#mine-flags");
const mineLayersElement = document.querySelector("#mine-layers");
const mineShapeSizeElement = document.querySelector("#mine-shape-size");
const mineModelStage = document.querySelector("#mine-model-stage");
const mineModelSpace = document.querySelector("#mine-model-space");
const flappyCanvas = document.querySelector("#flappy-canvas");
const flappyContext = flappyCanvas.getContext("2d");
const flappyStatusText = document.querySelector("#flappy-status-text");
const flappyRestartButton = document.querySelector("#flappy-restart-button");
const flappyScoreElement = document.querySelector("#flappy-score");
const flappyBestElement = document.querySelector("#flappy-best");
const duelCanvas = document.querySelector("#duel-canvas");
const duelContext = duelCanvas.getContext("2d");
const duelScoreElement = document.querySelector("#duel-score");
const duelTimeElement = document.querySelector("#duel-time");
const duelStatusText = document.querySelector("#duel-status-text");
const duelStartButton = document.querySelector("#duel-start-button");
const duelMoveButtons = Array.from(document.querySelectorAll("[data-duel-move]"));

const socket = io();
const GAME_2048 = "2048";
const GAME_MINESWEEPER = "minesweeper3d";
const GAME_FLAPPY = "flappy";
const GAME_DUEL = "paddleduel";
const size = 4;
const totalCells = size * size;
const bestKey = "web2-multiplayer-2048-best-score";
const tokenKey = "class-arcade-token";
const nameKey = "class-arcade-name";
const currentGameKey = "class-arcade-current-game";
const mineDifficultyKey = "class-arcade-minesweeper-difficulty";
const flappyBestKey = "class-arcade-flappy-best";
const mineLightModeQuery = window.matchMedia("(hover: none), (max-width: 720px)");
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
const flappySettings = {
  width: 420,
  height: 560,
  birdX: 118,
  birdRadius: 16,
  gravity: 0.42,
  jumpVelocity: -7.4,
  pipeWidth: 66,
  pipeGap: 150,
  pipeSpacing: 208,
  pipeSpeed: 2.65,
  groundHeight: 62,
};
const text = {
  ready: "已经进入房间，开始挑战吧。本局结束或重新开始时会结算平台积分。",
  waiting: "先登录账号，再创建或加入房间。",
  wonTitle: "你合成了 2048",
  wonCopy: "还能继续冲更高分，排行榜会实时更新。",
  wonStatus: "已经合成 2048，可以继续玩。",
  overTitle: "游戏结束",
  overStatus: "没有可移动的方块了，积分已结算。",
  minesReady: "拖动旋转模型，点立方体翻开，右键或长按插旗。",
  minesLayerReady: "手机分层模式：点格子翻开，长按插旗，用层按钮切换高度。",
  minesWin: "3D 扫雷完成，积分已结算。",
  minesLose: "踩到雷了，积分已结算。",
  flappyReady: "点击、触屏或按空格起飞，穿过管道拿分。",
  flappyPlaying: "保持节奏，别碰到管道或地面。",
  flappyOver: "撞到了，本局分数已结算。",
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
let mineModelRotationX = -28;
let mineModelRotationY = 36;
let mineModelDragging = false;
let mineModelDragX = 0;
let mineModelDragY = 0;
let mineModelDragDistance = 0;
let mineModelExpanded = false;
let mineModelRotationFrameId = null;
let mineLightMode = mineLightModeQuery.matches;
let mineLayerView = 0;
let flappyGameId = createGameId();
let flappyScore = 0;
let flappyBest = Number(localStorage.getItem(flappyBestKey)) || 0;
let flappyBirdY = flappySettings.height * 0.44;
let flappyVelocity = 0;
let flappyPipes = [];
let flappyRunning = false;
let flappyGameOver = false;
let flappyStartedAt = 0;
let flappyAnimationId = null;
let flappyLastFrameTime = 0;
let flappySettled = false;
let flappyGroundOffset = 0;
let flappyClouds = [];
let duelState = null;
let duelSide = "";
let duelInputDirection = 0;

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
  mineModelStage.querySelector(".mine-layer-shell")?.remove();
  mineModelSpace.innerHTML = "";
  mineModelSpace.dataset.renderMode = mineLightMode ? "layers" : "full";
  applyMineModelRotation();
  renderMineExpandButton();
  mineModelStage.classList.toggle("is-light-mode", mineLightMode);
  mineModelStage.classList.toggle("is-layer-mode", mineLightMode);

  if (mineLightMode) {
    const shell = document.createElement("div");
    shell.className = "mine-layer-shell";
    shell.innerHTML = `
      <div class="mine-layer-tabs" id="mine-layer-tabs" aria-label="扫雷层数"></div>
      <div class="mine-layer-board" id="mine-layer-board" aria-label="当前层扫雷棋盘"></div>
    `;
    mineModelStage.appendChild(shell);
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
    profileFlappyBest.textContent = "0";
    updateRoomActions();
    return;
  }

  localStorage.setItem(nameKey, profile.name);
  accountNameInput.value = profile.name;
  accountTitle.textContent = `欢迎，${profile.name}`;
  accountStatus.textContent = "账号已登录，小游戏成绩都会结算为平台积分。";
  profileName.textContent = profile.name;
  profileLevel.textContent = String(profile.level);
  profilePoints.textContent = String(profile.totalPoints);
  profileBest.textContent = String(profile.stats.game2048.highScore);
  profileMinesweeperWins.textContent = String(profile.stats.minesweeper3d.wins);
  flappyBest = Math.max(flappyBest, profile.stats.flappy?.bestScore || 0);
  localStorage.setItem(flappyBestKey, String(flappyBest));
  profileFlappyBest.textContent = String(flappyBest);
  flappyBestElement.textContent = String(flappyBest);
  profileStrip.hidden = false;
  accountForm.hidden = true;
  createRoomButton.disabled = false;
  joinRoomButton.disabled = false;
  updateRoomActions();
}

function updateRoomActions() {
  const show2048 = currentGame === GAME_2048;
  const showMinesweeper = currentGame === GAME_MINESWEEPER;
  const showFlappy = currentGame === GAME_FLAPPY;
  const showDuel = currentGame === GAME_DUEL;
  const showRoom = show2048 || showDuel;
  roomPanel.hidden = !showRoom;
  roomGameLabel.textContent = showDuel ? "挡板弹球对战" : "2048 联机竞速";
  game2048Panel.classList.toggle("is-hidden", !show2048);
  gameMinesweeperPanel.classList.toggle("is-hidden", !showMinesweeper);
  gameFlappyPanel.classList.toggle("is-hidden", !showFlappy);
  gameDuelPanel.classList.toggle("is-hidden", !showDuel);

  gameCards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.game === currentGame);
  });

  if (show2048) {
    statusText.textContent = currentRoomCode ? text.ready : hasAccount() ? "可以创建房间，或输入房间号加入同学。" : text.waiting;
  } else if (showMinesweeper) {
    mineStatusText.textContent = mineGameOver
      ? mineGameWon
        ? text.minesWin
        : text.minesLose
      : getMineReadyText();
  } else if (showFlappy) {
    flappyStatusText.textContent = flappyGameOver ? text.flappyOver : text.flappyReady;
    renderFlappy();
  } else if (showDuel) {
    renderDuel();
    updateDuelStatus();
  }
}

function getMineReadyText() {
  const config = getMineDifficulty();
  const operateText = mineLightMode ? text.minesLayerReady : text.minesReady;
  return `${config.label}难度：随机形状 ${mineActiveCells || config.activeCells} 格，${mineCount || config.mines} 颗雷。${operateText}`;
}

function setActiveGame(gameId, options = {}) {
  if (currentGame === GAME_DUEL && gameId !== GAME_DUEL) {
    setDuelInput(0);
  }

  currentGame = [GAME_2048, GAME_MINESWEEPER, GAME_FLAPPY, GAME_DUEL].includes(gameId)
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
  if (currentGame === GAME_DUEL) {
    const direction = getDuelDirection(event.key);

    if (direction !== 0) {
      event.preventDefault();
      setDuelInput(direction);
    }

    return;
  }

  if (currentGame === GAME_FLAPPY) {
    if ([" ", "ArrowUp", "w", "W"].includes(event.key)) {
      event.preventDefault();
      flap();
    }

    return;
  }

  if (currentGame !== GAME_2048) {
    return;
  }

  const direction = getDirectionFromKey(event.key);

  if (direction) {
    event.preventDefault();
    if (!gameFinished) {
      message.classList.add("is-hidden");
    }
    move2048(direction);
  }
}

function handleKeyUp(event) {
  if (currentGame !== GAME_DUEL) {
    return;
  }

  if (["ArrowUp", "ArrowDown", "w", "W", "s", "S"].includes(event.key)) {
    event.preventDefault();
    setDuelInput(0);
  }
}

function getDuelDirection(key) {
  if (key === "ArrowUp" || key === "w" || key === "W") {
    return -1;
  }

  if (key === "ArrowDown" || key === "s" || key === "S") {
    return 1;
  }

  return 0;
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
  duelState = room.duel || duelState;
  duelSide = getDuelSide();
  roomCodeInput.value = room.code;
  activeRoomCode.textContent = room.code;
  activeRoom.hidden = false;
  statusText.textContent = text.ready;
  renderPlayers(room);
  renderDuel();
  updateDuelStatus();
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
  const roomDuel = room.duel || duelState;
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
    if (currentGame === GAME_DUEL) {
      const side =
        roomDuel?.players?.left?.id === player.id
          ? "左侧"
          : roomDuel?.players?.right?.id === player.id
            ? "右侧"
            : "观战";
      meta.textContent = `${side} · Lv.${player.level || 1} · ${getRoomPlayerStatusText(player)}`;
    } else {
      meta.textContent = `${getRoomPlayerStatusText(player)} · Lv.${player.level || 1} · 最高块 ${player.bestTile || 0} · ${player.moves || 0} 步`;
    }

    info.append(name, meta);

    const scoreBox = document.createElement("div");
    scoreBox.className = "player-score";
    const scoreValue = document.createElement("strong");
    const duelScore =
      roomDuel?.players?.left?.id === player.id
        ? roomDuel?.score?.left
        : roomDuel?.players?.right?.id === player.id
          ? roomDuel?.score?.right
          : null;
    scoreValue.textContent = String(currentGame === GAME_DUEL && duelScore !== null ? duelScore || 0 : player.score || 0);
    const scoreLabel = document.createElement("span");
    scoreLabel.textContent = currentGame === GAME_DUEL ? "进球" : `${player.totalPoints || 0} 总分`;
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
    meta.textContent = `Lv.${player.level} · 2048 最高 ${player.stats.game2048.highScore} · 扫雷 ${player.stats.minesweeper3d.wins} 胜 · 飞鸟 ${player.stats.flappy?.bestScore || 0} · 弹球 ${player.stats.paddleduel?.wins || 0} 胜`;

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

function formatDuelTime(seconds) {
  const safeSeconds = Math.max(0, Math.ceil(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function getDuelSide(state = duelState) {
  if (!state?.players) {
    return "";
  }

  if (state.players.left?.id === currentPlayerId) {
    return "left";
  }

  if (state.players.right?.id === currentPlayerId) {
    return "right";
  }

  return "";
}

function updateDuelStatus() {
  duelSide = getDuelSide();
  const playerCount = [duelState?.players?.left, duelState?.players?.right].filter(Boolean).length;

  if (!currentRoomCode) {
    duelStatusText.textContent = hasAccount()
      ? "先创建房间，或输入同学的房间号加入。"
      : "先登录账号，再创建或加入房间。";
    duelStartButton.disabled = !hasAccount();
    return;
  }

  if (playerCount < 2) {
    duelStatusText.textContent = "等待第 2 位同学加入房间。";
    duelStartButton.disabled = true;
    return;
  }

  if (duelState?.active) {
    duelStatusText.textContent = duelSide
      ? `你在${duelSide === "left" ? "左侧" : "右侧"}，用 W/S 或上下方向键移动。`
      : "你正在观战这局对战。";
    duelStartButton.disabled = true;
    return;
  }

  if (duelState?.ended) {
    const winnerName = duelState.winner ? duelState.players?.[duelState.winner]?.name : "";
    duelStatusText.textContent = winnerName ? `${winnerName} 获胜，点击开始可以再来一局。` : "平局，点击开始可以再来一局。";
    duelStartButton.disabled = false;
    return;
  }

  duelStatusText.textContent = duelSide ? "满 2 人后可以开始，3 分钟内进门得分。" : "房间已满，你可以观战。";
  duelStartButton.disabled = !duelSide;
}

function setDuelInput(direction) {
  if (!currentRoomCode || duelInputDirection === direction) {
    return;
  }

  duelInputDirection = direction;
  socket.emit("duel:input", { direction });
}

function requestDuelStart() {
  if (!hasAccount()) {
    duelStatusText.textContent = "先登录账号再开始对战。";
    return;
  }

  if (!currentRoomCode) {
    duelStatusText.textContent = "先创建或加入一个房间。";
    return;
  }

  setDuelInput(0);
  socket.emit("duel:start", {}, (response) => {
    if (!response?.ok) {
      duelStatusText.textContent = response?.message || "暂时不能开始对战。";
    }
  });
}

function renderDuel() {
  const context = duelContext;
  const width = duelCanvas.width;
  const height = duelCanvas.height;
  const state = duelState || {};
  const score = state.score || { left: 0, right: 0 };
  const paddles = state.paddles || { left: 0.5, right: 0.5 };
  const ball = state.ball || { x: width / 2, y: height / 2 };

  duelScoreElement.textContent = `${score.left || 0} : ${score.right || 0}`;
  duelTimeElement.textContent = formatDuelTime(state.timeLeft ?? 180);
  context.clearRect(0, 0, width, height);

  const courtGradient = context.createLinearGradient(0, 0, width, height);
  courtGradient.addColorStop(0, "#17324a");
  courtGradient.addColorStop(0.52, "#1f5b61");
  courtGradient.addColorStop(1, "#24364b");
  context.fillStyle = courtGradient;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(255, 255, 255, 0.28)";
  context.lineWidth = 4;
  context.strokeRect(18, 18, width - 36, height - 36);
  context.setLineDash([12, 14]);
  context.beginPath();
  context.moveTo(width / 2, 24);
  context.lineTo(width / 2, height - 24);
  context.stroke();
  context.setLineDash([]);

  drawDuelGoal(context, 18, height);
  drawDuelGoal(context, width - 18, height);
  drawDuelPaddle(context, 42, paddles.left * height, "#f4c542");
  drawDuelPaddle(context, width - 42, paddles.right * height, "#65d6c1");
  drawDuelBall(context, ball.x, ball.y);

  context.fillStyle = "rgba(255, 255, 255, 0.9)";
  context.font = "900 44px Inter, Arial, sans-serif";
  context.textAlign = "center";
  context.fillText(`${score.left || 0}  :  ${score.right || 0}`, width / 2, 72);

  if (!state.active) {
    context.fillStyle = "rgba(8, 18, 28, 0.54)";
    context.fillRect(170, 176, width - 340, 128);
    context.fillStyle = "#ffffff";
    context.font = "900 28px Inter, Arial, sans-serif";
    context.fillText(state.ended ? "对战结束" : "等待开始", width / 2, 226);
    context.font = "800 16px Inter, Arial, sans-serif";
    context.fillText(currentRoomCode ? "满 2 人后点击开始对战" : "先创建或加入房间", width / 2, 260);
  }
}

function drawDuelGoal(context, x, height) {
  context.strokeStyle = "rgba(244, 197, 66, 0.68)";
  context.lineWidth = 8;
  context.beginPath();
  context.moveTo(x, 28);
  context.lineTo(x, height - 28);
  context.stroke();
}

function drawDuelPaddle(context, x, centerY, color) {
  const paddleHeight = 92;
  context.fillStyle = color;
  context.fillRect(x - 8, centerY - paddleHeight / 2, 16, paddleHeight);
  context.fillStyle = "rgba(255, 255, 255, 0.28)";
  context.fillRect(x - 5, centerY - paddleHeight / 2 + 8, 4, paddleHeight - 16);
}

function drawDuelBall(context, x, y) {
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(x, y, 11, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = "rgba(244, 197, 66, 0.9)";
  context.lineWidth = 3;
  context.stroke();
}

function setDuelTouchInput(clientY) {
  const rect = duelCanvas.getBoundingClientRect();
  setDuelInput(clientY < rect.top + rect.height / 2 ? -1 : 1);
}

function resetFlappyGame(options = {}) {
  stopFlappyLoop();
  flappyGameId = createGameId();
  flappyScore = 0;
  flappyBirdY = flappySettings.height * 0.44;
  flappyVelocity = 0;
  flappyPipes = [];
  flappyRunning = false;
  flappyGameOver = false;
  flappyStartedAt = 0;
  flappySettled = false;
  flappyGroundOffset = 0;
  flappyClouds = createFlappyClouds();
  flappyScoreElement.textContent = "0";
  flappyBestElement.textContent = String(flappyBest);
  flappyRestartButton.textContent = "开始";
  flappyStatusText.textContent = options.readyText || text.flappyReady;
  seedFlappyPipes();
  renderFlappy();
}

function createFlappyClouds() {
  return [
    { x: 52, y: 84, size: 26, speed: 0.14 },
    { x: 238, y: 126, size: 18, speed: 0.1 },
    { x: 336, y: 70, size: 22, speed: 0.12 },
  ];
}

function seedFlappyPipes() {
  flappyPipes = [];
  for (let index = 0; index < 3; index += 1) {
    flappyPipes.push(createFlappyPipe(flappySettings.width + 120 + index * flappySettings.pipeSpacing));
  }
}

function createFlappyPipe(x) {
  const topMin = 72;
  const topMax = flappySettings.height - flappySettings.groundHeight - flappySettings.pipeGap - 92;
  const topHeight = topMin + Math.random() * Math.max(1, topMax - topMin);

  return {
    x,
    topHeight,
    scored: false,
  };
}

function startFlappyGame() {
  if (flappyRunning) {
    return;
  }

  if (flappyGameOver) {
    resetFlappyGame();
  }

  flappyRunning = true;
  flappyStartedAt = flappyStartedAt || Date.now();
  flappyLastFrameTime = performance.now();
  flappyRestartButton.textContent = "重新开始";
  flappyStatusText.textContent = text.flappyPlaying;
  flappyVelocity = flappySettings.jumpVelocity;
  flappyAnimationId = window.requestAnimationFrame(updateFlappyFrame);
}

function stopFlappyLoop() {
  if (flappyAnimationId) {
    window.cancelAnimationFrame(flappyAnimationId);
    flappyAnimationId = null;
  }
}

function flap() {
  if (currentGame !== GAME_FLAPPY) {
    return;
  }

  if (!flappyRunning) {
    startFlappyGame();
    return;
  }

  if (flappyGameOver) {
    resetFlappyGame();
    return;
  }

  flappyVelocity = flappySettings.jumpVelocity;
}

function updateFlappyFrame(timestamp) {
  if (!flappyRunning) {
    return;
  }

  const delta = Math.min(2, (timestamp - flappyLastFrameTime) / 16.67 || 1);
  flappyLastFrameTime = timestamp;
  stepFlappy(delta);
  renderFlappy();

  if (flappyGameOver) {
    finishFlappyGame();
    return;
  }

  flappyAnimationId = window.requestAnimationFrame(updateFlappyFrame);
}

function stepFlappy(delta) {
  flappyVelocity += flappySettings.gravity * delta;
  flappyBirdY += flappyVelocity * delta;
  flappyGroundOffset = (flappyGroundOffset + flappySettings.pipeSpeed * delta) % 34;

  flappyClouds.forEach((cloud) => {
    cloud.x -= cloud.speed * delta;
    if (cloud.x < -cloud.size * 3) {
      cloud.x = flappySettings.width + cloud.size * 2;
      cloud.y = 54 + Math.random() * 92;
    }
  });

  flappyPipes.forEach((pipe) => {
    pipe.x -= flappySettings.pipeSpeed * delta;

    if (!pipe.scored && pipe.x + flappySettings.pipeWidth < flappySettings.birdX - flappySettings.birdRadius) {
      pipe.scored = true;
      flappyScore += 1;
      flappyScoreElement.textContent = String(flappyScore);

      if (flappyScore > flappyBest) {
        flappyBest = flappyScore;
        localStorage.setItem(flappyBestKey, String(flappyBest));
        flappyBestElement.textContent = String(flappyBest);
      }
    }
  });

  if (flappyPipes[0]?.x + flappySettings.pipeWidth < -20) {
    const lastPipe = flappyPipes[flappyPipes.length - 1];
    flappyPipes.shift();
    flappyPipes.push(createFlappyPipe(lastPipe.x + flappySettings.pipeSpacing));
  }

  if (isFlappyColliding()) {
    flappyGameOver = true;
  }
}

function isFlappyColliding() {
  const birdTop = flappyBirdY - flappySettings.birdRadius;
  const birdBottom = flappyBirdY + flappySettings.birdRadius;
  const birdLeft = flappySettings.birdX - flappySettings.birdRadius;
  const birdRight = flappySettings.birdX + flappySettings.birdRadius;
  const ceiling = 0;
  const floor = flappySettings.height - flappySettings.groundHeight;

  if (birdTop <= ceiling || birdBottom >= floor) {
    return true;
  }

  return flappyPipes.some((pipe) => {
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + flappySettings.pipeWidth;
    const gapTop = pipe.topHeight;
    const gapBottom = pipe.topHeight + flappySettings.pipeGap;
    const overlapsX = birdRight > pipeLeft && birdLeft < pipeRight;
    const hitsPipe = birdTop < gapTop || birdBottom > gapBottom;

    return overlapsX && hitsPipe;
  });
}

function finishFlappyGame() {
  stopFlappyLoop();
  flappyRunning = false;
  flappyRestartButton.textContent = "再来一局";
  flappyStatusText.textContent = text.flappyOver;
  settleFlappyGame();
}

async function settleFlappyGame() {
  if (!hasAccount() || flappySettled) {
    return;
  }

  flappySettled = true;
  const seconds = flappyStartedAt ? Math.floor((Date.now() - flappyStartedAt) / 1000) : 0;

  try {
    const data = await apiRequest("/api/games/flappy/results", {
      method: "POST",
      body: JSON.stringify({
        gameId: flappyGameId,
        score: flappyScore,
        bestScore: flappyBest,
        seconds,
      }),
    });

    renderAccount(data.profile);
    await refreshLeaderboard(data.leaderboard);
    flappyStatusText.textContent = `本局 ${flappyScore} 分，获得 ${data.award.points} 积分。`;
  } catch (error) {
    flappyStatusText.textContent = error.message;
    flappySettled = false;
  }
}

function renderFlappy() {
  const context = flappyContext;
  const width = flappySettings.width;
  const height = flappySettings.height;
  const floor = height - flappySettings.groundHeight;

  context.clearRect(0, 0, width, height);
  const sky = context.createLinearGradient(0, 0, 0, floor);
  sky.addColorStop(0, "#a9d8f5");
  sky.addColorStop(1, "#e8f6ee");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  drawFlappyClouds(context);
  drawFlappyPipes(context, floor);
  drawFlappyGround(context, floor, width, height);
  drawFlappyBird(context);
  drawFlappyOverlay(context);
}

function drawFlappyClouds(context) {
  context.fillStyle = "rgba(255, 255, 255, 0.82)";

  flappyClouds.forEach((cloud) => {
    context.beginPath();
    context.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
    context.arc(cloud.x + cloud.size * 0.9, cloud.y + 4, cloud.size * 0.76, 0, Math.PI * 2);
    context.arc(cloud.x - cloud.size * 0.82, cloud.y + 7, cloud.size * 0.62, 0, Math.PI * 2);
    context.fill();
  });
}

function drawFlappyPipes(context, floor) {
  flappyPipes.forEach((pipe) => {
    const gapBottom = pipe.topHeight + flappySettings.pipeGap;
    drawPipe(context, pipe.x, 0, flappySettings.pipeWidth, pipe.topHeight, true);
    drawPipe(context, pipe.x, gapBottom, flappySettings.pipeWidth, floor - gapBottom, false);
  });
}

function drawPipe(context, x, y, width, height, isTop) {
  if (height <= 0) {
    return;
  }

  const capHeight = 18;
  const pipeGradient = context.createLinearGradient(x, 0, x + width, 0);
  pipeGradient.addColorStop(0, "#0f6f5d");
  pipeGradient.addColorStop(0.45, "#1fa783");
  pipeGradient.addColorStop(1, "#0b594e");
  context.fillStyle = pipeGradient;
  context.fillRect(x, y, width, height);
  context.fillStyle = "rgba(255, 255, 255, 0.18)";
  context.fillRect(x + 10, y + 8, 8, Math.max(0, height - 16));
  context.fillStyle = "#0b594e";

  if (isTop) {
    context.fillRect(x - 6, y + height - capHeight, width + 12, capHeight);
  } else {
    context.fillRect(x - 6, y, width + 12, capHeight);
  }
}

function drawFlappyGround(context, floor, width, height) {
  context.fillStyle = "#dfb269";
  context.fillRect(0, floor, width, height - floor);
  context.fillStyle = "#187c68";
  context.fillRect(0, floor, width, 8);
  context.fillStyle = "rgba(255, 255, 255, 0.22)";

  for (let x = -34 - flappyGroundOffset; x < width + 34; x += 34) {
    context.fillRect(x, floor + 22, 18, 6);
  }
}

function drawFlappyBird(context) {
  const x = flappySettings.birdX;
  const y = flappyBirdY;
  const tilt = Math.max(-0.55, Math.min(0.72, flappyVelocity / 12));

  context.save();
  context.translate(x, y);
  context.rotate(tilt);
  context.fillStyle = "#f4c542";
  context.beginPath();
  context.ellipse(0, 0, 18, 15, 0, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#d68631";
  context.beginPath();
  context.ellipse(-8, 3, 11, 7, -0.45, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(8, -5, 5, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#17212b";
  context.beginPath();
  context.arc(10, -5, 2, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#ef7d3b";
  context.beginPath();
  context.moveTo(17, -1);
  context.lineTo(29, 4);
  context.lineTo(17, 9);
  context.closePath();
  context.fill();
  context.restore();
}

function drawFlappyOverlay(context) {
  context.fillStyle = "rgba(24, 33, 42, 0.78)";
  context.font = "900 42px Inter, Arial, sans-serif";
  context.textAlign = "center";
  context.fillText(String(flappyScore), flappySettings.width / 2, 72);

  if (!flappyRunning && !flappyGameOver) {
    context.font = "800 18px Inter, Arial, sans-serif";
    context.fillText("点击开始", flappySettings.width / 2, flappySettings.height * 0.46);
  }

  if (flappyGameOver) {
    context.fillStyle = "rgba(24, 33, 42, 0.58)";
    context.fillRect(58, 202, flappySettings.width - 116, 106);
    context.fillStyle = "#ffffff";
    context.font = "900 26px Inter, Arial, sans-serif";
    context.fillText("游戏结束", flappySettings.width / 2, 244);
    context.font = "800 16px Inter, Arial, sans-serif";
    context.fillText(`本局 ${flappyScore} 分`, flappySettings.width / 2, 276);
  }
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

function applyMineModelRotation() {
  mineModelSpace.style.setProperty("--mine-model-x", `${mineModelRotationX}deg`);
  mineModelSpace.style.setProperty("--mine-model-y", `${mineModelRotationY}deg`);
}

function scheduleMineModelRotation() {
  if (mineModelRotationFrameId) {
    return;
  }

  mineModelRotationFrameId = window.requestAnimationFrame(() => {
    mineModelRotationFrameId = null;
    applyMineModelRotation();
  });
}

function renderMineExpandButton() {
  if (mineLightMode) {
    const config = getMineDifficulty();
    mineExpandButton.textContent = `下一层 ${mineLayerView + 1}/${config.layers}`;
    mineExpandButton.setAttribute("aria-pressed", "false");
    mineModelStage.classList.remove("is-expanded");
    return;
  }

  mineExpandButton.textContent = mineModelExpanded ? "合拢模型" : "分层展开";
  mineExpandButton.setAttribute("aria-pressed", String(mineModelExpanded));
  mineModelStage.classList.toggle("is-expanded", mineModelExpanded);
}

function getMineCubeSize(config) {
  const stageWidth =
    mineModelStage.getBoundingClientRect().width || Math.min(window.innerWidth - 48, 620);
  const gridWidth = Math.max(config.rows, config.cols, config.layers);
  const minSize = mineLightMode ? 18 : 24;
  const maxSize = mineLightMode ? 28 : 36;
  const padding = mineLightMode ? 130 : 80;

  return Math.max(minSize, Math.min(maxSize, Math.floor((stageWidth - padding) / gridWidth)));
}

function getMineCubePosition(layer, row, column, config, cubeSize) {
  const gap = Math.max(2, Math.round(cubeSize * 0.08));
  const step = cubeSize + gap;
  const layerMiddle = (config.layers - 1) / 2;
  const rowMiddle = (config.rows - 1) / 2;
  const columnMiddle = (config.cols - 1) / 2;
  const layerOffset = layer - layerMiddle;
  const layerGap = mineModelExpanded ? cubeSize * (mineLightMode ? 1.15 : 1.45) : 0;

  return {
    x: (column - columnMiddle) * step,
    y: (layerMiddle - layer) * (step + layerGap),
    z: (row - rowMiddle) * step,
  };
}

function getMineCellMark(cell, revealAllMines) {
  if (cell.open && cell.mine) {
    return { type: "mine", text: "" };
  }

  if (cell.open && cell.adjacent > 0) {
    return { type: "number", text: String(cell.adjacent) };
  }

  if (cell.flagged) {
    return { type: "flag", text: "" };
  }

  if (revealAllMines && cell.mine) {
    return { type: "mine", text: "" };
  }

  return { type: "none", text: "" };
}

function createMineCube(layer, row, column, cell, config, cubeSize) {
  const cube = document.createElement("button");
  const faceNames = mineLightMode ? ["front", "right", "top"] : ["front", "back", "right", "left", "top", "bottom"];

  cube.type = "button";
  cube.className = "mine-cube";

  faceNames.forEach((faceName) => {
    const face = document.createElement("span");
    face.className = `cube-face cube-${faceName}`;
    cube.appendChild(face);
  });

  updateMineCube(cube, layer, row, column, cell, config, cubeSize);

  return cube;
}

function updateMineCube(cube, layer, row, column, cell, config, cubeSize) {
  const revealAllMines = mineGameOver && !mineGameWon;
  const mark = getMineCellMark(cell, revealAllMines);
  const position = getMineCubePosition(layer, row, column, config, cubeSize);
  let ariaLabel = `第 ${layer + 1} 层 第 ${row + 1} 行 第 ${column + 1} 列`;

  cube.className = "mine-cube";
  cube.dataset.layer = String(layer);
  cube.dataset.row = String(row);
  cube.dataset.column = String(column);
  cube.dataset.key = mineCellKey(layer, row, column);
  cube.style.setProperty("--cube-size", `${cubeSize}px`);
  cube.style.setProperty("--cube-half", `${cubeSize / 2}px`);
  cube.style.setProperty("--cube-x", `${position.x}px`);
  cube.style.setProperty("--cube-y", `${position.y}px`);
  cube.style.setProperty("--cube-z", `${position.z}px`);
  cube.style.setProperty("--cube-hue", String(176 + layer * 17));
  cube.style.setProperty("--cube-mark", `"${mark.text}"`);
  cube.classList.toggle("has-mark", mark.type !== "none");
  cube.classList.toggle("has-number", mark.type === "number");
  cube.classList.toggle("has-flag", mark.type === "flag");
  cube.classList.toggle("has-mine-mark", mark.type === "mine");

  if (cell.open) {
    cube.classList.add("is-open");

    if (cell.mine) {
      cube.classList.add("is-mine-revealed");
      ariaLabel = `${ariaLabel}，雷`;
    } else if (cell.adjacent > 0) {
      cube.classList.add(`is-number-${Math.min(cell.adjacent, 8)}`);
      ariaLabel = `${ariaLabel}，数字 ${cell.adjacent}`;
    } else {
      cube.classList.add("is-zero");
      ariaLabel = `${ariaLabel}，空`;
    }
  } else if (cell.flagged) {
    cube.classList.add("is-flagged");
    ariaLabel = `${ariaLabel}，已插旗`;
  }

  if (revealAllMines && cell.mine && !cell.open) {
    cube.classList.add("is-mine");
    ariaLabel = `${ariaLabel}，未翻开的雷`;
  }

  cube.setAttribute("aria-label", ariaLabel);
}

function renderMinesweeperLayerBoard(config) {
  mineLayerView = Math.max(0, Math.min(config.layers - 1, mineLayerView));
  const tabs = mineModelStage.querySelector("#mine-layer-tabs");
  const board = mineModelStage.querySelector("#mine-layer-board");

  if (!tabs || !board) {
    setupMinesweeperMarkup();
    renderMinesweeperLayerBoard(config);
    return;
  }

  tabs.innerHTML = "";
  board.innerHTML = "";
  board.style.setProperty("--mine-layer-cols", String(config.cols));

  for (let layer = 0; layer < config.layers; layer += 1) {
    const tab = document.createElement("button");
    const layerCells = mineBoard[layer]?.flat().filter((cell) => cell.active) || [];
    const layerFlags = layerCells.filter((cell) => cell.flagged).length;
    const layerOpen = layerCells.filter((cell) => cell.open).length;

    tab.type = "button";
    tab.className = "mine-layer-tab";
    tab.classList.toggle("is-active", layer === mineLayerView);
    tab.textContent = `${layer + 1}层 ${layerOpen}/${layerCells.length}${layerFlags ? ` 旗${layerFlags}` : ""}`;
    tab.addEventListener("click", () => {
      mineLayerView = layer;
      renderMinesweeperBoard();
    });
    tabs.appendChild(tab);
  }

  for (let row = 0; row < config.rows; row += 1) {
    for (let column = 0; column < config.cols; column += 1) {
      const cell = getMineCell(mineLayerView, row, column);
      const button = document.createElement("button");

      button.type = "button";
      button.className = "mine-layer-cell";
      button.dataset.layer = String(mineLayerView);
      button.dataset.row = String(row);
      button.dataset.column = String(column);
      updateMineLayerCell(button, mineLayerView, row, column, cell);
      board.appendChild(button);
    }
  }
}

function updateMineLayerCell(button, layer, row, column, cell) {
  const revealAllMines = mineGameOver && !mineGameWon;
  const mark = cell ? getMineCellMark(cell, revealAllMines) : { type: "none", text: "" };
  let ariaLabel = `第 ${layer + 1} 层 第 ${row + 1} 行 第 ${column + 1} 列`;

  button.className = "mine-layer-cell";
  button.textContent = mark.type === "number" ? mark.text : "";
  button.disabled = !cell?.active;
  button.classList.toggle("is-inactive", !cell?.active);
  button.classList.toggle("is-open", Boolean(cell?.open));
  button.classList.toggle("is-zero", Boolean(cell?.open && cell.adjacent === 0 && !cell.mine));
  button.classList.toggle("has-number", mark.type === "number");
  button.classList.toggle("has-flag", mark.type === "flag");
  button.classList.toggle("has-mine-mark", mark.type === "mine");

  if (mark.type === "number") {
    button.classList.add(`is-number-${Math.min(Number(mark.text), 8)}`);
    ariaLabel = `${ariaLabel}，数字 ${mark.text}`;
  } else if (mark.type === "flag") {
    ariaLabel = `${ariaLabel}，已插旗`;
  } else if (mark.type === "mine") {
    ariaLabel = `${ariaLabel}，雷`;
  } else if (cell?.open) {
    ariaLabel = `${ariaLabel}，空`;
  }

  button.setAttribute("aria-label", ariaLabel);
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
  mineLayerView = 0;
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
  const config = getMineDifficulty();
  const renderMode = mineLightMode ? "layers" : "full";

  if (mineModelSpace.dataset.renderMode !== renderMode) {
    setupMinesweeperMarkup();
  }

  mineModelStage.classList.toggle("is-light-mode", mineLightMode);
  mineModelStage.classList.toggle("is-layer-mode", mineLightMode);

  if (mineLightMode) {
    renderMinesweeperLayerBoard(config);
    renderMineExpandButton();
    renderMinesweeperStats();
    mineStatusText.textContent = mineGameOver
      ? mineGameWon
        ? text.minesWin
        : text.minesLose
      : getMineReadyText();
    return;
  }

  const fragment = document.createDocumentFragment();
  const cubeSize = getMineCubeSize(config);

  if (mineModelSpace.dataset.renderMode !== renderMode) {
    mineModelSpace.innerHTML = "";
    mineModelSpace.dataset.renderMode = renderMode;
  }

  const existingCubes = new Map(
    Array.from(mineModelSpace.querySelectorAll(".mine-cube")).map((cube) => [
      cube.dataset.key,
      cube,
    ]),
  );
  const activeKeys = new Set();

  mineModelSpace.style.setProperty("--cube-size", `${cubeSize}px`);
  mineModelSpace.style.setProperty("--cube-half", `${cubeSize / 2}px`);
  mineModelSpace.classList.toggle("is-expanded", mineModelExpanded);

  for (let layer = 0; layer < config.layers; layer += 1) {
    for (let row = 0; row < config.rows; row += 1) {
      for (let column = 0; column < config.cols; column += 1) {
        const cell = getMineCell(layer, row, column);

        if (!cell?.active) {
          continue;
        }

        const key = mineCellKey(layer, row, column);
        const cube = existingCubes.get(key) || createMineCube(layer, row, column, cell, config, cubeSize);

        activeKeys.add(key);
        updateMineCube(cube, layer, row, column, cell, config, cubeSize);
        fragment.appendChild(cube);
      }
    }
  }

  existingCubes.forEach((cube, key) => {
    if (!activeKeys.has(key)) {
      cube.remove();
    }
  });

  mineModelSpace.appendChild(fragment);
  applyMineModelRotation();
  renderMineExpandButton();

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

  mineModelExpanded = false;
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

function getMineActionButton(target) {
  return target.closest(".mine-cube, .mine-layer-cell");
}

function getMineButtonPosition(button) {
  return {
    layer: Number(button.dataset.layer),
    row: Number(button.dataset.row),
    column: Number(button.dataset.column),
  };
}

function handleMineClick(event) {
  if (currentGame !== GAME_MINESWEEPER) {
    return;
  }

  if (Date.now() < mineIgnoreClickUntil) {
    return;
  }

  if (mineModelDragDistance > 6) {
    return;
  }

  const button = getMineActionButton(event.target);

  if (!button) {
    return;
  }

  const { layer, row, column } = getMineButtonPosition(button);
  openMineCell(layer, row, column);
}

function handleMineContextMenu(event) {
  if (currentGame !== GAME_MINESWEEPER) {
    return;
  }

  const button = getMineActionButton(event.target);

  if (!button) {
    return;
  }

  event.preventDefault();
  const { layer, row, column } = getMineButtonPosition(button);
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

  const touch = event.changedTouches[0];
  const button = getMineActionButton(event.target);

  if (!mineLightMode) {
    startMineModelDrag(touch.clientX, touch.clientY);
  } else {
    mineModelDragDistance = 0;
  }

  if (!button) {
    clearMineTouchHold();
    return;
  }

  clearMineTouchHold();
  mineTouchTarget = button;
  mineTouchLongPressed = false;
  mineTouchTimerId = window.setTimeout(() => {
    mineTouchTimerId = null;

    if (mineModelDragDistance > 6) {
      return;
    }

    mineTouchLongPressed = true;
    const { layer, row, column } = getMineButtonPosition(button);
    toggleMineFlag(layer, row, column);
    mineIgnoreClickUntil = Date.now() + 400;
  }, 420);
}

function handleMineTouchEnd(event) {
  if (currentGame !== GAME_MINESWEEPER) {
    return;
  }

  const wasDragged = !mineLightMode && mineModelDragDistance > 6;
  const button = getMineActionButton(event.target) || mineTouchTarget;

  if (!mineLightMode) {
    endMineModelDrag();
  }

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

  if (!wasDragged && Date.now() >= mineIgnoreClickUntil) {
    const { layer, row, column } = getMineButtonPosition(button);
    openMineCell(layer, row, column);
  }

  mineIgnoreClickUntil = Date.now() + 250;
  mineTouchTarget = null;
}

function handleMineTouchMove(event) {
  if (mineLightMode) {
    return;
  }

  if (mineModelDragging) {
    event.preventDefault();
  }

  const touch = event.changedTouches[0];
  moveMineModelDrag(touch.clientX, touch.clientY);

  if (mineModelDragDistance > 6) {
    clearMineTouchHold();
  }
}

function handleMineTouchCancel() {
  clearMineTouchHold();
  endMineModelDrag();
}

function startMineModelDrag(clientX, clientY) {
  mineModelDragging = true;
  mineModelDragX = clientX;
  mineModelDragY = clientY;
  mineModelDragDistance = 0;
  mineModelStage.classList.add("is-dragging");
}

function moveMineModelDrag(clientX, clientY) {
  if (!mineModelDragging) {
    return;
  }

  const deltaX = clientX - mineModelDragX;
  const deltaY = clientY - mineModelDragY;
  mineModelDragX = clientX;
  mineModelDragY = clientY;
  mineModelDragDistance += Math.abs(deltaX) + Math.abs(deltaY);
  mineModelRotationY += deltaX * 0.55;
  mineModelRotationX = Math.max(-74, Math.min(28, mineModelRotationX - deltaY * 0.45));
  scheduleMineModelRotation();
}

function endMineModelDrag() {
  if (mineModelDragDistance > 6) {
    mineIgnoreClickUntil = Date.now() + 180;
  }

  mineModelDragging = false;
  mineModelStage.classList.remove("is-dragging");
}

function handleMineModelPointerDown(event) {
  if (mineLightMode) {
    return;
  }

  if (event.button !== 0) {
    return;
  }

  event.preventDefault();
  startMineModelDrag(event.clientX, event.clientY);
}

function handleMineModelPointerMove(event) {
  moveMineModelDrag(event.clientX, event.clientY);
}

function toggleMineModelExpanded() {
  if (mineLightMode) {
    const config = getMineDifficulty();
    mineLayerView = (mineLayerView + 1) % config.layers;
    renderMinesweeperBoard();
    return;
  }

  mineModelExpanded = !mineModelExpanded;
  renderMinesweeperBoard();
}

function handleMineLightModeChange(event) {
  mineLightMode = event.matches;

  if (mineBoard.length > 0) {
    setupMinesweeperMarkup();
    renderMinesweeperBoard();
  }
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

  duelState = room.duel || duelState;
  duelSide = getDuelSide();
  renderPlayers(room);
  renderDuel();
  updateDuelStatus();
});

socket.on("duel:update", (state) => {
  duelState = state;
  duelSide = getDuelSide();
  renderDuel();
  updateDuelStatus();
});

socket.on("duel:ended", async (payload = {}) => {
  duelState = payload.state || duelState;
  duelSide = getDuelSide();
  renderDuel();
  updateDuelStatus();

  try {
    const data = await apiRequest("/api/me");
    renderAccount(data.profile);
    await refreshLeaderboard();
  } catch {
    await refreshLeaderboard();
  }
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
mineExpandButton.addEventListener("click", toggleMineModelExpanded);
mineDifficultySelect.addEventListener("change", () => {
  setMineDifficulty(mineDifficultySelect.value);
});
flappyRestartButton.addEventListener("click", () => {
  if (flappyRunning) {
    resetFlappyGame();
    return;
  }

  startFlappyGame();
});
duelStartButton.addEventListener("click", requestDuelStart);
messageButton.addEventListener("click", hideMessageAndContinue);
gameCards.forEach((card) => {
  card.addEventListener("click", () => setActiveGame(card.dataset.game));
});
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);
boardElement.addEventListener("touchstart", handleTouchStart, { passive: true });
boardElement.addEventListener("touchend", handleTouchEnd);
flappyCanvas.addEventListener("click", flap);
flappyCanvas.addEventListener("touchstart", (event) => {
  event.preventDefault();
  flap();
}, { passive: false });
duelCanvas.addEventListener("pointerdown", (event) => {
  if (currentGame !== GAME_DUEL) {
    return;
  }

  duelCanvas.setPointerCapture(event.pointerId);
  setDuelTouchInput(event.clientY);
});
duelCanvas.addEventListener("pointermove", (event) => {
  if (currentGame !== GAME_DUEL || event.buttons === 0) {
    return;
  }

  setDuelTouchInput(event.clientY);
});
duelCanvas.addEventListener("pointerup", () => setDuelInput(0));
duelCanvas.addEventListener("pointercancel", () => setDuelInput(0));
duelMoveButtons.forEach((button) => {
  const direction = button.dataset.duelMove === "up" ? -1 : 1;

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    setDuelInput(direction);
  });
  button.addEventListener("pointerup", () => setDuelInput(0));
  button.addEventListener("pointerleave", () => setDuelInput(0));
  button.addEventListener("pointercancel", () => setDuelInput(0));
});
roomCodeInput.addEventListener("input", () => {
  roomCodeInput.value = roomCodeInput.value.toUpperCase();
});
mineModelStage.addEventListener("click", handleMineClick);
mineModelStage.addEventListener("contextmenu", handleMineContextMenu);
mineModelStage.addEventListener("mousedown", handleMineModelPointerDown);
document.addEventListener("mousemove", handleMineModelPointerMove);
document.addEventListener("mouseup", endMineModelDrag);
mineModelStage.addEventListener("touchstart", handleMineTouchStart, { passive: true });
mineModelStage.addEventListener("touchend", handleMineTouchEnd);
mineModelStage.addEventListener("touchmove", handleMineTouchMove, { passive: false });
mineModelStage.addEventListener("touchcancel", handleMineTouchCancel);
if (typeof mineLightModeQuery.addEventListener === "function") {
  mineLightModeQuery.addEventListener("change", handleMineLightModeChange);
} else {
  mineLightModeQuery.addListener(handleMineLightModeChange);
}
window.addEventListener("resize", () => {
  if (mineBoard.length > 0) {
    renderMinesweeperBoard();
  }
});

setupBoardMarkup();
mineDifficultySelect.value = mineDifficulty;
setupMinesweeperMarkup();
board = createEmptyBoard();
mineBoard = createMineBoard();
initializeMinesweeperBoard();
resetFlappyGame();
renderDuel();
start2048Game({ notify: false, settlePrevious: false });
loadSession();
