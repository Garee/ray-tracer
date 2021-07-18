import { Point, Vector, Ray } from "../src/models";
import { Cylinder } from "../src/models/shapes";

let cylinder;
beforeEach(() => {
  cylinder = Cylinder.of();
});

test("a ray misses a cylinder", () => {
  const testCases = [
    [Point.of({ x: 1 }), Vector.of({ y: 1 })],
    [Point.origin, Vector.of({ y: 1 })],
    [Point.of({ z: -5 }), Vector.of({ x: 1, y: 1, z: 1 })],
  ];
  testCases.forEach((testCase) => {
    const [origin, direction] = testCase;
    const ray = Ray.of({ origin, direction: direction.normalize() });
    const intersections = cylinder.intersect(ray);
    expect(intersections).toHaveLength(0);
  });
});

test("a ray strikes a cylinder", () => {
  const testCases = [
    [Point.of({ x: 1, z: -5 }), Vector.of({ z: 1 }), 5, 5],
    [Point.of({ z: -5 }), Vector.of({ z: 1 }), 4, 6],
    [
      Point.of({ x: 0.5, z: -5 }),
      Vector.of({ x: 0.1, y: 1, z: 1 }),
      6.80798,
      7.08872,
    ],
  ];
  testCases.forEach((testCase) => {
    const [origin, direction, t1, t2] = testCase;
    const ray = Ray.of({ origin, direction: direction.normalize() });
    const intersections = cylinder.intersect(ray);
    expect(intersections).toHaveLength(2);
    expect(intersections[0].t).toBeCloseTo(t1);
    expect(intersections[1].t).toBeCloseTo(t2);
  });
});

test("normal vector on a cylinder", () => {
  const testCases = [
    [Point.of({ x: 1 }), Vector.of({ x: 1 })],
    [Point.of({ y: 5, z: -1 }), Vector.of({ z: -1 })],
    [Point.of({ y: -2, z: 1 }), Vector.of({ z: 1 })],
    [Point.of({ x: -1, y: 1 }), Vector.of({ x: -1 })],
  ];
  testCases.forEach((testCase) => {
    const [point, expectedNormal] = testCase;
    const normal = cylinder.normalAt(point);
    expect(normal).toEqual(expectedNormal);
  });
});

test("the default minimum and maximum for a cylinder", () => {
  expect(cylinder.min).toEqual(-Infinity);
  expect(cylinder.max).toEqual(Infinity);
});

test("intersecting a constrained cylinder", () => {
  const testCases = [
    [Point.of({ y: 1.5 }), Vector.of({ x: 0.1, y: 1 }), 0],
    [Point.of({ y: 3, z: -5 }), Vector.of({ z: 1 }), 0],
    [Point.of({ z: -5 }), Vector.of({ z: 1 }), 0],
    [Point.of({ y: 2, z: -5 }), Vector.of({ z: 1 }), 0],
    [Point.of({ y: 1, z: -5 }), Vector.of({ z: 1 }), 0],
    [Point.of({ y: 1.5, z: -2 }), Vector.of({ z: 1 }), 2],
  ];
  const cylinder = Cylinder.of({
    min: 1,
    max: 2,
  });
  testCases.forEach((testCase) => {
    const [origin, direction, count] = testCase;
    const ray = Ray.of({ origin, direction: direction.normalize() });
    expect(cylinder.intersect(ray)).toHaveLength(count);
  });
});

test("the default closed value for a cylinder", () => {
  expect(cylinder.closed).toBe(false);
});

test("intersecting the caps of a closed cylinder", () => {
  const testCases = [
    [Point.of({ y: 3 }), Vector.of({ y: -1 }), 2],
    [Point.of({ y: 3, z: -2 }), Vector.of({ y: -1, z: 2 }), 2],
    [Point.of({ y: 4, z: -2 }), Vector.of({ y: -1, z: 1 }), 2],
    [Point.of({ z: -2 }), Vector.of({ y: 1, z: 2 }), 2],
    [Point.of({ y: -1, z: -2 }), Vector.of({ y: 1, z: 1 }), 2],
  ];
  cylinder = Cylinder.of({
    min: 1,
    max: 2,
    closed: true,
  });
  testCases.forEach((testCase) => {
    const [origin, direction, count] = testCase;
    const ray = Ray.of({ origin, direction: direction.normalize() });
    const intersections = cylinder.intersect(ray);
    expect(intersections).toHaveLength(count);
  });
});

test("the normal vector on a cylinder's end caps", () => {
  const testCases = [
    [Point.of({ y: 1 }), Vector.of({ y: -1 })],
    [Point.of({ x: 0.5, y: 1 }), Vector.of({ y: -1 })],
    [Point.of({ y: 1, z: 0.5 }), Vector.of({ y: -1 })],
    [Point.of({ y: 2 }), Vector.of({ y: 1 })],
    [Point.of({ x: 0.5, y: 2 }), Vector.of({ y: 1 })],
    [Point.of({ y: 2, z: 0.5 }), Vector.of({ y: 1 })],
  ];
  cylinder = Cylinder.of({
    min: 1,
    max: 2,
    closed: true,
  });
  testCases.forEach((testCase) => {
    const [point, expectedNormal] = testCase;
    const normal = cylinder.normalAt(point);
    expect(normal).toEqual(expectedNormal);
  });
});
