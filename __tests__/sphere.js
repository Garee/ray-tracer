import { Point } from "../src/point";
import { Vector } from "../src/vector";
import { Ray } from "../src/ray";
import { Sphere } from "../src/sphere";
import { Matrix } from "../src/matrix";
import { translation, scaling } from "../src/transformations";

test("a ray intersects a sphere at two points", () => {
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.t)).toEqual([4, 6]);
});

test("a ray intersects a sphere at a tangent", () => {
  const ray = new Ray(new Point(0, 1, -5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.t)).toEqual([5, 5]);
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
  expect(int.map((i) => i.t)).toEqual([-1, 1]);
});

test("a sphere behind a ray", () => {
  const ray = new Ray(new Point(0, 0, 5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.t)).toEqual([-6, -4]);
});

test("intersect sets the object on the intersection", () => {
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.obj)).toEqual([sphere, sphere]);
});

test("a sphere's default transformation", () => {
  const sphere = new Sphere();
  expect(sphere.transform).toEqual(Matrix.identity());
});

test("changing a sphere's transformation", () => {
  const sphere = new Sphere();
  const transform = translation(2, 3, 4);
  sphere.setTransform(transform);
  expect(sphere.transform).toEqual(transform);
});

test("intersecting a scaled sphere with a ray", () => {
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  sphere.setTransform(scaling(2, 2, 2));
  const ints = sphere.intersect(ray);
  expect(ints.map((i) => i.t)).toEqual([3, 7]);
});

test("intersecting a translated sphere with a ray", () => {
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  sphere.setTransform(translation(5, 0, 0));
  const ints = sphere.intersect(ray);
  expect(ints.map((i) => i.t)).toEqual([]);
});
