import { Tuple, Point, Vector, Color } from "../src/models";
import { expectToBeCloseToTuple } from "../src/util";

test("a tuple with w=1.0 is a point", () => {
  const a = Tuple.of({ x: 4.3, y: -4.2, z: 3.1, w: 1 });
  expect(a.x).toBe(4.3);
  expect(a.y).toBe(-4.2);
  expect(a.z).toBe(3.1);
  expect(a.w).toBe(1);
  expect(a.isPoint()).toBe(true);
  expect(a.isVector()).toBe(false);
});

test("a tuple with w=0 is a vector", () => {
  const a = Tuple.of({ x: 4.3, y: -4.2, z: 3.1, w: 0 });
  expect(a.x).toBe(4.3);
  expect(a.y).toBe(-4.2);
  expect(a.z).toBe(3.1);
  expect(a.w).toBe(0);
  expect(a.isPoint()).toBe(false);
  expect(a.isVector()).toBe(true);
});

test("create point tuples", () => {
  const a = Point.of({ x: 4, y: -4, z: 3 });
  const t = Tuple.of({ x: 4, y: -4, z: 3, w: 1 });
  expect(a).toEqual(t);
});

test("create vector tuples", () => {
  const a = Vector.of({ x: 4, y: -4, z: 3 });
  const t = Tuple.of({ x: 4, y: -4, z: 3, w: 0 });
  expect(a).toEqual(t);
});

test("add two tuples", () => {
  const a = Tuple.of({ x: 3, y: -2, z: 5, w: 1 });
  const b = Tuple.of({ x: -2, y: 3, z: 1, w: 0 });
  const c = a.add(b);
  expect(c).toEqual(Tuple.of({ x: 1, y: 1, z: 6, w: 1 }));
});

test("add two points", () => {
  const a = Point.of({ x: 3, y: -2, z: 5 });
  const b = Point.of({ x: -2, y: 3, z: 1 });
  expect(() => a.add(b)).toThrow("A 'Point' cannot add a 'Point'.");
});

test("subtract two tuples", () => {
  const a = Point.of({ x: 3, y: 2, z: 1 });
  const b = Point.of({ x: 5, y: 6, z: 7 });
  const c = a.subtract(b);
  expect(c).toEqual(Vector.of({ x: -2, y: -4, z: -6 }));
});

test("subtract a vector from a point", () => {
  const a = Point.of({ x: 3, y: 2, z: 1 });
  const b = Vector.of({ x: 5, y: 6, z: 7 });
  const c = a.subtract(b);
  expect(c).toEqual(Point.of({ x: -2, y: -4, z: -6 }));
});

test("subtract two vectors", () => {
  const a = Vector.of({ x: 3, y: 2, z: 1 });
  const b = Vector.of({ x: 5, y: 6, z: 7 });
  const c = a.subtract(b);
  expect(c).toEqual(Vector.of({ x: -2, y: -4, z: -6 }));
});

test("subtract a point from a vector", () => {
  const a = Vector.of({ x: 3, y: 2, z: 1 });
  const b = Point.of({ x: 5, y: 6, z: 7 });
  expect(() => a.subtract(b)).toThrow(
    "A 'Point' cannot be subtracted from a 'Vector'."
  );
});

test("negate a tuple", () => {
  const a = Tuple.of({ x: 1, y: -2, z: 3, w: 0 });
  const b = a.negate();
  expect(b).toEqual(Tuple.of({ x: -1, y: 2, z: -3, w: 0 }));
});

test("multiply a tuple by a scalar", () => {
  const a = Tuple.of({ x: 1, y: -2, z: 3, w: 0 });
  const b = a.multiply(3.5);
  expect(b).toEqual(Tuple.of({ x: 3.5, y: -7, z: 10.5, w: 0 }));
});

test("multiply a tuple by a fraction", () => {
  const a = Tuple.of({ x: 1, y: -2, z: 3, w: 0 });
  const b = a.multiply(0.5);
  expect(b).toEqual(Tuple.of({ x: 0.5, y: -1, z: 1.5, w: 0 }));
});

test("divide a tuple by a scalar", () => {
  const a = Tuple.of({ x: 1, y: -2, z: 3, w: 0 });
  const b = a.divide(2);
  expect(b).toEqual(Tuple.of({ x: 0.5, y: -1, z: 1.5, w: 0 }));
});

test("magnitude of Vector(1, 0, 0)", () => {
  const a = Vector.of({ x: 1 });
  expect(a.magnitude()).toBe(1);
});

