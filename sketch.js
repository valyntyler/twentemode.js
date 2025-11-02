console.log("Hello, textmode.js!");
const t = textmode.create({
  width: window.innerWidth,
  height: window.innerHeight,
  fontSize: 16,
  frameRate: 60,
});
const tm = t;

t.setup(async () => {
  myImage = await t.loadImage("juan.png");
});

t.draw(async () => {
  t.background(0);

  for (let y = 0; y < t.grid.rows; y++) {
    for (let x = 0; x < t.grid.cols; x++) {
      tm.push();

      tm.char(".");
      tm.charColor(120, 0, 255);

      tm.cellColor(0, 0, 0);
      tm.rect(x, y, 1, 1);

      tm.pop();
    }
  }

  t.image(myImage, 0, 0, t.grid.cols, t.grid.rows);
});

t.windowResized(() => {
  t.resizeCanvas(window.innerWidth, window.innerHeight);
});
