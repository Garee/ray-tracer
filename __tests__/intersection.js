import { Intersection, hit } from "../src/intersection";
import { Sphere } from "../src/sphere";

test("an intersection encapsulates t and obj", () => {
  const sphere = new Sphere();
  const int = new Intersection(3.5, sphere);
  expect(int.t).toEqual(3.5);
  expect(int.obj).toEqual(sphere);
});

test("aggregate intersections", () => {
  const sphere = new Sphere();
  const int1 = new Intersection(1, sphere);
  const int2 = new Intersection(2, sphere);
  const ints = [int1, int2];
  expect(ints).toHaveLength(2);
  expect(ints[0].t).toEqual(1);
  expect(ints[1].t).toEqual(2);
});

test("the hit, when all intersections have t > 0", () => {
  const sphere = new Sphere();
  const int1 = new Intersection(1, sphere);
  const int2 = new Intersection(2, sphere);
  const hi = hit([int1, int2]);
  expect(hi).toEqual(int1);
});

test("the hit, when some intersections have t < 0", () => {
  const sphere = new Sphere();
  const int1 = new Intersection(-1, sphere);
  const int2 = new Intersection(2, sphere);
  const hi = hit([int1, int2]);
  expect(hi).toEqual(int2);
});

test("the hit, when all intersections have t < 0", () => {
  const sphere = new Sphere();
  const int1 = new Intersection(-1, sphere);
  const int2 = new Intersection(-2, sphere);
  const hi = hit([int1, int2]);
  expect(hi).toBeUndefined();
});

test("the hit is always the lowest non-negative intersection", () => {
  const sphere = new Sphere();
  const int1 = new Intersection(5, sphere);
  const int2 = new Intersection(7, sphere);
  const int3 = new Intersection(-3, sphere);
  const int4 = new Intersection(2, sphere);
  const hi = hit([int1, int2, int3, int4]);
  expect(hi).toEqual(int4);
});
