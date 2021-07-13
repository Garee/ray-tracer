import { Canvas, Color } from "../src/models";

test("create a canvas", () => {
  const c = Canvas.of({ width: 10, height: 20 });
  expect(c.width).toBe(10);
  expect(c.height).toBe(20);
  c.pixels.forEach((p) => expect(p).toEqual(Color.black));
});

test("write pixels to a canvas", () => {
  let c = Canvas.of({ width: 10, height: 20 });
  c = c.writePixel({ x: 2, y: 3, color: Color.red });
  const px = c.getPixel({ x: 2, y: 3 });
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
    .writePixel({ x: 0, y: 0, color: Color.of({ r: 1.5 }) })
    .writePixel({ x: 2, y: 1, color: Color.of({ g: 0.5 }) })
    .writePixel({ x: 4, y: 2, color: Color.of({ r: -0.5, b: 1 }) });
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
