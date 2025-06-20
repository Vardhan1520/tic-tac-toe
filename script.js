const gameBoard = document.getElementById("gameBoard");
const statusText = document.getElementById("statusText");
const restartBtn = document.getElementById("restartBtn");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; // Player = X, AI = O
let running = true;

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

function init() {
  gameBoard.innerHTML = "";
  board.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = index;
    cell.addEventListener("click", handlePlayerMove);
    gameBoard.appendChild(cell);
  });
  statusText.textContent = "Your turn (X)";
}

function handlePlayerMove(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !running) return;

  makeMove(index, "X");
  e.target.classList.add("played");

  if (checkWinner("X")) return;
  if (board.includes("")) {
    setTimeout(() => aiMove(), 500); // delay for realism
  }
}

function makeMove(index, player) {
  board[index] = player;
  const cell = gameBoard.querySelector(`[data-index="${index}"]`);
  cell.textContent = player;
  cell.classList.add("played");
}

function aiMove() {
  const bestMove = minimax(board, "O").index;
  makeMove(bestMove, "O");
  checkWinner("O");
}

function checkWinner(player) {
  let won = false;
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] === player && board[b] === player && board[c] === player) {
      won = true;
      break;
    }
  }

  if (won) {
    statusText.textContent = `${player === "X" ? "You win!" : "AI wins!"}`;
    running = false;
    return true;
  } else if (!board.includes("")) {
    statusText.textContent = "It's a draw!";
    running = false;
    return true;
  } else {
    statusText.textContent = `${player === "X" ? "AI's turn (O)" : "Your turn (X)"}`;
    return false;
  }
}

function minimax(newBoard, player) {
  const availSpots = newBoard.map((val, i) => val === "" ? i : null).filter(v => v !== null);

  if (checkWin(newBoard, "X")) return { score: -10 };
  if (checkWin(newBoard, "O")) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === "O") {
      const result = minimax(newBoard, "X");
      move.score = result.score;
    } else {
      const result = minimax(newBoard, "O");
      move.score = result.score;
    }

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === "O") {
    let bestScore = -Infinity;
    moves.forEach((m, i) => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((m, i) => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}

function checkWin(board, player) {
  return winPatterns.some(([a, b, c]) => board[a] === player && board[b] === player && board[c] === player);
}

restartBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  running = true;
  init();
});

init();
