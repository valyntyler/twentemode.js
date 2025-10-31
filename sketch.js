// sketch.js
const t = textmode.create({
  width: window.innerWidth,
  height: window.innerHeight,
  fontSize: 16,
  frameRate: 60,
});

t.setup(() => {
  // Optional setup code here (e.g., load fonts/shaders, initialize variables that access 't')
});

t.draw(() => {
  t.background(32); // Dark gray background

  t.char("A");
  t.charColor(255, 0, 0); // Cover the top-left quarter of the grid with a rectangle of red 'A's
  t.rect(0, 0, t.grid.cols / 2, t.grid.rows / 2);

  // ...add your drawing code here!
});

t.windowResized(() => {
  t.resizeCanvas(window.innerWidth, window.innerHeight);
});
