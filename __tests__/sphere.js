import { Point } from "../src/point";
import { Vector } from "../src/vector";
import { Ray } from "../src/ray";
import { Sphere } from "../src/sphere";

test("a ray intersects a sphere at two points", () => {
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int).toEqual([4, 6]);
});

test("a ray intersects a sphere at a tangent", () => {
  const ray = new Ray(new Point(0, 1, -5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int).toEqual([5, 5]);
});

test("a ray misses a sphere", () => {
  const ray = new Ray(new Point(0, 2, -5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int).toEqual([]);
});

test("a ray originates inside a sphere", () => {
  const ray = new Ray(new Point(0, 0, 0), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int).toEqual([-1, 1]);
});

test("a sphere behind a ray", () => {
  const ray = new Ray(new Point(0, 0, 5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int).toEqual([-6, -4]);
});
