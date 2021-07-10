import { Plane } from "../src/plane";
import { Point } from "../src/point";
import { Vector } from "../src/vector";
import { Ray } from "../src/ray";
import { Intersection } from "../src/intersection";

test("the normal of a plane is constant everywhere", () => {
  const plane = new Plane();
  const n1 = plane.normalAt(new Point(0, 0, 0));
  const n2 = plane.normalAt(new Point(10, 0, -10));
  const n3 = plane.normalAt(new Point(-5, 0, 150));
  [n1, n2, n3].forEach((n) => expect(n).toEqual(new Vector(0, 1, 0)));
});

test("intersect with a ray parallel to the plane", () => {
  const plane = new Plane();
  const ray = new Ray(new Point(0, 10, 0), new Vector(0, 0, 1));
  expect(plane.intersect(ray)).toEqual([]);
});

test("intersect with a coplanar ray", () => {
  const plane = new Plane();
  const ray = new Ray(new Point(), new Vector(0, 0, 1));
  expect(plane.intersect(ray)).toEqual([]);
});

test("a ray intersecting a plane from above", () => {
  const plane = new Plane();
  const ray = new Ray(new Point(0, 1, 0), new Vector(0, -1, 0));
  const ints = plane.intersect(ray);
  expect(ints).toEqual([new Intersection(1, plane)]);
});

test("a ray intersecting a plane from below", () => {
  const plane = new Plane();
  const ray = new Ray(new Point(0, -1, 0), new Vector(0, 1, 0));
  const ints = plane.intersect(ray);
  expect(ints).toEqual([new Intersection(1, plane)]);
});
