import { StripePattern } from "../src/models/patterns";
import { Color, Light, lighting, Material, Point, Vector } from "../src/models";
import { expectToBeCloseToTuple } from "../src/util";
import { Sphere } from "../src/models/shapes";

let m, p;
beforeEach(() => {
  m = Material.of();
  p = Point.origin;
});

test("the default material", () => {
  expect(m).toEqual(
    Material.of({
      color: Color.white,
      ambient: 0.1,
      diffuse: 0.9,
      specular: 0.9,
      shininess: 200,
      reflective: 0.0,
    })
  );
});

test("lighting with the eye between the light and the surface", () => {
  const eye = Vector.of({ z: -1 });
  const normal = Vector.of({ z: -1 });
  const light = Light.of({
    position: Point.of({ z: -10 }),
    intensity: Color.white,
  });
  const obj = Sphere.of();
  expect(lighting(m, obj, light, p, eye, normal)).toEqual(
    Color.of({ r: 1.9, g: 1.9, b: 1.9 })
  );
});

test("lighting with the eye between the light and surface, eye offset 45deg", () => {
  const eye = Vector.of({ y: Math.sqrt(2) / 2, z: Math.sqrt(2) / 2 });
  const normal = Vector.of({ z: -1 });
  const light = Light.of({
    position: Point.of({ z: -10 }),
    intensity: Color.white,
  });
  const obj = Sphere.of();
  expect(lighting(m, obj, light, p, eye, normal)).toEqual(Color.white);
});

test("lighting with eye opposite surface, light offset 45deg", () => {
  const eye = Vector.of({ z: -1 });
  const normal = Vector.of({ z: -1 });
  const light = Light.of({
    position: Point.of({ y: 10, z: -10 }),
    intensity: Color.white,
  });
  const obj = Sphere.of();
  expect(light).toBeDefined();
  expectToBeCloseToTuple(
    lighting(m, obj, light, p, eye, normal),
    Color.of({ r: 0.7364, g: 0.7364, b: 0.7364 })
  );
});

test("lighting with eye in the path of the reflection vector", () => {
  const eye = Vector.of({ y: -Math.sqrt(2) / 2, z: -Math.sqrt(2) / 2 });
  const normal = Vector.of({ z: -1 });
  const light = Light.of({
    position: Point.of({ y: 10, z: -10 }),
    intensity: Color.white,
  });
  const obj = Sphere.of();
  expect(light).toBeDefined();
  expectToBeCloseToTuple(
    lighting(m, obj, light, p, eye, normal),
    Color.of({ r: 1.6364, g: 1.6364, b: 1.6364 })
  );
});

test("lighting with the light behind the surface", () => {
  const eye = Vector.of({ z: -1 });
  const normal = Vector.of({ z: -1 });
  const light = Light.of({
    position: Point.of({ z: 10 }),
    intensity: Color.white,
  });
  const obj = Sphere.of();
  expect(lighting(m, obj, light, p, eye, normal)).toEqual(
    Color.of({ r: 0.1, g: 0.1, b: 0.1 })
  );
});

test("lighting with the surface in shadow", () => {
  const eye = Vector.of({ z: -1 });
  const normal = Vector.of({ z: -1 });
  const light = Light.of({
    position: Point.of({ z: -10 }),
    intensity: Color.white,
  });
  const obj = Sphere.of();
  const inShadow = true;
  const color = lighting(m, obj, light, p, eye, normal, inShadow);
  expect(color).toEqual(Color.of({ r: 0.1, g: 0.1, b: 0.1 }));
});

test("lighting with a pattern applied", () => {
  const m = Material.of({
    pattern: StripePattern.of({ colors: [Color.white, Color.black] }),
    ambient: 1,
    diffuse: 0,
    specular: 0,
  });
  const eye = Vector.of({ z: -1 });
  const normal = Vector.of({ z: -1 });
  const light = Light.of({
    position: Point.of({ z: -10 }),
    intensity: Color.white,
  });
  const obj = Sphere.of();
  const c1 = lighting(m, obj, light, Point.of({ x: 0.9 }), eye, normal, false);
  const c2 = lighting(m, obj, light, Point.of({ x: 1.1 }), eye, normal, false);
  expect(c1).toEqual(Color.white);
  expect(c2).toEqual(Color.black);
});
