# Pixel Art Maker

Frontend-only pixel editor with a modern two-page experience: a marketing-style home page and a fully featured editor that runs entirely in the browser.

## Features
- Tools: pencil, eraser, bucket/fill, eyedropper, line, rectangle, mirror drawing.
- Canvas controls: sizes 8–64, zoom 0.5–4x, gridlines toggle, new/clear canvas, undo/redo (40-depth history).
- Color system: primary/secondary swatches, hex inputs, quick palette, recent colors (8), right-click paints with secondary.
- Storage & export: save/load to localStorage with timestamps, export PNG or JSON, import from JSON.
- Status bar: shows grid size, cursor coordinates, and active color. Keyboard shortcuts: P/E/B/I/L/R, G gridlines, Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z redo.

## Run locally
Open `index.html` in your browser. Navigate to the editor via the header link or CTA buttons. No build step or backend required.

## Editor tips
- Left-click draws with the primary color; right-click draws with the secondary color.
- Mirror toggle paints a symmetric stroke across the vertical center.
- Use the eyedropper to set the primary/secondary color from any pixel.
- Line and rectangle tools: first click sets the start point, second click commits the shape.
- Use local saves to keep multiple versions; reload them from the save list on the right panel.
