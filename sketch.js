function loadImageInternal(name, path) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 8;
      canvas.height = 6;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      //
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
      console.log(data.data)

      // this.images.set(name, {
      //   canvas,
      //   imageData: ctx.getImageData(0, 0, canvas.width, canvas.height)
      // });

      resolve();
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${name} from ${path}`));
    };

    img.src = path;
  });
}

(async () => {
  await loadImageInternal("fuck you", "./juan.png")
})();
