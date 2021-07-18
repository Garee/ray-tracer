import { Point, Vector, Ray, Matrix, Material } from "../src/models";
import { Shape, Sphere } from "../src/models/shapes";
import { translate, scale, rotateZ } from "../src/models/transformations";
import { expectToBeCloseToTuple } from "../src/util";

let sphere;

beforeEach(() => {
  sphere = new Sphere();
});

test("a ray intersects a sphere at two points", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.t)).toEqual([4, 6]);
});

test("a ray intersects a sphere at a tangent", () => {
  const ray = Ray.of({
    origin: Point.of({ y: 1, z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.t)).toEqual([5, 5]);
});

test("a ray misses a sphere", () => {
  const ray = Ray.of({
    origin: Point.of({ y: 2, z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const int = sphere.intersect(ray);
  expect(int).toEqual([]);
});

test("a ray originates inside a sphere", () => {
  const ray = Ray.of({ direction: Vector.of({ z: 1 }) });
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.t)).toEqual([-1, 1]);
});

test("a sphere behind a ray", () => {
  const ray = Ray.of({
    origin: Point.of({ z: 5 }),
    direction: Vector.of({ z: 1 }),
  });
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.t)).toEqual([-6, -4]);
});

test("intersect sets the object on the intersection", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const int = sphere.intersect(ray);
  expect(int.map((i) => i.object)).toEqual([sphere, sphere]);
});

test("a sphere's default transformation", () => {
  expect(sphere.transform).toEqual(Matrix.identity);
});

test("changing a sphere's transformation", () => {
  const transform = translate({ x: 2, y: 3, z: 4 });
  sphere = sphere.setTransform(transform);
  expect(sphere.transform).toEqual(transform);
});

test("intersecting a scaled sphere with a ray", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  sphere = sphere.setTransform(scale({ x: 2, y: 2, z: 2 }));
  const ints = sphere.intersect(ray);
  expect(ints.map((i) => i.t)).toEqual([3, 7]);
});

test("intersecting a translated sphere with a ray", () => {
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  sphere = sphere.setTransform(translate({ x: 5 }));
  const ints = sphere.intersect(ray);
  expect(ints.map((i) => i.t)).toEqual([]);
});

test("the normal on a sphere at a point on the x-axis", () => {
  const n = sphere.normalAt(Point.of({ x: 1 }));
  expect(n).toEqual(Vector.of({ x: 1 }));
});

test("the normal on a sphere at a point on the y-axis", () => {
  const n = sphere.normalAt(Point.of({ y: 1 }));
  expect(n).toEqual(Vector.of({ y: 1 }));
});

test("the normal on a sphere at a point on the z-axis", () => {
  const n = sphere.normalAt(Point.of({ z: 1 }));
  expect(n).toEqual(Vector.of({ z: 1 }));
});

test("the normal on a sphere at a nonaxial point", () => {
  const n = sphere.normalAt(
    Point.of({ x: Math.sqrt(3) / 3, y: Math.sqrt(3) / 3, z: Math.sqrt(3) / 3 })
  );
  expect(n).toEqual(
    Vector.of({ x: Math.sqrt(3) / 3, y: Math.sqrt(3) / 3, z: Math.sqrt(3) / 3 })
  );
});

test("the normal is a normalized vector", () => {
  const n = sphere.normalAt(
    Point.of({ x: Math.sqrt(3) / 3, y: Math.sqrt(3) / 3, z: Math.sqrt(3) / 3 })
  );
  expect(n).toEqual(n.normalize());
});

test("computing the normal on a translated sphere", () => {
  sphere = sphere.setTransform(translate({ y: 1 }));
  const n = sphere.normalAt(Point.of({ y: 1.70711, z: -0.70711 }));
  expect(n).toBeDefined();
  expectToBeCloseToTuple(n, Vector.of({ y: 0.70711, z: -0.70711 }));
});

test("computing the normal on a transformed sphere", () => {
  const m = scale({ x: 1, y: 0.5, z: 1 }).multiply(rotateZ(90));
  sphere = sphere.setTransform(m);
  const n = sphere.normalAt(
    Point.of({ y: Math.sqrt(2) / 2, z: -Math.sqrt(2) / 2 })
  );
  expect(n).toBeDefined();
  expectToBeCloseToTuple(n, Vector.of({ y: 0.97014, z: -0.24254 }));
});

test("a sphere has a default material", () => {
  expect(sphere.material).toEqual(Material.of());
});

test("a sphere may be assigned a material", () => {
  const m = Material.of({ ambient: 1 });
  sphere = sphere.setMaterial(m);
  expect(sphere.material).toEqual(m);
});

test("a sphere is a shape", () => {
  expect(sphere.__proto__ instanceof Shape).toBe(true);
});

test("a helper for producing a sphere with a glassy material", () => {
  const sphere = Sphere.glassy();
  expect(sphere.transform).toEqual(Matrix.identity);
  expect(sphere.material.transparency).toEqual(1.0);
  expect(sphere.material.refractive).toEqual(1.5);
});
