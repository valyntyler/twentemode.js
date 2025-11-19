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

const noiseShader = t.createFilterShader(`#version 300 es
precision highp float;

in vec2 v_uv;
in vec3 v_character;
in vec4 v_primaryColor;
in vec4 v_secondaryColor;
in vec2 v_rotation;
in vec3 v_transform;

uniform float u_frameCount;

layout(location = 0) out vec4 o_character;
layout(location = 1) out vec4 o_primaryColor;
layout(location = 2) out vec4 o_secondaryColor;
layout(location = 3) out vec4 o_rotation;
layout(location = 4) out vec4 o_transform;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  vec2 gridPos = floor(gl_FragCoord.xy);
  float noise = random(gridPos + u_frameCount * 0.1);

  o_character = vec4(0.01, 0.0, 0.0, 1.0);
  o_primaryColor = vec4(vec3(1.0), 1.0);
  o_secondaryColor = vec4(0.0, 0.0, 0.0, 1.0);
  o_rotation = vec4(0.0, 0.0, 0.0, 1.0);
  o_transform = vec4(0.0, 0.0, 0.0, 1.0);
}`);

// t.draw(() => {
//   t.shader(noiseShader);
//   t.setUniform('u_frameCount', t.frameCount);
//   t.rect(0, 0, t.grid.cols, t.grid.rows);
// });

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

  t.shader(noiseShader);
  // t.image(myImage, 0, 0, t.grid.cols, t.grid.rows);
});

t.windowResized(() => {
  t.resizeCanvas(window.innerWidth, window.innerHeight);
});
