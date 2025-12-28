const KEY = 'pam-saves';

// LocalStorage helpers for saving and loading canvases
const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch (e) {
    return [];
  }
};

const writeAll = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

export const listSaves = () => readAll();

export const saveSnapshot = (payload) => {
  const all = readAll();
  const record = {
    id: Date.now(),
    created: new Date().toISOString(),
    size: payload.size,
    pixels: payload.pixels,
  };
  all.unshift(record);
  writeAll(all.slice(0, 12));
  return record;
};

export const loadSnapshot = (id) => readAll().find((s) => s.id === id);

export const loadLatest = () => readAll()[0] || null;
