// script.js
document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const resetButton = document.getElementById('reset-button');
    const difficultySelect = document.getElementById('difficulty');
    const gameOverMessage = document.getElementById('game-over-message');

    const player = 'X';
    const computer = 'O';

    let cells = [];
    let gameActive = true;

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    function createBoard() {
        cells = [];
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => handleCellClick(i));
            board.appendChild(cell);
            cells.push(cell);
        }
        gameOverMessage.textContent = '';
    }

    function handleCellClick(index) {
        if (!gameActive || cells[index].textContent) return;
        cells[index].textContent = player;
        if (checkWin(player)) {
            gameOverMessage.textContent = 'You win!';
            gameActive = false;
            return;
        }
        if (isBoardFull()) {
            gameOverMessage.textContent = 'It\'s a tie!';
            gameActive = false;
            return;
        }
        setTimeout(computerMove, 500);
    }

    function computerMove() {
        const difficulty = difficultySelect.value;
        let move;
        if (difficulty === 'easy') {
            move = randomMove();
        } else if (difficulty === 'medium') {
            move = mediumMove();
        } else {
            move = hardMove();
        }
        if (move !== null) {
            cells[move].textContent = computer;
            if (checkWin(computer)) {
                gameOverMessage.textContent = 'Computer wins!';
                gameActive = false;
                return;
            }
            if (isBoardFull()) {
                gameOverMessage.textContent = 'It\'s a tie!';
                gameActive = false;
                return;
            }
        }
    }

    function randomMove() {
        const emptyCells = cells.filter(cell => !cell.textContent);
        if (emptyCells.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return cells.indexOf(emptyCells[randomIndex]);
    }

    function mediumMove() {
        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (cells[a].textContent === player && cells[b].textContent === player && !cells[c].textContent) return c;
            if (cells[a].textContent === player && cells[c].textContent === player && !cells[b].textContent) return b;
            if (cells[b].textContent === player && cells[c].textContent === player && !cells[a].textContent) return a;
        }
        return randomMove();
    }

    function hardMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < cells.length; i++) {
            if (!cells[i].textContent) {
                cells[i].textContent = computer;
                let score = minimax(cells, 0, false);
                cells[i].textContent = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    function minimax(board, depth, isMaximizing) {
        let scores = { 'X': -1, 'O': 1, 'tie': 0 };
        let result = checkWinForMinimax(board, player) ? 'X' : checkWinForMinimax(board, computer) ? 'O' : null;
        if (result) return scores[result];
        if (isBoardFullForMinimax(board)) return scores['tie'];

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i].textContent) {
                    board[i].textContent = computer;
                    let score = minimax(board, depth + 1, false);
                    board[i].textContent = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i].textContent) {
                    board[i].textContent = player;
                    let score = minimax(board, depth + 1, true);
                    board[i].textContent = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWin(currentPlayer) {
        return winningCombinations.some(combo => 
            combo.every(index => cells[index].textContent === currentPlayer)
        );
    }

    function checkWinForMinimax(board, currentPlayer) {
        return winningCombinations.some(combo => 
            combo.every(index => board[index].textContent === currentPlayer)
        );
    }

    function isBoardFull() {
        return cells.every(cell => cell.textContent);
    }

    function isBoardFullForMinimax(board) {
        return board.every(cell => cell.textContent);
    }

    function resetGame() {
        createBoard();
        gameActive = true;
    }

    resetButton.addEventListener('click', resetGame);
    createBoard();
});
