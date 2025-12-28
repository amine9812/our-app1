// Status bar text updater
export const updateStatus = (els, { sizeText, coordText, colorText }) => {
  if (els.size) els.size.textContent = sizeText;
  if (els.coord) els.coord.textContent = coordText;
  if (els.color) els.color.textContent = colorText;
};

// Show current tool name
export const setToolLabel = (el, tool) => {
  if (el) el.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
};
