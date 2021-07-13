import { Intersection } from "../src/models";
import { hit } from "../src/models/intersections";
import { Sphere } from "../src/models/shapes";

let sphere;
beforeEach(() => {
  sphere = Sphere.of();
});

test("an intersection encapsulates t and obj", () => {
  const int = Intersection.of({ t: 3.5, object: sphere });
  expect(int.t).toEqual(3.5);
  expect(int.object).toEqual(sphere);
});

test("aggregate intersections", () => {
  const int1 = Intersection.of({ t: 1, object: sphere });
  const int2 = Intersection.of({ t: 2, object: sphere });
  const ints = [int1, int2];
  expect(ints).toHaveLength(2);
  expect(ints[0].t).toEqual(1);
  expect(ints[1].t).toEqual(2);
});

test("the hit, when all intersections have t > 0", () => {
  const int1 = Intersection.of({ t: 1, object: sphere });
  const int2 = Intersection.of({ t: 2, object: sphere });
  const hi = hit([int1, int2]);
  expect(hi).toEqual(int1);
});

test("the hit, when some intersections have t < 0", () => {
  const int1 = Intersection.of({ t: -1, object: sphere });
  const int2 = Intersection.of({ t: 2, object: sphere });
  const hi = hit([int1, int2]);
  expect(hi).toEqual(int2);
});

test("the hit, when all intersections have t < 0", () => {
  const int1 = Intersection.of({ t: -1, object: sphere });
  const int2 = Intersection.of({ t: -2, object: sphere });
  const hi = hit([int1, int2]);
  expect(hi).toBeUndefined();
});

test("the hit is always the lowest non-negative intersection", () => {
  const int1 = Intersection.of({ t: 5, object: sphere });
  const int2 = Intersection.of({ t: 7, object: sphere });
  const int3 = Intersection.of({ t: -3, object: sphere });
  const int4 = Intersection.of({ t: 2, object: sphere });
  const hi = hit([int1, int2, int3, int4]);
  expect(hi).toEqual(int4);
});
