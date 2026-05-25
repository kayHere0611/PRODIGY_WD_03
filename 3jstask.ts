export {};

type Player = "X" | "O";
let currentPlayer: Player = "X";
let boardState: string[] = ["", "", "", "", "", "", "", "", ""];
let gameActive: boolean = true;
let isAiMode: boolean = false;

const statusText = document.getElementById("status") as HTMLElement;
const cells = document.querySelectorAll(".cell");
const resetBtn = document.getElementById("reset") as HTMLButtonElement;
const winLineSvg = document.getElementById("win-line-svg") as HTMLElement;
const winLine = document.getElementById("win-line") as unknown as SVGLineElement;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];


const lineCoords: { [key: string]: number[] } = {
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
        isAiMode = (e.target as HTMLInputElement).value === "ai";
        reset();
    });
});

function handleCellClick(e: Event) {
    const clickedCell = e.target as HTMLElement;
    const cellIndex = parseInt(clickedCell.getAttribute("data-index")!);

    if (boardState[cellIndex] !== "" || !gameActive) return;
    if (isAiMode && currentPlayer === "O") return; // Block clicking during AI turn

    makeMove(cellIndex, currentPlayer);

    if (gameActive && isAiMode && currentPlayer === "O") {
        setTimeout(computerMove, 600);
    }
}

function makeMove(index: number, player: string) {
    boardState[index] = player;
    const cell = document.querySelector(`.cell[data-index="${index}"]`) as HTMLElement;
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    checkResult();
}

function computerMove() {
    if (!gameActive) return;
    const availableMoves = boardState
        .map((val, idx) => (val === "" ? idx : null))
        .filter((val) => val !== null) as number[];

    if (availableMoves.length > 0) {
        const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        makeMove(randomIndex, "O");
    }
}

function checkResult() {
    let roundWon = false;
    let winningPattern: number[] = [];

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

function drawWinLine(condition: number[]) {
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