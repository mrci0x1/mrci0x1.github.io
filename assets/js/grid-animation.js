(function () {
  const CELL = 24;
  const FADE_DURATION = 600;

  // Elements that should block the grid highlight
  const IGNORE_SELECTORS = [
    '#sidebar',
    '#topbar-wrapper',
    '#main-wrapper',
    '.post-preview',
    'article',
    'nav',
    'header',
    'footer',
    '.card',
    'a',
    'button',
    'input',
    'img',
  ].join(',');

  function isOverContent(x, y) {
    // Get all elements at this point (skips the canvas itself since pointer-events: none)
    const el = document.elementFromPoint(x, y);
    if (!el || el === document.documentElement || el === document.body) return false;
    return el.closest(IGNORE_SELECTORS) !== null;
  }

  function init() {
    const canvas = document.createElement('canvas');
    canvas.id = 'grid-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const cells = new Map();

    let mouseCol = -1;
    let mouseRow = -1;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', function (e) {
      // If hovering over any real content, clear active cell
      if (isOverContent(e.clientX, e.clientY)) {
        mouseCol = -1;
        mouseRow = -1;
        return;
      }

      const col = Math.floor(e.clientX / CELL);
      const row = Math.floor(e.clientY / CELL);

      if (col !== mouseCol || row !== mouseRow) {
        mouseCol = col;
        mouseRow = row;
        const key = col + ',' + row;
        cells.set(key, { col: col, row: row, fadeStart: null });
      }
    });

    window.addEventListener('mouseleave', function () {
      mouseCol = -1;
      mouseRow = -1;
    });

    function draw(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      cells.forEach(function (cell, key) {
        const isActive = cell.col === mouseCol && cell.row === mouseRow;

        if (isActive) {
          ctx.fillStyle = 'rgba(220, 38, 38, 0.5)';
          ctx.fillRect(cell.col * CELL + 1, cell.row * CELL + 1, CELL - 2, CELL - 2);
        } else {
          if (!cell.fadeStart) cell.fadeStart = now;
          const elapsed = now - cell.fadeStart;
          if (elapsed >= FADE_DURATION) {
            cells.delete(key);
            return;
          }
          const alpha = 0.5 * (1 - elapsed / FADE_DURATION);
          ctx.fillStyle = 'rgba(220, 38, 38, ' + alpha.toFixed(3) + ')';
          ctx.fillRect(cell.col * CELL + 1, cell.row * CELL + 1, CELL - 2, CELL - 2);
        }
      });

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
