import {
  World,
  Color,
  Point,
  Light,
  Ray,
  Vector,
  Intersection,
} from "../src/models";
import { Sphere } from "../src/models/shapes";
import { prepareComputations } from "../src/models/intersections";
import { expectToBeCloseToTuple } from "../src/util";
import { translate } from "../src/models/transformations";

let world;
beforeEach(() => {
  world = World.default;
});

test("creating a world", () => {
  expect(new World()).toEqual({});
});

test("the default world", () => {
  const s1 = World.defaultObjects[0];
  const s2 = World.defaultObjects[1];
  expect(world.contains(s1)).toBe(true);
  expect(world.contains(s2)).toBe(true);
  expect(world.lights[0]).toEqual(
    Light.of({
      position: Point.of({ x: -10, y: 10, z: -10 }),
      intensity: Color.white,
    })
  );
});

test("intersect a world with a ray", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = world.intersect(ray);
  expect(intersections.map((i) => i.t)).toEqual([4, 4.5, 5.5, 6]);
});

test("shading an intersection", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const shape = world.objects[0];
  const intersection = Intersection.of({ t: 4, object: shape });
  const comps = prepareComputations(intersection, ray);
  const color = world.shadeHit(comps);
  expect(color).toBeDefined();
  expectToBeCloseToTuple(
    color,
    Color.of({ r: 0.38066, g: 0.47583, b: 0.2855 })
  );
});

test("shading an intersection from the inside", () => {
  const light = Light.of({
    position: Point.of({ y: 0.25 }),
    intensity: Color.white,
  });
  world = World.of({ lights: [light] });
  const ray = Ray.of({ origin: Point.origin, direction: Vector.of({ z: 1 }) });
  const intersection = Intersection.of({ t: 0.5, object: Sphere.of() });
  const comps = prepareComputations(intersection, ray);
  const color = world.shadeHit(comps);
  expect(color).toBeDefined();
  expectToBeCloseToTuple(
    color,
    Color.of({ r: 0.90498, g: 0.90498, b: 0.90498 })
  );
});

test("the color when a ray misses", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ y: 1 }),
  });
  expect(world.colorAt(ray)).toEqual(Color.black);
});

test("the color when a ray hits", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  expect(ray).toBeDefined();
  expectToBeCloseToTuple(
    world.colorAt(ray),
    Color.of({ r: 0.38066, g: 0.47583, b: 0.2855 })
  );
});

test("the color with an intersection behind the ray", () => {
  const outer = world.objects[0];
  outer.material.ambient = 1;
  const inner = world.objects[1];
  inner.material.ambient = 1;
  const ray = Ray.of({
    origin: Point.of({ z: 0.75 }),
    direction: Vector.of({ z: -1 }),
  });
  expect(ray).toBeDefined();
  expectToBeCloseToTuple(world.colorAt(ray), inner.material.color);
});

test("there is no shadow when nothing is collinear with point and light", () => {
  expect(world.isShadowed(Point.of({ y: 10 }))).toBe(false);
});

test("the shadow when an object is between the point and the light", () => {
  expect(world.isShadowed(Point.of({ x: 10, y: -10, z: 10 }))).toBe(true);
});

test("there is no shadow when an object is behind the light", () => {
  expect(world.isShadowed(Point.of({ x: -20, y: -20, z: -20 }))).toBe(false);
});

test("there is no shadow when an object is behind the point", () => {
  expect(world.isShadowed(Point.of({ x: -2, y: -2, z: -2 }))).toBe(false);
});

test("shadeHit is given an intersection in shadow", () => {
  const light = Light.of({ position: Point.of({ z: -10 }) });
  const shape = Sphere.of().setTransform(translate({ z: 10 }));
  const world = World.of({ lights: [light], objects: [Sphere.of(), shape] });
  const ray = Ray.of({
    origin: Point.of({ z: 5 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersection = Intersection.of({ t: 4, object: shape });
  const comps = prepareComputations(intersection, ray);
  const color = world.shadeHit(comps);
  expect(color).toEqual(Color.of({ r: 0.1, g: 0.1, b: 0.1 }));
});
