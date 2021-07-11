import { Shape, Sphere } from "../src/models/shapes";
import { Matrix, Material, Point, Vector, Ray } from "../src/models";
import { rotationZ, scaling, translation } from "../src/models/transformations";
import { expectToBeCloseToTuple } from "../src/util";

let shape, sphere;

beforeEach(() => {
  shape = Shape.of();
  sphere = Sphere.of();
});

test("the default transformation", () => {
  expect(shape.transform).toEqual(Matrix.identity);
});

test("assiging a transformation", () => {
  shape = shape.setTransform(translation(2, 3, 4));
  expect(shape.transform).toEqual(translation(2, 3, 4));
});

test("the default material", () => {
  expect(shape.material).toEqual(Material.of());
});

test("assigning a material", () => {
  shape = shape.setMaterial(Material.of({ ambient: 1 }));
  expect(shape.material.ambient).toEqual(1);
});

test("intersecting a scaled shape with a ray", () => {
  shape = sphere.setTransform(scaling(2, 2, 2));
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const tRay = shape.getTransformedRay(ray);
  expect(tRay.origin).toEqual(Point.of({ z: -2.5 }));
  expect(tRay.direction).toEqual(Vector.of({ z: 0.5 }));
});

test("intersecting a translated shape with a ray", () => {
  shape = sphere.setTransform(translation(5, 0, 0));
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const tRay = shape.getTransformedRay(ray);
  expect(tRay.origin).toEqual(Point.of({ x: -5, z: -5 }));
  expect(tRay.direction).toEqual(Vector.of({ z: 1 }));
});

test("computing the normal on a translated shape", () => {
  shape = sphere.setTransform(translation(0, 1, 0));
  const n = shape.normalAt(Point.of({ y: 1.70711, z: -0.70711 }));
  expect(n).toBeDefined();
  expectToBeCloseToTuple(n, Vector.of({ y: 0.70711, z: -0.70711 }));
});

test("computing the normal on a transformed shape", () => {
  shape = sphere.setTransform(
    scaling(1, 0.5, 1).multiply(rotationZ(Math.PI / 5))
  );
  const n = shape.normalAt(
    Point.of({ y: Math.sqrt(2) / 2, z: -Math.sqrt(2) / 2 })
  );
  expect(n).toBeDefined();
  expectToBeCloseToTuple(n, Vector.of({ y: 0.97014, z: -0.24254 }));
});
