import { Point, Ray, Vector } from "../src/models";
import { prepareComputations } from "../src/models/intersections";
import { SmoothTriangle } from "../src/models/shapes";
import { expectToBeCloseToTuple } from "../src/util";

let triangle;
beforeEach(() => {
  const p1 = Point.of({ y: 1 });
  const p2 = Point.of({ x: -1 });
  const p3 = Point.of({ x: 1 });
  const n1 = Vector.of({ y: 1 });
  const n2 = Vector.of({ x: -1 });
  const n3 = Vector.of({ x: 1 });
  triangle = SmoothTriangle.of({ p1, p2, p3, n1, n2, n3 });
});

test("constructing a smooth triangle", () => {
  expect(triangle.p1).toEqual(Point.of({ y: 1 }));
  expect(triangle.p2).toEqual(Point.of({ x: -1 }));
  expect(triangle.p3).toEqual(Point.of({ x: 1 }));
  expect(triangle.n1).toEqual(Vector.of({ y: 1 }));
  expect(triangle.n2).toEqual(Vector.of({ x: -1 }));
  expect(triangle.n3).toEqual(Vector.of({ x: 1 }));
});

test("an intersection with a smooth triangle stores u and v", () => {
  const ray = Ray.of({
    origin: Point.of({ x: -0.2, y: 0.3, z: -2 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersection = triangle._intersect(ray);
  const { u, v } = intersection[0];
  expect(u).toBeCloseTo(0.45);
  expect(v).toBeCloseTo(0.25);
});

test("a smooth triangle uses u and v to interpolate the normal", () => {
  const intersection = triangle.intersectWithUV(1, 0.45, 0.25);
  const normal = triangle.normalAt(Point.origin, intersection);
  expect(normal).toBeDefined();
  expectToBeCloseToTuple(normal, Vector.of({ x: -0.5547, y: 0.83205 }));
});

test("preparing the normal on a smooth triangle", () => {
  const intersection = triangle.intersectWithUV(1, 0.45, 0.25);
  const ray = Ray.of({
    origin: Point.of({ x: -0.2, y: 0.3, z: -2 }),
    direction: Vector.of({ z: 1 }),
  });
  const comps = prepareComputations(intersection, ray, [intersection]);
  expect(comps.normal).toBeDefined();
  expectToBeCloseToTuple(comps.normal, Vector.of({ x: -0.5547, y: 0.83205 }));
});
