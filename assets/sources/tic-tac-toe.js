const statusDisplay = document.querySelector(".gameStatus");

let gameActive = true;
let currentPlayer = "Player1";
let currentSymbol = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let restart = document.querySelector(".gameRestart");
let cell = document.querySelectorAll(".cell");

const winningMessage = () => `Congratulations! ${currentPlayer} wins`;
const drawMessage = () => `Draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerText = currentPlayerTurn();

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentSymbol;
  clickedCell.innerText = currentSymbol;
}

function handlePlayerChange() {
  currentSymbol = currentSymbol === "X" ? "O" : "X";
  currentPlayer = currentPlayer === "Player1" ? "Player2" : "Player1";
  statusDisplay.innerText = currentPlayerTurn();
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];
    if (a === "" || b === "" || c === "") {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    alert(statusDisplay.innerText = winningMessage());
    gameActive = false;
    return;
  }

  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    alert(statusDisplay.innerText = drawMessage());
    gameActive = false;
    return;
  }

  handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = "Player1";
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.innerText = currentPlayerTurn();
  cell.forEach((cell) => (cell.innerHTML = ""));
}

cell.forEach((cell) => cell.addEventListener("click", handleCellClick));
restart.addEventListener("click", handleRestartGame);