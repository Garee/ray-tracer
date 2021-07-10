import { Point } from "../src/point";
import { Vector } from "../src/vector";
import { Ray } from "../src/ray";
import { Sphere } from "../src/sphere";
import { Matrix } from "../src/matrix";
import { translation, scaling, rotationZ } from "../src/transformations";
import { expectToBeCloseToTuple } from "../src/util";
import { Material } from "../src/material";

test("a ray intersects a sphere at two points", () => {
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.t)).toEqual([4, 6]);
});

test("a ray intersects a sphere at a tangent", () => {
  const ray = new Ray(new Point(0, 1, -5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.t)).toEqual([5, 5]);
});

test("a ray misses a sphere", () => {
  const ray = new Ray(new Point(0, 2, -5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int).toEqual([]);
});

test("a ray originates inside a sphere", () => {
  const ray = new Ray(new Point(), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.t)).toEqual([-1, 1]);
});

test("a sphere behind a ray", () => {
  const ray = new Ray(new Point(0, 0, 5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.t)).toEqual([-6, -4]);
});

test("intersect sets the object on the intersection", () => {
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  const sphere = new Sphere();
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.obj)).toEqual([sphere, sphere]);
});

test("a sphere's default transformation", () => {
  const sphere = new Sphere();
  expect(sphere.transform).toEqual(Matrix.identity());
});

test("changing a sphere's transformation", () => {
  let sphere = new Sphere();
  const transform = translation(2, 3, 4);
  sphere = sphere.setTransform(transform);
  expect(sphere.transform).toEqual(transform);
});

test("intersecting a scaled sphere with a ray", () => {
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  let sphere = new Sphere();
  sphere = sphere.setTransform(scaling(2, 2, 2));
  const ints = sphere.intersect(ray);
  expect(ints.map((i) => i.t)).toEqual([3, 7]);
});

test("intersecting a translated sphere with a ray", () => {
  const ray = new Ray(new Point(0, 0, -5), new Vector(0, 0, 1));
  let sphere = new Sphere();
  sphere = sphere.setTransform(translation(5, 0, 0));
  const ints = sphere.intersect(ray);
  expect(ints.map((i) => i.t)).toEqual([]);
});

test("the normal on a sphere at a point on the x-axis", () => {
  const sphere = new Sphere();
  const n = sphere.normalAt(new Point(1, 0, 0));
  expect(n).toEqual(new Vector(1, 0, 0));
});

test("the normal on a sphere at a point on the y-axis", () => {
  const sphere = new Sphere();
  const n = sphere.normalAt(new Point(0, 1, 0));
  expect(n).toEqual(new Vector(0, 1, 0));
});

test("the normal on a sphere at a point on the z-axis", () => {
  const sphere = new Sphere();
  const n = sphere.normalAt(new Point(0, 0, 1));
  expect(n).toEqual(new Vector(0, 0, 1));
});

test("the normal on a sphere at a nonaxial point", () => {
  const sphere = new Sphere();
  const n = sphere.normalAt(
    new Point(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3)
  );
  expect(n).toEqual(
    new Vector(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3)
  );
});

test("the normal is a normalized vector", () => {
  const sphere = new Sphere();
  const n = sphere.normalAt(
    new Point(Math.sqrt(3) / 3, Math.sqrt(3) / 3, Math.sqrt(3) / 3)
  );
  expect(n).toEqual(n.normalize());
});

test("computing the normal on a translated sphere", () => {
  let sphere = new Sphere();
  sphere = sphere.setTransform(translation(0, 1, 0));
  const n = sphere.normalAt(new Point(0, 1.70711, -0.70711));
  expect(n).toBeDefined();
  expectToBeCloseToTuple(n, new Vector(0, 0.70711, -0.70711));
});

test("computing the normal on a transformed sphere", () => {
  let sphere = new Sphere();
  const m = scaling(1, 0.5, 1).multiply(rotationZ(Math.PI / 5));
  sphere = sphere.setTransform(m);
  const n = sphere.normalAt(new Point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2));
  expect(n).toBeDefined();
  expectToBeCloseToTuple(n, new Vector(0, 0.97014, -0.24254));
});

test("a sphere has a default material", () => {
  const sphere = new Sphere();
  expect(sphere.material).toEqual(new Material());
});

test("a sphere may be assigned a material", () => {
  let sphere = new Sphere();
  const m = new Material({ ambient: 1 });
  sphere = sphere.setMaterial(m);
  expect(sphere.material).toEqual(m);
});
