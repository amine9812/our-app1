// Convert pixel matrix into a PNG and trigger download
export const exportPNG = (state) => {
  const canvas = document.createElement('canvas');
  canvas.width = state.size;
  canvas.height = state.size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < state.size; y++) {
    for (let x = 0; x < state.size; x++) {
      const color = state.pixels[y][x];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'pixel-art.png';
  link.click();
};

// Download raw pixel data for later import
export const exportJSON = (state) => {
  const payload = {
    size: state.size,
    pixels: state.pixels,
  };
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'pixel-art.json';
  link.click();
  URL.revokeObjectURL(link.href);
};
