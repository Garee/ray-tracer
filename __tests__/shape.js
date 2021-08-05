import { Sphere } from "../src/models/shapes";
import { Matrix, Material, Point, Vector, Ray } from "../src/models";
import { rotateZ, scale, translate } from "../src/models/transformations";

let shape;

beforeEach(() => {
  shape = Sphere.of();
});

test("the default transformation", () => {
  expect(shape.transform).toEqual(Matrix.identity);
});

test("assiging a transformation", () => {
  shape = shape.setTransform(translate({ x: 2, y: 3, z: 4 }));
  expect(shape.transform).toEqual(translate({ x: 2, y: 3, z: 4 }));
});

test("the default material", () => {
  expect(shape.material).toEqual(Material.of());
});

test("assigning a material", () => {
  shape = shape.setMaterial(Material.of({ ambient: 1 }));
  expect(shape.material.ambient).toEqual(1);
});

test("intersecting a scaled shape with a ray", () => {
  shape = shape.setTransform(scale({ x: 2, y: 2, z: 2 }));
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const tRay = shape.getTransformedRay(ray);
  expect(tRay.origin).toEqual(Point.of({ z: -2.5 }));
  expect(tRay.direction).toEqual(Vector.of({ z: 0.5 }));
});

test("intersecting a translated shape with a ray", () => {
  shape = shape.setTransform(translate({ x: 5 }));
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const tRay = shape.getTransformedRay(ray);
  expect(tRay.origin).toEqual(Point.of({ x: -5, z: -5 }));
  expect(tRay.direction).toEqual(Vector.of({ z: 1 }));
});

test("computing the normal on a translated shape", () => {
  shape = shape.setTransform(translate({ y: 1 }));
  const n = shape.normalAt(Point.of({ y: 1.70711, z: -0.70711 }));
  expect(n.fixed).toEqual(Vector.of({ y: 0.70711, z: -0.70711 }).fixed);
});

test("computing the normal on a transformed shape", () => {
  shape = shape.setTransform(
    scale({ x: 1, y: 0.5, z: 1 }).multiply(rotateZ(90))
  );
  const n = shape.normalAt(
    Point.of({ y: Math.sqrt(2) / 2, z: -Math.sqrt(2) / 2 })
  );
  expect(n.fixed).toEqual(Vector.of({ y: 0.97014, z: -0.24254 }).fixed);
});

test("a shape has a parent attribute", () => {
  expect(shape.parent).toBeUndefined();
});
