import { Canvas, Color } from "../src/models";

test("create a canvas", () => {
  const c = Canvas.of({ width: 10, height: 20 });
  expect(c.width).toBe(10);
  expect(c.height).toBe(20);
  c.pixels.forEach((p) => expect(p).toEqual(Color.black));
});

test("write pixels to a canvas", () => {
  let c = Canvas.of({ width: 10, height: 20 });
  c = c.writePixel(2, 3, Color.red);
  const px = c.getPixel(2, 3);
  expect(px).toEqual(Color.red);
});

test("create a PPM header from a cavas", () => {
  const c = Canvas.of({ width: 5, height: 3 });
  const ppm = c.toPpm();
  const header = ppm.slice(0, 3);
  expect(header).toEqual(["P3", "5 3", "255"]);
});

test("create a PPM file from a canvas", () => {
  let c = Canvas.of({ width: 5, height: 3 })
    .writePixel(0, 0, Color.of({ r: 1.5 }))
    .writePixel(2, 1, Color.of({ g: 0.5 }))
    .writePixel(4, 2, Color.of({ r: -0.5, b: 1 }));
  const ppm = c.toPpm();
  expect(ppm.slice(3, ppm.length - 1)).toEqual([
    "255 0 0 0 0 0 0 0 0 0 0 0 0 0 0",
    "0 0 0 0 0 0 0 128 0 0 0 0 0 0 0",
    "0 0 0 0 0 0 0 0 0 0 0 0 0 0 255",
  ]);
});

test("PPM file lines have a max length of 70", () => {
  const c = Canvas.of({ width: 10, height: 2 }).fill(
    Color.of({ r: 1, g: 0.8, b: 0.6 })
  );
  const ppm = c.toPpm();
  expect(ppm.slice(3, ppm.length - 1)).toEqual([
    "255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204",
    "153 255 204 153 255 204 153 255 204 153 255 204 153",
    "255 204 153 255 204 153 255 204 153 255 204 153 255 204 153 255 204",
    "153 255 204 153 255 204 153 255 204 153 255 204 153",
  ]);
});

test("PPM files always end with a newline", () => {
  const c = Canvas.of({ width: 5, height: 3 });
  const ppm = c.toPpm();
  expect(ppm.pop()).toEqual("\n");
});
