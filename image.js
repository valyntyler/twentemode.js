export function loadImage(path, resolution) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.crossOrigin = "anonymous";
    img.src = path;

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${path}`));
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = resolution[0];
      canvas.height = resolution[1];

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(data);
    };
  });
}

export function toImageSpace(position, resolution) {
  const width = resolution[0];
  const x = position[0];
  const y = position[1];
  return (y * width + x) * 4;
}

export function imageRGB(image, position, resolution) {
  const pixelIndex = toImageSpace(position, resolution);
  return [
    image.data[pixelIndex],
    image.data[pixelIndex + 1],
    image.data[pixelIndex + 2],
  ];
}