test("magnitude of Vector(0, 1, 0)", () => {
  const a = Vector.of({ y: 1 });
  expect(a.magnitude()).toBe(1);
});

test("magnitude of Vector(0, 0, 1)", () => {
  const a = Vector.of({ z: 1 });
  expect(a.magnitude()).toBe(1);
});

test("magnitude of Vector(1, 2, 3)", () => {
  const a = Vector.of({ x: 1, y: 2, z: 3 });
  expect(a.magnitude()).toBe(Math.sqrt(14));
});

test("magnitude of Vector(-1, -2, -3)", () => {
  const a = Vector.of({ x: -1, y: -2, z: -3 });
  expect(a.magnitude()).toBe(Math.sqrt(14));
});

test("normalize Vector(4, 0, 0)", () => {
  const a = Vector.of({ x: 4 });
  expect(a.normalize()).toEqual(Vector.of({ x: 1 }));
});

test("normalize Vector(1, 2, 3)", () => {
  const a = Vector.of({ x: 1, y: 2, z: 3 });
  expect(a.normalize()).toEqual(
    Vector.of({
      x: 1 / Math.sqrt(14),
      y: 2 / Math.sqrt(14),
      z: 3 / Math.sqrt(14),
    })
  );
});

test("magnitude of normalized vector", () => {
  const a = Vector.of({ x: 1, y: 2, z: 3 });
  const b = a.normalize();
  expect(b.magnitude()).toEqual(1);
});

test("dot product of two vectors", () => {
  const a = Vector.of({ x: 1, y: 2, z: 3 });
  const b = Vector.of({ x: 2, y: 3, z: 4 });
  expect(a.dot(b)).toEqual(20);
});

test("cross product of two vectors", () => {
  const a = Vector.of({ x: 1, y: 2, z: 3 });
  const b = Vector.of({ x: 2, y: 3, z: 4 });
  expect(a.cross(b)).toEqual(Vector.of({ x: -1, y: 2, z: -1 }));
  expect(b.cross(a)).toEqual(Vector.of({ x: 1, y: -2, z: 1 }));
});

test("colors are (red, green, blue) tuples", () => {
  const a = Color.of({ r: -0.5, g: 0.4, b: 1.7 });
  expect(a.red).toBe(-0.5);
  expect(a.green).toBe(0.4);
  expect(a.blue).toBe(1.7);
});

test("add two colors", () => {
  const a = Color.of({ r: 0.9, g: 0.6, b: 0.75 });
  const b = Color.of({ r: 0.7, g: 0.1, b: 0.25 });
  const c = a.add(b);
  expect(c).toEqual(Color.of({ r: 1.6, g: 0.7, b: 1.0 }));
});

test("subtract two colors", () => {
  const a = Color.of({ r: 0.9, g: 0.6, b: 0.75 });
  const b = Color.of({ r: 0.7, g: 0.1, b: 0.25 });
  const c = a.subtract(b);
  expect(c).toBeDefined();
  expectToBeCloseToTuple(c, Color.of({ r: 0.2, g: 0.5, b: 0.5 }));
});

test("multiply a color by a scalar", () => {
  const a = Color.of({ r: 0.2, g: 0.3, b: 0.4 });
  const b = a.multiply(2);
  expect(b).toEqual(Color.of({ r: 0.4, g: 0.6, b: 0.8 }));
});

test("multiply two colors", () => {
  const a = Color.of({ r: 1, g: 0.2, b: 0.4 });
  const b = Color.of({ r: 0.9, g: 1, b: 0.1 });
  const c = a.multiply(b);
  expect(c).toBeDefined();
  expectToBeCloseToTuple(c, Color.of({ r: 0.9, g: 0.2, b: 0.04 }));
});

test("reflecting a vector approaching at 45deg", () => {
  const v = Vector.of({ x: 1, y: -1 });
  const n = Vector.of({ y: 1 });
  expect(n).toBeDefined();
  expectToBeCloseToTuple(v.reflect(n), Vector.of({ x: 1, y: 1 }));
});

test("reflecting a vector off a slanted surface", () => {
  const v = Vector.of({ y: -1 });
  const n = Vector.of({ x: Math.sqrt(2) / 2, y: Math.sqrt(2) / 2 });
  expect(n).toBeDefined();
  expectToBeCloseToTuple(v.reflect(n), Vector.of({ x: 1 }));
});
