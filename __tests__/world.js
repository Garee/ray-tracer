import { World } from "../src/world";
import { Color, White, Black } from "../src/color";
import { Point } from "../src/point";
import { Light } from "../src/light";
import { Ray } from "../src/ray";
import { Vector } from "../src/vector";
import { Sphere } from "../src/sphere";
import { Intersection } from "../src/intersection";
import { prepareComputations } from "../src/intersections";
import { expectToBeCloseToTuple } from "../src/util";

test("creating a world", () => {
  const w = new World();
  expect(w).toEqual({});
});

test("the default world", () => {
  const s1 = World.defaultObjects[0];
  const s2 = World.defaultObjects[1];
  const w = World.default();
  expect(w.contains(s1)).toBe(true);
  expect(w.contains(s2)).toBe(true);
  expect(w.lights[0]).toEqual(new Light(new Point(-10, 10, -10), White));
});

test("intersect a world with a ray", () => {
  const w = World.default();
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const ints = w.intersect(ray);
  expect(ints.map((i) => i.t)).toEqual([4, 4.5, 5.5, 6]);
});

test("shading an intersection", () => {
  const w = World.default();
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const shape = w.objs[0];
  const int = new Intersection(4, shape);
  const comps = prepareComputations(int, ray);
  const color = w.shadeHit(comps);
  expect(color).toBeDefined();
  expectToBeCloseToTuple(color, new Color(0.38066, 0.47583, 0.2855));
});

test("shading an intersection from the inside", () => {
  const light = new Light(new Point(0, 0.25, 0), White);
  const w = World.default(light);
  const ray = new Ray(new Point(), new Vector(0, 0, 1));
  const shape = new Sphere();
  const int = new Intersection(0.5, shape);
  const comps = prepareComputations(int, ray);
  const color = w.shadeHit(comps);
  expect(color).toBeDefined();
  expectToBeCloseToTuple(color, new Color(0.90498, 0.90498, 0.90498));
});

test("the color when a ray misses", () => {
  const w = World.default();
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 1, 0));
  expect(w.colorAt(ray)).toEqual(Black);
});

test("the color when a ray hits", () => {
  const w = World.default();
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  expect(ray).toBeDefined();
  expectToBeCloseToTuple(w.colorAt(ray), new Color(0.38066, 0.47583, 0.2855));
});

test("the color with an intersection behind the ray", () => {
  const w = World.default();
  const outer = w.objs[0];
  outer.material.ambient = 1;
  const inner = w.objs[1];
  inner.material.ambient = 1;
  const ray = new Ray(new Point(0, 0, 0.75), new Vector(0, 0, -1));
  expect(ray).toBeDefined();
  expectToBeCloseToTuple(w.colorAt(ray), inner.material.color);
});
