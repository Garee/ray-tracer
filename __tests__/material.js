import { Color, White, Black } from "../src/color";
import { StripePattern } from "../src/patterns/stripe";
import { Light, lighting } from "../src/light";
import { Material } from "../src/material";
import { Point } from "../src/point";
import { Vector } from "../src/vector";
import { expectToBeCloseToTuple } from "../src/util";
import { Sphere } from "../src/sphere";

let m, p;
beforeEach(() => {
  m = new Material();
  p = new Point();
});

test("the default material", () => {
  expect(m).toEqual(
    new Material({
      color: White,
      ambient: 0.1,
      diffuse: 0.9,
      specular: 0.9,
      shininess: 200,
    })
  );
});

test("lighting with the eye between the light and the surface", () => {
  const eye = new Vector(0, 0, -1);
  const normal = new Vector(0, 0, -1);
  const light = new Light(new Point(0, 0, -10), White);
  const obj = new Sphere();
  expect(lighting(m, obj, light, p, eye, normal)).toEqual(
    new Color(1.9, 1.9, 1.9)
  );
});

test("lighting with the eye between the light and surface, eye offset 45deg", () => {
  const eye = new Vector(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2);
  const normal = new Vector(0, 0, -1);
  const light = new Light(new Point(0, 0, -10), White);
  const obj = new Sphere();
  expect(lighting(m, obj, light, p, eye, normal)).toEqual(White);
});

test("lighting with eye opposite surface, light offset 45deg", () => {
  const eye = new Vector(0, 0, -1);
  const normal = new Vector(0, 0, -1);
  const light = new Light(new Point(0, 10, -10), White);
  const obj = new Sphere();
  expect(light).toBeDefined();
  expectToBeCloseToTuple(
    lighting(m, obj, light, p, eye, normal),
    new Color(0.7364, 0.7364, 0.7364)
  );
});

test("lighting with eye in the path of the reflection vector", () => {
  const eye = new Vector(0, -Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
  const normal = new Vector(0, 0, -1);
  const light = new Light(new Point(0, 10, -10), White);
  const obj = new Sphere();
  expect(light).toBeDefined();
  expectToBeCloseToTuple(
    lighting(m, obj, light, p, eye, normal),
    new Color(1.6364, 1.6364, 1.6364)
  );
});

test("lighting with the light behind the surface", () => {
  const eye = new Vector(0, 0, -1);
  const normal = new Vector(0, 0, -1);
  const light = new Light(new Point(0, 0, 10), White);
  const obj = new Sphere();
  expect(lighting(m, obj, light, p, eye, normal)).toEqual(
    new Color(0.1, 0.1, 0.1)
  );
});

test("lighting with the surface in shadow", () => {
  const eye = new Vector(0, 0, -1);
  const normal = new Vector(0, 0, -1);
  const light = new Light(new Point(0, 0, -10), White);
  const obj = new Sphere();
  const inShadow = true;
  const color = lighting(m, obj, light, p, eye, normal, inShadow);
  expect(color).toEqual(new Color(0.1, 0.1, 0.1));
});

test("lighting with a pattern applied", () => {
  const m = new Material({
    pattern: new StripePattern(White, Black),
    ambient: 1,
    diffuse: 0,
    specular: 0,
  });
  const eye = new Vector(0, 0, -1);
  const normal = new Vector(0, 0, -1);
  const light = new Light(new Point(0, 0, -10), White);
  const obj = new Sphere();
  const c1 = lighting(m, obj, light, new Point(0.9, 0, 0), eye, normal, false);
  const c2 = lighting(m, obj, light, new Point(1.1, 0, 0), eye, normal, false);
  expect(c1).toEqual(White);
  expect(c2).toEqual(Black);
});
