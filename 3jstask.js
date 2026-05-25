"use strict";
let currentPlayer = "X";
let boardState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let isAiMode = false;
const statusText = document.getElementById("status");
const cells = document.querySelectorAll(".cell");
const resetBtn = document.getElementById("reset");
const winLineSvg = document.getElementById("win-line-svg");
const winLine = document.getElementById("win-line");
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6] // Diagonals
];
// Fixed coordinates for 320x320 grid (100px cells + 10px gaps)
const lineCoords = {
    "0,1,2": [10, 50, 310, 50],
    "3,4,5": [10, 160, 310, 160],
    "6,7,8": [10, 270, 310, 270],
    "0,3,6": [50, 10, 50, 310],
    "1,4,7": [160, 10, 160, 310],
    "2,5,8": [270, 10, 270, 310],
    "0,4,8": [20, 20, 300, 300],
    "2,4,6": [300, 20, 20, 300]
};
// Mode Selection
const modeRadios = document.querySelectorAll('input[name="gameMode"]');
modeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        isAiMode = e.target.value === "ai";
        reset();
    });
});
function handleCellClick(e) {
    const clickedCell = e.target;
    const cellIndex = parseInt(clickedCell.getAttribute("data-index"));
    if (boardState[cellIndex] !== "" || !gameActive)
        return;
    if (isAiMode && currentPlayer === "O")
        return; // Block clicking during AI turn
    makeMove(cellIndex, currentPlayer);
    if (gameActive && isAiMode && currentPlayer === "O") {
        setTimeout(computerMove, 600);
    }
}
function makeMove(index, player) {
    boardState[index] = player;
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    checkResult();
}
function computerMove() {
    if (!gameActive)
        return;
    const availableMoves = boardState
        .map((val, idx) => (val === "" ? idx : null))
        .filter((val) => val !== null);
    if (availableMoves.length > 0) {
        const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        makeMove(randomIndex, "O");
    }
}
function checkResult() {
    let roundWon = false;
    let winningPattern = [];
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            winningPattern = condition;
            break;
        }
    }
    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
        drawWinLine(winningPattern);
        gameActive = false;
        return;
    }
    if (!boardState.includes("")) {
        statusText.textContent = "It's a Draw! 🤝";
        gameActive = false;
        return;
    }
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = (isAiMode && currentPlayer === "O") ? "AI is thinking..." : `Player ${currentPlayer}'s Turn`;
}
function drawWinLine(condition) {
    const key = condition.join(",");
    const coords = lineCoords[key];
    winLine.setAttribute("x1", coords[0].toString());
    winLine.setAttribute("y1", coords[1].toString());
    winLine.setAttribute("x2", coords[2].toString());
    winLine.setAttribute("y2", coords[3].toString());
    winLineSvg.style.display = "block";
}
function reset() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    winLineSvg.style.display = "none";
    statusText.textContent = "Player X's Turn";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("x", "o");
    });
}
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", reset);
