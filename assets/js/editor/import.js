// Read a JSON save file and validate minimal shape
export const importJSON = (file, onSuccess, onError) => {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.size || !data.pixels) throw new Error('Invalid data');
      onSuccess(data);
    } catch (e) {
      onError?.(e);
    }
  };
  reader.onerror = () => onError?.(reader.error);
  reader.readAsText(file);
};
