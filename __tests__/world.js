import {
  World,
  Color,
  Point,
  Light,
  Ray,
  Vector,
  Intersection,
  Material,
} from "../src/models";
import { Plane, Sphere } from "../src/models/shapes";
import { Pattern } from "../src/models/patterns";
import { prepareComputations } from "../src/models/intersections";
import { translate } from "../src/models/transformations";

class TestPattern extends Pattern {
  colorAt({ x, y, z }) {
    return Color.of({ r: x, g: y, b: z });
  }
}

let world;
beforeEach(() => {
  world = World.default();
});

test("creating a world", () => {
  expect(new World()).toEqual({});
});

test("the default world", () => {
  const objects = World.defaultObjects();
  const s1 = objects[0];
  const s2 = objects[1];
  expect(world.objects[0]).toEqual(s1);
  expect(world.objects[1]).toEqual(s2);
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
  const object = world.objects[0];
  const intersection = Intersection.of({ t: 4, object: object });
  const comps = prepareComputations(intersection, ray);
  const color = world.shadeHit(comps);
  expect(color.fixed).toEqual(
    Color.of({ r: 0.38066, g: 0.47583, b: 0.2855 }).fixed
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
  expect(color.fixed).toEqual(
    Color.of({ r: 0.90498, g: 0.90498, b: 0.90498 }).fixed
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
  expect(world.colorAt(ray).fixed).toEqual(
    Color.of({ r: 0.38066, g: 0.47583, b: 0.2855 }).fixed
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
  expect(world.colorAt(ray).fixed).toEqual(inner.material.color.fixed);
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
  const object = Sphere.of().setTransform(translate({ z: 10 }));
  const world = World.of({ lights: [light], objects: [Sphere.of(), object] });
  const ray = Ray.of({
    origin: Point.of({ z: 5 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersection = Intersection.of({ t: 4, object: object });
  const comps = prepareComputations(intersection, ray);
  const color = world.shadeHit(comps);
  expect(color).toEqual(Color.of({ r: 0.1, g: 0.1, b: 0.1 }));
});

test("the reflected color for a nonreflective material", () => {
  world.objects[1] = world.objects[1].setMaterial({
    ...world.objects[1].material,
    ambient: 1,
  });
  const ray = Ray.of({ direction: Vector.of({ z: 1 }) });
  const intersection = Intersection.of({ t: 1, object: world.objects[1] });
  const comps = prepareComputations(intersection, ray);
  const color = world.reflectedColor(comps);
  expect(color).toEqual(Color.black);
});

test("the reflected color for a reflective material", () => {
  const object = Plane.of({
    material: Material.of({
      reflective: 0.5,
    }),
    transform: translate({ x: 0, y: -1, z: 0 }),
  });
  world = world.addObject(object);
  const ray = Ray.of({
    origin: Point.of({ x: 0, y: 0, z: -3 }),
    direction: Vector.of({ x: 0, y: -Math.sqrt(2) / 2, z: Math.sqrt(2) / 2 }),
  });
  const intersection = Intersection.of({ t: Math.sqrt(2), object: object });
  const comps = prepareComputations(intersection, ray);
  const color = world.reflectedColor(comps);
  expect(color.fixed).toEqual(
    Color.of({ r: 0.19032, g: 0.2379, b: 0.14274 }).fixed
  );
});

test("shadeHit() with a reflective material", () => {
  const object = Plane.of({
    material: Material.of({
      reflective: 0.5,
    }),
    transform: translate({ y: -1 }),
  });
  world = world.addObject(object);
  const ray = Ray.of({
    origin: Point.of({ z: -3 }),
    direction: Vector.of({ y: -Math.sqrt(2) / 2, z: Math.sqrt(2) / 2 }),
  });
  const intersection = Intersection.of({ t: Math.sqrt(2), object: object });
  const comps = prepareComputations(intersection, ray);
  const color = world.shadeHit(comps);
  expect(color.fixed).toEqual(
    Color.of({ r: 0.87677, g: 0.92436, b: 0.82918 }).fixed
  );
});

test("colorAt() with mutually reflective surfaces", () => {
  const light = Light.of({
    position: Point.origin,
    intensity: Color.white,
  });
  const lower = Plane.of({
    material: Material.of({
      reflective: 1,
    }),
    transform: translate({ y: -1 }),
  });
  const upper = Plane.of({
    material: Material.of({
      reflective: 1,
    }),
    transform: translate({ y: 1 }),
  });
  world = World.of({ lights: [light], objects: [lower, upper] });
  const ray = Ray.of({ direction: Vector.of({ y: 1 }) });
  // This will time out if there is infinite recursion.
  const color = world.colorAt(ray);
  expect(color).toBeDefined();
});

test("the reflected color at the maximum recursion depth", () => {
  const object = Plane.of({
    material: Material.of({
      reflective: 0.5,
    }),
    transform: translate({ y: -1 }),
  });
  world = world.addObject(object);
  const ray = Ray.of({
    origin: Point.of({ z: -3 }),
    direction: Vector.of({ y: -Math.sqrt(2) / 2, z: Math.sqrt(2) / 2 }),
  });
  const intersection = Intersection.of({ t: Math.sqrt(2), object: object });
  const comps = prepareComputations(intersection, ray);
  const color = world.reflectedColor(comps, 0);
  expect(color).toEqual(Color.black);
});

test("the refracted color with an opaque surface", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = [
    Intersection.of({ t: 4, object: world.objects[0] }),
    Intersection.of({ t: 6, object: world.objects[0] }),
  ];
  const comps = prepareComputations(intersections[0], ray, intersections);
  const color = world.refractedColor(comps);
  expect(color).toEqual(Color.black);
});

test("the refracted color at the maximum recursive depth", () => {
  world.objects[0] = world.objects[0].setMaterial(
    Material.of({
      transparency: 1.0,
      refractive: 1.5,
    })
  );
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = [
    Intersection.of({ t: 4, object: world.objects[0] }),
    Intersection.of({ t: 6, object: world.objects[0] }),
  ];
  const comps = prepareComputations(intersections[0], ray, intersections);
  const color = world.reflectedColor(comps, 0);
  expect(color).toEqual(Color.black);
});

test("the refracted color under total internal reflection", () => {
  world.objects[0] = world.objects[0].setMaterial(
    Material.of({
      transparency: 1.0,
      refractive: 1.5,
    })
  );
  const ray = Ray.of({
    origin: Point.of({ z: Math.sqrt(2) / 2 }),
    direction: Vector.of({ y: 1 }),
  });
  const intersections = [
    Intersection.of({ t: Math.sqrt(2) / 2, object: world.objects[0] }),
    Intersection.of({ t: Math.sqrt(2) / 2, object: world.objects[0] }),
  ];
  const comps = prepareComputations(intersections[1], ray, intersections);
  const color = world.reflectedColor(comps);
  expect(color).toEqual(Color.black);
});

test("the refracted color with a refracted ray", () => {
  world.objects[0] = world.objects[0].setMaterial(
    Material.of({
      ambient: 1.0,
      pattern: new TestPattern(),
    })
  );
  world.objects[1] = world.objects[1].setMaterial(
    Material.of({
      transparency: 1.0,
      refractive: 1.5,
    })
  );
  const ray = Ray.of({
    origin: Point.of({ z: 0.1 }),
    direction: Vector.of({ y: 1 }),
  });
  const intersections = [
    Intersection.of({ t: -0.9899, object: world.objects[0] }),
    Intersection.of({ t: -0.4899, object: world.objects[1] }),
    Intersection.of({ t: 0.4899, object: world.objects[1] }),
    Intersection.of({ t: 0.9899, object: world.objects[0] }),
  ];
  const comps = prepareComputations(intersections[2], ray, intersections);
  const color = world.refractedColor(comps);
  expect(color.fixed).toEqual(Color.of({ r: 0, g: 0.99888, b: 0.04725 }).fixed);
});

test("shadeHit() with a transparent material", () => {
  const floor = Plane.of({
    material: Material.of({
      transparency: 0.5,
      refractive: 1.5,
    }),
    transform: translate({ y: -1 }),
  });
  const ball = Sphere.of({
    material: Material.of({
      color: Color.red,
      ambient: 0.5,
    }),
    transform: translate({ y: -3.5, z: -0.5 }),
  });
  world = world.addObject(floor).addObject(ball);
  const ray = Ray.of({
    origin: Point.of({ z: -3 }),
    direction: Vector.of({ y: -Math.sqrt(2) / 2, z: Math.sqrt(2) / 2 }),
  });
  const intersections = [Intersection.of({ t: Math.sqrt(2), object: floor })];
  const comps = prepareComputations(intersections[0], ray, intersections);
  const color = world.shadeHit(comps);
  expect(color.fixed).toEqual(
    Color.of({ r: 0.93642, g: 0.68642, b: 0.68642 }).fixed
  );
});

test("shadeHit with a reflective, transparent material", () => {
  const floor = Plane.of({
    material: Material.of({
      transparency: 0.5,
      refractive: 1.5,
      reflective: 0.5,
    }),
    transform: translate({ y: -1 }),
  });
  const ball = Sphere.of({
    material: Material.of({
      color: Color.red,
      ambient: 0.5,
    }),
    transform: translate({ y: -3.5, z: -0.5 }),
  });
  world = world.addObject(floor).addObject(ball);
  const ray = Ray.of({
    origin: Point.of({ z: -3 }),
    direction: Vector.of({ y: -Math.sqrt(2) / 2, z: Math.sqrt(2) / 2 }),
  });
  const intersections = [Intersection.of({ t: Math.sqrt(2), object: floor })];
  const comps = prepareComputations(intersections[0], ray, intersections);
  const color = world.shadeHit(comps);
  expect(color.fixed).toEqual(
    Color.of({ r: 0.93391, g: 0.69643, b: 0.69243 }).fixed
  );
});
