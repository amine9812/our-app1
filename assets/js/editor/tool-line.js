// Bresenham-inspired line plotting helper
const plotLine = (x0, y0, x1, y1, plot) => {
  let dx = Math.abs(x1 - x0);
  let dy = -Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  while (true) {
    plot(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
};

// Draw line (and mirrored version when enabled)
export const drawLine = ({ start, end, color, applyPixel, state }) => {
  if (!start || !end) return;
  plotLine(start.x, start.y, end.x, end.y, (x, y) => {
    applyPixel(x, y, color);
  });
  if (state.mirror) {
    const mirrorStart = { x: state.size - 1 - start.x, y: start.y };
    const mirrorEnd = { x: state.size - 1 - end.x, y: end.y };
    plotLine(mirrorStart.x, mirrorStart.y, mirrorEnd.x, mirrorEnd.y, (x, y) => {
      applyPixel(x, y, color);
    });
  }
};
