// Load saved score
let savedScores = JSON.parse(localStorage.getItem("scores"));
let scores = savedScores || { X: 0, O: 0, draw: 0 };

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");

// 🎵 Sound
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playClick() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 400;
  gain.gain.value = 0.2;
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function playWin() {
  [500,700,900].forEach((freq,i)=>{
    setTimeout(()=>{
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = freq;
      gain.gain.value = 0.2;
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    }, i*150);
  });
}

function playDraw() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.frequency.value = 200;
  gain.gain.value = 0.2;
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}

// Create Board
function createBoard() {
  boardElement.innerHTML = "";

  board.forEach((cell, index) => {
    const div = document.createElement("div");
    div.classList.add("cell");
    div.setAttribute("data-index", index);
    div.innerText = cell;

    div.addEventListener("click", handleClick);
    boardElement.appendChild(div);
  });
}

// Handle Click
function handleClick() {
  const index = this.getAttribute("data-index");

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  this.innerText = currentPlayer;
  this.classList.add(currentPlayer === "X" ? "x" : "o");

  playClick();
  checkWinner();
}

// Check Winner
function checkWinner() {
  let winner = null;

  winConditions.forEach(condition => {
    const [a,b,c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
    }
  });

  if (winner) {
    statusText.innerText = winner + " Wins!";
    scores[winner]++;
    updateScore();
    playWin();
    gameActive = false;
    return;
  }

  if (!board.includes("")) {
    statusText.innerText = "Draw!";
    scores.draw++;
    updateScore();
    playDraw();
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.innerText = "Player " + currentPlayer + "'s Turn";
}

// Update Score + Save
function updateScore() {
  document.getElementById("scoreX").innerText = scores.X;
  document.getElementById("scoreO").innerText = scores.O;
  document.getElementById("scoreDraw").innerText = scores.draw;

  localStorage.setItem("scores", JSON.stringify(scores));
}

// Restart Game
function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.innerText = "Player X's Turn";
  createBoard();
}

// Reset Score
function resetScore() {
  scores = { X: 0, O: 0, draw: 0 };
  localStorage.removeItem("scores");
  updateScore();
}

// Start Game
createBoard();
updateScore();