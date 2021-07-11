import { Camera, Matrix, Point, Vector, Color, World } from "../src/models";
import {
  rotationY,
  translation,
  viewTransform,
} from "../src/models/transformations";
import { expectToBeCloseToTuple } from "../src/util";

test("constructing a camera", () => {
  const width = 160;
  const height = 120;
  const fov = Math.PI / 2;
  const camera = new Camera(width, height, fov);
  expect(camera.width).toEqual(width);
  expect(camera.height).toEqual(height);
  expect(camera.fov).toEqual(fov);
  expect(camera.transform).toEqual(Matrix.identity);
});

test("the pixel size for a horizontal canvas", () => {
  const camera = new Camera(200, 125, Math.PI / 2);
  expect(camera.pixelSize).toBeCloseTo(0.01);
});

test("the pixel size for a vertical canvas", () => {
  const camera = new Camera(125, 200, Math.PI / 2);
  expect(camera.pixelSize).toBeCloseTo(0.01);
});

test("constructing a ray through the center of the canvas", () => {
  const camera = new Camera(201, 101, Math.PI / 2);
  const ray = camera.rayForPixelAt(100, 50);
  expect(ray.origin).toEqual(new Point());
  expectToBeCloseToTuple(ray.direction, new Vector(0, 0, -1));
});

test("constructing a ray through a corner of the canvas", () => {
  const camera = new Camera(201, 101, Math.PI / 2);
  const ray = camera.rayForPixelAt(0, 0);
  expect(ray.origin).toEqual(new Point());
  expectToBeCloseToTuple(ray.direction, new Vector(0.66519, 0.33259, -0.66851));
});

test("constructing a ray when the camera is transformed", () => {
  const camera = new Camera(201, 101, Math.PI / 2).setTransform(
    rotationY(Math.PI / 4).multiply(translation(0, -2, 5))
  );
  const ray = camera.rayForPixelAt(100, 50);
  expect(ray.origin).toEqual(new Point(0, 2, -5));
  expectToBeCloseToTuple(
    ray.direction,
    new Vector(Math.sqrt(2) / 2, 0, -Math.sqrt(2) / 2)
  );
});

test("rendering a world with a camera", () => {
  const world = World.default();
  const from = new Point(0, 0, -5);
  const to = new Point();
  const up = new Vector(0, 1, 0);
  const camera = new Camera(11, 11, Math.PI / 2).setTransform(
    viewTransform(from, to, up)
  );
  const canvas = camera.render(world);
  expect(canvas).toBeDefined();
  expectToBeCloseToTuple(
    canvas.getPixel(5, 5),
    Color.of({ r: 0.38066, g: 0.47583, b: 0.2855 })
  );
});
