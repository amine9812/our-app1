// Single-pixel drawing with optional horizontal mirror
export const draw = ({ x, y, color, state, applyPixel }) => {
  applyPixel(x, y, color);
  if (state.mirror) {
    const mx = state.size - 1 - x;
    applyPixel(mx, y, color);
  }
};
