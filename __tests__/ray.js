import { Point } from "../src/point";
import { Vector } from "../src/vector";
import { Ray } from "../src/ray";
import { translation, scaling } from "../src/transformations";

test("creating and querying a ray", () => {
  const origin = new Point(1, 2, 3);
  const direction = new Vector(4, 5, 6);
  const ray = new Ray(origin, direction);
  expect(ray.origin).toEqual(origin);
  expect(ray.direction).toEqual(direction);
});

test("computing a point from a distance", () => {
  const ray = new Ray(new Point(2, 3, 4), new Vector(1, 0, 0));
  expect(ray.position(0)).toEqual(new Point(2, 3, 4));
  expect(ray.position(1)).toEqual(new Point(3, 3, 4));
  expect(ray.position(-1)).toEqual(new Point(1, 3, 4));
  expect(ray.position(2.5)).toEqual(new Point(4.5, 3, 4));
});

test("translating a ray", () => {
  const ray = new Ray(new Point(1, 2, 3), new Vector(0, 1, 0));
  const move = translation(3, 4, 5);
  expect(ray.transform(move)).toEqual(
    new Ray(new Point(4, 6, 8), new Vector(0, 1, 0))
  );
});

test("scaling a ray", () => {
  const ray = new Ray(new Point(1, 2, 3), new Vector(0, 1, 0));
  const scale = scaling(2, 3, 4);
  expect(ray.transform(scale)).toEqual(
    new Ray(new Point(2, 6, 12), new Vector(0, 3, 0))
  );
});