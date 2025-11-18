/**
 * @name [textmode.js] Digital Rain
 * @description Matrix-style falling digital rain using character-based graphics.
 * @author humanbydefinition
 * @link https://github.com/humanbydefinition/textmode.js
 */

console.log("hello from textmode!!")

// Create textmode instance
const tm = textmode.create({
  width: window.innerWidth * 0.6,
  height: window.innerHeight * 0.6,
  fontSize: 16
});

// Rain drop system
const drops = [];
const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

tm.setup(() => {
  // Initialize rain drops
  for (let x = 0; x < tm.grid.cols; x++) {
    drops[x] = {
      y: Math.random() * -50,
      speed: Math.random() * 0.3 + 0.1,
      length: Math.floor(Math.random() * 15) + 5,
      chars: []
    };

    // Generate random characters for this drop
    for (let i = 0; i < drops[x].length; i++) {
      drops[x].chars[i] = chars[Math.floor(Math.random() * chars.length)];
    }
  }
});


tm.draw(() => {
  tm.background(0);

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
        const center = [tm.grid.cols / 2, tm.grid.rows / 2]
        const radius = Math.min(center[0], center[1])
        const circle_fade = 10

        const diff = [center[0] - x, center[1] - y]
        const distance = Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1]) - radius

        const intensity = 255 * (1 - distance) / circle_fade
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
});

tm.windowResized(() => {
  tm.resizeCanvas(window.innerWidth, window.innerHeight);

  // Reinitialize drops for new grid size
  drops.length = 0;
  for (let x = 0; x < tm.grid.cols; x++) {
    drops[x] = {
      y: Math.random() * -50,
      speed: Math.random() * 0.3 + 0.1,
      length: Math.floor(Math.random() * 15) + 5,
      chars: []
    };

    for (let i = 0; i < drops[x].length; i++) {
      drops[x].chars[i] = chars[Math.floor(Math.random() * chars.length)];
    }
  }
});
