// Sample a pixel color and assign it to primary/secondary
export const pick = ({ x, y, getPixel, setPrimary, setSecondary, useSecondary }) => {
  const color = getPixel(x, y);
  if (color === null || color === undefined) return;
  if (useSecondary) {
    setSecondary(color);
  } else {
    setPrimary(color);
  }
};
