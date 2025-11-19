import { loadImage, imageRGB } from "./image.js";

let resolution = null;
let horseImage = null;

console.log("Hello, textmode.js!");
const t = textmode.create({
  width: window.innerWidth,
  height: window.innerHeight,
  fontSize: 16,
  frameRate: 60,
});

t.setup(async () => {
  resolution = [t.grid.cols, t.grid.rows]
  horseImage = await loadImage("twente.svg", resolution)

  console.log(horseImage.data)
});

t.draw(async () => {
  t.background(0);
  console.log("hello from this frame!!");

  for (let y = 0; y < t.grid.rows; y++) {
    for (let x = 0; x < t.grid.cols; x++) {
      t.push();

      const color = imageRGB(horseImage, [x, y], resolution)

      t.char(".");
      t.charColor(0, color[1], 0)

      t.cellColor(0, 0, 0);
      t.rect(x, y, 1, 1);

      t.pop();
    }
  }
});

t.windowResized(() => {
  t.resizeCanvas(window.innerWidth, window.innerHeight);
});
