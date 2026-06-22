let board = Array(9).fill(null);
let current = 'X';
let gameOver = false;
let mode = '2p';
let score = { X: 0, O: 0, D: 0 };

const wins = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function setMode(m) {
  mode = m;
  document.getElementById('btn-2p').classList.toggle('active', m === '2p');
  document.getElementById('btn-ai').classList.toggle('active', m === 'ai');
  resetGame();
}

function checkWinner(b) {
  for (const [a, c, d] of wins) {
    if (b[a] && b[a] === b[c] && b[a] === b[d])
      return { winner: b[a], line: [a, c, d] };
  }
  if (b.every(Boolean)) return { winner: null, line: null, draw: true };
  return null;
}

function minimax(b, isMax) {
  const res = checkWinner(b);
  if (res) return res.winner === 'O' ? 10 : res.winner === 'X' ? -10 : 0;
  let best = isMax ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = isMax ? 'O' : 'X';
      const v = minimax(b, !isMax);
      b[i] = null;
      best = isMax ? Math.max(best, v) : Math.min(best, v);
    }
  }
  return best;
}

function aiMove() {
  let best = -Infinity, move = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const v = minimax(board, false);
      board[i] = null;
      if (v > best) { best = v; move = i; }
    }
  }
  return move;
}

function render(winLine = []) {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  board.forEach((v, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell'
      + (v ? ' taken ' + v.toLowerCase() : '')
      + (winLine.includes(i) ? ' win' : '');
    cell.textContent = v || '';
    if (!v && !gameOver) cell.onclick = () => handleClick(i);
    boardEl.appendChild(cell);
  });
}

function updateStatus(text) {
  document.getElementById('status').textContent = text;
}

function updateScore() {
  document.getElementById('sx').textContent = score.X;
  document.getElementById('so').textContent = score.O;
  document.getElementById('sd').textContent = score.D;
}

function handleClick(i) {
  if (gameOver || board[i]) return;
  board[i] = current;
  const res = checkWinner(board);
  if (res) {
    render(res.line || []);
    if (res.draw) {
      score.D++;
      updateStatus('Draw!');
    } else {
      score[res.winner]++;
      updateStatus((mode === 'ai' && res.winner === 'O' ? 'AI' : 'Player ' + res.winner) + ' wins! 🎉');
    }
    updateScore();
    gameOver = true;
    return;
  }
  current = current === 'X' ? 'O' : 'X';
  render();
  if (mode === 'ai' && current === 'O' && !gameOver) {
    updateStatus('AI is thinking…');
    setTimeout(() => {
      const m = aiMove();
      board[m] = 'O';
      const r2 = checkWinner(board);
      if (r2) {
        render(r2.line || []);
        if (r2.draw) { score.D++; updateStatus('Draw!'); }
        else { score.O++; updateStatus('AI wins!'); }
        updateScore();
        gameOver = true;
        return;
      }
      current = 'X';
      render();
      updateStatus('Your turn (X)');
    }, 300);
    return;
  }
  updateStatus(mode === 'ai' ? 'Your turn (X)' : `${current}'s turn`);
}

function resetGame() {
  board = Array(9).fill(null);
  current = 'X';
  gameOver = false;
  render();
  updateStatus(mode === 'ai' ? 'Your turn (X)' : "X's turn");
}

function resetScore() {
  score = { X: 0, O: 0, D: 0 };
  updateScore();
  resetGame();
}

resetGame();
