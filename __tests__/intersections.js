import { Point } from "../src/point";
import { Ray } from "../src/ray";
import { Sphere } from "../src/sphere";
import { Vector } from "../src/vector";
import { Intersection } from "../src/intersection";
import { prepareComputations } from "../src/intersections";
import { expectToBeCloseToTuple } from "../src/util";
import { translation } from "../src/transformations";

test("precomputing the state of an intersection", () => {
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const shape = new Sphere();
  const int = new Intersection(4, shape);
  const comps = prepareComputations(int, ray);
  expect(comps.t).toEqual(int.t);
  expect(comps.obj).toEqual(int.obj);
  expect(comps.point).toEqual(new Point(0, 0, -1));
  expectToBeCloseToTuple(comps.eye, new Vector(0, 0, -1));
  expect(comps.normal).toEqual(new Vector(0, 0, -1));
});

test("the hit, when an intersection occurs on the outside", () => {
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const shape = new Sphere();
  const int = new Intersection(4, shape);
  const comps = prepareComputations(int, ray);
  expect(comps.inside).toBe(false);
});

test("the hit, when an intersection occurs on the inside", () => {
  const ray = new Ray(new Point(), new Vector(0, 0, 1));
  const shape = new Sphere();
  const int = new Intersection(1, shape);
  const comps = prepareComputations(int, ray);
  expect(comps.point).toEqual(new Point(0, 0, 1));
  expectToBeCloseToTuple(comps.eye, new Vector(0, 0, -1));
  expect(comps.inside).toBe(true);
  expectToBeCloseToTuple(comps.normal, new Vector(0, 0, -1));
});

test("the hit should offset the point", () => {
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const shape = new Sphere().setTransform(translation(0, 0, 1));
  const int = new Intersection(5, shape);
  const comps = prepareComputations(int, ray);
  expect(comps.overPoint.z).toBeLessThan(-0.000001 / 2);
  expect(comps.point.z).toBeGreaterThan(comps.overPoint.z);
});
