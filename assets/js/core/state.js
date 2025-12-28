export const MAX_RECENTS = 8;
export const DEFAULT_SIZE = 16;

export const createEmptyPixels = (size) =>
  Array.from({ length: size }, () => Array(size).fill(null));

// Canonical editor state used throughout the app
export const state = {
  size: DEFAULT_SIZE,
  pixels: createEmptyPixels(DEFAULT_SIZE),
  primaryColor: '#0ea5e9',
  secondaryColor: '#f97316',
  currentTool: 'pencil',
  mirror: false,
  gridlines: true,
  zoom: 1,
  rectangleFilled: true,
  startPoint: null,
  recentColors: [],
};

// Mutators for top-level properties
export const setSize = (size) => {
  state.size = size;
  state.pixels = createEmptyPixels(size);
  state.startPoint = null;
};

export const setTool = (tool) => {
  state.currentTool = tool;
  state.startPoint = null;
};

export const setPrimary = (color) => {
  state.primaryColor = color;
  addRecentColor(color);
};

export const setSecondary = (color) => {
  state.secondaryColor = color;
  addRecentColor(color);
};

export const setMirror = (value) => {
  state.mirror = value;
};

export const setRectangleFilled = (value) => {
  state.rectangleFilled = value;
};

export const setGridlines = (value) => {
  state.gridlines = value;
};

export const setZoom = (value) => {
  state.zoom = value;
};

// Color history helpers
export const addRecentColor = (color) => {
  if (!color) return;
  state.recentColors = [color, ...state.recentColors.filter((c) => c !== color)].slice(0, MAX_RECENTS);
};

// Pixel grid helpers
export const setPixels = (pixels) => {
  state.pixels = pixels.map((row) => [...row]);
};

export const resetCanvas = (size = state.size) => {
  state.size = size;
  state.pixels = createEmptyPixels(size);
  state.startPoint = null;
};

export const inBounds = (x, y) => x >= 0 && y >= 0 && x < state.size && y < state.size;

export const getPixel = (x, y) => (inBounds(x, y) ? state.pixels[y][x] : null);

export const setPixel = (x, y, color) => {
  if (!inBounds(x, y)) return;
  state.pixels[y][x] = color;
};

export const clonePixels = () => state.pixels.map((row) => [...row]);
