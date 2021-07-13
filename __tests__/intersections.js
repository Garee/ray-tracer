import { Point, Ray, Vector, Intersection } from "../src/models";
import { Sphere } from "../src/models/shapes";
import { prepareComputations } from "../src/models/intersections";
import { expectToBeCloseToTuple } from "../src/util";
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
  expect(comps.overPoint.z).toBeLessThan(-0.000001 / 2);
  expect(comps.point.z).toBeGreaterThan(comps.overPoint.z);
});
