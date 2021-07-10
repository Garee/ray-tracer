import { Color, Black } from "../src/color";
import { Canvas } from "../src/canvas";

test("create a canvas", () => {
  const c = new Canvas(10, 20);
  expect(c.width).toBe(10);
  expect(c.height).toBe(20);
  const white = Black;
  c.pixels.forEach((p) => expect(p).toEqual(white));
});

test("write pixels to a canvas", () => {
  let c = new Canvas(10, 20);
  const red = new Color(1, 0, 0);
  c = c.writePixel(2, 3, red);
  const px = c.getPixel(2, 3);
  expect(px).toEqual(red);
});

test("create a PPM header from a cavas", () => {
  const c = new Canvas(5, 3);
  const ppm = c.toPpm();
  const header = ppm.slice(0, 3);
  expect(header).toEqual(["P3", "5 3", "255"]);
});

test("create a PPM file from a canvas", () => {
  let c = new Canvas(5, 3)
    .writePixel(0, 0, new Color(1.5, 0, 0))
    .writePixel(2, 1, new Color(0, 0.5, 0))
    .writePixel(4, 2, new Color(-0.5, 0, 1));
  const ppm = c.toPpm();
  expect(ppm.slice(3, ppm.length - 1)).toEqual([
    "255 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
    "0 0 0 0 0 0 0 128 0 0 0 0 0 0 0",
    "0 0 0 0 0 0 0 0 0 0 0 0 0 0 255",
  ]);
});

test("PPM file lines have a max length of 70", () => {
  const c = new Canvas(10, 2).fill(new Color(1, 0.8, 0.6));
  const ppm = c.toPpm();
  expect(ppm.slice(3, ppm.length - 1)).toEqual([
    "255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204",
    "153 255 204 153 255 204 153 255 204 153 255 204 153",
    "255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204",
    "153 255 204 153 255 204 153 255 204 153 255 204 153",
  ]);
});

test("PPM files always end with a newline", () => {
  const c = new Canvas(5, 3);
  const ppm = c.toPpm();
  expect(ppm.pop()).toEqual("\n");
});
