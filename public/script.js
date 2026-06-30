const boardElement = document.querySelector("#board");
const scoreElement = document.querySelector("#score");
const bestScoreElement = document.querySelector("#best-score");
const restartButton = document.querySelector("#restart-button");
const message = document.querySelector("#message");
const messageTitle = document.querySelector("#message-title");
const messageCopy = document.querySelector("#message-copy");
const messageButton = document.querySelector("#message-button");
const messageSecondaryButton = document.querySelector("#message-secondary-button");
const statusText = document.querySelector("#status-text");
const roomCodeInput = document.querySelector("#room-code");
const createRoomButton = document.querySelector("#create-room-button");
const joinRoomButton = document.querySelector("#join-room-button");
const activeRoom = document.querySelector("#active-room");
const activeRoomCode = document.querySelector("#active-room-code");
const copyRoomButton = document.querySelector("#copy-room-button");
const roomGameLabel = document.querySelector("#room-game-label");
const appShell = document.querySelector("#app-shell");
const loginView = document.querySelector("#login-view");
const appView = document.querySelector("#app-view");
const playersList = document.querySelector("#players-list");
const playerCount = document.querySelector("#player-count");
const globalList = document.querySelector("#global-list");
const globalCount = document.querySelector("#global-count");
const announcementPanel = document.querySelector("#announcement-panel");
const announcementToggle = document.querySelector("#announcement-toggle");
const announcementsList = document.querySelector("#announcements-list");
const leaderboardPanel = document.querySelector("#leaderboard-panel");
const leaderboardToggle = document.querySelector("#leaderboard-toggle");
const changelogPanel = document.querySelector("#changelog-panel");
const changelogToggle = document.querySelector("#changelog-toggle");
const changelogList = document.querySelector("#changelog-list");
const panelCloseButtons = Array.from(document.querySelectorAll("[data-panel-close]"));
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
const profileDodgeBest = document.querySelector("#profile-dodge-best");
const profileUntangleWins = document.querySelector("#profile-untangle-wins");
const profileFruitBest = document.querySelector("#profile-fruit-best");
const gameCards = Array.from(document.querySelectorAll(".game-card[data-game]"));
const roomPanel = document.querySelector("#room-panel");
const game2048Panel = document.querySelector("#game-2048");
const gameMinesweeperPanel = document.querySelector("#game-minesweeper3d");
const gameFlappyPanel = document.querySelector("#game-flappy");
const gameFruitPanel = document.querySelector("#game-fruitmerge");
const gameDodgePanel = document.querySelector("#game-dodge");
const gameUntanglePanel = document.querySelector("#game-untangle");
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
const fruitCanvas = document.querySelector("#fruit-canvas");
const fruitContext = fruitCanvas.getContext("2d");
const fruitStatusText = document.querySelector("#fruit-status-text");
const fruitRestartButton = document.querySelector("#fruit-restart-button");
const fruitScoreElement = document.querySelector("#fruit-score");
const fruitLargestElement = document.querySelector("#fruit-largest");
const fruitBestElement = document.querySelector("#fruit-best");
const dodgeCanvas = document.querySelector("#dodge-canvas");
const dodgeContext = dodgeCanvas.getContext("2d");
const dodgeStatusText = document.querySelector("#dodge-status-text");
const dodgeRestartButton = document.querySelector("#dodge-restart-button");
const dodgeDifficultySelect = document.querySelector("#dodge-difficulty");
const dodgeTimeElement = document.querySelector("#dodge-time");
const dodgeGrazesElement = document.querySelector("#dodge-grazes");
const dodgeBestElement = document.querySelector("#dodge-best");
const dodgeMoveButtons = Array.from(document.querySelectorAll("[data-dodge-move]"));
const untangleCanvas = document.querySelector("#untangle-canvas");
const untangleContext = untangleCanvas.getContext("2d");
const untangleStatusText = document.querySelector("#untangle-status-text");
const untangleRestartButton = document.querySelector("#untangle-restart-button");
const untangleUndoButton = document.querySelector("#untangle-undo-button");
const untangleDifficultySelect = document.querySelector("#untangle-difficulty");
const untangleCrossingsElement = document.querySelector("#untangle-crossings");
const untangleMovesElement = document.querySelector("#untangle-moves");
const untangleBestElement = document.querySelector("#untangle-best");
const untangleUndosElement = document.querySelector("#untangle-undos");
const duelCanvas = document.querySelector("#duel-canvas");
const duelContext = duelCanvas.getContext("2d");
const duelScoreElement = document.querySelector("#duel-score");
const duelTimeElement = document.querySelector("#duel-time");
const duelStatusText = document.querySelector("#duel-status-text");
const duelStartButton = document.querySelector("#duel-start-button");
const duelServeButton = document.querySelector("#duel-serve-button");
const duelMoveButtons = Array.from(document.querySelectorAll("[data-duel-move]"));

