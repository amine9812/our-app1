import { qs } from '../core/dom.js';
import {
  state,
  setSize,
  setTool,
  setPrimary,
  setSecondary,
  setMirror,
  setGridlines,
  setZoom,
  setRectangleFilled,
  setPixel,
  getPixel,
  resetCanvas,
  clonePixels,
  setPixels,
} from '../core/state.js';
import { buildGrid, paintCell, paintAll, toggleGridlines, getCoords } from './grid.js';
import { getTool } from './tools.js';
import { renderPalette, renderRecents } from './palette.js';
import { exportPNG, exportJSON } from './export.js';
import { importJSON } from './import.js';
import { registerShortcuts } from '../core/shortcuts.js';
import { initHistory, pushHistory, undo as undoHistory, redo as redoHistory } from '../core/history.js';
import { saveSnapshot, loadLatest, loadSnapshot, listSaves } from '../core/storage.js';
import { setToolLabel, updateStatus } from './renderer.js';

// Cache DOM references for controls and displays
const els = {
  grid: qs('#grid'),
  sizeSelect: qs('#grid-size'),
  zoom: qs('#zoom'),
  gridlines: qs('#gridlines-toggle'),
  mirror: qs('#mirror-toggle'),
  rectangleFill: qs('#rectangle-fill-toggle'),
  primaryColor: qs('#primary-color'),
  secondaryColor: qs('#secondary-color'),
  primaryHex: qs('#primary-hex'),
  secondaryHex: qs('#secondary-hex'),
  presetPalette: qs('#preset-palette'),
  recentColors: qs('#recent-colors'),
  toolButtons: qs('#tool-buttons'),
  currentToolLabel: qs('#current-tool-label'),
  status: {
    size: qs('#status-size'),
    coord: qs('#status-coord'),
    color: qs('#status-color'),
  },
  canvasWrapper: qs('#canvas-wrapper'),
  buttons: {
    newCanvas: qs('#new-canvas'),
    clearCanvas: qs('#clear-canvas'),
    undo: qs('#undo'),
    redo: qs('#redo'),
    saveLocal: qs('#save-local'),
    loadLocal: qs('#load-local'),
    exportPng: qs('#export-png'),
    exportJson: qs('#export-json'),
  },
  importInput: qs('#import-json'),
  saveList: qs('#save-list'),
};

let isDrawing = false;
let activeButton = 0;

// Apply a color to state + DOM in one place
const applyPixel = (x, y, color) => {
  setPixel(x, y, color);
  paintCell(els.grid, x, y, color);
};

// Keep recents list in sync with state
const syncRecentColors = () => {
  renderRecents(els.recentColors, state.recentColors, (color) => {
    setPrimary(color);
    syncColorInputs();
    refreshStatus();
  });
};

// Keep select inputs aligned with state size
const syncSizeControl = () => {
  els.sizeSelect.value = String(state.size);
};

// Mirror state colors into both color inputs and hex fields
const syncColorInputs = () => {
  els.primaryColor.value = state.primaryColor;
  els.secondaryColor.value = state.secondaryColor;
  els.primaryHex.value = state.primaryColor;
  els.secondaryHex.value = state.secondaryColor;
};

// Refresh status bar content
const refreshStatus = (coordText = 'Hover a pixel') => {
  updateStatus(els.status, {
    sizeText: `${state.size} x ${state.size}`,
    coordText,
    colorText: `Color: ${state.primaryColor}`,
  });
};

// Rebuild the DOM grid after size/state changes
const rebuildGrid = () => {
  buildGrid(els.grid);
  paintAll(els.grid, state.pixels);
  toggleGridlines(els.grid, state.gridlines);
  els.grid.style.transform = `scale(${state.zoom})`;
  els.grid.style.transformOrigin = 'top left';
};

// Highlight active tool button and label
const highlightToolButton = (tool) => {
  els.toolButtons.querySelectorAll('button').forEach((btn) => {
    btn.classList.toggle('primary', btn.dataset.tool === tool);
  });
  setToolLabel(els.currentToolLabel, tool);
};

// Push a new snapshot into undo history
const commitHistory = () => {
  pushHistory(state.pixels);
};

