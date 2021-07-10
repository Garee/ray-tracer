import { Color, White } from "../src/color";
import { Light, lighting } from "../src/light";
import { Material } from "../src/material";
import { Point } from "../src/point";
import { Vector } from "../src/vector";
import { expectToBeCloseToTuple } from "../src/util";

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
  expect(lighting(m, light, p, eye, normal)).toEqual(new Color(1.9, 1.9, 1.9));
});

test("lighting with the eye between the light and surface, eye offset 45deg", () => {
  const eye = new Vector(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2);
  const normal = new Vector(0, 0, -1);
  const light = new Light(new Point(0, 0, -10), White);
  expect(lighting(m, light, p, eye, normal)).toEqual(White);
});

test("lighting with eye opposite surface, light offset 45deg", () => {
  const eye = new Vector(0, 0, -1);
  const normal = new Vector(0, 0, -1);
  const light = new Light(new Point(0, 10, -10), White);
  expect(light).toBeDefined();
  expectToBeCloseToTuple(
    lighting(m, light, p, eye, normal),
    new Color(0.7364, 0.7364, 0.7364)
  );
});

test("lighting with eye in the path of the reflection vector", () => {
  const eye = new Vector(0, -Math.sqrt(2) / 2, -Math.sqrt(2) / 2);
  const normal = new Vector(0, 0, -1);
  const light = new Light(new Point(0, 10, -10), White);
  expect(light).toBeDefined();
  expectToBeCloseToTuple(
    lighting(m, light, p, eye, normal),
    new Color(1.6364, 1.6364, 1.6364)
  );
});

test("lighting with the light behind the surface", () => {
  const eye = new Vector(0, 0, -1);
  const normal = new Vector(0, 0, -1);
  const light = new Light(new Point(0, 0, 10), White);
  expect(lighting(m, light, p, eye, normal)).toEqual(new Color(0.1, 0.1, 0.1));
});

test("lighting with the surface in shadow", () => {
  const eye = new Vector(0, 0, -1);
  const normal = new Vector(0, 0, -1);
  const light = new Light(new Point(0, 0, -10), White);
  const inShadow = true;
  const color = lighting(m, light, p, eye, normal, inShadow);
  expect(color).toEqual(new Color(0.1, 0.1, 0.1));
});
