/**
 * @name [textmode.js] Batch Image Plasma Renderer
 * @description Renders multiple images with plasma field animation overlaid
 * @author trintler
 * @link https://github.com/humanbydefinition/textmode.js
 */

class ImagePlasmaBatchRenderer {
  constructor(fontSizePx = 6) {
    this.tm = textmode.create({
      width: window.innerWidth,
      height: window.innerHeight,
      fontSize: fontSizePx
    });

    this.images = new Map();
    this.currentImage = null;
    this.isRendering = false;
  }

  /**
   * Load multiple images
   * @param {Object} imageMap - { name: path, ... }
   */
  async loadImages(imageMap) {
    const promises = Object.entries(imageMap).map(([name, path]) => {
      return this.loadImageInternal(name, path);
    });

    return Promise.all(promises);
  }

  /**
   * Load a single image
   * @private
   */
  loadImageInternal(name, path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = this.tm.grid.cols;
        canvas.height = this.tm.grid.rows;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        this.images.set(name, {
          canvas,
          imageData: ctx.getImageData(0, 0, canvas.width, canvas.height)
        });

        console.log(`Image loaded: ${name} (${canvas.width}x${canvas.height})`);
        resolve();
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${name} from ${path}`));
      };

      img.src = path;
    });
  }

  /**
   * Get brightness of pixel
   * @private
   */
  getPixelBrightness(imageData, pixelIndex) {
    const data = imageData.data;
    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];
    const a = data[pixelIndex + 3];

    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 * (a / 255);
  }

  /**
   * Get pixel color
   * @private
   */
  getPixelColor(imageData, pixelIndex) {
    const data = imageData.data;
    return [
      data[pixelIndex],
      data[pixelIndex + 1],
      data[pixelIndex + 2]
    ];
  }

  /**
   * Blend two RGB colors
   * @private
   */
  blendColors(colorA, colorB, blendFactor) {
    return [
      Math.round(colorA[0] * (1 - blendFactor) + colorB[0] * blendFactor),
      Math.round(colorA[1] * (1 - blendFactor) + colorB[1] * blendFactor),
      Math.round(colorA[2] * (1 - blendFactor) + colorB[2] * blendFactor)
    ];
  }

  /**
   * HSL to RGB conversion
   * @private
   */
  hsl2rgb(h, s, l) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;

    if (h < 1 / 6) [r, g, b] = [c, x, 0];
    else if (h < 2 / 6) [r, g, b] = [x, c, 0];
    else if (h < 3 / 6) [r, g, b] = [0, c, x];
    else if (h < 4 / 6) [r, g, b] = [0, x, c];
    else if (h < 5 / 6) [r, g, b] = [x, 0, c];
    else[r, g, b] = [c, 0, x];

    return [
      Math.floor((r + m) * 255),
      Math.floor((g + m) * 255),
      Math.floor((b + m) * 255)
    ];
  }

  /**
   * Generate plasma animation value
   * @private
   */
  generatePlasma(x, y, time) {
    const nx = x / this.tm.grid.cols;
    const ny = y / this.tm.grid.rows;

    const plasma1 = Math.sin(nx * 8 + time);
    const plasma2 = Math.sin(ny * 6 + time * 1.3);
    const plasma3 = Math.sin((nx + ny) * 4 + time * 0.8);
    const plasma4 = Math.sin(Math.sqrt(nx * nx + ny * ny) * 12 + time * 1.5);

    const combined = (plasma1 + plasma2 + plasma3 + plasma4) / 4;
    return (combined + 1) / 2;
  }

  /**
   * Render specific image with plasma
   */
  renderImage(name) {
    const imageInfo = this.images.get(name);
    if (!imageInfo) {
      console.warn(`Image not found: ${name}`);
      return;
    }

    this.currentImage = name;
    const { canvas, imageData } = imageInfo;

    this.tm.draw(() => {
      this.tm.background(0);

      const time = this.tm.frameCount * 0.02;

      for (let y = 0; y < this.tm.grid.rows; y++) {
        for (let x = 0; x < this.tm.grid.cols; x++) {
          this.tm.push();

          const pixelIndex = (y * canvas.width + x) * 4;
          const imageBrightness = this.getPixelBrightness(imageData, pixelIndex);
          const imageColor = this.getPixelColor(imageData, pixelIndex);

          const plasmaIntensity = this.generatePlasma(x, y, time);

          const plasmaHue = (plasmaIntensity + time * 0.5) % 1;
          const plasmaSaturation = 1.0;
          const plasmaLightness = plasmaIntensity;
          const plasmaColor = this.hsl2rgb(plasmaHue, plasmaSaturation, plasmaLightness);

          const blendedColor = this.blendColors(imageColor, plasmaColor, plasmaIntensity * 0.6);

          const combinedBrightness = Math.min(
            imageBrightness + plasmaIntensity * 0.4,
            1.0
          );

          const chars = [' ', '·', '░', '▒', '▓', '█'];
          const charIndex = Math.floor(combinedBrightness * (chars.length - 1));
          const char = chars[Math.max(0, Math.min(charIndex, chars.length - 1))];

          this.tm.charColor(blendedColor[0], blendedColor[1], blendedColor[2]);
          this.tm.cellColor(0, 0, 0);
          this.tm.char(char);
          this.tm.rect(x, y, 1, 1);

          this.tm.pop();
        }
      }
    });
  }

  /**
   * Get list of loaded images
   */
  getLoadedImages() {
    return Array.from(this.images.keys());
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    this.tm.resizeCanvas(window.innerWidth, window.innerHeight);
    if (this.currentImage) {
      this.renderImage(this.currentImage);
    }
  }
}

// export global instance
window.BatchImagePlasmaRenderer = new ImagePlasmaBatchRenderer(6);

// handle window resize
window.addEventListener('resize', () => {
  window.BatchImagePlasmaRenderer.onWindowResize();
});
