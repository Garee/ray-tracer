import { Camera, Matrix, Point, Vector, Color, World } from "../src/models";
import { rotateY, translate, view } from "../src/models/transformations";
import { toRadians } from "../src/util/maths";

test("constructing a camera", () => {
  const width = 160;
  const height = 120;
  const fov = 90;
  const camera = Camera.of({ width, height, fov });
  expect(camera.width).toEqual(width);
  expect(camera.height).toEqual(height);
  expect(camera.fov).toEqual(toRadians(fov));
  expect(camera.transform).toEqual(Matrix.identity);
});

test("the pixel size for a horizontal canvas", () => {
  const camera = Camera.of({ width: 200, height: 125, fov: 90 });
  expect(camera.pixelSize).toBeCloseTo(0.01);
});

test("the pixel size for a vertical canvas", () => {
  const camera = Camera.of({ width: 125, height: 200, fov: 90 });
  expect(camera.pixelSize).toBeCloseTo(0.01);
});

test("constructing a ray through the center of the canvas", () => {
  const camera = Camera.of({ width: 201, height: 101, fov: 90 });
  const ray = camera.rayForPixelAt(100, 50);
  expect(ray.origin).toEqual(new Point());
  const expected = new Vector(0, 0, -1);
  expect(ray.direction.fixed).toEqual(expected.fixed);
});

test("constructing a ray through a corner of the canvas", () => {
  const camera = Camera.of({ width: 201, height: 101, fov: 90 });
  const ray = camera.rayForPixelAt(0, 0);
  expect(ray.origin).toEqual(new Point());
  const expected = new Vector(0.66519, 0.33259, -0.66851);
  expect(ray.direction.fixed).toEqual(expected.fixed);
});

test("constructing a ray when the camera is transformed", () => {
  const camera = Camera.of({
    width: 201,
    height: 101,
    fov: 90,
  }).setTransform(rotateY(45).multiply(translate({ y: -2, z: 5 })));
  const ray = camera.rayForPixelAt(100, 50);
  expect(ray.origin).toEqual(new Point(0, 2, -5));
  const expected = new Vector(Math.sqrt(2) / 2, 0, -Math.sqrt(2) / 2);
  expect(ray.direction.fixed).toEqual(expected.fixed);
});

test("rendering a world with a camera", () => {
  const world = World.default();
  const from = Point.of({ z: -5 });
  const to = Point.origin;
  const up = Vector.of({ y: 1 });
  const camera = Camera.of({
    width: 11,
    height: 11,
    fov: 90,
  }).setTransform(view({ from, to, up }));
  const canvas = camera.render(world);
  expect(canvas).toBeDefined();
  const color = canvas.getPixel({ x: 5, y: 5 });
  const expected = Color.of({ r: 0.38066, g: 0.47583, b: 0.2855 });
  expect(color.fixed).toEqual(expected.fixed);
});
