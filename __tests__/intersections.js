import { Point, Ray, Vector, Intersection } from "../src/models";
import { Plane, Sphere } from "../src/models/shapes";
import { prepareComputations } from "../src/models/intersections";
import { Epsilon, expectToBeCloseToTuple } from "../src/util";
import { translate } from "../src/models/transformations";

test("precomputing the state of an intersection", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const shape = Sphere.of();
  const int = Intersection.of({ t: 4, object: shape });
  const comps = prepareComputations(int, ray);
  expect(comps.t).toEqual(int.t);
  expect(comps.object).toEqual(int.object);
  expect(comps.point).toEqual(Point.of({ z: -1 }));
  expectToBeCloseToTuple(comps.eye, Vector.of({ z: -1 }));
  expect(comps.normal).toEqual(Vector.of({ z: -1 }));
});

test("the hit, when an intersection occurs on the outside", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const shape = Sphere.of();
  const int = Intersection.of({ t: 4, object: shape });
  const comps = prepareComputations(int, ray);
  expect(comps.inside).toBe(false);
});

test("the hit, when an intersection occurs on the inside", () => {
  const ray = Ray.of({ origin: Point.origin, direction: Vector.of({ z: 1 }) });
  const shape = Sphere.of();
  const int = Intersection.of({ t: 1, object: shape });
  const comps = prepareComputations(int, ray);
  expect(comps.point).toEqual(Point.of({ z: 1 }));
  expectToBeCloseToTuple(comps.eye, Vector.of({ z: -1 }));
  expect(comps.inside).toBe(true);
  expectToBeCloseToTuple(comps.normal, Vector.of({ z: -1 }));
});

test("the hit should offset the point", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const shape = Sphere.of().setTransform(translate({ z: 1 }));
  const int = Intersection.of({ t: 5, object: shape });
  const comps = prepareComputations(int, ray);
  expect(comps.overPoint.z).toBeLessThan(-Epsilon / 2);
  expect(comps.point.z).toBeGreaterThan(comps.overPoint.z);
});

test("precomputing the reflection vector", () => {
  const shape = Plane.of();
  const ray = Ray.of({
    origin: Point.of({ y: 1, z: -1 }),
    direction: Vector.of({ y: -Math.sqrt(2) / 2, z: Math.sqrt(2) / 2 }),
  });
  const intersection = Intersection.of({ t: Math.sqrt(2), object: shape });
  const comps = prepareComputations(intersection, ray);
  expect(comps.reflect).toEqual(
    Vector.of({ y: Math.sqrt(2) / 2, z: Math.sqrt(2) / 2 })
  );
});
