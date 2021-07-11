import {
  World,
  Color,
  Point,
  Light,
  Ray,
  Vector,
  Intersection,
} from "../src/models";
import { White, Black } from "../src/models/color";
import { Sphere } from "../src/models/shapes";
import { prepareComputations } from "../src/models/intersections";
import { expectToBeCloseToTuple } from "../src/util";
import { translation } from "../src/models/transformations";

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

test("there is no shadow when nothing is collinear with point and light", () => {
  const world = World.default();
  expect(world.isShadowed(new Point(0, 10, 0))).toBe(false);
});

test("the shadow when an object is between the point and the light", () => {
  const world = World.default();
  expect(world.isShadowed(new Point(10, -10, 10))).toBe(true);
});

test("there is no shadow when an object is behind the light", () => {
  const world = World.default();
  expect(world.isShadowed(new Point(-20, -20, -20))).toBe(false);
});

test("there is no shadow when an object is behind the point", () => {
  const world = World.default();
  expect(world.isShadowed(new Point(-2, -2, -2))).toBe(false);
});

test("shadeHit is given an intersection in shadow", () => {
  const light = new Light(new Point(0, 0, -10), White);
  const s1 = new Sphere();
  const s2 = new Sphere().setTransform(translation(0, 0, 10));
  const world = World.default(light).addObject(s1).addObject(s2);
  const ray = new Ray(new Point(0, 0, 5), new Vector(0, 0, 1));
  const int = new Intersection(4, s2);
  const comps = prepareComputations(int, ray);
  const color = world.shadeHit(comps);
  expect(color).toEqual(new Color(0.1, 0.1, 0.1));
});
