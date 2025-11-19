import { loadImage } from "./image.js";

console.log("Hello, textmode.js!");
const t = textmode.create({
  width: window.innerWidth,
  height: window.innerHeight,
  fontSize: 16,
  frameRate: 60,
});

t.setup(async () => {
  const jeff = await loadImage("juan.png", [100, 100])
  console.log(jeff)
});

t.draw(async () => {
  t.background(0);
  console.log("hello from this frame");

  for (let y = 0; y < t.grid.rows; y++) {
    for (let x = 0; x < t.grid.cols; x++) {
      t.push();

      t.char(".");
      t.charColor(120, 0, 255);

      t.cellColor(0, 0, 0);
      t.rect(x, y, 1, 1);

      t.pop();
    }
  }
});

t.windowResized(() => {
  t.resizeCanvas(window.innerWidth, window.innerHeight);
});
