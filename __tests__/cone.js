import { Cone } from "../src/models/shapes";
import { Point, Vector, Ray } from "../src/models";

let cone;
beforeEach(() => {
  cone = Cone.of();
});

test("intersecting a cone with a ray", () => {
  const testCases = [
    [Point.of({ z: -5 }), Vector.of({ z: 1 }), 5, 5],
    [Point.of({ z: -5 }), Vector.of({ x: 1, y: 1, z: 1 }), 8.66025, 8.66025],
    [
      Point.of({ x: 1, y: 1, z: -5 }),
      Vector.of({ x: -0.5, y: -1, z: 1 }),
      4.55006,
      49.44994,
    ],
  ];
  testCases.forEach((testCase) => {
    const [origin, direction, t0, t1] = testCase;
    const ray = Ray.of({ origin, direction: direction.normalize() });
    const intersections = cone.intersect(ray);
    expect(intersections).toHaveLength(2);
    expect(intersections[0].t).toBeCloseTo(t0);
    expect(intersections[1].t).toBeCloseTo(t1);
  });
});

test("intersecting a cone with a ray parallel to one of its halves", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -1 }),
    direction: Vector.of({ y: 1, z: 1 }).normalize(),
  });
  const intersections = cone.intersect(ray);
  expect(intersections).toHaveLength(1);
  expect(intersections[0].t).toBeCloseTo(0.35355);
});

test("intersecting a cone's end caps", () => {
  const testCases = [
    [Point.of({ z: -5 }), Vector.of({ y: 1 }), 0],
    [Point.of({ z: -0.25 }), Vector.of({ y: 1, z: 1 }), 2],
    [Point.of({ z: -0.25 }), Vector.of({ y: -1 }), 4],
  ];
  cone = Cone.of({
    min: -0.5,
    max: 0.5,
    closed: true,
  });
  testCases.forEach((testCase) => {
    const [origin, direction, count] = testCase;
    const ray = Ray.of({ origin, direction: direction.normalize() });
    const intersections = cone.intersect(ray);
    expect(intersections).toHaveLength(count);
  });
});

test("computing the normal vector on a cone", () => {
  const testCases = [
    [Point.origin, Vector.of()],
    [
      Point.of({ x: 1, y: 1, z: 1 }),
      Vector.of({ x: 1, y: -Math.sqrt(2), z: 1 }),
    ],
    [Point.of({ x: -1, y: -1 }), Vector.of({ x: -1, y: 1 })],
  ];
  testCases.forEach((testCase) => {
    const [point, expectedNormal] = testCase;
    const normal = cone._normalAt(point);
    expect(normal).toEqual(expectedNormal);
  });
});