// Route pointer actions to the current tool
const handleToolAction = (coords, event) => {
  const useSecondary = event && event.button === 2;
  const color = useSecondary ? state.secondaryColor : state.primaryColor;
  const tool = getTool(state.currentTool);

  if (state.currentTool === 'pencil') {
    tool.draw({ ...coords, color, state, applyPixel });
    return;
  }

  if (state.currentTool === 'eraser') {
    tool.draw({ ...coords, state, applyPixel });
    return;
  }

  if (state.currentTool === 'bucket') {
    tool.fill({ ...coords, color, applyPixel, getPixel, state });
    commitHistory();
    return;
  }

  if (state.currentTool === 'eyedropper') {
    tool.pick({
      ...coords,
      getPixel,
      setPrimary,
      setSecondary,
      useSecondary,
    });
    syncColorInputs();
    syncRecentColors();
    refreshStatus();
    return;
  }

  if (state.currentTool === 'line') {
    if (!state.startPoint) {
      state.startPoint = coords;
      refreshStatus(`Start: (${coords.x + 1}, ${coords.y + 1})`);
    } else {
      tool.drawLine({
        start: state.startPoint,
        end: coords,
        color,
        applyPixel,
        state,
      });
      state.startPoint = null;
      commitHistory();
    }
    return;
  }

  if (state.currentTool === 'rectangle') {
    if (!state.startPoint) {
      state.startPoint = coords;
      refreshStatus(`Start: (${coords.x + 1}, ${coords.y + 1})`);
    } else {
      tool.drawRectangle({
        start: state.startPoint,
        end: coords,
        color,
        applyPixel,
        state,
        filled: state.rectangleFilled,
      });
      state.startPoint = null;
      commitHistory();
    }
  }
};

// Pointer event handlers for drawing
const handlePointerDown = (event) => {
  const cell = event.target.closest('.cell');
  if (!cell) return;
  event.preventDefault();
  const coords = getCoords(cell);
  activeButton = event.button;
  isDrawing = ['pencil', 'eraser'].includes(state.currentTool);
  handleToolAction(coords, event);
};

const handlePointerMove = (event) => {
  const cell = event.target.closest('.cell');
  if (!cell) return;
  const coords = getCoords(cell);
  refreshStatus(`(${coords.x + 1}, ${coords.y + 1})`);
  if (!isDrawing) return;
  handleToolAction(coords, { button: activeButton });
};

const handlePointerUp = () => {
  if (isDrawing) {
    commitHistory();
  }
  isDrawing = false;
};

// Bind pointer listeners on the grid element
const bindGridEvents = () => {
  els.grid.addEventListener('pointerdown', handlePointerDown);
  els.grid.addEventListener('pointermove', handlePointerMove);
  els.grid.addEventListener('pointerup', handlePointerUp);
  els.grid.addEventListener('pointerleave', handlePointerUp);
  els.grid.addEventListener('contextmenu', (e) => e.preventDefault());
};

// Tool selection buttons
const bindToolButtons = () => {
  els.toolButtons.addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-tool]');
    if (!btn) return;
    setTool(btn.dataset.tool);
    highlightToolButton(btn.dataset.tool);
    refreshStatus();
  });
};

// Color pickers + hex inputs
const bindColorInputs = () => {
  const normalizeHex = (val) => {
    if (!val) return null;
    if (!val.startsWith('#')) val = `#${val}`;
    if (val.length === 7) return val;
    return null;
  };

  els.primaryColor.addEventListener('input', (e) => {
    setPrimary(e.target.value);
    syncColorInputs();
    syncRecentColors();
    refreshStatus();
  });
  els.secondaryColor.addEventListener('input', (e) => {
    setSecondary(e.target.value);
    syncColorInputs();
    syncRecentColors();
    refreshStatus();
  });
  els.primaryHex.addEventListener('change', (e) => {
    const val = normalizeHex(e.target.value);
    if (val) {
      setPrimary(val);
      syncColorInputs();
      syncRecentColors();
      refreshStatus();
    }
  });
  els.secondaryHex.addEventListener('change', (e) => {
    const val = normalizeHex(e.target.value);
    if (val) {
      setSecondary(val);
      syncColorInputs();
      syncRecentColors();
      refreshStatus();
    }
  });
};

