// Keyboard shortcuts handler; ignores input fields to avoid conflicts
export const registerShortcuts = (actions) => {
  window.addEventListener('keydown', (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        actions.redo?.();
      } else {
        actions.undo?.();
      }
      return;
    }

    switch (key) {
      case 'p':
        actions.setTool?.('pencil');
        break;
      case 'e':
        actions.setTool?.('eraser');
        break;
      case 'b':
        actions.setTool?.('bucket');
        break;
      case 'i':
        actions.setTool?.('eyedropper');
        break;
      case 'l':
        actions.setTool?.('line');
        break;
      case 'r':
        actions.setTool?.('rectangle');
        break;
      case 'g':
        actions.toggleGrid?.();
        break;
      default:
        break;
    }
  });
};