const socket = io();
const GAME_2048 = "2048";
const GAME_MINESWEEPER = "minesweeper3d";
const GAME_FLAPPY = "flappy";
const GAME_FRUIT = "fruitmerge";
const GAME_DODGE = "dodge";
const GAME_UNTANGLE = "untangle";
const GAME_DUEL = "paddleduel";
const size = 4;
const totalCells = size * size;
const bestKey = "web2-multiplayer-2048-best-score";
const tokenKey = "class-arcade-token";
const nameKey = "class-arcade-name";
const currentGameKey = "class-arcade-current-game";
const mineDifficultyKey = "class-arcade-minesweeper-difficulty";
const flappyBestKey = "class-arcade-flappy-best";
const fruitBestKey = "class-arcade-fruit-best";
const dodgeBestKey = "class-arcade-dodge-best";
const dodgeDifficultyKey = "class-arcade-dodge-difficulty";
const untangleDifficultyKey = "class-arcade-untangle-difficulty";
const untangleBestKey = "class-arcade-untangle-best";
const mineLightModeQuery = window.matchMedia("(hover: none), (max-width: 720px)");
const untangleLayoutQuery = window.matchMedia("(hover: none), (max-width: 720px)");
const maxInfoEntries = 10;
const announcements = [];
const changelogEntries = [
  {
    title: "合成水果尺寸微调",
    body: "水果整体缩小一档，保留压力感但降低过度拥挤，让合成水果的操作空间更舒服。",
  },
  {
    title: "平台积分规则优化",
    body: "下调合成水果的刷分收益，提升扫雷、绳结、灵敏、飞鸟和弹球的操作奖励，并加入软上限避免单局积分过度膨胀。",
  },
  {
    title: "合成水果再次加难",
    body: "葡萄放大到原柠檬尺寸，后续水果按容器可承受比例整体放大，警戒线大幅下移，并强化危险倒计时提示。",
  },
  {
    title: "合成水果难度上调",
    body: "水果整体变大，警戒线下移并缩短倒计时，同时降低高级水果出生概率，让合成西瓜更有压力。",
  },
  {
    title: "修复绳结手机端横向滑动",
    body: "手机打开绳结解谜时页面会锁住水平方向，状态栏和竖版画布不再把网页撑出屏幕。",
  },
  {
    title: "合成水果建模升级",
    body: "水果从字母圆球改为专属图案，加入葡萄串、樱桃果柄、橘子瓣、猕猴桃籽、菠萝网纹和西瓜条纹等细节。",
  },
  {
    title: "修复合成水果碰撞不合成问题",
    body: "相同水果现在正常接触就会合成，并加入短暂出生保护，减少刚释放时的误合成。",
  },
  {
    title: "新增合成水果小游戏",
    body: "加入轻量版合成水果玩法，支持手机竖屏、圆形碰撞合成、警戒线失败和账号积分结算。",
  },
  {
    title: "绳结解谜新增撤回机会",
    body: "每局按难度提供 3、5、7、9 次撤回机会，拖错节点可以回退上一步并返还步数。",
  },
  {
    title: "绳结解谜手机端改为竖屏大画布",
    body: "手机浏览器会使用竖向题面和更高的操作区域，节点坐标也会同步切换到竖版布局，方便拖动。",
  },
  {
    title: "绳结解谜步数改为动态计算",
    body: "同一难度下会根据本局初始交叉数、节点数和绳索密度自动调整步数，不再用固定步数卡死。",
  },
  {
    title: "绳结解谜规模提升",
    body: "四个难度分别调整为 10、20、30、50 个节点，并同步增加绳索数量与复杂度。",
  },
  {
    title: "绳结解谜开局更随机",
    body: "节点不再主要分布在外围，而是会在画布内部随机生成并挑选更复杂的交叉局面。",
  },
  {
    title: "新增绳结解谜小游戏",
    body: "加入拖动节点解开绳索交叉的解谜玩法，支持难度选择、有限步数和账号积分结算。",
  },
];
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
const fruitSettings = {
  width: 420,
  height: 620,
  wallPadding: 18,
  floorY: 596,
  topLineY: 220,
  spawnY: 78,
  gravity: 0.34,
  damping: 0.992,
  friction: 0.985,
  restitution: 0.16,
  collisionIterations: 5,
  maxFruits: 52,
  dropCooldownMs: 460,
  warningMs: 1050,
};
const fruitTypes = [
  { name: "葡萄", mark: "G", color: "#8d5bd1", radius: 29, points: 2 },
  { name: "樱桃", mark: "C", color: "#e94c5f", radius: 34, points: 5 },
  { name: "橘子", mark: "O", color: "#f39b30", radius: 41, points: 12 },
  { name: "柠檬", mark: "L", color: "#f4cf45", radius: 49, points: 24 },
  { name: "猕猴桃", mark: "K", color: "#8abf45", radius: 58, points: 45 },
  { name: "苹果", mark: "A", color: "#df4b43", radius: 69, points: 80 },
  { name: "梨", mark: "P", color: "#b7d956", radius: 82, points: 140 },
  { name: "桃子", mark: "T", color: "#f08c77", radius: 97, points: 230 },
  { name: "菠萝", mark: "B", color: "#d4a938", radius: 115, points: 360 },
  { name: "哈密瓜", mark: "H", color: "#85c96a", radius: 136, points: 560 },
  { name: "西瓜", mark: "W", color: "#3fa05a", radius: 160, points: 900 },
];
const dodgeSettings = {
  width: 640,
  height: 480,
  planeRadius: 12,
  bulletRadius: 6,
  grazeRadius: 26,
};
const dodgeDifficulties = {
  easy: {
    label: "入门",
    planeSpeed: 4.85,
    baseSpawnMs: 560,
    minSpawnMs: 170,
    speedBase: 2.35,
    speedRandom: 1.25,
    speedGrowth: 0.035,
    pressureSeconds: 58,
    doubleChance: 0.16,
    earlyBurstAfter: 22,
  },
  normal: {
    label: "标准",
    planeSpeed: 4.75,
    baseSpawnMs: 460,
    minSpawnMs: 120,
    speedBase: 2.8,
    speedRandom: 1.55,
    speedGrowth: 0.045,
    pressureSeconds: 50,
    doubleChance: 0.26,
    earlyBurstAfter: 14,
  },
  hard: {
    label: "困难",
    planeSpeed: 4.65,
    baseSpawnMs: 360,
    minSpawnMs: 90,
    speedBase: 3.2,
    speedRandom: 1.8,
    speedGrowth: 0.055,
    pressureSeconds: 42,
    doubleChance: 0.38,
    earlyBurstAfter: 8,
  },
  expert: {
    label: "专家",
    planeSpeed: 4.55,
    baseSpawnMs: 270,
    minSpawnMs: 68,
    speedBase: 3.65,
    speedRandom: 2.05,
    speedGrowth: 0.068,
    pressureSeconds: 34,
    doubleChance: 0.5,
    earlyBurstAfter: 4,
  },
};
const untangleLayouts = {
  desktop: {
    width: 720,
    height: 520,
    margin: 58,
  },
  mobile: {
    width: 520,
    height: 820,
    margin: 42,
  },
};
const untangleSettings = {
  ...untangleLayouts.desktop,
  nodeRadius: 18,
};
const untangleDifficulties = {
  easy: {
    label: "入门",
    nodes: 10,
    targetEdges: 17,
    baseMoves: 14,
    minMoves: 12,
    maxMoves: 22,
    minCrossings: 12,
    undoLimit: 3,
  },
  normal: {
    label: "标准",
    nodes: 20,
    targetEdges: 37,
    baseMoves: 28,
    minMoves: 24,
    maxMoves: 46,
    minCrossings: 45,
    undoLimit: 5,
  },
  hard: {
    label: "困难",
    nodes: 30,
    targetEdges: 57,
    baseMoves: 42,
    minMoves: 36,
    maxMoves: 70,
    minCrossings: 95,
    undoLimit: 7,
  },
  expert: {
    label: "专家",
    nodes: 50,
    targetEdges: 97,
    baseMoves: 64,
    minMoves: 58,
    maxMoves: 112,
    minCrossings: 230,
    undoLimit: 9,
  },
};
const text = {
  ready: "已经进入房间，开始挑战吧。本局结束或重新开始时会结算平台积分。",
  waiting: "滑动方块合成 2048，本局结束或重开时会结算积分。",
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
  fruitReady: "移动落点，点击或松手释放水果，相同水果碰撞会合成更大的水果。",
  fruitPlaying: "控制落点，别让水果堆过警戒线太久。",
  fruitOver: "水果堆过警戒线，本局已结算。",
  dodgeReady: "点击画面或按空格开始，移动飞机躲避随机子弹。",
  dodgePlaying: "保持移动，子弹会越来越密，贴近躲开可以擦弹加分。",
  dodgeOver: "被击中了，本局时间已结算。",
  untangleReady: "拖动节点，让任意两条绳索不再交叉。",
  untangleWin: "全部绳索已解开，积分已结算。",
  untangleLose: "步数用完了，重新观察一下绳子的结构再试。",
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
let mineModelScale = 1;
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
let fruitGameId = createGameId();
let fruitScore = 0;
let fruitBest = Number(localStorage.getItem(fruitBestKey)) || 0;
let fruitLargestLevel = 0;
let fruitNextLevel = 0;
let fruitDropX = fruitSettings.width / 2;
let fruitBodies = [];
let fruitRunning = false;
let fruitGameOver = false;
let fruitStartedAt = 0;
let fruitSettled = false;
let fruitAnimationId = null;
let fruitLastFrameTime = 0;
let fruitLastDropAt = 0;
let fruitWarningStartedAt = 0;
let fruitPointerActive = false;
const fruitSpriteCache = new Map();
let dodgeGameId = createGameId();
let dodgePlane = { x: dodgeSettings.width / 2, y: dodgeSettings.height / 2 };
let dodgeTarget = { x: dodgeSettings.width / 2, y: dodgeSettings.height / 2 };
let dodgeBullets = [];
let dodgeSparks = [];
let dodgeKeys = new Set();
let dodgeRunning = false;
let dodgeGameOver = false;
let dodgeStartedAt = 0;
let dodgeElapsed = 0;
let dodgeBest = Number(localStorage.getItem(dodgeBestKey)) || 0;
let dodgeDifficulty = localStorage.getItem(dodgeDifficultyKey) || "normal";
let dodgeGrazes = 0;
let dodgeAnimationId = null;
let dodgeLastFrameTime = 0;
let dodgeNextSpawnIn = 0;
let dodgeSettled = false;
let untangleGameId = createGameId();
let untangleDifficulty = localStorage.getItem(untangleDifficultyKey) || "normal";
let untangleBest = Number(localStorage.getItem(untangleBestKey)) || 0;
let untangleNodes = [];
let untangleEdges = [];
let untangleCrossings = 0;
let untangleInitialCrossings = 0;
let untangleMovesUsed = 0;
let untangleMovesLimit = 0;
let untangleUndoLimit = 0;
let untangleUndosLeft = 0;
let untangleHistory = [];
let untangleDragSnapshot = null;
let untangleStartedAt = 0;
let untangleGameOver = false;
let untangleWon = false;
let untangleSettled = false;
let untangleDragNode = null;
let untangleDragPointerId = null;
let untangleDragStartX = 0;
let untangleDragStartY = 0;
let untangleDidMove = false;
let duelState = null;
let duelSide = "";
let duelInputDirection = 0;
let duelRenderFrameId = null;

if (!mineDifficulties[mineDifficulty]) {
  mineDifficulty = "normal";
}

if (!dodgeDifficulties[dodgeDifficulty]) {
  dodgeDifficulty = "normal";
}

if (!untangleDifficulties[untangleDifficulty]) {
  untangleDifficulty = "normal";
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

function getDodgeDifficulty() {
  return dodgeDifficulties[dodgeDifficulty] || dodgeDifficulties.normal;
}

function setDodgeDifficulty(value) {
  if (!dodgeDifficulties[value]) {
    return;
  }

  dodgeDifficulty = value;
  localStorage.setItem(dodgeDifficultyKey, dodgeDifficulty);
  dodgeDifficultySelect.value = dodgeDifficulty;
  resetDodgeGame();
}

function getUntangleDifficulty() {
  return untangleDifficulties[untangleDifficulty] || untangleDifficulties.normal;
}

function setUntangleDifficulty(value) {
  if (!untangleDifficulties[value]) {
    return;
  }

  untangleDifficulty = value;
  localStorage.setItem(untangleDifficultyKey, untangleDifficulty);
  untangleDifficultySelect.value = untangleDifficulty;
  startUntangleGame();
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
  mineModelStage.querySelector(".mine-mobile-shell")?.remove();
  mineModelSpace.innerHTML = "";
  mineModelSpace.dataset.renderMode = mineLightMode ? "mobile" : "desktop";
  applyMineModelRotation();
  renderMineExpandButton();
  mineModelStage.classList.toggle("is-light-mode", mineLightMode);
  mineModelStage.classList.toggle("is-layer-mode", mineLightMode);

  if (mineLightMode) {
    const shell = document.createElement("div");
    shell.className = "mine-mobile-shell";
    shell.innerHTML = `
      <div class="mine-layer-shell">
        <div class="mine-layer-tabs" id="mine-layer-tabs" aria-label="扫雷层数"></div>
        <div class="mine-layer-board" id="mine-layer-board" aria-label="当前层扫雷棋盘"></div>
        <div class="mine-neighbor-layers" id="mine-neighbor-layers" aria-label="相邻层扫雷状态"></div>
      </div>
    `;
    mineModelStage.appendChild(shell);
  }
}

function hasAccount() {
  return Boolean(token && profile);
}

function renderAuthView() {
  const loggedIn = hasAccount();
  appShell.classList.toggle("is-auth-required", !loggedIn);
  loginView.hidden = loggedIn;
  appView.hidden = !loggedIn;
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

  loginView.hidden = true;
  appView.hidden = false;
  appShell.classList.remove("is-auth-required");

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
    accountStatus.textContent = "昵称加密码即可进入。";
    profileStrip.hidden = true;
    createRoomButton.disabled = true;
    joinRoomButton.disabled = true;
    profileMinesweeperWins.textContent = "0";
    profileFlappyBest.textContent = "0";
    profileDodgeBest.textContent = "0.0s";
    profileUntangleWins.textContent = "0";
    profileFruitBest.textContent = "0";
    renderAuthView();
    updateRoomActions();
    return;
  }

  localStorage.setItem(nameKey, profile.name);
  accountNameInput.value = profile.name;
  accountTitle.textContent = `欢迎，${profile.name}`;
  profileName.textContent = profile.name;
  profileLevel.textContent = String(profile.level);
  profilePoints.textContent = String(profile.totalPoints);
  profileBest.textContent = String(profile.stats.game2048.highScore);
  profileMinesweeperWins.textContent = String(profile.stats.minesweeper3d.wins);
  flappyBest = Math.max(flappyBest, profile.stats.flappy?.bestScore || 0);
  localStorage.setItem(flappyBestKey, String(flappyBest));
  profileFlappyBest.textContent = String(flappyBest);
  flappyBestElement.textContent = String(flappyBest);
  dodgeBest = Math.max(dodgeBest, profile.stats.dodge?.bestTime || 0);
  localStorage.setItem(dodgeBestKey, String(dodgeBest));
  profileDodgeBest.textContent = formatDodgeTime(dodgeBest);
  dodgeBestElement.textContent = formatDodgeTime(dodgeBest);
  profileUntangleWins.textContent = String(profile.stats.untangle?.wins || 0);
  fruitBest = Math.max(fruitBest, profile.stats.fruitmerge?.bestScore || 0);
  localStorage.setItem(fruitBestKey, String(fruitBest));
  profileFruitBest.textContent = String(fruitBest);
  fruitBestElement.textContent = String(fruitBest);
  profileStrip.hidden = false;
  createRoomButton.disabled = false;
  joinRoomButton.disabled = false;
  renderAuthView();
  updateRoomActions();
}

function updateRoomActions() {
  const show2048 = currentGame === GAME_2048;
  const showMinesweeper = currentGame === GAME_MINESWEEPER;
  const showFlappy = currentGame === GAME_FLAPPY;
  const showFruit = currentGame === GAME_FRUIT;
  const showDodge = currentGame === GAME_DODGE;
  const showUntangle = currentGame === GAME_UNTANGLE;
  const showDuel = currentGame === GAME_DUEL;
  const showRoom = show2048 || showDuel;
  roomPanel.hidden = !showRoom;
  roomGameLabel.textContent = showDuel ? "挡板弹球对战" : "2048 联机竞速";
  game2048Panel.classList.toggle("is-hidden", !show2048);
  gameMinesweeperPanel.classList.toggle("is-hidden", !showMinesweeper);
  gameFlappyPanel.classList.toggle("is-hidden", !showFlappy);
  gameFruitPanel.classList.toggle("is-hidden", !showFruit);
  gameDodgePanel.classList.toggle("is-hidden", !showDodge);
  gameUntanglePanel.classList.toggle("is-hidden", !showUntangle);
  gameDuelPanel.classList.toggle("is-hidden", !showDuel);

  gameCards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.game === currentGame);
  });

  if (show2048) {
    statusText.textContent = text.waiting;
  } else if (showMinesweeper) {
    mineStatusText.textContent = mineGameOver
      ? mineGameWon
        ? text.minesWin
        : text.minesLose
      : getMineReadyText();
  } else if (showFlappy) {
    flappyStatusText.textContent = flappyGameOver ? text.flappyOver : text.flappyReady;
    renderFlappy();
  } else if (showFruit) {
    fruitStatusText.textContent = fruitGameOver ? text.fruitOver : text.fruitReady;
    renderFruit();
  } else if (showDodge) {
    dodgeStatusText.textContent = dodgeGameOver
      ? text.dodgeOver
      : `${getDodgeDifficulty().label}难度：${text.dodgeReady}`;
    renderDodge();
  } else if (showUntangle) {
    untangleStatusText.textContent = getUntangleStatusText();
    renderUntangle();
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

  if (currentGame === GAME_DODGE && gameId !== GAME_DODGE) {
    dodgeKeys.clear();
  }

  if (currentGame === GAME_FRUIT && gameId !== GAME_FRUIT) {
    stopFruitLoop();
    fruitRunning = false;
  }

  currentGame = [GAME_2048, GAME_MINESWEEPER, GAME_FLAPPY, GAME_FRUIT, GAME_DODGE, GAME_UNTANGLE, GAME_DUEL].includes(gameId)
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
    accountStatus.textContent = "昵称要填写，密码至少 4 位。";
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
  statusText.textContent = text.waiting;
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
    showMessage(text.wonTitle, "已经合成 2048，要现在结算重开，还是继续冲更高分？", false, {
      primaryLabel: "继续游戏",
      secondaryLabel: "结算并重开",
    });
    statusText.textContent = "已经合成 2048，可以选择结算重开，或继续冲更高分。";
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

function showMessage(title, copy, lockGame, options = {}) {
  messageTitle.textContent = title;
  messageCopy.textContent = copy;
  messageButton.textContent = options.primaryLabel || (lockGame ? "再来一局" : "继续游戏");
  messageSecondaryButton.hidden = !options.secondaryLabel;

  if (options.secondaryLabel) {
    messageSecondaryButton.textContent = options.secondaryLabel;
  }

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

async function settleAndRestart2048() {
  message.classList.add("is-hidden");
  gameFinished = true;
  await settle2048Game("won-restart");
  start2048Game({ settlePrevious: false });
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
  if (event.key === "Escape") {
    closeInfoPanels();
    return;
  }

  if (currentGame === GAME_DUEL) {
    const direction = getDuelDirection(event.key);

    if (direction !== 0) {
      event.preventDefault();
      setDuelInput(direction);
    }

    return;
  }

  if (currentGame === GAME_DODGE) {
    const direction = getDodgeDirection(event.key);

    if (direction) {
      event.preventDefault();
      dodgeKeys.add(direction);
      startDodgeGame();
      return;
    }

    if (event.key === " ") {
      event.preventDefault();
      startDodgeGame();
      return;
    }
  }

  if (currentGame === GAME_FLAPPY) {
    if ([" ", "ArrowUp", "w", "W"].includes(event.key)) {
      event.preventDefault();
      flap();
    }

    return;
  }

  if (currentGame === GAME_FRUIT) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      event.preventDefault();
      fruitDropX = Math.max(
        fruitSettings.wallPadding + fruitTypes[fruitNextLevel].radius,
        fruitDropX - 18,
      );
      renderFruit();
      return;
    }

    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      event.preventDefault();
      fruitDropX = Math.min(
        fruitSettings.width - fruitSettings.wallPadding - fruitTypes[fruitNextLevel].radius,
        fruitDropX + 18,
      );
      renderFruit();
      return;
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      dropFruit();
      return;
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
  if (currentGame === GAME_DODGE) {
    const direction = getDodgeDirection(event.key);

    if (direction) {
      event.preventDefault();
      dodgeKeys.delete(direction);
      return;
    }
  }

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

function getDodgeDirection(key) {
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

  return directions[key] || "";
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
    meta.textContent = `Lv.${player.level} · 2048 最高 ${player.stats.game2048.highScore} · 扫雷 ${player.stats.minesweeper3d.wins} 胜 · 飞鸟 ${player.stats.flappy?.bestScore || 0} · 水果 ${player.stats.fruitmerge?.bestScore || 0} · 灵敏 ${formatDodgeTime(player.stats.dodge?.bestTime || 0)} · 解绳 ${player.stats.untangle?.wins || 0} 胜 · 弹球 ${player.stats.paddleduel?.wins || 0} 胜`;

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

function toggleInfoPanel(panel, toggle) {
  const willOpen = panel.classList.contains("is-collapsed");
  closeInfoPanels();

  if (willOpen) {
    panel.classList.remove("is-collapsed");
    toggle.setAttribute("aria-expanded", "true");
  }
}

function closeInfoPanels() {
  [
    [announcementPanel, announcementToggle],
    [leaderboardPanel, leaderboardToggle],
    [changelogPanel, changelogToggle],
  ].forEach(([panel, toggle]) => {
    panel.classList.add("is-collapsed");
    toggle.setAttribute("aria-expanded", "false");
  });
}

function closeInfoPanelFromButton(button) {
  const panelMap = {
    announcement: [announcementPanel, announcementToggle],
    leaderboard: [leaderboardPanel, leaderboardToggle],
    changelog: [changelogPanel, changelogToggle],
  };
  const target = panelMap[button.dataset.panelClose];

  if (!target) {
    return;
  }

  const [panel, toggle] = target;
  panel.classList.add("is-collapsed");
  toggle.setAttribute("aria-expanded", "false");
}

function renderInfoList(list, entries, emptyTitle, emptyBody) {
  list.innerHTML = "";

  if (!entries.length) {
    const item = document.createElement("li");
    item.className = "announcement-item";

    const title = document.createElement("strong");
    title.textContent = emptyTitle;

    const body = document.createElement("span");
    body.textContent = emptyBody;

    item.append(title, body);
    list.appendChild(item);
    return;
  }

  entries.slice(0, maxInfoEntries).forEach((announcement) => {
    const item = document.createElement("li");
    item.className = "announcement-item";

    const title = document.createElement("strong");
    title.textContent = announcement.title;

    const body = document.createElement("span");
    body.textContent = announcement.body;

    item.append(title, body);
    list.appendChild(item);
  });
}

function renderAnnouncements() {
  renderInfoList(announcementsList, announcements, "暂无公告", "公告栏以后只展示你明确要发布的正式公告。");
}

function renderChangelog() {
  renderInfoList(changelogList, changelogEntries, "暂无更新", "最近还没有记录新的功能更新。");
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
  const isServer = duelSide && duelState?.waitingForServe && duelState?.servingSide === duelSide;

  duelServeButton.hidden = !duelState?.active || !duelState?.waitingForServe;
  duelServeButton.disabled = !isServer;

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
    if (duelState.waitingForServe) {
      const serverName = duelState.players?.[duelState.servingSide]?.name || "一方";
      duelStatusText.textContent = isServer
        ? "轮到你开球，调整挡板位置后点击开球。"
        : `等待 ${serverName} 开球。`;
    } else {
      duelStatusText.textContent = duelSide
        ? `你在${duelSide === "left" ? "左侧" : "右侧"}，用 W/S 或上下方向键移动。`
        : "你正在观战这局对战。";
    }
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

function requestDuelServe() {
  if (!currentRoomCode) {
    duelStatusText.textContent = "先创建或加入一个房间。";
    return;
  }

  socket.emit("duel:serve", {}, (response) => {
    if (!response?.ok) {
      duelStatusText.textContent = response?.message || "暂时不能开球。";
    }
  });
}

function scheduleDuelRender() {
  if (duelRenderFrameId) {
    return;
  }

  duelRenderFrameId = window.requestAnimationFrame(() => {
    duelRenderFrameId = null;
    renderDuel();
  });
}

function renderDuel() {
  const context = duelContext;
  const width = duelCanvas.width;
  const height = duelCanvas.height;
  const state = duelState || {};
  const stateWidth = state.width || width;
  const stateHeight = state.height || height;
  const score = state.score || { left: 0, right: 0 };
  const paddles = state.paddles || { left: 0.5, right: 0.5 };
  const ball = state.ball || { x: stateWidth / 2, y: stateHeight / 2 };
  const scaleX = width / stateWidth;
  const scaleY = height / stateHeight;

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
  drawDuelPaddle(context, 42 * scaleX, paddles.left * height, "#f4c542");
  drawDuelPaddle(context, width - 42 * scaleX, paddles.right * height, "#65d6c1");
  drawDuelBall(context, ball.x * scaleX, ball.y * scaleY);

  context.fillStyle = "rgba(255, 255, 255, 0.9)";
  context.font = "900 44px Inter, Arial, sans-serif";
  context.textAlign = "center";
  context.fillText(`${score.left || 0}  :  ${score.right || 0}`, width / 2, 72);

  if (state.active && state.waitingForServe) {
    context.fillStyle = "rgba(8, 18, 28, 0.42)";
    context.fillRect(190, 182, width - 380, 112);
    context.fillStyle = "#ffffff";
    context.font = "900 26px Inter, Arial, sans-serif";
    context.fillText("等待开球", width / 2, 226);
    context.font = "800 15px Inter, Arial, sans-serif";
    const serverName = state.players?.[state.servingSide]?.name || "发球方";
    context.fillText(`${serverName} 点击开球后继续`, width / 2, 256);
  } else if (!state.active) {
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
  const paddleHeight = 112;
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

function getFruitSpawnLevel() {
  const roll = Math.random();

  if (roll < 0.7) return 0;
  if (roll < 0.93) return 1;
  if (fruitLargestLevel >= 3 && roll < 0.985) return 2;
  if (fruitLargestLevel >= 6) return 3;
  return 0;
}

function createFruitBody(level, x, y, options = {}) {
  const type = fruitTypes[level];

  return {
    id: createGameId(),
    level,
    x,
    y,
    vx: options.vx || 0,
    vy: options.vy || 0,
    radius: type.radius,
    merged: false,
    settledFrames: 0,
    bornAt: Date.now(),
  };
}

function resetFruitGame(options = {}) {
  stopFruitLoop();
  fruitGameId = createGameId();
  fruitScore = 0;
  fruitLargestLevel = 0;
  fruitNextLevel = getFruitSpawnLevel();
  fruitDropX = fruitSettings.width / 2;
  fruitBodies = [];
  fruitRunning = false;
  fruitGameOver = false;
  fruitStartedAt = 0;
  fruitSettled = false;
  fruitLastDropAt = 0;
  fruitWarningStartedAt = 0;
  fruitPointerActive = false;
  fruitScoreElement.textContent = "0";
  fruitLargestElement.textContent = fruitTypes[0].name;
  fruitBestElement.textContent = String(fruitBest);
  fruitRestartButton.textContent = "重新开局";
  fruitStatusText.textContent = options.readyText || text.fruitReady;
  renderFruit();
}

function startFruitGame() {
  if (fruitRunning || fruitGameOver) {
    return;
  }

  fruitRunning = true;
  fruitStartedAt = fruitStartedAt || Date.now();
  fruitLastFrameTime = performance.now();
  fruitStatusText.textContent = text.fruitPlaying;
  fruitAnimationId = window.requestAnimationFrame(updateFruitFrame);
}

function stopFruitLoop() {
  if (fruitAnimationId) {
    window.cancelAnimationFrame(fruitAnimationId);
    fruitAnimationId = null;
  }
}

function updateFruitFrame(timestamp) {
  if (!fruitRunning) {
    return;
  }

  const delta = Math.min(2, (timestamp - fruitLastFrameTime) / 16.67 || 1);
  fruitLastFrameTime = timestamp;
  stepFruit(delta);
  renderFruit();

  if (fruitGameOver) {
    finishFruitGame();
    return;
  }

  fruitAnimationId = window.requestAnimationFrame(updateFruitFrame);
}

function stepFruit(delta) {
  fruitBodies.forEach((fruit) => {
    fruit.vy += fruitSettings.gravity * delta;
    fruit.vx *= fruitSettings.damping;
    fruit.vy *= fruitSettings.damping;
    fruit.x += fruit.vx * delta;
    fruit.y += fruit.vy * delta;
  });

  for (let iteration = 0; iteration < fruitSettings.collisionIterations; iteration += 1) {
    resolveFruitWalls();
    resolveFruitPairs();
  }

  mergeFruitPairs();
  fruitBodies = fruitBodies.filter((fruit) => !fruit.merged).slice(-fruitSettings.maxFruits);
  checkFruitDangerLine();
  updateFruitStatsDisplay();
}

function resolveFruitWalls() {
  const left = fruitSettings.wallPadding;
  const right = fruitSettings.width - fruitSettings.wallPadding;

  fruitBodies.forEach((fruit) => {
    if (fruit.x - fruit.radius < left) {
      fruit.x = left + fruit.radius;
      fruit.vx = Math.abs(fruit.vx) * fruitSettings.restitution;
    } else if (fruit.x + fruit.radius > right) {
      fruit.x = right - fruit.radius;
      fruit.vx = -Math.abs(fruit.vx) * fruitSettings.restitution;
    }

    if (fruit.y + fruit.radius > fruitSettings.floorY) {
      fruit.y = fruitSettings.floorY - fruit.radius;
      fruit.vy = -Math.abs(fruit.vy) * fruitSettings.restitution;
      fruit.vx *= fruitSettings.friction;
    }
  });
}

function resolveFruitPairs() {
  for (let first = 0; first < fruitBodies.length; first += 1) {
    for (let second = first + 1; second < fruitBodies.length; second += 1) {
      const a = fruitBodies[first];
      const b = fruitBodies[second];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy) || 0.0001;
      const minimum = a.radius + b.radius;

      if (distance >= minimum) {
        continue;
      }

      const overlap = minimum - distance;
      const nx = dx / distance;
      const ny = dy / distance;
      a.x -= nx * overlap * 0.5;
      a.y -= ny * overlap * 0.5;
      b.x += nx * overlap * 0.5;
      b.y += ny * overlap * 0.5;

      const relativeVelocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      const impulse = Math.min(2.8, Math.max(-2.8, relativeVelocity * 0.42));
      a.vx += impulse * nx;
      a.vy += impulse * ny;
      b.vx -= impulse * nx;
      b.vy -= impulse * ny;
    }
  }
}

function mergeFruitPairs() {
  for (let first = 0; first < fruitBodies.length; first += 1) {
    const a = fruitBodies[first];

    if (a.merged) {
      continue;
    }

    for (let second = first + 1; second < fruitBodies.length; second += 1) {
      const b = fruitBodies[second];

      if (b.merged || a.level !== b.level || a.level >= fruitTypes.length - 1) {
        continue;
      }

      const distance = Math.hypot(b.x - a.x, b.y - a.y);
      const contactDistance = a.radius + b.radius + 3;
      const bothReady = Date.now() - a.bornAt > 180 && Date.now() - b.bornAt > 180;

      if (!bothReady || distance > contactDistance) {
        continue;
      }

      const nextLevel = a.level + 1;
      const merged = createFruitBody(
        nextLevel,
        (a.x + b.x) / 2,
        (a.y + b.y) / 2,
        {
          vx: (a.vx + b.vx) * 0.34,
          vy: Math.min(0, (a.vy + b.vy) * 0.2) - 1.2,
        },
      );
      a.merged = true;
      b.merged = true;
      fruitBodies.push(merged);
      fruitScore += fruitTypes[nextLevel].points;
      fruitLargestLevel = Math.max(fruitLargestLevel, nextLevel);
      fruitWarningStartedAt = 0;
      return;
    }
  }
}

function checkFruitDangerLine() {
  const now = Date.now();
  const danger = fruitBodies.some((fruit) => {
    const oldEnough = now - fruit.bornAt > 900;
    const nearlyStill = Math.abs(fruit.vy) < 2.8;

    return oldEnough && nearlyStill && fruit.y - fruit.radius < fruitSettings.topLineY;
  });

  if (!danger) {
    fruitWarningStartedAt = 0;
    return;
  }

  fruitWarningStartedAt = fruitWarningStartedAt || now;

  if (now - fruitWarningStartedAt >= fruitSettings.warningMs) {
    fruitGameOver = true;
  }
}

function updateFruitStatsDisplay() {
  fruitScoreElement.textContent = String(fruitScore);
  fruitLargestElement.textContent = fruitTypes[fruitLargestLevel].name;
  fruitBestElement.textContent = String(Math.max(fruitBest, fruitScore));
}

function setFruitDropXFromClient(clientX) {
  const rect = fruitCanvas.getBoundingClientRect();
  const scaleX = fruitSettings.width / rect.width;
  const radius = fruitTypes[fruitNextLevel].radius;
  fruitDropX = Math.max(
    fruitSettings.wallPadding + radius,
    Math.min(fruitSettings.width - fruitSettings.wallPadding - radius, (clientX - rect.left) * scaleX),
  );
}

function dropFruit() {
  const now = Date.now();

  if (fruitGameOver || now - fruitLastDropAt < fruitSettings.dropCooldownMs) {
    return;
  }

  startFruitGame();
  const level = fruitNextLevel;
  const radius = fruitTypes[level].radius;
  const spawnJitter = (Math.random() - 0.5) * Math.min(18, radius * 0.38);
  const spawnX = Math.max(
    fruitSettings.wallPadding + radius,
    Math.min(fruitSettings.width - fruitSettings.wallPadding - radius, fruitDropX + spawnJitter),
  );
  const fruit = createFruitBody(level, spawnX, fruitSettings.spawnY, {
    vx: (Math.random() - 0.5) * 1.1,
  });
  fruitBodies.push(fruit);
  fruitNextLevel = getFruitSpawnLevel();
  fruitLastDropAt = now;
  fruitStatusText.textContent = text.fruitPlaying;
  renderFruit();
}

function handleFruitPointerDown(event) {
  if (currentGame !== GAME_FRUIT) {
    return;
  }

  event.preventDefault();
  fruitCanvas.setPointerCapture(event.pointerId);
  fruitPointerActive = true;
  setFruitDropXFromClient(event.clientX);
  renderFruit();
}

function handleFruitPointerMove(event) {
  if (currentGame !== GAME_FRUIT || !fruitPointerActive) {
    return;
  }

  event.preventDefault();
  setFruitDropXFromClient(event.clientX);
  renderFruit();
}

function handleFruitPointerUp(event) {
  if (currentGame !== GAME_FRUIT || !fruitPointerActive) {
    return;
  }

  event.preventDefault();
  fruitPointerActive = false;
  setFruitDropXFromClient(event.clientX);
  dropFruit();
}

function handleFruitPointerCancel() {
  fruitPointerActive = false;
}

function finishFruitGame() {
  stopFruitLoop();
  fruitRunning = false;
  fruitRestartButton.textContent = "再来一局";
  fruitStatusText.textContent = text.fruitOver;

  if (fruitScore > fruitBest) {
    fruitBest = fruitScore;
    localStorage.setItem(fruitBestKey, String(fruitBest));
    fruitBestElement.textContent = String(fruitBest);
    profileFruitBest.textContent = String(fruitBest);
  }

  renderFruit();
  settleFruitGame();
}

async function settleFruitGame() {
  if (!hasAccount() || fruitSettled) {
    return;
  }

  fruitSettled = true;
  const seconds = fruitStartedAt ? Math.floor((Date.now() - fruitStartedAt) / 1000) : 0;

  try {
    const data = await apiRequest("/api/games/fruit-merge/results", {
      method: "POST",
      body: JSON.stringify({
        gameId: fruitGameId,
        score: fruitScore,
        bestScore: fruitBest,
        largestLevel: fruitLargestLevel,
        largestName: fruitTypes[fruitLargestLevel].name,
        seconds,
      }),
    });

    renderAccount(data.profile);
    await refreshLeaderboard(data.leaderboard);
    fruitStatusText.textContent = `本局 ${fruitScore} 分，最大 ${fruitTypes[fruitLargestLevel].name}，获得 ${data.award.points} 积分。`;
  } catch (error) {
    fruitStatusText.textContent = error.message;
    fruitSettled = false;
  }
}

function renderFruit() {
  const context = fruitContext;
  const width = fruitSettings.width;
  const height = fruitSettings.height;

  context.clearRect(0, 0, width, height);
  drawFruitBackground(context);
  fruitBodies.forEach((fruit) => drawFruitBody(context, fruit));
  drawFruitPreview(context);
  drawFruitOverlay(context);
}

function drawFruitBackground(context) {
  const gradient = context.createLinearGradient(0, 0, 0, fruitSettings.height);
  gradient.addColorStop(0, "#fff7e8");
  gradient.addColorStop(1, "#f2ead8");
  context.fillStyle = gradient;
  context.fillRect(0, 0, fruitSettings.width, fruitSettings.height);
  context.fillStyle = "rgba(24, 33, 42, 0.08)";
  context.fillRect(0, fruitSettings.floorY, fruitSettings.width, fruitSettings.height - fruitSettings.floorY);
  context.strokeStyle = fruitWarningStartedAt ? "rgba(186, 63, 74, 0.86)" : "rgba(186, 63, 74, 0.42)";
  context.setLineDash([8, 7]);
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(fruitSettings.wallPadding, fruitSettings.topLineY);
  context.lineTo(fruitSettings.width - fruitSettings.wallPadding, fruitSettings.topLineY);
  context.stroke();
  context.setLineDash([]);
  context.strokeStyle = "rgba(24, 33, 42, 0.16)";
  context.lineWidth = 3;
  context.strokeRect(
    fruitSettings.wallPadding,
    0,
    fruitSettings.width - fruitSettings.wallPadding * 2,
    fruitSettings.floorY,
  );
}

function drawFruitBody(context, fruit) {
  const sprite = getFruitSprite(fruit.level, fruit.radius);

  context.drawImage(sprite, fruit.x - sprite.width / 2, fruit.y - sprite.height / 2);
}

function getFruitSprite(level, radius) {
  const safeRadius = Math.max(8, Math.round(radius));
  const key = `${level}-${safeRadius}`;
  const cached = fruitSpriteCache.get(key);

  if (cached) {
    return cached;
  }

  const padding = Math.ceil(Math.max(10, safeRadius * 0.18));
  const size = Math.ceil(safeRadius * 2 + padding * 2);
  const sprite = document.createElement("canvas");
  const spriteContext = sprite.getContext("2d");

  sprite.width = size;
  sprite.height = size;
  drawFruitSprite(spriteContext, {
    level,
    x: size / 2,
    y: size / 2,
    radius: safeRadius,
  });
  fruitSpriteCache.set(key, sprite);

  return sprite;
}

function drawFruitSprite(context, fruit) {
  const type = fruitTypes[fruit.level];

  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";

  switch (type.name) {
    case "葡萄":
      drawGrapeSprite(context, fruit, type);
      break;
    case "樱桃":
      drawCherrySprite(context, fruit, type);
      break;
    case "橘子":
      drawOrangeSprite(context, fruit, type);
      break;
    case "柠檬":
      drawLemonSprite(context, fruit, type);
      break;
    case "猕猴桃":
      drawKiwiSprite(context, fruit, type);
      break;
    case "苹果":
      drawAppleSprite(context, fruit, type);
      break;
    case "梨":
      drawPearSprite(context, fruit, type);
      break;
    case "桃子":
      drawPeachSprite(context, fruit, type);
      break;
    case "菠萝":
      drawPineappleSprite(context, fruit, type);
      break;
    case "哈密瓜":
      drawCantaloupeSprite(context, fruit, type);
      break;
    case "西瓜":
      drawWatermelonSprite(context, fruit, type);
      break;
    default:
      drawRoundFruitBase(context, fruit, type.color);
      drawFruitGloss(context, fruit.x, fruit.y, fruit.radius);
      break;
  }

  context.restore();
}

function drawRoundFruitBase(context, fruit, color, options = {}) {
  const { x, y, radius } = fruit;
  const gradient = context.createRadialGradient(
    x - radius * 0.34,
    y - radius * 0.38,
    radius * 0.06,
    x,
    y,
    radius,
  );

  gradient.addColorStop(0, options.light || "#fffdf4");
  gradient.addColorStop(0.2, shadeColor(color, 18));
  gradient.addColorStop(0.74, color);
  gradient.addColorStop(1, options.dark || shadeColor(color, -24));
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius * (options.scale || 1), 0, Math.PI * 2);
  context.fill();
  drawFruitOutline(context, x, y, radius * (options.scale || 1));
}

function drawFruitOutline(context, x, y, radius, alpha = 0.18) {
  context.strokeStyle = `rgba(24, 33, 42, ${alpha})`;
  context.lineWidth = Math.max(1, radius * 0.045);
  context.stroke();
}

function drawFruitGloss(context, x, y, radius, alpha = 0.34) {
  context.save();
  context.globalAlpha = alpha;
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.ellipse(
    x - radius * 0.34,
    y - radius * 0.36,
    radius * 0.22,
    radius * 0.11,
    -0.6,
    0,
    Math.PI * 2,
  );
  context.fill();
  context.restore();
}

function drawLeaf(context, x, y, width, height, rotation, color = "#3e9b57") {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.fillStyle = color;
  context.strokeStyle = "rgba(24, 93, 54, 0.28)";
  context.lineWidth = Math.max(1, width * 0.08);
  context.beginPath();
  context.moveTo(-width * 0.48, 0);
  context.bezierCurveTo(-width * 0.2, -height * 0.56, width * 0.4, -height * 0.48, width * 0.55, 0);
  context.bezierCurveTo(width * 0.25, height * 0.38, -width * 0.24, height * 0.32, -width * 0.48, 0);
  context.closePath();
  context.fill();
  context.stroke();
  context.restore();
}

function drawStem(context, x, y, radius, options = {}) {
  context.save();
  context.strokeStyle = options.color || "#7a4d2d";
  context.lineWidth = Math.max(1.2, radius * (options.width ?? 0.08));
  context.beginPath();
  context.moveTo(x + radius * (options.startX ?? -0.02), y - radius * (options.startY ?? 0.62));
  context.bezierCurveTo(
    x + radius * (options.cp1x ?? -0.08),
    y - radius * (options.cp1y ?? 0.86),
    x + radius * (options.cp2x ?? 0.12),
    y - radius * (options.cp2y ?? 0.92),
    x + radius * (options.endX ?? 0.22),
    y - radius * (options.endY ?? 1.02),
  );
  context.stroke();
  context.restore();
}

function drawGrapeSprite(context, fruit, type) {
  const { x, y, radius } = fruit;
  const grapes = [
    [-0.24, -0.2, 0.32],
    [0.08, -0.28, 0.34],
    [0.34, -0.05, 0.3],
    [-0.38, 0.06, 0.3],
    [-0.1, 0.14, 0.33],
    [0.22, 0.26, 0.29],
  ];

  drawStem(context, x, y, radius, {
    startX: -0.02,
    startY: 0.44,
    endX: 0.06,
    endY: 0.96,
    width: 0.07,
  });
  drawLeaf(context, x + radius * 0.18, y - radius * 0.7, radius * 0.5, radius * 0.28, -0.28);

  grapes.forEach(([offsetX, offsetY, scale], index) => {
    const grapeRadius = radius * scale;
    const grapeX = x + radius * offsetX;
    const grapeY = y + radius * offsetY;
    const gradient = context.createRadialGradient(
      grapeX - grapeRadius * 0.28,
      grapeY - grapeRadius * 0.35,
      grapeRadius * 0.05,
      grapeX,
      grapeY,
      grapeRadius,
    );

    gradient.addColorStop(0, "#e7d7ff");
    gradient.addColorStop(0.25, index % 2 ? "#a87bea" : "#915fd8");
    gradient.addColorStop(1, shadeColor(type.color, -28));
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(grapeX, grapeY, grapeRadius, 0, Math.PI * 2);
    context.fill();
    drawFruitOutline(context, grapeX, grapeY, grapeRadius, 0.12);
  });
}

function drawCherrySprite(context, fruit, type) {
  const { x, y, radius } = fruit;

  drawStem(context, x, y, radius, {
    startX: 0,
    startY: 0.5,
    cp1x: -0.1,
    cp1y: 0.86,
    cp2x: 0.08,
    cp2y: 1,
    endX: 0.28,
    endY: 1.16,
    width: 0.07,
  });
  drawLeaf(context, x + radius * 0.25, y - radius * 0.8, radius * 0.52, radius * 0.28, 0.08);
  drawRoundFruitBase(context, fruit, type.color, { dark: "#b8203b" });

  context.strokeStyle = "rgba(126, 24, 46, 0.22)";
  context.lineWidth = Math.max(1, radius * 0.06);
  context.beginPath();
  context.arc(x + radius * 0.05, y + radius * 0.02, radius * 0.55, 0.58, 2.35);
  context.stroke();
  drawFruitGloss(context, x, y, radius, 0.42);
}

function drawOrangeSprite(context, fruit, type) {
  const { x, y, radius } = fruit;

  drawRoundFruitBase(context, fruit, type.color, { dark: "#cf6d1f" });
  context.save();
  context.beginPath();
  context.arc(x, y, radius * 0.9, 0, Math.PI * 2);
  context.clip();
  context.strokeStyle = "rgba(154, 83, 25, 0.24)";
  context.lineWidth = Math.max(1, radius * 0.035);

  for (let index = 0; index < 10; index += 1) {
    const angle = (Math.PI * 2 * index) / 10;
    context.beginPath();
    context.moveTo(x + Math.cos(angle) * radius * 0.16, y + Math.sin(angle) * radius * 0.16);
    context.lineTo(x + Math.cos(angle) * radius * 0.82, y + Math.sin(angle) * radius * 0.82);
    context.stroke();
  }

  context.fillStyle = "rgba(255, 218, 132, 0.55)";
  for (let index = 0; index < 12; index += 1) {
    const angle = (Math.PI * 2 * index) / 12 + 0.18;
    context.beginPath();
    context.arc(
      x + Math.cos(angle) * radius * 0.52,
      y + Math.sin(angle) * radius * 0.52,
      Math.max(1.1, radius * 0.035),
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  context.restore();
  drawLeaf(context, x + radius * 0.22, y - radius * 0.75, radius * 0.42, radius * 0.2, -0.1);
  drawFruitGloss(context, x, y, radius, 0.25);
}

function drawLemonSprite(context, fruit, type) {
  const { x, y, radius } = fruit;
  const gradient = context.createRadialGradient(
    x - radius * 0.35,
    y - radius * 0.36,
    radius * 0.08,
    x,
    y,
    radius,
  );

  gradient.addColorStop(0, "#fffbe0");
  gradient.addColorStop(0.28, "#ffe66c");
  gradient.addColorStop(1, shadeColor(type.color, -18));
  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(x - radius * 0.95, y);
  context.bezierCurveTo(x - radius * 0.74, y - radius * 0.6, x - radius * 0.18, y - radius * 0.82, x + radius * 0.18, y - radius * 0.68);
  context.bezierCurveTo(x + radius * 0.64, y - radius * 0.5, x + radius * 0.9, y - radius * 0.16, x + radius * 0.98, y);
  context.bezierCurveTo(x + radius * 0.72, y + radius * 0.58, x + radius * 0.2, y + radius * 0.82, x - radius * 0.16, y + radius * 0.68);
  context.bezierCurveTo(x - radius * 0.62, y + radius * 0.48, x - radius * 0.88, y + radius * 0.16, x - radius * 0.95, y);
  context.closePath();
  context.fill();
  context.strokeStyle = "rgba(139, 116, 21, 0.2)";
  context.lineWidth = Math.max(1, radius * 0.045);
  context.stroke();

  context.strokeStyle = "rgba(151, 126, 28, 0.22)";
  context.lineWidth = Math.max(1, radius * 0.035);
  context.beginPath();
  context.moveTo(x - radius * 0.48, y - radius * 0.28);
  context.quadraticCurveTo(x, y - radius * 0.06, x + radius * 0.48, y - radius * 0.24);
  context.stroke();
  drawFruitGloss(context, x, y, radius, 0.32);
}

function drawKiwiSprite(context, fruit, type) {
  const { x, y, radius } = fruit;

  drawRoundFruitBase(context, fruit, "#8b6a3e", { dark: "#5b4329", light: "#d7bd80" });
  context.fillStyle = type.color;
  context.beginPath();
  context.arc(x, y, radius * 0.78, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#f7f2d6";
  context.beginPath();
  context.arc(x, y, radius * 0.22, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "rgba(24, 33, 42, 0.78)";
  for (let index = 0; index < 18; index += 1) {
    const angle = (Math.PI * 2 * index) / 18;
    context.beginPath();
    context.ellipse(
      x + Math.cos(angle) * radius * 0.48,
      y + Math.sin(angle) * radius * 0.48,
      Math.max(1.1, radius * 0.035),
      Math.max(0.8, radius * 0.018),
      angle,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  drawFruitGloss(context, x, y, radius, 0.24);
}

function drawAppleSprite(context, fruit, type) {
  const { x, y, radius } = fruit;
  const gradient = context.createRadialGradient(
    x - radius * 0.36,
    y - radius * 0.38,
    radius * 0.06,
    x,
    y,
    radius,
  );

  drawStem(context, x, y, radius, { startX: 0.02, startY: 0.56, endX: 0.14, endY: 1.03 });
  drawLeaf(context, x + radius * 0.22, y - radius * 0.84, radius * 0.52, radius * 0.28, 0.08);
  gradient.addColorStop(0, "#ffd6c8");
  gradient.addColorStop(0.24, "#f56555");
  gradient.addColorStop(1, shadeColor(type.color, -28));
  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(x, y - radius * 0.62);
  context.bezierCurveTo(x - radius * 0.26, y - radius * 0.86, x - radius * 0.82, y - radius * 0.72, x - radius * 0.86, y - radius * 0.16);
  context.bezierCurveTo(x - radius * 0.92, y + radius * 0.48, x - radius * 0.44, y + radius * 0.9, x - radius * 0.05, y + radius * 0.75);
  context.bezierCurveTo(x + radius * 0.18, y + radius * 0.92, x + radius * 0.86, y + radius * 0.5, x + radius * 0.84, y - radius * 0.12);
  context.bezierCurveTo(x + radius * 0.82, y - radius * 0.7, x + radius * 0.24, y - radius * 0.86, x, y - radius * 0.62);
  context.closePath();
  context.fill();
  context.strokeStyle = "rgba(103, 37, 36, 0.18)";
  context.lineWidth = Math.max(1, radius * 0.045);
  context.stroke();
  drawFruitGloss(context, x, y, radius, 0.34);
}

function drawPearSprite(context, fruit, type) {
  const { x, y, radius } = fruit;
  const gradient = context.createRadialGradient(
    x - radius * 0.28,
    y - radius * 0.36,
    radius * 0.08,
    x,
    y,
    radius,
  );

  drawStem(context, x, y, radius, { startX: 0, startY: 0.68, endX: 0.16, endY: 1.05 });
  drawLeaf(context, x + radius * 0.22, y - radius * 0.86, radius * 0.48, radius * 0.25, 0.16);
  gradient.addColorStop(0, "#f5f0a6");
  gradient.addColorStop(0.28, type.color);
  gradient.addColorStop(1, "#88ad36");
  context.fillStyle = gradient;
  context.beginPath();
  context.moveTo(x, y - radius * 0.78);
  context.bezierCurveTo(x - radius * 0.36, y - radius * 0.78, x - radius * 0.58, y - radius * 0.38, x - radius * 0.48, y - radius * 0.08);
  context.bezierCurveTo(x - radius * 0.86, y + radius * 0.12, x - radius * 0.76, y + radius * 0.84, x, y + radius * 0.86);
  context.bezierCurveTo(x + radius * 0.78, y + radius * 0.84, x + radius * 0.86, y + radius * 0.14, x + radius * 0.48, y - radius * 0.08);
  context.bezierCurveTo(x + radius * 0.58, y - radius * 0.4, x + radius * 0.34, y - radius * 0.78, x, y - radius * 0.78);
  context.closePath();
  context.fill();
  context.strokeStyle = "rgba(80, 104, 32, 0.18)";
  context.lineWidth = Math.max(1, radius * 0.045);
  context.stroke();

  context.fillStyle = "rgba(111, 96, 31, 0.24)";
  for (let index = 0; index < 9; index += 1) {
    const offsetX = Math.cos(index * 2.18) * radius * (0.18 + (index % 3) * 0.12);
    const offsetY = Math.sin(index * 1.73) * radius * 0.42 + radius * 0.18;
    context.beginPath();
    context.arc(x + offsetX, y + offsetY, Math.max(1, radius * 0.018), 0, Math.PI * 2);
    context.fill();
  }
  drawFruitGloss(context, x, y, radius, 0.24);
}

function drawPeachSprite(context, fruit, type) {
  const { x, y, radius } = fruit;

  drawLeaf(context, x + radius * 0.26, y - radius * 0.78, radius * 0.54, radius * 0.28, 0.02);
  drawRoundFruitBase(context, fruit, type.color, { dark: "#d76b66", light: "#ffe0b5" });
  context.strokeStyle = "rgba(143, 61, 70, 0.32)";
  context.lineWidth = Math.max(1.2, radius * 0.05);
  context.beginPath();
  context.moveTo(x + radius * 0.12, y - radius * 0.72);
  context.bezierCurveTo(x - radius * 0.06, y - radius * 0.26, x + radius * 0.18, y + radius * 0.28, x - radius * 0.08, y + radius * 0.72);
  context.stroke();
  drawFruitGloss(context, x, y, radius, 0.3);
}

function drawPineappleSprite(context, fruit, type) {
  const { x, y, radius } = fruit;

  drawLeaf(context, x - radius * 0.18, y - radius * 0.58, radius * 0.34, radius * 0.46, -0.75, "#338a55");
  drawLeaf(context, x + radius * 0.02, y - radius * 0.68, radius * 0.36, radius * 0.5, -0.1, "#3f9c58");
  drawLeaf(context, x + radius * 0.22, y - radius * 0.58, radius * 0.34, radius * 0.46, 0.65, "#2f7f4a");

  const gradient = context.createLinearGradient(x - radius * 0.6, y - radius * 0.7, x + radius * 0.62, y + radius * 0.78);
  gradient.addColorStop(0, "#f5d870");
  gradient.addColorStop(0.5, type.color);
  gradient.addColorStop(1, "#a97924");

  context.save();
  context.beginPath();
  context.ellipse(x, y + radius * 0.1, radius * 0.68, radius * 0.78, 0, 0, Math.PI * 2);
  context.fillStyle = gradient;
  context.fill();
  context.clip();

  context.strokeStyle = "rgba(112, 78, 22, 0.28)";
  context.lineWidth = Math.max(1, radius * 0.035);
  for (let offset = -radius * 1.2; offset <= radius * 1.2; offset += radius * 0.24) {
    context.beginPath();
    context.moveTo(x - radius + offset, y - radius * 0.7);
    context.lineTo(x + radius + offset, y + radius * 0.92);
    context.stroke();

    context.beginPath();
    context.moveTo(x + radius - offset, y - radius * 0.7);
    context.lineTo(x - radius - offset, y + radius * 0.92);
    context.stroke();
  }
  context.restore();

  context.strokeStyle = "rgba(82, 55, 18, 0.2)";
  context.lineWidth = Math.max(1.2, radius * 0.045);
  context.beginPath();
  context.ellipse(x, y + radius * 0.1, radius * 0.68, radius * 0.78, 0, 0, Math.PI * 2);
  context.stroke();
  drawFruitGloss(context, x, y, radius, 0.2);
}

function drawCantaloupeSprite(context, fruit, type) {
  const { x, y, radius } = fruit;

  drawRoundFruitBase(context, fruit, type.color, { dark: "#5ea956", light: "#e6f5a4" });
  context.save();
  context.beginPath();
  context.arc(x, y, radius * 0.92, 0, Math.PI * 2);
  context.clip();
  context.strokeStyle = "rgba(236, 244, 191, 0.7)";
  context.lineWidth = Math.max(1, radius * 0.035);

  for (let offset = -radius; offset <= radius; offset += radius * 0.24) {
    context.beginPath();
    context.moveTo(x - radius, y + offset);
    context.lineTo(x + radius, y + offset + radius * 0.42);
    context.stroke();

    context.beginPath();
    context.moveTo(x + radius, y + offset);
    context.lineTo(x - radius, y + offset + radius * 0.42);
    context.stroke();
  }

  context.strokeStyle = "rgba(66, 128, 62, 0.28)";
  context.lineWidth = Math.max(1.2, radius * 0.06);
  for (let index = -1; index <= 1; index += 1) {
    context.beginPath();
    context.ellipse(x + index * radius * 0.28, y, radius * 0.2, radius * 0.92, 0, 0, Math.PI * 2);
    context.stroke();
  }
  context.restore();
  drawFruitGloss(context, x, y, radius, 0.18);
}

function drawWatermelonSprite(context, fruit, type) {
  const { x, y, radius } = fruit;

  drawRoundFruitBase(context, fruit, type.color, { dark: "#26784b", light: "#b8f08a" });
  context.save();
  context.beginPath();
  context.arc(x, y, radius * 0.94, 0, Math.PI * 2);
  context.clip();
  context.strokeStyle = "rgba(29, 93, 54, 0.58)";
  context.lineWidth = Math.max(3, radius * 0.12);

  for (let index = -2; index <= 2; index += 1) {
    const startX = x + index * radius * 0.34;
    context.beginPath();
    context.moveTo(startX, y - radius * 0.95);
    context.bezierCurveTo(
      startX - radius * 0.18,
      y - radius * 0.45,
      startX + radius * 0.18,
      y + radius * 0.12,
      startX - radius * 0.06,
      y + radius * 0.95,
    );
    context.stroke();
  }

  context.fillStyle = "rgba(255, 86, 90, 0.88)";
  context.beginPath();
  context.moveTo(x + radius * 0.18, y + radius * 0.08);
  context.arc(x, y, radius * 0.64, 0.08, 0.92);
  context.closePath();
  context.fill();

  context.fillStyle = "rgba(24, 33, 42, 0.76)";
  for (let index = 0; index < 5; index += 1) {
    context.beginPath();
    context.ellipse(
      x + radius * (0.24 + index * 0.08),
      y + radius * (0.27 + Math.sin(index) * 0.12),
      Math.max(1.4, radius * 0.026),
      Math.max(2, radius * 0.045),
      -0.4,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  context.restore();
  drawFruitGloss(context, x, y, radius, 0.16);
}

function drawFruitPreview(context) {
  if (fruitGameOver) {
    return;
  }

  const type = fruitTypes[fruitNextLevel];
  context.strokeStyle = "rgba(24, 33, 42, 0.18)";
  context.setLineDash([5, 6]);
  context.beginPath();
  context.moveTo(fruitDropX, fruitSettings.spawnY);
  context.lineTo(fruitDropX, fruitSettings.floorY);
  context.stroke();
  context.setLineDash([]);
  context.globalAlpha = 0.78;
  drawFruitBody(context, {
    level: fruitNextLevel,
    x: fruitDropX,
    y: fruitSettings.spawnY,
    radius: type.radius,
  });
  context.globalAlpha = 1;
}

function drawFruitOverlay(context) {
  context.fillStyle = "rgba(24, 33, 42, 0.78)";
  context.font = "900 26px Inter, Arial, sans-serif";
  context.textAlign = "left";
  context.fillText(String(fruitScore), 22, 38);

  if (fruitWarningStartedAt && !fruitGameOver) {
    const left = Math.max(0, fruitSettings.warningMs - (Date.now() - fruitWarningStartedAt));
    const secondsLeft = Math.max(0.1, left / 1000).toFixed(1);

    context.save();
    context.textAlign = "center";
    context.fillStyle = "rgba(186, 63, 74, 0.94)";
    context.fillRect(fruitSettings.width / 2 - 106, fruitSettings.topLineY - 48, 212, 34);
    context.strokeStyle = "rgba(255, 255, 255, 0.78)";
    context.lineWidth = 2;
    context.strokeRect(fruitSettings.width / 2 - 106, fruitSettings.topLineY - 48, 212, 34);
    context.fillStyle = "#ffffff";
    context.font = "900 18px Inter, Arial, sans-serif";
    context.fillText(`危险 ${secondsLeft}s`, fruitSettings.width / 2, fruitSettings.topLineY - 25);
    context.restore();
  }

  if (!fruitRunning && fruitBodies.length === 0 && !fruitGameOver) {
    context.textAlign = "center";
    context.fillStyle = "rgba(24, 33, 42, 0.62)";
    context.font = "900 19px Inter, Arial, sans-serif";
    context.fillText("拖动选择落点，松手释放", fruitSettings.width / 2, fruitSettings.height * 0.44);
  }

  if (fruitGameOver) {
    context.fillStyle = "rgba(24, 33, 42, 0.66)";
    context.fillRect(54, 232, fruitSettings.width - 108, 126);
    context.textAlign = "center";
    context.fillStyle = "#ffffff";
    context.font = "900 28px Inter, Arial, sans-serif";
    context.fillText("游戏结束", fruitSettings.width / 2, 274);
    context.font = "800 16px Inter, Arial, sans-serif";
    context.fillText(`本局 ${fruitScore} 分 · 最大 ${fruitTypes[fruitLargestLevel].name}`, fruitSettings.width / 2, 310);
  }
}

function shadeColor(color, percent) {
  const value = Number.parseInt(color.slice(1), 16);
  const amount = Math.round(2.55 * percent);
  const red = Math.max(0, Math.min(255, (value >> 16) + amount));
  const green = Math.max(0, Math.min(255, (value >> 8 & 0xff) + amount));
  const blue = Math.max(0, Math.min(255, (value & 0xff) + amount));

  return `#${(0x1000000 + red * 0x10000 + green * 0x100 + blue).toString(16).slice(1)}`;
}

function formatDodgeTime(seconds) {
  return `${Math.max(0, seconds).toFixed(1)}s`;
}

function resetDodgeGame(options = {}) {
  const difficulty = getDodgeDifficulty();

  stopDodgeLoop();
  dodgeGameId = createGameId();
  dodgePlane = { x: dodgeSettings.width / 2, y: dodgeSettings.height / 2 };
  dodgeTarget = { ...dodgePlane };
  dodgeBullets = [];
  dodgeSparks = [];
  dodgeKeys.clear();
  dodgeRunning = false;
  dodgeGameOver = false;
  dodgeStartedAt = 0;
  dodgeElapsed = 0;
  dodgeGrazes = 0;
  dodgeNextSpawnIn = 360;
  dodgeSettled = false;
  dodgeTimeElement.textContent = formatDodgeTime(0);
  dodgeGrazesElement.textContent = "0";
  dodgeBestElement.textContent = formatDodgeTime(dodgeBest);
  dodgeRestartButton.textContent = "开始";
  dodgeStatusText.textContent =
    options.readyText || `${difficulty.label}难度：${text.dodgeReady}`;
  renderDodge();
}

function startDodgeGame() {
  if (dodgeRunning) {
    return;
  }

  if (dodgeGameOver) {
    resetDodgeGame();
  }

  dodgeRunning = true;
  dodgeStartedAt = dodgeStartedAt || Date.now();
  dodgeLastFrameTime = performance.now();
  dodgeRestartButton.textContent = "重新开始";
  dodgeStatusText.textContent = `${getDodgeDifficulty().label}难度：${text.dodgePlaying}`;
  dodgeAnimationId = window.requestAnimationFrame(updateDodgeFrame);
}

function stopDodgeLoop() {
  if (dodgeAnimationId) {
    window.cancelAnimationFrame(dodgeAnimationId);
    dodgeAnimationId = null;
  }
}

function updateDodgeFrame(timestamp) {
  if (!dodgeRunning) {
    return;
  }

  const delta = Math.min(2.4, (timestamp - dodgeLastFrameTime) / 16.67 || 1);
  dodgeLastFrameTime = timestamp;
  stepDodge(delta);
  renderDodge();

  if (dodgeGameOver) {
    finishDodgeGame();
    return;
  }

  dodgeAnimationId = window.requestAnimationFrame(updateDodgeFrame);
}

function stepDodge(delta) {
  dodgeElapsed = dodgeStartedAt ? (Date.now() - dodgeStartedAt) / 1000 : 0;
  updateDodgePlane(delta);
  dodgeNextSpawnIn -= delta * 16.67;

  while (dodgeNextSpawnIn <= 0) {
    spawnDodgeBullet();
    dodgeNextSpawnIn += getDodgeSpawnDelay();
  }

  dodgeBullets.forEach((bullet) => {
    bullet.x += bullet.vx * delta;
    bullet.y += bullet.vy * delta;
    bullet.life += delta;

    const distance = Math.hypot(bullet.x - dodgePlane.x, bullet.y - dodgePlane.y);

    if (distance < bullet.radius + dodgeSettings.planeRadius * 0.78) {
      dodgeGameOver = true;
    } else if (!bullet.grazed && distance < dodgeSettings.grazeRadius) {
      bullet.grazed = true;
      dodgeGrazes += 1;
      dodgeSparks.push({
        x: bullet.x,
        y: bullet.y,
        life: 20,
        size: 5 + Math.random() * 4,
      });
    }
  });

  dodgeBullets = dodgeBullets.filter(
    (bullet) =>
      bullet.x > -70 &&
      bullet.x < dodgeSettings.width + 70 &&
      bullet.y > -70 &&
      bullet.y < dodgeSettings.height + 70 &&
      bullet.life < 760,
  );

  dodgeSparks.forEach((spark) => {
    spark.life -= delta;
  });
  dodgeSparks = dodgeSparks.filter((spark) => spark.life > 0);
  dodgeTimeElement.textContent = formatDodgeTime(dodgeElapsed);
  dodgeGrazesElement.textContent = String(dodgeGrazes);
}

function updateDodgePlane(delta) {
  const difficulty = getDodgeDifficulty();
  let inputX = 0;
  let inputY = 0;

  if (dodgeKeys.has("left")) inputX -= 1;
  if (dodgeKeys.has("right")) inputX += 1;
  if (dodgeKeys.has("up")) inputY -= 1;
  if (dodgeKeys.has("down")) inputY += 1;

  if (inputX !== 0 || inputY !== 0) {
    const length = Math.hypot(inputX, inputY) || 1;
    dodgePlane.x += (inputX / length) * difficulty.planeSpeed * delta;
    dodgePlane.y += (inputY / length) * difficulty.planeSpeed * delta;
    dodgeTarget = { ...dodgePlane };
  } else {
    dodgePlane.x += (dodgeTarget.x - dodgePlane.x) * Math.min(1, 0.16 * delta);
    dodgePlane.y += (dodgeTarget.y - dodgePlane.y) * Math.min(1, 0.16 * delta);
  }

  const margin = dodgeSettings.planeRadius + 8;
  dodgePlane.x = Math.max(margin, Math.min(dodgeSettings.width - margin, dodgePlane.x));
  dodgePlane.y = Math.max(margin, Math.min(dodgeSettings.height - margin, dodgePlane.y));
}

function getDodgeSpawnDelay() {
  const difficulty = getDodgeDifficulty();
  const pressure = Math.min(1, dodgeElapsed / difficulty.pressureSeconds);
  return difficulty.baseSpawnMs - (difficulty.baseSpawnMs - difficulty.minSpawnMs) * pressure;
}

function spawnDodgeBullet() {
  const difficulty = getDodgeDifficulty();
  const side = Math.floor(Math.random() * 4);
  const margin = 32;
  let x = 0;
  let y = 0;

  if (side === 0) {
    x = Math.random() * dodgeSettings.width;
    y = -margin;
  } else if (side === 1) {
    x = dodgeSettings.width + margin;
    y = Math.random() * dodgeSettings.height;
  } else if (side === 2) {
    x = Math.random() * dodgeSettings.width;
    y = dodgeSettings.height + margin;
  } else {
    x = -margin;
    y = Math.random() * dodgeSettings.height;
  }

  const drift = 110 + Math.min(180, dodgeElapsed * 3.2);
  const targetX = dodgePlane.x + (Math.random() - 0.5) * drift;
  const targetY = dodgePlane.y + (Math.random() - 0.5) * drift;
  const angle = Math.atan2(targetY - y, targetX - x);
  const speed =
    difficulty.speedBase +
    Math.random() * difficulty.speedRandom +
    Math.min(2.75, dodgeElapsed * difficulty.speedGrowth);

  dodgeBullets.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: dodgeSettings.bulletRadius + Math.random() * 2.5,
    life: 0,
    grazed: false,
    hue: 18 + Math.random() * 28,
  });

  if (dodgeElapsed > difficulty.earlyBurstAfter && Math.random() < difficulty.doubleChance) {
    const offsetAngle = angle + (Math.random() > 0.5 ? 0.12 : -0.12);
    dodgeBullets.push({
      x,
      y,
      vx: Math.cos(offsetAngle) * (speed * 0.95),
      vy: Math.sin(offsetAngle) * (speed * 0.95),
      radius: dodgeSettings.bulletRadius,
      life: 0,
      grazed: false,
      hue: 42 + Math.random() * 16,
    });
  }
}

function finishDodgeGame() {
  stopDodgeLoop();
  dodgeRunning = false;
  dodgeRestartButton.textContent = "再来一局";
  dodgeStatusText.textContent = text.dodgeOver;

  if (dodgeElapsed > dodgeBest) {
    dodgeBest = dodgeElapsed;
    localStorage.setItem(dodgeBestKey, String(dodgeBest));
    dodgeBestElement.textContent = formatDodgeTime(dodgeBest);
    profileDodgeBest.textContent = formatDodgeTime(dodgeBest);
  }

  settleDodgeGame();
}

async function settleDodgeGame() {
  if (!hasAccount() || dodgeSettled) {
    return;
  }

  dodgeSettled = true;
  const seconds = Math.max(0, Math.round(dodgeElapsed * 10) / 10);

  try {
    const data = await apiRequest("/api/games/dodge/results", {
      method: "POST",
      body: JSON.stringify({
        gameId: dodgeGameId,
        seconds,
        grazes: dodgeGrazes,
        bestTime: dodgeBest,
      }),
    });

    renderAccount(data.profile);
    await refreshLeaderboard(data.leaderboard);
    dodgeStatusText.textContent = `本局坚持 ${formatDodgeTime(seconds)}，擦弹 ${dodgeGrazes} 次，获得 ${data.award.points} 积分。`;
  } catch (error) {
    dodgeStatusText.textContent = error.message;
    dodgeSettled = false;
  }
}

function renderDodge() {
  const context = dodgeContext;
  const width = dodgeSettings.width;
  const height = dodgeSettings.height;

  context.clearRect(0, 0, width, height);
  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#111827");
  sky.addColorStop(0.55, "#18314f");
  sky.addColorStop(1, "#0f1f28");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  drawDodgeGrid(context, width, height);
  drawDodgeBullets(context);
  drawDodgeSparks(context);
  drawDodgePlane(context);
  drawDodgeOverlay(context);
}

function drawDodgeGrid(context, width, height) {
  context.save();
  context.strokeStyle = "rgba(101, 214, 193, 0.12)";
  context.lineWidth = 1;

  for (let x = 32; x < width; x += 32) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  for (let y = 32; y < height; y += 32) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  context.restore();
}

function drawDodgeBullets(context) {
  dodgeBullets.forEach((bullet) => {
    const glow = context.createRadialGradient(
      bullet.x,
      bullet.y,
      0,
      bullet.x,
      bullet.y,
      bullet.radius * 3.2,
    );
    glow.addColorStop(0, `hsla(${bullet.hue}, 92%, 68%, 0.95)`);
    glow.addColorStop(0.42, `hsla(${bullet.hue}, 92%, 58%, 0.42)`);
    glow.addColorStop(1, `hsla(${bullet.hue}, 92%, 58%, 0)`);
    context.fillStyle = glow;
    context.beginPath();
    context.arc(bullet.x, bullet.y, bullet.radius * 3.2, 0, Math.PI * 2);
    context.fill();

    context.fillStyle = "#fff7d6";
    context.beginPath();
    context.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    context.fill();
  });
}

function drawDodgeSparks(context) {
  dodgeSparks.forEach((spark) => {
    context.globalAlpha = Math.max(0, spark.life / 20);
    context.strokeStyle = "#65d6c1";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(spark.x, spark.y, spark.size + (20 - spark.life) * 0.6, 0, Math.PI * 2);
    context.stroke();
    context.globalAlpha = 1;
  });
}

function drawDodgePlane(context) {
  const angle =
    dodgeKeys.has("left") && !dodgeKeys.has("right")
      ? -0.24
      : dodgeKeys.has("right") && !dodgeKeys.has("left")
        ? 0.24
        : 0;

  context.save();
  context.translate(dodgePlane.x, dodgePlane.y);
  context.rotate(angle);
  context.fillStyle = "rgba(101, 214, 193, 0.16)";
  context.beginPath();
  context.arc(0, 0, dodgeSettings.grazeRadius, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#65d6c1";
  context.beginPath();
  context.moveTo(0, -18);
  context.lineTo(15, 14);
  context.lineTo(0, 8);
  context.lineTo(-15, 14);
  context.closePath();
  context.fill();
  context.fillStyle = "#f4c542";
  context.beginPath();
  context.moveTo(0, -11);
  context.lineTo(5, 7);
  context.lineTo(0, 4);
  context.lineTo(-5, 7);
  context.closePath();
  context.fill();
  context.restore();
}

function drawDodgeOverlay(context) {
  context.fillStyle = "rgba(255, 255, 255, 0.92)";
  context.font = "900 26px Inter, Arial, sans-serif";
  context.textAlign = "left";
  context.fillText(formatDodgeTime(dodgeElapsed), 20, 38);
  context.font = "800 15px Inter, Arial, sans-serif";
  context.fillStyle = "rgba(255, 255, 255, 0.72)";
  context.fillText(`擦弹 ${dodgeGrazes}`, 20, 62);

  if (!dodgeRunning && !dodgeGameOver) {
    context.textAlign = "center";
    context.fillStyle = "rgba(255, 255, 255, 0.88)";
    context.font = "900 24px Inter, Arial, sans-serif";
    context.fillText("点击开始", dodgeSettings.width / 2, dodgeSettings.height * 0.48);
    context.font = "800 14px Inter, Arial, sans-serif";
    context.fillText("鼠标/触屏拖动，或 WASD/方向键移动", dodgeSettings.width / 2, dodgeSettings.height * 0.48 + 30);
  }

  if (dodgeGameOver) {
    context.fillStyle = "rgba(17, 24, 39, 0.68)";
    context.fillRect(162, 174, dodgeSettings.width - 324, 118);
    context.textAlign = "center";
    context.fillStyle = "#ffffff";
    context.font = "900 28px Inter, Arial, sans-serif";
    context.fillText("被击中了", dodgeSettings.width / 2, 220);
    context.font = "800 16px Inter, Arial, sans-serif";
    context.fillText(
      `坚持 ${formatDodgeTime(dodgeElapsed)} · 擦弹 ${dodgeGrazes}`,
      dodgeSettings.width / 2,
      252,
    );
  }
}

function setDodgeTargetFromPointer(event) {
  const rect = dodgeCanvas.getBoundingClientRect();
  const scaleX = dodgeSettings.width / rect.width;
  const scaleY = dodgeSettings.height / rect.height;
  dodgeTarget = {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function handleDodgePointerDown(event) {
  if (currentGame !== GAME_DODGE) {
    return;
  }

  event.preventDefault();
  dodgeCanvas.setPointerCapture(event.pointerId);
  if (event.pointerType !== "touch") {
    setDodgeTargetFromPointer(event);
  }
  startDodgeGame();
}

function handleDodgePointerMove(event) {
  if (currentGame !== GAME_DODGE || event.buttons === 0 || event.pointerType === "touch") {
    return;
  }

  event.preventDefault();
  setDodgeTargetFromPointer(event);
}

function setDodgeMoveButton(button, pressed) {
  const direction = button.dataset.dodgeMove;

  if (!direction) {
    return;
  }

  button.classList.toggle("is-pressed", pressed);

  if (pressed) {
    dodgeKeys.add(direction);
    startDodgeGame();
  } else {
    dodgeKeys.delete(direction);
  }
}

function preventDodgeButtonSelection(event) {
  event.preventDefault();
}

function getUntangleLayout() {
  return untangleLayoutQuery.matches ? untangleLayouts.mobile : untangleLayouts.desktop;
}

function scaleUntanglePoint(point, scaleX, scaleY) {
  return {
    ...point,
    x: point.x * scaleX,
    y: point.y * scaleY,
    solutionX: point.solutionX * scaleX,
    solutionY: point.solutionY * scaleY,
  };
}

function applyUntangleCanvasLayout(options = {}) {
  const layout = getUntangleLayout();
  const previousWidth = untangleSettings.width;
  const previousHeight = untangleSettings.height;
  const changed =
    previousWidth !== layout.width ||
    previousHeight !== layout.height ||
    untangleCanvas.width !== layout.width ||
    untangleCanvas.height !== layout.height;

  if (!changed) {
    return false;
  }

  untangleSettings.width = layout.width;
  untangleSettings.height = layout.height;
  untangleSettings.margin = layout.margin;
  untangleCanvas.width = layout.width;
  untangleCanvas.height = layout.height;
  untangleCanvas.classList.toggle("is-portrait", untangleLayoutQuery.matches);

  if (options.scaleExisting !== false && untangleNodes.length > 0) {
    const scaleX = layout.width / Math.max(1, previousWidth);
    const scaleY = layout.height / Math.max(1, previousHeight);
    untangleNodes = untangleNodes.map((node) => scaleUntanglePoint(node, scaleX, scaleY));
  }

  return true;
}

function handleUntangleLayoutChange() {
  const changed = applyUntangleCanvasLayout({ scaleExisting: true });

  if (changed && untangleNodes.length > 0) {
    renderUntangle();
  }
}

function getUntangleStatusText() {
  const difficulty = getUntangleDifficulty();

  if (untangleWon) {
    return text.untangleWin;
  }

  if (untangleGameOver) {
    return text.untangleLose;
  }

  return `${difficulty.label}难度：本局 ${untangleInitialCrossings || untangleCrossings} 处交叉，剩余 ${Math.max(0, untangleMovesLimit - untangleMovesUsed)} 步。`;
}

function getUntangleNodeRadius() {
  const count = untangleNodes.length || getUntangleDifficulty().nodes;

  if (count <= 10) return 17;
  if (count <= 20) return 13;
  if (count <= 30) return 10;
  return 7;
}

function getUntangleNodeFontSize() {
  const count = untangleNodes.length || getUntangleDifficulty().nodes;

  if (count <= 10) return 14;
  if (count <= 20) return 11;
  if (count <= 30) return 9;
  return 0;
}

function getUntangleEdgeWidth(isCrossing) {
  const count = untangleNodes.length || getUntangleDifficulty().nodes;

  if (count >= 50) {
    return isCrossing ? 1.55 : 0.85;
  }

  if (count >= 30) {
    return isCrossing ? 2 : 1.15;
  }

  if (count >= 20) {
    return isCrossing ? 2.5 : 1.5;
  }

  return isCrossing ? 3.4 : 2.2;
}

function updateUntangleStatsDisplay() {
  untangleCrossingsElement.textContent = String(untangleCrossings);
  untangleMovesElement.textContent = String(Math.max(0, untangleMovesLimit - untangleMovesUsed));
  untangleBestElement.textContent = String(untangleBest);
  untangleUndosElement.textContent = String(Math.max(0, untangleUndosLeft));
  untangleUndoButton.disabled =
    untangleGameOver ||
    untangleUndosLeft <= 0 ||
    untangleHistory.length === 0;
}

function cloneUntangleNodes(nodes = untangleNodes) {
  return nodes.map((node) => ({ ...node }));
}

function createUntangleSnapshot() {
  return {
    nodes: cloneUntangleNodes(),
    movesUsed: untangleMovesUsed,
    crossings: untangleCrossings,
    startedAt: untangleStartedAt,
  };
}

function restoreUntangleSnapshot(snapshot) {
  untangleNodes = cloneUntangleNodes(snapshot.nodes);
  untangleMovesUsed = snapshot.movesUsed;
  untangleCrossings = snapshot.crossings;
  untangleStartedAt = snapshot.startedAt;
}

function undoUntangleMove() {
  if (untangleGameOver || untangleUndosLeft <= 0 || untangleHistory.length === 0) {
    return;
  }

  const snapshot = untangleHistory.pop();
  restoreUntangleSnapshot(snapshot);
  untangleUndosLeft -= 1;
  untangleStatusText.textContent = `${getUntangleDifficulty().label}难度：已撤回一步，剩余 ${untangleUndosLeft} 次撤回。`;
  updateUntangleStatsDisplay();
  renderUntangle();
}

function getUntangleSolvedPositions(count) {
  const centerX = untangleSettings.width / 2;
  const centerY = untangleSettings.height / 2;
  const radiusX = untangleSettings.width / 2 - untangleSettings.margin;
  const radiusY = untangleSettings.height / 2 - untangleSettings.margin;

  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / count;

    return {
      x: centerX + Math.cos(angle) * radiusX,
      y: centerY + Math.sin(angle) * radiusY,
    };
  });
}

function getUntangleEdgeKey(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function shuffleUntangleItems(items) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function getUntangleOrientation(a, b, c) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function isUntanglePointOnSegment(a, b, c) {
  const epsilon = 0.0001;

  return (
    Math.min(a.x, c.x) - epsilon <= b.x &&
    b.x <= Math.max(a.x, c.x) + epsilon &&
    Math.min(a.y, c.y) - epsilon <= b.y &&
    b.y <= Math.max(a.y, c.y) + epsilon
  );
}

function doUntangleSegmentsIntersect(a, b, c, d) {
  const epsilon = 0.0001;
  const first = getUntangleOrientation(a, b, c);
  const second = getUntangleOrientation(a, b, d);
  const third = getUntangleOrientation(c, d, a);
  const fourth = getUntangleOrientation(c, d, b);

  if (Math.abs(first) < epsilon && isUntanglePointOnSegment(a, c, b)) return true;
  if (Math.abs(second) < epsilon && isUntanglePointOnSegment(a, d, b)) return true;
  if (Math.abs(third) < epsilon && isUntanglePointOnSegment(c, a, d)) return true;
  if (Math.abs(fourth) < epsilon && isUntanglePointOnSegment(c, b, d)) return true;

  return (
    (first > epsilon && second < -epsilon || first < -epsilon && second > epsilon) &&
    (third > epsilon && fourth < -epsilon || third < -epsilon && fourth > epsilon)
  );
}

function doUntangleEdgesCross(firstEdge, secondEdge, nodes) {
  if (
    firstEdge.a === secondEdge.a ||
    firstEdge.a === secondEdge.b ||
    firstEdge.b === secondEdge.a ||
    firstEdge.b === secondEdge.b
  ) {
    return false;
  }

  return doUntangleSegmentsIntersect(
    nodes[firstEdge.a],
    nodes[firstEdge.b],
    nodes[secondEdge.a],
    nodes[secondEdge.b],
  );
}

function canAddUntangleEdge(edges, candidate, positions) {
  return edges.every((edge) => !doUntangleEdgesCross(edge, candidate, positions));
}

function createUntangleEdges(count, targetEdges, positions) {
  const edges = [];
  const used = new Set();

  for (let index = 0; index < count; index += 1) {
    const next = (index + 1) % count;
    edges.push({ a: index, b: next });
    used.add(getUntangleEdgeKey(index, next));
  }

  const candidates = [];

  for (let a = 0; a < count; a += 1) {
    for (let b = a + 1; b < count; b += 1) {
      const key = getUntangleEdgeKey(a, b);

      if (!used.has(key)) {
        candidates.push({ a, b });
      }
    }
  }

  shuffleUntangleItems(candidates).forEach((candidate) => {
    if (edges.length >= targetEdges) {
      return;
    }

    if (canAddUntangleEdge(edges, candidate, positions)) {
      edges.push(candidate);
      used.add(getUntangleEdgeKey(candidate.a, candidate.b));
    }
  });

  return edges;
}

function getUntangleRandomScramblePoint(config) {
  const margin = untangleSettings.margin + 8;
  const centerX = untangleSettings.width / 2;
  const centerY = untangleSettings.height / 2;
  const centerBias =
    config.nodes >= 50
      ? 0.72
      : config.nodes >= 30
        ? 0.66
        : config.nodes >= 20
          ? 0.6
          : 0.5;

  if (Math.random() < centerBias) {
    const angle = Math.random() * Math.PI * 2;
    const radiusFactor = config.nodes >= 50 ? 0.4 : config.nodes >= 30 ? 0.37 : 0.34;
    const radius = Math.sqrt(Math.random()) * Math.min(untangleSettings.width, untangleSettings.height) * radiusFactor;

    return {
      x: Math.max(
        margin,
        Math.min(untangleSettings.width - margin, centerX + Math.cos(angle) * radius * 1.28),
      ),
      y: Math.max(
        margin,
        Math.min(untangleSettings.height - margin, centerY + Math.sin(angle) * radius * 0.92),
      ),
    };
  }

  return {
    x: margin + Math.random() * (untangleSettings.width - margin * 2),
    y: margin + Math.random() * (untangleSettings.height - margin * 2),
  };
}

function getUntangleMinimumNodeDistance(count) {
  if (count <= 10) return 48;
  if (count <= 20) return 30;
  if (count <= 30) return 22;
  return 15;
}

function createUntangleScrambledNodes(solvedPositions, config) {
  const count = solvedPositions.length;
  const minimumDistance = getUntangleMinimumNodeDistance(count);
  const points = [];

  for (let index = 0; index < count; index += 1) {
    let bestPoint = null;
    let bestDistance = -1;

    for (let attempt = 0; attempt < 90; attempt += 1) {
      const point = getUntangleRandomScramblePoint(config);
      const nearestDistance = points.length === 0
        ? Infinity
        : Math.min(...points.map((existing) => Math.hypot(existing.x - point.x, existing.y - point.y)));

      if (nearestDistance >= minimumDistance) {
        bestPoint = point;
        break;
      }

      if (nearestDistance > bestDistance) {
        bestPoint = point;
        bestDistance = nearestDistance;
      }
    }

    points.push(bestPoint);
  }

  return solvedPositions.map((position, index) => {
    const scrambled = points[index];

    return {
      id: index,
      x: scrambled.x,
      y: scrambled.y,
      solutionX: position.x,
      solutionY: position.y,
    };
  });
}

function getUntangleIntersectionPoint(a, b, c, d) {
  const denominator =
    (a.x - b.x) * (c.y - d.y) -
    (a.y - b.y) * (c.x - d.x);

  if (Math.abs(denominator) < 0.0001) {
    return {
      x: (a.x + b.x + c.x + d.x) / 4,
      y: (a.y + b.y + c.y + d.y) / 4,
    };
  }

  const first = a.x * b.y - a.y * b.x;
  const second = c.x * d.y - c.y * d.x;

  return {
    x: (first * (c.x - d.x) - (a.x - b.x) * second) / denominator,
    y: (first * (c.y - d.y) - (a.y - b.y) * second) / denominator,
  };
}

function getUntangleCrossingInfo(nodes = untangleNodes, edges = untangleEdges) {
  const crossingEdges = new Set();
  const points = [];
  let count = 0;

  for (let first = 0; first < edges.length; first += 1) {
    for (let second = first + 1; second < edges.length; second += 1) {
      const firstEdge = edges[first];
      const secondEdge = edges[second];

      if (!doUntangleEdgesCross(firstEdge, secondEdge, nodes)) {
        continue;
      }

      count += 1;
      crossingEdges.add(first);
      crossingEdges.add(second);

      if (points.length < 360) {
        points.push(
          getUntangleIntersectionPoint(
            nodes[firstEdge.a],
            nodes[firstEdge.b],
            nodes[secondEdge.a],
            nodes[secondEdge.b],
          ),
        );
      }
    }
  }

  return { count, crossingEdges, points };
}

function createUntanglePuzzle(config) {
  const solvedPositions = getUntangleSolvedPositions(config.nodes);
  const edges = createUntangleEdges(config.nodes, config.targetEdges, solvedPositions);
  const minimumCrossings = config.minCrossings || (config.nodes <= 6 ? 2 : config.nodes <= 9 ? 5 : 9);
  let bestNodes = [];
  let bestCrossings = -1;
  const attempts =
    config.nodes >= 50
      ? 150
      : config.nodes >= 30
        ? 190
        : config.nodes >= 20
          ? 210
          : 160;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const nodes = createUntangleScrambledNodes(solvedPositions, config);
    const crossings = getUntangleCrossingInfo(nodes, edges).count;

    if (crossings > bestCrossings) {
      bestNodes = nodes;
      bestCrossings = crossings;
    }

    if (crossings >= minimumCrossings && attempt > attempts * 0.72) {
      break;
    }
  }

  if (bestCrossings <= 0) {
    bestNodes = forceUntangleCrossing(bestNodes, edges);
    bestCrossings = getUntangleCrossingInfo(bestNodes, edges).count;
  }

  return {
    nodes: bestNodes,
    edges,
    crossings: Math.max(0, bestCrossings),
  };
}

function calculateUntangleMoveLimit(config, puzzle) {
  const crossings = Math.max(0, puzzle.crossings || 0);
  const crossingRatio = config.minCrossings > 0 ? crossings / config.minCrossings : 1;
  const extraCrossingMoves = Math.ceil(Math.max(0, crossingRatio - 1) * config.baseMoves * 0.34);
  const density = puzzle.edges.length / Math.max(1, puzzle.nodes.length);
  const densityMoves = Math.ceil(Math.max(0, density - 1.75) * config.nodes * 0.18);
  const rawMoves = config.baseMoves + extraCrossingMoves + densityMoves;

  return Math.max(config.minMoves, Math.min(config.maxMoves, rawMoves));
}

function forceUntangleCrossing(nodes, edges) {
  const result = nodes.map((node) => ({ ...node }));
  const centerX = untangleSettings.width / 2;
  const centerY = untangleSettings.height / 2;
  const offsetX = untangleSettings.width * 0.24;
  const offsetY = untangleSettings.height * 0.24;

  for (let first = 0; first < edges.length; first += 1) {
    for (let second = first + 1; second < edges.length; second += 1) {
      const firstEdge = edges[first];
      const secondEdge = edges[second];
      const shared =
        firstEdge.a === secondEdge.a ||
        firstEdge.a === secondEdge.b ||
        firstEdge.b === secondEdge.a ||
        firstEdge.b === secondEdge.b;

      if (shared) {
        continue;
      }

      result[firstEdge.a] = { ...result[firstEdge.a], x: centerX - offsetX, y: centerY - offsetY };
      result[firstEdge.b] = { ...result[firstEdge.b], x: centerX + offsetX, y: centerY + offsetY };
      result[secondEdge.a] = { ...result[secondEdge.a], x: centerX + offsetX, y: centerY - offsetY };
      result[secondEdge.b] = { ...result[secondEdge.b], x: centerX - offsetX, y: centerY + offsetY };
      return result;
    }
  }

  return result;
}

function startUntangleGame(options = {}) {
  if (options.settlePrevious !== false) {
    settleUntangleGame("restart");
  }

  applyUntangleCanvasLayout({ scaleExisting: false });
  const difficulty = getUntangleDifficulty();
  const puzzle = createUntanglePuzzle(difficulty);
  untangleGameId = createGameId();
  untangleNodes = puzzle.nodes;
  untangleEdges = puzzle.edges;
  untangleCrossings = puzzle.crossings;
  untangleInitialCrossings = puzzle.crossings;
  untangleMovesUsed = 0;
  untangleMovesLimit = calculateUntangleMoveLimit(difficulty, puzzle);
  untangleUndoLimit = difficulty.undoLimit;
  untangleUndosLeft = difficulty.undoLimit;
  untangleHistory = [];
  untangleDragSnapshot = null;
  untangleStartedAt = 0;
  untangleGameOver = false;
  untangleWon = false;
  untangleSettled = false;
  untangleDragNode = null;
  untangleDragPointerId = null;
  untangleRestartButton.textContent = "重新开局";
  untangleStatusText.textContent = getUntangleStatusText();
  updateUntangleStatsDisplay();
  renderUntangle();
}

function renderUntangle() {
  const context = untangleContext;
  const width = untangleSettings.width;
  const height = untangleSettings.height;
  const crossingInfo = getUntangleCrossingInfo();
  untangleCrossings = crossingInfo.count;
  updateUntangleStatsDisplay();

  context.clearRect(0, 0, width, height);
  drawUntangleBackground(context, width, height);
  drawUntangleEdges(context, crossingInfo.crossingEdges);
  drawUntangleCrossings(context, crossingInfo.points);
  drawUntangleNodes(context);
  drawUntangleOverlay(context);
}

function drawUntangleBackground(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#f8faf6");
  gradient.addColorStop(1, "#edf3f2");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "rgba(24, 33, 42, 0.06)";
  context.lineWidth = 1;

  for (let x = 40; x < width; x += 40) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  for (let y = 40; y < height; y += 40) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
}

function drawUntangleEdges(context, crossingEdges) {
  untangleEdges.forEach((edge, index) => {
    const start = untangleNodes[edge.a];
    const end = untangleNodes[edge.b];
    const isCrossing = crossingEdges.has(index);

    context.strokeStyle = isCrossing ? "rgba(186, 63, 74, 0.86)" : "rgba(24, 124, 104, 0.52)";
    context.lineWidth = getUntangleEdgeWidth(isCrossing);
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  });
}

function drawUntangleCrossings(context, points) {
  const markerRadius = untangleNodes.length >= 50 ? 2.2 : untangleNodes.length >= 30 ? 3 : 4.5;
  context.fillStyle = "rgba(186, 63, 74, 0.9)";

  points.forEach((point) => {
    context.beginPath();
    context.arc(point.x, point.y, markerRadius, 0, Math.PI * 2);
    context.fill();
  });
}

function drawUntangleNodes(context) {
  const baseRadius = getUntangleNodeRadius();
  const fontSize = getUntangleNodeFontSize();

  untangleNodes.forEach((node) => {
    const isDragging = untangleDragNode === node.id;
    const radius = baseRadius + (isDragging ? Math.max(2, baseRadius * 0.26) : 0);

    context.save();
    context.shadowColor = "rgba(24, 33, 42, 0.18)";
    context.shadowBlur = isDragging ? 14 : Math.max(4, baseRadius * 0.5);
    context.shadowOffsetY = Math.max(2, baseRadius * 0.22);
    context.fillStyle = untangleWon ? "#dff4eb" : "#ffffff";
    context.strokeStyle = isDragging ? "#d68631" : "#187c68";
    context.lineWidth = isDragging ? Math.max(2.5, baseRadius * 0.26) : Math.max(1.5, baseRadius * 0.18);
    context.beginPath();
    context.arc(node.x, node.y, radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();

    if (fontSize > 0) {
      context.fillStyle = "#18212a";
      context.font = `900 ${fontSize}px Inter, Arial, sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(String(node.id + 1), node.x, node.y + 0.5);
    }
  });
}

function drawUntangleOverlay(context) {
  if (!untangleGameOver) {
    return;
  }

  context.fillStyle = "rgba(24, 33, 42, 0.68)";
  context.fillRect(untangleSettings.width / 2 - 170, untangleSettings.height / 2 - 58, 340, 116);
  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "900 28px Inter, Arial, sans-serif";
  context.fillText(untangleWon ? "解开了" : "步数用完", untangleSettings.width / 2, untangleSettings.height / 2 - 16);
  context.font = "800 16px Inter, Arial, sans-serif";
  context.fillText(
    untangleWon
      ? `用了 ${untangleMovesUsed} 步，剩余 ${Math.max(0, untangleMovesLimit - untangleMovesUsed)} 步`
      : `还剩 ${untangleCrossings} 处交叉`,
    untangleSettings.width / 2,
    untangleSettings.height / 2 + 22,
  );
}

function getUntangleCanvasPoint(event) {
  const rect = untangleCanvas.getBoundingClientRect();

  return {
    x: ((event.clientX - rect.left) / rect.width) * untangleSettings.width,
    y: ((event.clientY - rect.top) / rect.height) * untangleSettings.height,
  };
}

function getUntangleNodeAt(point) {
  const pickRadius = Math.max(18, getUntangleNodeRadius() + 11);
  let closest = null;
  let closestDistance = Infinity;

  untangleNodes.forEach((node) => {
    const distance = Math.hypot(node.x - point.x, node.y - point.y);

    if (distance <= pickRadius && distance < closestDistance) {
      closest = node;
      closestDistance = distance;
    }
  });

  return closest;
}

function clampUntangleNode(point) {
  const margin = getUntangleNodeRadius() + 8;

  return {
    x: Math.max(margin, Math.min(untangleSettings.width - margin, point.x)),
    y: Math.max(margin, Math.min(untangleSettings.height - margin, point.y)),
  };
}

function handleUntanglePointerDown(event) {
  if (currentGame !== GAME_UNTANGLE || untangleGameOver) {
    return;
  }

  const point = getUntangleCanvasPoint(event);
  const node = getUntangleNodeAt(point);

  if (!node) {
    return;
  }

  event.preventDefault();
  untangleCanvas.setPointerCapture(event.pointerId);
  untangleDragNode = node.id;
  untangleDragPointerId = event.pointerId;
  untangleDragStartX = node.x;
  untangleDragStartY = node.y;
  untangleDidMove = false;
  untangleDragSnapshot = createUntangleSnapshot();
  untangleStartedAt = untangleStartedAt || Date.now();
  renderUntangle();
}

function handleUntanglePointerMove(event) {
  if (
    currentGame !== GAME_UNTANGLE ||
    untangleDragPointerId !== event.pointerId ||
    untangleDragNode === null
  ) {
    return;
  }

  event.preventDefault();
  const node = untangleNodes[untangleDragNode];
  const point = clampUntangleNode(getUntangleCanvasPoint(event));
  node.x = point.x;
  node.y = point.y;
  untangleDidMove =
    untangleDidMove ||
    Math.hypot(node.x - untangleDragStartX, node.y - untangleDragStartY) > 4;
  renderUntangle();
}

function handleUntanglePointerUp(event) {
  if (untangleDragPointerId !== event.pointerId || untangleDragNode === null) {
    return;
  }

  event.preventDefault();
  const moved = untangleDidMove;
  untangleDragNode = null;
  untangleDragPointerId = null;

  if (moved && !untangleGameOver) {
    if (untangleDragSnapshot) {
      untangleHistory.push(untangleDragSnapshot);
      untangleHistory = untangleHistory.slice(-Math.max(1, untangleUndoLimit));
    }

    untangleMovesUsed += 1;
    checkUntangleGameState();
  }

  untangleDragSnapshot = null;
  renderUntangle();
}

function handleUntanglePointerCancel(event) {
  if (untangleDragPointerId !== event.pointerId) {
    return;
  }

  untangleDragNode = null;
  untangleDragPointerId = null;
  untangleDragSnapshot = null;
  renderUntangle();
}

function checkUntangleGameState() {
  untangleCrossings = getUntangleCrossingInfo().count;

  if (untangleCrossings === 0) {
    finishUntangleGame(true);
    return;
  }

  if (untangleMovesUsed >= untangleMovesLimit) {
    finishUntangleGame(false);
    return;
  }

  untangleStatusText.textContent = getUntangleStatusText();
  updateUntangleStatsDisplay();
}

function finishUntangleGame(wonGame) {
  untangleGameOver = true;
  untangleWon = wonGame;
  untangleRestartButton.textContent = "再来一局";

  if (wonGame) {
    const movesLeft = Math.max(0, untangleMovesLimit - untangleMovesUsed);

    if (movesLeft > untangleBest) {
      untangleBest = movesLeft;
      localStorage.setItem(untangleBestKey, String(untangleBest));
    }
  }

  untangleStatusText.textContent = wonGame ? text.untangleWin : text.untangleLose;
  updateUntangleStatsDisplay();
  settleUntangleGame(wonGame ? "won" : "lost");
}

async function settleUntangleGame(reason) {
  if (!hasAccount() || untangleSettled || untangleMovesUsed === 0) {
    return;
  }

  untangleSettled = true;
  const seconds = untangleStartedAt ? Math.floor((Date.now() - untangleStartedAt) / 1000) : 0;

  try {
    const data = await apiRequest("/api/games/untangle/results", {
      method: "POST",
      body: JSON.stringify({
        gameId: untangleGameId,
        won: untangleWon,
        difficulty: untangleDifficulty,
        movesUsed: untangleMovesUsed,
        movesLimit: untangleMovesLimit,
        intersections: untangleCrossings,
        initialIntersections: untangleInitialCrossings,
        seconds,
        nodes: untangleNodes.length,
        edges: untangleEdges.length,
        reason,
      }),
    });

    renderAccount(data.profile);
    await refreshLeaderboard(data.leaderboard);
    untangleStatusText.textContent = untangleWon
      ? `全部绳索已解开，获得 ${data.award.points} 积分。`
      : `本局剩余 ${untangleCrossings} 处交叉，获得 ${data.award.points} 积分。`;
  } catch (error) {
    untangleStatusText.textContent = error.message;
    untangleSettled = false;
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
  mineModelSpace.style.setProperty("--mine-model-scale", String(mineModelScale));
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
  return createMineCubeWithOptions(layer, row, column, cell, config, cubeSize, {});
}

function createMineCubeWithOptions(layer, row, column, cell, config, cubeSize, options = {}) {
  const cube = document.createElement("button");
  const faceNames =
    options.faceNames ||
    ["front", "back", "right", "left", "top", "bottom"];

  cube.type = "button";
  cube.className = options.baseClass || "mine-cube";
  cube.tabIndex = options.interactive === false ? -1 : 0;
  cube.setAttribute("aria-hidden", options.interactive === false ? "true" : "false");

  faceNames.forEach((faceName) => {
    const face = document.createElement("span");
    face.className = `cube-face cube-${faceName}`;
    cube.appendChild(face);
  });

  updateMineCube(cube, layer, row, column, cell, config, cubeSize, options);

  return cube;
}

function updateMineCube(cube, layer, row, column, cell, config, cubeSize, options = {}) {
  const revealAllMines = mineGameOver && !mineGameWon;
  const mark = getMineCellMark(cell, revealAllMines);
  const position = getMineCubePosition(layer, row, column, config, cubeSize);
  let ariaLabel = `第 ${layer + 1} 层 第 ${row + 1} 行 第 ${column + 1} 列`;

  cube.className = options.baseClass || "mine-cube";
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
  cube.classList.toggle("is-open", Boolean(cell.open));

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

  if (options.interactive === false) {
    cube.tabIndex = -1;
    cube.setAttribute("aria-hidden", "true");
    cube.removeAttribute("aria-label");
    return;
  }

  cube.setAttribute("aria-label", ariaLabel);
}

function renderMinesweeperLayerBoard(config) {
  mineLayerView = Math.max(0, Math.min(config.layers - 1, mineLayerView));
  const tabs = mineModelStage.querySelector("#mine-layer-tabs");
  const board = mineModelStage.querySelector("#mine-layer-board");
  const neighbors = mineModelStage.querySelector("#mine-neighbor-layers");

  if (!tabs || !board || !neighbors) {
    setupMinesweeperMarkup();
    renderMinesweeperLayerBoard(config);
    return;
  }

  tabs.innerHTML = "";
  board.innerHTML = "";
  neighbors.innerHTML = "";
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

  renderMineNeighborLayers(config, neighbors);
}

function renderMineNeighborLayers(config, container) {
  const neighborLayers = [
    { layer: mineLayerView - 1, label: "上一层" },
    { layer: mineLayerView + 1, label: "下一层" },
  ].filter(({ layer }) => layer >= 0 && layer < config.layers);

  container.hidden = neighborLayers.length === 0;

  neighborLayers.forEach(({ layer, label }) => {
    const panel = document.createElement("section");
    const title = document.createElement("button");
    const preview = document.createElement("div");
    const layerCells = mineBoard[layer]?.flat().filter((cell) => cell.active) || [];
    const layerFlags = layerCells.filter((cell) => cell.flagged).length;
    const layerOpen = layerCells.filter((cell) => cell.open).length;

    panel.className = "mine-neighbor-panel";
    title.type = "button";
    title.className = "mine-neighbor-title";
    title.textContent = `${label} ${layer + 1}/${config.layers} · ${layerOpen}/${layerCells.length}${layerFlags ? ` · 旗${layerFlags}` : ""}`;
    title.addEventListener("click", () => {
      mineLayerView = layer;
      renderMinesweeperBoard();
    });

    preview.className = "mine-neighbor-board";
    preview.style.setProperty("--mine-layer-cols", String(config.cols));

    for (let row = 0; row < config.rows; row += 1) {
      for (let column = 0; column < config.cols; column += 1) {
        const cell = getMineCell(layer, row, column);
        const item = document.createElement("span");

        item.className = "mine-layer-cell mine-neighbor-cell";
        item.setAttribute("aria-hidden", "true");
        updateMineLayerCell(item, layer, row, column, cell);
        item.classList.add("mine-neighbor-cell");
        item.removeAttribute("aria-label");
        item.removeAttribute("disabled");
        preview.appendChild(item);
      }
    }

    panel.appendChild(title);
    panel.appendChild(preview);
    container.appendChild(panel);
  });
}

function updateMineLayerCell(button, layer, row, column, cell) {
  const revealAllMines = mineGameOver && !mineGameWon;
  const mark = cell ? getMineCellMark(cell, revealAllMines) : { type: "none", text: "" };
  let ariaLabel = `第 ${layer + 1} 层 第 ${row + 1} 行 第 ${column + 1} 列`;

  button.className = "mine-layer-cell";
  button.textContent = mark.type === "number" ? mark.text : "";

  if ("disabled" in button) {
    button.disabled = !cell?.active;
  }

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

  recalculateMineAdjacency(config);
  renderMinesweeperBoard();
}

function recalculateMineAdjacency(config = getMineDifficulty()) {
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

function protectFirstMineClick(layer, row, column) {
  const firstCell = getMineCell(layer, row, column);

  if (mineStartedAt || !firstCell?.active || !firstCell.mine) {
    return;
  }

  const candidates = [];

  mineBoard.forEach((mineLayer, layerIndex) => {
    mineLayer.forEach((mineRow, rowIndex) => {
      mineRow.forEach((cell, columnIndex) => {
        if (
          cell.active &&
          !cell.mine &&
          (layerIndex !== layer || rowIndex !== row || columnIndex !== column)
        ) {
          candidates.push({ layer: layerIndex, row: rowIndex, column: columnIndex, cell });
        }
      });
    });
  });

  if (candidates.length === 0) {
    return;
  }

  const replacement = candidates[Math.floor(Math.random() * candidates.length)];
  firstCell.mine = false;
  replacement.cell.mine = true;
  recalculateMineAdjacency();
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
  const renderMode = mineLightMode ? "mobile" : "desktop";

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

  protectFirstMineClick(layer, row, column);

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
  const button = target.closest(".mine-layer-cell, .mine-cube");

  if (
    !button ||
    button.classList.contains("mine-neighbor-cell")
  ) {
    return null;
  }

  return button;
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

function handleMineModelWheel(event) {
  if (mineLightMode || currentGame !== GAME_MINESWEEPER) {
    return;
  }

  event.preventDefault();

  const direction = event.deltaY > 0 ? -1 : 1;
  const step = event.ctrlKey ? 0.08 : 0.12;
  mineModelScale = Math.max(0.62, Math.min(1.85, mineModelScale + direction * step));
  applyMineModelRotation();
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
  scheduleDuelRender();
  updateDuelStatus();
});

socket.on("duel:update", (state) => {
  duelState = state;
  duelSide = getDuelSide();
  scheduleDuelRender();
  updateDuelStatus();
});

socket.on("duel:ended", async (payload = {}) => {
  duelState = payload.state || duelState;
  duelSide = getDuelSide();
  scheduleDuelRender();
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
announcementToggle.addEventListener("click", () => toggleInfoPanel(announcementPanel, announcementToggle));
leaderboardToggle.addEventListener("click", () => toggleInfoPanel(leaderboardPanel, leaderboardToggle));
changelogToggle.addEventListener("click", () => toggleInfoPanel(changelogPanel, changelogToggle));
announcementPanel.addEventListener("click", (event) => {
  if (event.target === announcementPanel) {
    closeInfoPanels();
  }
});
leaderboardPanel.addEventListener("click", (event) => {
  if (event.target === leaderboardPanel) {
    closeInfoPanels();
  }
});
changelogPanel.addEventListener("click", (event) => {
  if (event.target === changelogPanel) {
    closeInfoPanels();
  }
});
panelCloseButtons.forEach((button) => {
  button.addEventListener("click", () => closeInfoPanelFromButton(button));
});
restartButton.addEventListener("click", () => start2048Game());
mineRestartButton.addEventListener("click", () => startMinesweeperGame());
mineExpandButton.addEventListener("click", toggleMineModelExpanded);
mineDifficultySelect.addEventListener("change", () => {
  setMineDifficulty(mineDifficultySelect.value);
});
dodgeDifficultySelect.addEventListener("change", () => {
  setDodgeDifficulty(dodgeDifficultySelect.value);
});
untangleDifficultySelect.addEventListener("change", () => {
  setUntangleDifficulty(untangleDifficultySelect.value);
});
flappyRestartButton.addEventListener("click", () => {
  if (flappyRunning) {
    resetFlappyGame();
    return;
  }

  startFlappyGame();
});
fruitRestartButton.addEventListener("click", () => {
  resetFruitGame();
});
dodgeRestartButton.addEventListener("click", () => {
  if (dodgeRunning) {
    resetDodgeGame();
    return;
  }

  startDodgeGame();
});
untangleRestartButton.addEventListener("click", () => {
  startUntangleGame();
});
untangleUndoButton.addEventListener("click", undoUntangleMove);
duelStartButton.addEventListener("click", requestDuelStart);
duelServeButton.addEventListener("click", requestDuelServe);
messageButton.addEventListener("click", hideMessageAndContinue);
messageSecondaryButton.addEventListener("click", settleAndRestart2048);
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
fruitCanvas.addEventListener("pointerdown", handleFruitPointerDown);
fruitCanvas.addEventListener("pointermove", handleFruitPointerMove);
fruitCanvas.addEventListener("pointerup", handleFruitPointerUp);
fruitCanvas.addEventListener("pointercancel", handleFruitPointerCancel);
dodgeCanvas.addEventListener("pointerdown", handleDodgePointerDown);
dodgeCanvas.addEventListener("pointermove", handleDodgePointerMove);
dodgeCanvas.addEventListener("pointerup", () => {
  dodgeTarget = { ...dodgePlane };
});
dodgeCanvas.addEventListener("pointercancel", () => {
  dodgeTarget = { ...dodgePlane };
});
dodgeMoveButtons.forEach((button) => {
  button.addEventListener("contextmenu", preventDodgeButtonSelection);
  button.addEventListener("selectstart", preventDodgeButtonSelection);
  button.addEventListener("touchstart", preventDodgeButtonSelection, { passive: false });
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    setDodgeMoveButton(button, true);
  });
  button.addEventListener("pointerup", () => setDodgeMoveButton(button, false));
  button.addEventListener("pointerleave", () => setDodgeMoveButton(button, false));
  button.addEventListener("pointercancel", () => setDodgeMoveButton(button, false));
});
untangleCanvas.addEventListener("pointerdown", handleUntanglePointerDown);
untangleCanvas.addEventListener("pointermove", handleUntanglePointerMove);
untangleCanvas.addEventListener("pointerup", handleUntanglePointerUp);
untangleCanvas.addEventListener("pointercancel", handleUntanglePointerCancel);
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

  button.addEventListener("contextmenu", preventDodgeButtonSelection);
  button.addEventListener("selectstart", preventDodgeButtonSelection);
  button.addEventListener("touchstart", preventDodgeButtonSelection, { passive: false });
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
mineModelStage.addEventListener("wheel", handleMineModelWheel, { passive: false });
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
if (typeof untangleLayoutQuery.addEventListener === "function") {
  untangleLayoutQuery.addEventListener("change", handleUntangleLayoutChange);
} else {
  untangleLayoutQuery.addListener(handleUntangleLayoutChange);
}
window.addEventListener("resize", () => {
  if (mineBoard.length > 0) {
    renderMinesweeperBoard();
  }

  handleUntangleLayoutChange();
});

setupBoardMarkup();
renderAnnouncements();
renderChangelog();
applyUntangleCanvasLayout({ scaleExisting: false });
mineDifficultySelect.value = mineDifficulty;
dodgeDifficultySelect.value = dodgeDifficulty;
untangleDifficultySelect.value = untangleDifficulty;
setupMinesweeperMarkup();
board = createEmptyBoard();
mineBoard = createMineBoard();
initializeMinesweeperBoard();
resetFlappyGame();
resetFruitGame();
resetDodgeGame();
startUntangleGame({ notify: false, settlePrevious: false });
renderDuel();
start2048Game({ notify: false, settlePrevious: false });
loadSession();
