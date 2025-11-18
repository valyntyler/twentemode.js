console.log("Hello, textmode.js!");
const t = textmode.create({
  width: window.innerWidth,
  height: window.innerHeight,
  fontSize: 16,
  frameRate: 60,
});
const tm = t;

t.setup(async () => {
  myImage = await t.loadImage("twente.svg");
});

t.draw(async () => {
  t.background(0);
  console.log(t.characters);

  for (let y = 0; y < t.grid.rows; y++) {
    for (let x = 0; x < t.grid.cols; x++) {
      t.push();

      const center = [t.grid.cols / 2, t.grid.rows / 2]
      const radius = 25
      const fade = 25

      const diff = [center[0] - x, center[1] - y]
      const distance = Math.sqrt(diff[0] * diff[0] + diff[1] * diff[1]) - radius

      const blue = 255 * (1 - distance) / fade
      const red = 120 * (1 - distance) / fade

      t.char(".");
      t.charColor(red, 0, blue);

      t.cellColor(0, 0, 0);
      t.rect(x, y, 1, 1);

      t.pop();
    }
  }
});

t.windowResized(() => {
  t.resizeCanvas(window.innerWidth, window.innerHeight);
});
