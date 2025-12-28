// Draw rectangular outline or fill; mirrors when enabled
export const drawRectangle = ({ start, end, color, applyPixel, state, filled = true }) => {
  if (!start || !end) return;
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (filled || y === minY || y === maxY || x === minX || x === maxX) {
        applyPixel(x, y, color);
      }
    }
  }

  if (state.mirror) {
    const width = state.size - 1;
    const mirrorStart = { x: width - start.x, y: start.y };
    const mirrorEnd = { x: width - end.x, y: end.y };
    const mMinX = Math.min(mirrorStart.x, mirrorEnd.x);
    const mMaxX = Math.max(mirrorStart.x, mirrorEnd.x);
    const mMinY = Math.min(mirrorStart.y, mirrorEnd.y);
    const mMaxY = Math.max(mirrorStart.y, mirrorEnd.y);
    for (let y = mMinY; y <= mMaxY; y++) {
      for (let x = mMinX; x <= mMaxX; x++) {
        if (filled || y === mMinY || y === mMaxY || x === mMinX || x === mMaxX) {
          applyPixel(x, y, color);
        }
      }
    }
  }
};
