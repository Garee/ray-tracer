import { Canvas } from "./canvas";
import { Color } from "./color";
import { Sphere } from "./sphere";
import { Ray } from "./ray";
import { Point } from "./point";
import { hit } from "./intersection";
import { Light, lighting } from "./light";
import { Material } from "./material";

const Colors = {
  white: new Color(1, 1, 1),
  black: new Color(0, 0, 0),
  red: new Color(1, 0, 0),
  green: new Color(0, 1, 0),
  blue: new Color(0, 0, 1),
};

const width = 100;
const height = 100;
let c = new Canvas(width, height).fill(Colors.black);

const sphere = new Sphere().setMaterial(
  new Material({ color: new Color(0, 1, 0) })
);
const light = new Light(new Point(-10, 10, -10), Colors.white);

const wallSize = 7;
const wallZ = 10;
const cameraZ = -5;
const origin = new Point(0, 0, cameraZ);

function colorPixels() {
  const pxSize = wallSize / height;
  for (let x = 0; x < width; x++) {
    const worldX = -(wallSize / 2) + pxSize * x;
    for (let y = 0; y < height; y++) {
      const worldY = wallSize / 2 - pxSize * y;

      const target = new Point(worldX, worldY, wallZ);
      const direction = target.subtract(origin).normalize();
      const ray = new Ray(origin, direction);

      const int = hit(sphere.intersect(ray));
      if (int) {
        const { t, obj } = int;
        const point = ray.position(t);
        const normal = obj.normalAt(point);
        const eye = ray.direction.multiply(-1);
        const color = lighting(obj.material, light, point, eye, normal);
        c = c.writePixel(x, y, color);
      }
    }
  }
}

function render() {
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

setTimeout(() => {
  colorPixels();
  render();
});
