function loadImage(path, resolution) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = path;

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${path}`));
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = resolution[0];
      canvas.height = resolution[1];

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(data);
    };
  })
}

(async () => {
  const jeff = await loadImage("juan.png", [100, 100])
  console.log(jeff)
})();
