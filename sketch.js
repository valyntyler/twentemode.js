import { loadImage } from "./image.js";

(async () => {
  const jeff = await loadImage("juan.png", [100, 100])
  console.log(jeff)
})();
