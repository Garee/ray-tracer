import { Point, Vector, Ray } from "../src/models";
import { Cube } from "../src/models/shapes";

let cube;
beforeEach(() => {
  cube = Cube.of();
});

test("a ray intersects a cube", () => {
  const testCases = [
    [Point.of({ x: 5, y: 0.5 }), Vector.of({ x: -1 }), 4, 6],
    [Point.of({ x: -5, y: 0.5 }), Vector.of({ x: 1 }), 4, 6],
    [Point.of({ x: 0.5, y: 5 }), Vector.of({ y: -1 }), 4, 6],
    [Point.of({ x: 0.5, y: -5 }), Vector.of({ y: 1 }), 4, 6],
    [Point.of({ x: 0.5, z: -5 }), Vector.of({ z: 1 }), 4, 6],
    [Point.of({ y: 0.5 }), Vector.of({ z: 1 }), -1, 1],
  ];
  testCases.forEach((testCase) => {
    const [origin, direction, t1, t2] = testCase;
    const ray = Ray.of({ origin, direction });
    const intersections = cube.intersect(ray);
    expect(intersections).toHaveLength(2);
    expect(intersections[0].t).toEqual(t1);
    expect(intersections[1].t).toEqual(t2);
  });
});

test("a ray misses a cube", () => {
  const testCases = [
    [Point.of({ x: -2 }), Vector.of({ x: 0.2673, y: 0.5345, z: 0.8018 })],
    [Point.of({ y: -2 }), Vector.of({ x: 0.8018, y: 0.2673, z: 0.5345 })],
    [Point.of({ z: -2 }), Vector.of({ x: 0.5345, y: 0.8108, z: 0.2673 })],
    [Point.of({ x: 2, z: 2 }), Vector.of({ z: -1 })],
    [Point.of({ y: 2, z: 2 }), Vector.of({ y: -1 })],
    [Point.of({ x: 2, y: 2 }), Vector.of({ x: -1 })],
  ];
  testCases.forEach((testCase) => {
    const [origin, direction] = testCase;
    const ray = Ray.of({ origin, direction });
    const intersections = cube.intersect(ray);
    expect(intersections).toHaveLength(0);
  });
});

test("the normal on the surface of a cube", () => {
  const testCases = [
    [Point.of({ x: 1, y: 0.5, z: -0.8 }), Vector.of({ x: 1 })],
    [Point.of({ x: -1, y: -0.2, z: 0.9 }), Vector.of({ x: -1 })],
    [Point.of({ x: -0.4, y: 1, z: -0.1 }), Vector.of({ y: 1 })],
    [Point.of({ x: 0.3, y: -1, z: -0.7 }), Vector.of({ y: -1 })],
    [Point.of({ x: -0.6, y: 0.3, z: 1 }), Vector.of({ z: 1 })],
    [Point.of({ x: 0.4, y: 0.4, z: -1 }), Vector.of({ z: -1 })],
    [Point.of({ x: 1, y: 1, z: 1 }), Vector.of({ x: 1 })],
    [Point.of({ x: -1, y: -1, z: -1 }), Vector.of({ x: -1 })],
  ];
  testCases.forEach((testCase) => {
    const [point, expectedNormal] = testCase;
    const normal = cube.normalAt(point);
    expect(normal).toEqual(expectedNormal);
  });
});