// All other control bindings (size, zoom, toggles, storage, import/export)
const bindControls = () => {
  els.sizeSelect.addEventListener('change', (e) => {
    const newSize = Number(e.target.value);
    resetCanvas(newSize);
    rebuildGrid();
    initHistory(state.pixels);
    refreshStatus();
  });

  els.zoom.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    setZoom(val);
    els.grid.style.transform = `scale(${val})`;
  });

  els.gridlines.addEventListener('change', (e) => {
    setGridlines(e.target.checked);
    toggleGridlines(els.grid, state.gridlines);
  });

  els.mirror.addEventListener('change', (e) => {
    setMirror(e.target.checked);
  });

  els.rectangleFill.addEventListener('change', (e) => {
    setRectangleFilled(e.target.checked);
  });

  els.buttons.newCanvas.addEventListener('click', () => {
    const confirmed = confirm('Start a new blank canvas? This will clear current work.');
    if (!confirmed) return;
    resetCanvas(state.size);
    rebuildGrid();
    initHistory(state.pixels);
    refreshStatus();
  });

  els.buttons.clearCanvas.addEventListener('click', () => {
    resetCanvas(state.size);
    rebuildGrid();
    initHistory(state.pixels);
    refreshStatus();
  });

  els.buttons.undo.addEventListener('click', () => {
    const prev = undoHistory();
    if (prev) {
      setPixels(prev);
      rebuildGrid();
    }
  });

  els.buttons.redo.addEventListener('click', () => {
    const next = redoHistory();
    if (next) {
      setPixels(next);
      rebuildGrid();
    }
  });

  els.buttons.saveLocal.addEventListener('click', () => {
    const snapshot = { size: state.size, pixels: clonePixels() };
    saveSnapshot(snapshot);
    renderSaveList();
    alert('Saved to your browser.');
  });

  els.buttons.loadLocal.addEventListener('click', () => {
    const latest = loadLatest();
    if (latest) {
      loadSnapshotToCanvas(latest);
    } else {
      alert('No saved canvas found.');
    }
  });

  els.buttons.exportPng.addEventListener('click', () => exportPNG(state));
  els.buttons.exportJson.addEventListener('click', () => exportJSON(state));

  els.importInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importJSON(
      file,
      (data) => loadSnapshotToCanvas(data),
      () => alert('Unable to import JSON file.')
    );
    e.target.value = '';
  });
};

// Render list of saved canvases in local storage
const renderSaveList = () => {
  const saves = listSaves();
  els.saveList.innerHTML = '';
  saves.forEach((save) => {
    const row = document.createElement('div');
    row.className = 'save-item';
    const label = document.createElement('span');
    const date = new Date(save.created);
    label.textContent = `${save.size}x${save.size} — ${date.toLocaleString()}`;
    const btn = document.createElement('button');
    btn.className = 'btn small ghost';
    btn.textContent = 'Load';
    btn.addEventListener('click', () => loadSnapshotToCanvas(saveSnapshotLoad(save.id)));
    row.append(label, btn);
    els.saveList.appendChild(row);
  });
};

// Load a save record into state and UI
const loadSnapshotToCanvas = (data) => {
  if (!data || !data.pixels) return;
  setSize(data.size);
  setPixels(data.pixels);
  syncSizeControl();
  rebuildGrid();
  initHistory(state.pixels);
  refreshStatus();
};

const saveSnapshotLoad = (id) => loadSnapshot(id) || loadLatest();

// Set up preset palettes
const initPalette = () => {
  renderPalette(els.presetPalette, (color) => {
    setPrimary(color);
    syncColorInputs();
    syncRecentColors();
    refreshStatus();
  });
};

// Register keyboard shortcuts
const initShortcuts = () => {
  registerShortcuts({
    setTool: (tool) => {
      setTool(tool);
      highlightToolButton(tool);
    },
    undo: () => {
      const prev = undoHistory();
      if (prev) {
        setPixels(prev);
        rebuildGrid();
      }
    },
    redo: () => {
      const next = redoHistory();
      if (next) {
        setPixels(next);
        rebuildGrid();
      }
    },
    toggleGrid: () => {
      els.gridlines.checked = !els.gridlines.checked;
      setGridlines(els.gridlines.checked);
      toggleGridlines(els.grid, state.gridlines);
    },
  });
};

// Bootstraps the editor UI
const init = () => {
  rebuildGrid();
  initHistory(state.pixels);
  bindGridEvents();
  bindToolButtons();
  bindColorInputs();
  bindControls();
  initPalette();
  syncColorInputs();
  syncRecentColors();
  renderSaveList();
  refreshStatus();
  initShortcuts();
  highlightToolButton(state.currentTool);
};

init();
