// Palette seeds shown in the sidebar
const PRESET_COLORS = [
  '#0ea5e9',
  '#22c55e',
  '#f97316',
  '#e11d48',
  '#6366f1',
  '#a855f7',
  '#f59e0b',
  '#14b8a6',
  '#334155',
  '#f5f5f4',
  '#0b1224',
  '#94a3b8',
];

// Render preset palette buttons
export const renderPalette = (el, onSelect) => {
  el.innerHTML = '';
  PRESET_COLORS.forEach((color) => {
    const btn = document.createElement('button');
    btn.style.backgroundColor = color;
    btn.title = color;
    btn.addEventListener('click', () => onSelect(color));
    el.appendChild(btn);
  });
};

// Render recently used colors
export const renderRecents = (el, colors, onSelect) => {
  el.innerHTML = '';
  colors.forEach((color) => {
    const btn = document.createElement('button');
    btn.style.backgroundColor = color;
    btn.title = color;
    btn.addEventListener('click', () => onSelect(color));
    el.appendChild(btn);
  });
};
