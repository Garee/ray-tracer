import { Point, Vector, Ray } from "../src/models";
import { Triangle } from "../src/models/shapes";
import { expectToBeCloseToTuple } from "../src/util";

let triangle;
beforeEach(() => {
  triangle = Triangle.of({
    p1: Point.of({ y: 1 }),
    p2: Point.of({ x: -1 }),
    p3: Point.of({ x: 1 }),
  });
});

test("constructing a triangle", () => {
  expect(triangle.p1).toEqual(Point.of({ y: 1 }));
  expect(triangle.p2).toEqual(Point.of({ x: -1 }));
  expect(triangle.p3).toEqual(Point.of({ x: 1 }));
  expect(triangle.e1).toEqual(Vector.of({ x: -1, y: -1 }));
  expect(triangle.e2).toEqual(Vector.of({ x: 1, y: -1 }));
  expectToBeCloseToTuple(triangle.normal, Vector.of({ z: -1 }));
});

test("finding a normal on a triangle", () => {
  expect(triangle._normalAt(Point.of({ y: 0.5 }))).toEqual(triangle.normal);
  expect(triangle._normalAt(Point.of({ x: -0.5, y: 0.75 }))).toEqual(
    triangle.normal
  );
  expect(triangle._normalAt(Point.of({ x: 0.5, y: 0.25 }))).toEqual(
    triangle.normal
  );
});

test("intersecting a ray parallel to the triangle", () => {
  const ray = Ray.of({
    origin: Point.of({ y: -1, z: -2 }),
    direction: Vector.of({ y: 1 }),
  });
  const intersections = triangle._intersect(ray);
  expect(intersections).toHaveLength(0);
});

test("a ray misses the p1-p3 edge", () => {
  const ray = Ray.of({
    origin: Point.of({ x: 1, y: 1, z: -2 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = triangle._intersect(ray);
  expect(intersections).toHaveLength(0);
});

test("a ray misses the p1-p2 edge", () => {
  const ray = Ray.of({
    origin: Point.of({ x: -1, y: 1, z: -2 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = triangle._intersect(ray);
  expect(intersections).toHaveLength(0);
});

test("a ray misses the p2-p3 edge", () => {
  const ray = Ray.of({
    origin: Point.of({ y: -1, z: -2 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = triangle._intersect(ray);
  expect(intersections).toHaveLength(0);
});

test("a ray strikes a triangle", () => {
  const ray = Ray.of({
    origin: Point.of({ y: 0.5, z: -2 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = triangle._intersect(ray);
  expect(intersections).toHaveLength(1);
  expect(intersections[0].t).toEqual(2);
});
