import { loadImage, imageRGB } from "./image.js";

// Rain drop system
const drops = [];
const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let resolution = null;
let horseImage = null;

console.log("Hello, textmode.js!");
const t = textmode.create({
  width: window.innerWidth * 0.6,
  height: window.innerHeight * 0.6,
  fontSize: 16,
  frameRate: 60,
});
const tm = t;

async function onResizeCanvas() {
  const aspectRatio = 960 / 639;
  const height = Math.min(window.innerWidth, window.innerHeight);
  const width = height * aspectRatio;

  tm.resizeCanvas(width * 0.6, height * 0.6);

  // Resample Image
  resolution = [t.grid.cols, t.grid.rows];
  horseImage = await loadImage("twente.svg", resolution);

  // Reinitialize drops for new grid size
  drops.length = 0;
  for (let x = 0; x < tm.grid.cols; x++) {
    drops[x] = {
      y: Math.random() * -50,
      speed: Math.random() * 0.3 + 0.1,
      length: Math.floor(Math.random() * 15) + 5,
      chars: [],
    };

    for (let i = 0; i < drops[x].length; i++) {
      drops[x].chars[i] = chars[Math.floor(Math.random() * chars.length)];
    }
  }
}

t.setup(async () => {
  onResizeCanvas();

  // Initialize rain drops
  for (let x = 0; x < tm.grid.cols; x++) {
    drops[x] = {
      y: Math.random() * -50,
      speed: Math.random() * 0.3 + 0.1,
      length: Math.floor(Math.random() * 15) + 5,
      chars: [],
    };

    // Generate random characters for this drop
    for (let i = 0; i < drops[x].length; i++) {
      drops[x].chars[i] = chars[Math.floor(Math.random() * chars.length)];
    }
  }
});

t.draw(async () => {
  t.background(0);
  console.log("hello from this frame!!");

  // Update and draw each rain drop
  for (let x = 0; x < drops.length; x++) {
    const drop = drops[x];

    // Draw the trail
    for (let i = 0; i < drop.length; i++) {
      const y = drop.y - i;
      if (y >= 0 && y < tm.grid.rows) {
        tm.push();

        // Calculate fade based on position in trail
        const fade = (drop.length - i) / drop.length;

        // Body fades from bright green to dark green
        const green = Math.floor(255 * fade * 0.8);
        tm.charColor(0, green, 0);

        // let me cook
        // const fadeBounadryBottom = tm.grid.rows * 0.8;
        // const percOut = (y - fadeBounadryBottom) / (tm.grid.rows - fadeBounadryBottom)
        // if (y > fadeBounadryBottom) {
        //   const intensity = green * (1 - percOut)
        //   tm.charColor(0, intensity, 0);
        // }
        // const fadeBoundaryTop = tm.grid.rows * 0.2;
        // const percIn = y / (tm.grid.rows - fadeBounadryBottom)
        // if (y < fadeBoundaryTop) {
        //   const intensity = green * percIn
        //   tm.charColor(0, intensity, 0);
        // }

        // i didn't cook
        const center = [tm.grid.cols / 2, tm.grid.rows / 2];
        const radius = Math.min(center[0], center[1]);
        const circle_fade = 10;

        const diff = [center[0] - x, center[1] - y];
        const distance =
          Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1]) - radius;

        const intensity = (255 * (1 - distance)) / circle_fade;
        tm.charColor(0, intensity, 0);

        // Occasionally change character for glitch effect
        if (Math.random() < 0.1) {
          drop.chars[i] = chars[Math.floor(Math.random() * chars.length)];
        }

        tm.char(drop.chars[i]);
        tm.cellColor(0, 0, 0);
        tm.rect(x, Math.floor(y), 1, 1);

        tm.pop();
      }
    }

    // Update drop position
    drop.y += drop.speed;

    // Reset drop when it goes off screen
    if (drop.y - drop.length > tm.grid.rows) {
      drop.y = Math.random() * -50;
      drop.speed = Math.random() * 0.3 + 0.1;
      drop.length = Math.floor(Math.random() * 15) + 5;

      // Generate new random characters
      for (let i = 0; i < drop.length; i++) {
        drop.chars[i] = chars[Math.floor(Math.random() * chars.length)];
      }
    }
  }

  const time = t.frameCount * 0.01;
  for (let y = 0; y < t.grid.rows; y++) {
    for (let x = 0; x < t.grid.cols; x++) {
      t.push();

      // Normalize coordinates
      const nx = x / tm.grid.cols;
      const ny = y / tm.grid.rows;

      // Create multiple plasma waves
      const plasma1 = Math.sin(nx * 8 + time);
      const plasma2 = Math.sin(ny * 6 + time * 1.3);
      const plasma3 = Math.sin((nx + ny) * 4 + time * 0.8);
      const plasma4 = Math.sin(Math.sqrt(nx * nx + ny * ny) * 12 + time * 1.5);

      // Combine plasma values
      const combined = (plasma1 + plasma2 + plasma3 + plasma4) / 4;
      const intensity = (combined + 1) / 2; // Normalize to 0-1

      // Create rainbow color cycling
      const hue = (intensity + time * 0.5) % 1;
      const saturation = 1.0;
      const lightness = intensity;

      // Convert HSL to RGB
      const hsl2rgb = (h, s, l) => {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
        const m = l - c / 2;
        let r, g, b;

        if (h < 1 / 6) [r, g, b] = [c, x, 0];
        else if (h < 2 / 6) [r, g, b] = [x, c, 0];
        else if (h < 3 / 6) [r, g, b] = [0, c, x];
        else if (h < 4 / 6) [r, g, b] = [0, x, c];
        else if (h < 5 / 6) [r, g, b] = [x, 0, c];
        else [r, g, b] = [c, 0, x];

        return [
          Math.floor((r + m) * 255),
          Math.floor((g + m) * 255),
          Math.floor((b + m) * 255),
        ];
      };

      const [r, g, b] = hsl2rgb(hue, saturation, lightness);
      const color = imageRGB(horseImage, [x, y], resolution);

      if (color[1] >= 1) {
        color[1] = color[1] * 0.9 + ((r + g + b) / 3) * 0.1;
      }

      if (color[1] > 250) {
        t.char("#");
      } else if (color[1] > 200) {
        t.char("@");
      } else if (color[1] > 150) {
        t.char("%");
      } else if (color[1] > 100) {
        t.char("*");
      } else if (color[1] > 50) {
        t.char("+");
      } else {
        t.char(".");
      }

      t.charColor(0, color[1], 0);

      t.cellColor(0, 0, 0);

      // only draw if no "transparency"
      if (color[1] >= 1) {
        t.rect(x, y, 1, 1);
      }

      t.pop();
    }
  }
});

tm.windowResized(onResizeCanvas);
