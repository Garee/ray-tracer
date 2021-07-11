import { Plane } from "../src/models/shapes";
import { Point, Vector, Ray, Intersection } from "../src/models";

let plane;

beforeEach(() => {
  plane = new Plane();
});

test("the normal of a plane is constant everywhere", () => {
  const n1 = plane.normalAt(Point.origin);
  const n2 = plane.normalAt(Point.of({ x: 10, z: -10 }));
  const n3 = plane.normalAt(Point.of({ x: -5, z: 150 }));
  [n1, n2, n3].forEach((n) => expect(n).toEqual(Vector.of({ y: 1 })));
});

test("intersect with a ray parallel to the plane", () => {
  const ray = Ray.of({
    origin: Point.of({ y: 10 }),
    direction: Vector.of({ z: 1 }),
  });
  expect(plane.intersect(ray)).toEqual([]);
});

test("intersect with a coplanar ray", () => {
  const ray = Ray.of({ direction: Vector.of({ z: 1 }) });
  expect(plane.intersect(ray)).toEqual([]);
});

test("a ray intersecting a plane from above", () => {
  const ray = Ray.of({
    origin: Point.of({ y: 1 }),
    direction: Vector.of({ y: -1 }),
  });
  const ints = plane.intersect(ray);
  expect(ints).toEqual([new Intersection(1, plane)]);
});

test("a ray intersecting a plane from below", () => {
  const ray = Ray.of({
    origin: Point.of({ y: -1 }),
    direction: Vector.of({ y: 1 }),
  });
  const ints = plane.intersect(ray);
  expect(ints).toEqual([new Intersection(1, plane)]);
});
