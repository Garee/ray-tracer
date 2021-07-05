import { Tuple } from "../src/tuple";
import { Point } from "../src/point";
import { Vector } from "../src/vector";
import { Color } from "../src/color";

test("a tuple with w=1.0 is a point", () => {
  const a = new Tuple(4.3, -4.2, 3.1, 1);
  expect(a.x).toBe(4.3);
  expect(a.y).toBe(-4.2);
  expect(a.z).toBe(3.1);
  expect(a.w).toBe(1);
  expect(a.isPoint()).toBe(true);
  expect(a.isVector()).toBe(false);
});

test("a tuple with w=0 is a vector", () => {
  const a = new Tuple(4.3, -4.2, 3.1, 0);
  expect(a.x).toBe(4.3);
  expect(a.y).toBe(-4.2);
  expect(a.z).toBe(3.1);
  expect(a.w).toBe(0);
  expect(a.isPoint()).toBe(false);
  expect(a.isVector()).toBe(true);
});

test("create point tuples", () => {
  const a = new Point(4, -4, 3);
  const t = new Tuple(4, -4, 3, 1);
  expect(a).toEqual(t);
});

test("create vector tuples", () => {
  const a = new Vector(4, -4, 3);
  const t = new Tuple(4, -4, 3, 0);
  expect(a).toEqual(t);
});

test("add two tuples", () => {
  const a = new Tuple(3, -2, 5, 1);
  const b = new Tuple(-2, 3, 1, 0);
  const c = a.add(b);
  expect(c).toEqual(new Tuple(1, 1, 6, 1));
});

test("add two points", () => {
  const a = new Point(3, -2, 5, 1);
  const b = new Point(-2, 3, 1, 0);
  expect(() => a.add(b)).toThrow("You cannot add two Points.");
});

test("subtract two tuples", () => {
  const a = new Point(3, 2, 1, 1);
  const b = new Point(5, 6, 7, 0);
  const c = a.subtract(b);
  expect(c).toEqual(new Vector(-2, -4, -6));
});

test("subtract a vector from a point", () => {
  const a = new Point(3, 2, 1);
  const b = new Vector(5, 6, 7);
  const c = a.subtract(b);
  expect(c).toEqual(new Point(-2, -4, -6));
});

test("subtract two vectors", () => {
  const a = new Vector(3, 2, 1);
  const b = new Vector(5, 6, 7);
  const c = a.subtract(b);
  expect(c).toEqual(new Vector(-2, -4, -6));
});

test("subtract a point from a vector", () => {
  const a = new Vector(3, 2, 1);
  const b = new Point(5, 6, 7);
  expect(() => a.subtract(b)).toThrow(
    "You cannot subtract a Point from a Vector."
  );
});

test("negate a tuple", () => {
  const a = new Tuple(1, -2, 3, 0);
  const b = a.negate();
  expect(b).toEqual(new Tuple(-1, 2, -3, 0));
});

test("multiply a tuple by a scalar", () => {
  const a = new Tuple(1, -2, 3, 0);
  const b = a.multiply(3.5);
  expect(b).toEqual(new Tuple(3.5, -7, 10.5, 0));
});

test("multiply a tuple by a fraction", () => {
  const a = new Tuple(1, -2, 3, 0);
  const b = a.multiply(0.5);
  expect(b).toEqual(new Tuple(0.5, -1, 1.5, 0));
});

test("divide a tuple by a scalar", () => {
  const a = new Tuple(1, -2, 3, 0);
  const b = a.divide(2);
  expect(b).toEqual(new Tuple(0.5, -1, 1.5, 0));
});

test("magnitude of Vector(1, 0, 0)", () => {
  const a = new Vector(1, 0, 0);
  expect(a.magnitude()).toBe(1);
});

test("magnitude of Vector(0, 1, 0)", () => {
  const a = new Vector(0, 1, 0);
  expect(a.magnitude()).toBe(1);
});

test("magnitude of Vector(0, 0, 1)", () => {
  const a = new Vector(0, 0, 1);
  expect(a.magnitude()).toBe(1);
});

test("magnitude of Vector(1, 2, 3)", () => {
  const a = new Vector(1, 2, 3);
  expect(a.magnitude()).toBe(Math.sqrt(14));
});

test("magnitude of Vector(-1, -2, -3)", () => {
  const a = new Vector(-1, -2, -3);
  expect(a.magnitude()).toBe(Math.sqrt(14));
});

test("normalize Vector(4, 0, 0)", () => {
  const a = new Vector(4, 0, 0);
  expect(a.normalize()).toEqual(new Vector(1, 0, 0));
});

test("normalize Vector(1, 2, 3)", () => {
  const a = new Vector(1, 2, 3);
  expect(a.normalize()).toEqual(
    new Vector(1 / Math.sqrt(14), 2 / Math.sqrt(14), 3 / Math.sqrt(14))
  );
});

test("magnitude of normalized vector", () => {
  const a = new Vector(1, 2, 3);
  const b = a.normalize();
  expect(b.magnitude()).toEqual(1);
});

test("dot product of two vectors", () => {
  const a = new Vector(1, 2, 3);
  const b = new Vector(2, 3, 4);
  expect(a.dot(b)).toEqual(20);
});

test("cross product of two vectors", () => {
  const a = new Vector(1, 2, 3);
  const b = new Vector(2, 3, 4);
  expect(a.cross(b)).toEqual(new Vector(-1, 2, -1));
  expect(b.cross(a)).toEqual(new Vector(1, -2, 1));
});

test("colors are (red, green, blue) tuples", () => {
  const a = new Color(-0.5, 0.4, 1.7);
  expect(a.red).toBe(-0.5);
  expect(a.green).toBe(0.4);
  expect(a.blue).toBe(1.7);
});

test("add two colors", () => {
  const a = new Color(0.9, 0.6, 0.75);
  const b = new Color(0.7, 0.1, 0.25);
  const c = a.add(b);
  expect(c).toEqual(new Color(1.6, 0.7, 1.0));
});

test("subtract two colors", () => {
  const a = new Color(0.9, 0.6, 0.75);
  const b = new Color(0.7, 0.1, 0.25);
  const c = a.subtract(b);
  expect(c).toBeDefined();
  expectToBeCloseTo(c, new Color(0.2, 0.5, 0.5));
});

test("multiply a color by a scalar", () => {
  const a = new Color(0.2, 0.3, 0.4);
  const b = a.multiply(2);
  expect(b).toEqual(new Color(0.4, 0.6, 0.8));
});

test("multiply two colors", () => {
  const a = new Color(1, 0.2, 0.4);
  const b = new Color(0.9, 1, 0.1);
  const c = a.multiply(b);
  expect(c).toBeDefined();
  expectToBeCloseTo(c, new Color(0.9, 0.2, 0.04));
});

function expectToBeCloseTo(a, b) {
  expect(a.x).toBeCloseTo(b.x);
  expect(a.y).toBeCloseTo(b.y);
  expect(a.z).toBeCloseTo(b.z);
  expect(a.w).toBeCloseTo(b.w);
}
