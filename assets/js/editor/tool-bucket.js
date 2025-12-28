// Flood fill using BFS across contiguous pixels with the same color
export const fill = ({ x, y, color, getPixel, applyPixel, state }) => {
  const target = getPixel(x, y);
  if (target === color) return;
  const queue = [[x, y]];
  const visited = new Set();

  const key = (cx, cy) => `${cx}-${cy}`;
  while (queue.length) {
    const [cx, cy] = queue.shift();
    if (visited.has(key(cx, cy))) continue;
    visited.add(key(cx, cy));
    const current = getPixel(cx, cy);
    if (current !== target) continue;
    applyPixel(cx, cy, color);
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    dirs.forEach(([dx, dy]) => {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx >= 0 && ny >= 0 && nx < state.size && ny < state.size) {
        queue.push([nx, ny]);
      }
    });
  }
};
