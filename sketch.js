// sketch.js
const t = textmode.create({
  width: window.innerWidth,
  height: window.innerHeight,
  fontSize: 16,
  frameRate: 60,
});

const hello = ": HELLO, WORLD! :";

t.setup(() => {
  // Optional setup code here (e.g., load fonts/shaders, initialize variables that access 't')
});

t.draw(() => {
  t.background(0);

  const time = t.frameCount * 0.3;

  for (let y = 0; y < t.grid.rows; y++) {
    for (let x = 0; x < t.grid.cols; x++) {
      t.push();

      pos = Math.round(time) + x + 4 * y;

      t.char(hello[pos % hello.length]);
      t.charColor((24 * 255) / (x + y + 1), 0, 0);
      t.cellColor(0, 0, 0);
      t.rect(x, y, 1, 1);

      t.pop();
    }
  }
});

t.windowResized(() => {
  t.resizeCanvas(window.innerWidth, window.innerHeight);
});
