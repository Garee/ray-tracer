import { Shape } from "../src/shape";
import { Matrix } from "../src/matrix";
import { rotationZ, scaling, translation } from "../src/transformations";
import { Material } from "../src/material";
import { Point } from "../src/point";
import { Sphere } from "../src/sphere";
import { Vector } from "../src/vector";
import { Ray } from "../src/ray";
import { expectToBeCloseToTuple } from "../src/util";

test("the default transformation", () => {
  const shape = new Shape();
  expect(shape.transform).toEqual(Matrix.identity());
});

test("assiging a transformation", () => {
  const shape = new Shape().setTransform(translation(2, 3, 4));
  expect(shape.transform).toEqual(translation(2, 3, 4));
});

test("the default material", () => {
  const shape = new Shape();
  expect(shape.material).toEqual(new Material());
});

test("assigning a material", () => {
  const shape = new Shape().setMaterial(new Material({ ambient: 1 }));
  expect(shape.material.ambient).toEqual(1);
});

test("intersecting a scaled shape with a ray", () => {
  const shape = new Sphere().setTransform(scaling(2, 2, 2));
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const tRay = shape.getTransformedRay(ray);
  expect(tRay.origin).toEqual(new Point(0, 0, -2.5));
  expect(tRay.direction).toEqual(new Vector(0, 0, 0.5));
});

test("intersecting a translated shape with a ray", () => {
  const shape = new Sphere().setTransform(translation(5, 0, 0));
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const tRay = shape.getTransformedRay(ray);
  expect(tRay.origin).toEqual(new Point(-5, 0, -5));
  expect(tRay.direction).toEqual(new Vector(0, 0, 1));
});

test("computing the normal on a translated shape", () => {
  const shape = new Sphere().setTransform(translation(0, 1, 0));
  const n = shape.normalAt(new Point(0, 1.70711, -0.70711));
  expect(n).toBeDefined();
  expectToBeCloseToTuple(n, new Vector(0, 0.70711, -0.70711));
});

test("computing the normal on a transformed shape", () => {
  const shape = new Sphere().setTransform(
    scaling(1, 0.5, 1).multiply(rotationZ(Math.PI / 5))
  );
  const n = shape.normalAt(new Point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));
  expect(n).toBeDefined();
  expectToBeCloseToTuple(n, new Vector(0, 0.97014, -0.24254));
});
