// Clear a pixel (and its mirrored counterpart)
export const draw = ({ x, y, state, applyPixel }) => {
  applyPixel(x, y, null);
  if (state.mirror) {
    const mx = state.size - 1 - x;
    applyPixel(mx, y, null);
  }
};
