import { Point } from "./point";
import { Canvas } from "./canvas";
import { Color } from "./color";
import { translation } from "./transformations";

const white = new Color(1, 1, 1);
const black = new Color(0, 0, 0);

const width = 900;
const height = 550;
let c = new Canvas(width, height).fill(black);

function render(c) {
  const el = document.getElementById("canvas");
  const ctx = el.getContext("2d");

  const imageData = ctx.createImageData(c.width, c.height);
  c.scalePixels().forEach((p, i) => {
    const idx = i * 4;
    imageData.data[idx] = p.red;
    imageData.data[idx + 1] = p.green;
    imageData.data[idx + 2] = p.blue;
    imageData.data[idx + 3] = 255;
  });

  ctx.putImageData(imageData, 0, 0);
}

function renderCrossAt(p, c) {
  const x = Math.round(p.x);
  const y = Math.round(p.y);
  return c
    .writePixel(x, y, white)
    .writePixel(x, y - 1, white)
    .writePixel(x, y + 1, white)
    .writePixel(x - 1, y, white)
    .writePixel(x + 1, y, white);
}

const radius = width / 8;
const center = new Point(width / 2, height / 2, 0);
c = renderCrossAt(center, c);

const twelve = translation(0, -radius, 0).multiply(center);
c = renderCrossAt(twelve, c);

render(c);
