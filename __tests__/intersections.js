import { Point, Ray, Vector, Intersection } from "../src/models";
import { Plane, Sphere } from "../src/models/shapes";
import { prepareComputations, schlick } from "../src/models/intersections";
import { Epsilon, expectToBeCloseToTuple } from "../src/util";
import { translate, scale } from "../src/models/transformations";

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

test("finding n1 and n2 at various intersections", () => {
  const a = Sphere.glassy().setTransform(scale({ x: 2, y: 2, z: 2 }));
  const b = Sphere.glassy({ refractive: 2 }).setTransform(
    translate({ z: -0.25 })
  );
  const c = Sphere.glassy({ refractive: 2.5 }).setTransform(
    translate({ z: 0.25 })
  );
  const ray = Ray.of({
    origin: Point.of({ z: -4 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = [
    Intersection.of({ t: 2, object: a }),
    Intersection.of({ t: 2.75, object: b }),
    Intersection.of({ t: 3.25, object: c }),
    Intersection.of({ t: 4.75, object: b }),
    Intersection.of({ t: 5.25, object: c }),
    Intersection.of({ t: 6, object: a }),
  ];
  const ns = [
    { n1: 1.0, n2: 1.5 },
    { n1: 1.5, n2: 2.0 },
    { n1: 2.0, n2: 2.5 },
    { n1: 2.5, n2: 2.5 },
    { n1: 2.5, n2: 1.5 },
    { n1: 1.5, n2: 1.0 },
  ];
  intersections.forEach((intersection, i) => {
    const { n1, n2 } = prepareComputations(intersection, ray, intersections);
    expect(n1).toEqual(ns[i].n1);
    expect(n2).toEqual(ns[i].n2);
  });
});

test("the under point is offset below the surface", () => {
  const sphere = Sphere.glassy().setTransform(translate({ z: 1 }));
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersection = Intersection.of({ t: 5, object: sphere });
  const { underPoint, point } = prepareComputations(intersection, ray, [
    intersection,
  ]);
  expect(underPoint.z).toBeGreaterThan(Epsilon / 2);
  expect(point.z).toBeLessThan(underPoint.z);
});

test("the Schlick approximation under total internal reflection", () => {
  const shape = Sphere.glassy();
  const ray = Ray.of({
    origin: Point.of({ z: Math.sqrt(2) / 2 }),
    direction: Vector.of({ y: 1 }),
  });
  const intersections = [
    Intersection.of({ t: -Math.sqrt(2) / 2, object: shape }),
    Intersection.of({ t: Math.sqrt(2) / 2, object: shape }),
  ];
  const comps = prepareComputations(intersections[1], ray, intersections);
  const reflectance = schlick(comps);
  expect(reflectance).toEqual(1);
});

test("the Schlick approximation with a perpendicular viewing angle", () => {
  const shape = Sphere.glassy();
  const ray = Ray.of({
    direction: Vector.of({ y: 1 }),
  });
  const intersections = [
    Intersection.of({ t: -1, object: shape }),
    Intersection.of({ t: 1, object: shape }),
  ];
  const comps = prepareComputations(intersections[1], ray, intersections);
  const reflectance = schlick(comps);
  expect(reflectance).toBeCloseTo(0.04);
});

test("the schlick approximation with small angle and n2 > n1", () => {
  const shape = Sphere.glassy();
  const ray = Ray.of({
    origin: Point.of({ y: 0.99, z: -2 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = [Intersection.of({ t: 1.8589, object: shape })];
  const comps = prepareComputations(intersections[0], ray, intersections);
  const reflectance = schlick(comps);
  expect(reflectance).toBeCloseTo(0.48873);
});
