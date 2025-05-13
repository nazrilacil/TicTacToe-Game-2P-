const boardEl = document.getElementById('board');
    const statusEl = document.getElementById('status');
    const scoreXEl = document.getElementById('scoreX');
    const scoreOEl = document.getElementById('scoreO');
    const playerXEl = document.getElementById('playerX');
    const playerOEl = document.getElementById('playerO');
    const victoryText = document.getElementById('victoryText');
    const clickSound = document.getElementById('clickSound');
    const winSound = document.getElementById('winSound');
    const modeIcon = document.getElementById('modeIcon');

    let board = Array(9).fill('');
    let currentPlayer = 'X';
    let score = { X: 0, O: 0 };
    let playerNames = { X: '', O: '' };
    let gameOver = false;

    function toggleDarkMode() {
      document.documentElement.classList.toggle('dark');
      modeIcon.textContent = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
    }

    function startGame() {
      const nameX = document.getElementById('nameX').value.trim() || 'Player X';
      const nameO = document.getElementById('nameO').value.trim() || 'Player O';

      playerNames.X = nameX;
      playerNames.O = nameO;

      updateScore();
      document.getElementById('nameModal').style.display = 'none';
      updateStatus();
      createBoard();
    }

    function createBoard() {
      boardEl.innerHTML = '';
      board.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.className = `w-full aspect-square bg-white dark:bg-gray-700 rounded-xl shadow text-4xl flex items-center justify-center cursor-pointer font-bold select-none transition-all duration-200`;
        cell.dataset.index = index;
        if (value === 'X') cell.innerHTML = `<span class="text-red-500">${value}</span>`;
        else if (value === 'O') cell.innerHTML = `<span class="text-green-500">${value}</span>`;
        cell.addEventListener('click', () => handleMove(index, cell));
        boardEl.appendChild(cell);
      });
    }

    function handleMove(index, cell) {
      if (board[index] || gameOver) return;
      board[index] = currentPlayer;
      clickSound.currentTime = 0;
      clickSound.play();
      createBoard();

      const win = checkWinner(currentPlayer);
      if (win) {
        highlightWinner(win);
        winSound.currentTime = 0;
        winSound.play();
        gameOver = true;
        score[currentPlayer]++;
        updateScore();
        statusEl.textContent = `${playerNames[currentPlayer]} menang!`;
        victoryText.classList.remove('hidden');
        setTimeout(() => {
          victoryText.classList.add('hidden');
          resetBoard();
        }, 2000);
      } else if (board.every(cell => cell)) {
        statusEl.textContent = 'Seri!';
        gameOver = true;
        setTimeout(resetBoard, 1500);
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
      }
    }

    function checkWinner(player) {
      const winPatterns = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      return winPatterns.find(pattern => pattern.every(i => board[i] === player));
    }

    function highlightWinner(pattern) {
      const cells = document.querySelectorAll('#board div');
      pattern.forEach(i => {
        cells[i].classList.add('bg-yellow-300', 'dark:bg-yellow-500');
      });
    }

    function updateScore() {
      scoreXEl.textContent = score.X;
      scoreOEl.textContent = score.O;
      playerXEl.innerHTML = `${playerNames.X} (X): <span id="scoreX">${score.X}</span>`;
      playerOEl.innerHTML = `${playerNames.O} (O): <span id="scoreO">${score.O}</span>`;
    }

    function updateStatus() {
      statusEl.textContent = `Giliran: ${playerNames[currentPlayer]}`;
    }

    function resetBoard() {
      board = Array(9).fill('');
      currentPlayer = 'X';
      gameOver = false;
      updateStatus();
      createBoard();
    }