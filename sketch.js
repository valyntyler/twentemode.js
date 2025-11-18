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

      t.char(".");
      t.charColor(120, 0, 255);

      t.cellColor(0, 0, 0);
      t.rect(x, y, 1, 1);

      t.pop();
    }
  }

  t.image(myImage, 0, 0, t.grid.cols, t.grid.rows);
});

t.windowResized(() => {
  t.resizeCanvas(window.innerWidth, window.innerHeight);
});
