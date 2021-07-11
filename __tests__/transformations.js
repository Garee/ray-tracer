import {
  translation,
  scaling,
  rotationX,
  rotationY,
  rotationZ,
  shearing,
  viewTransform,
} from "../src/models/transformations";
import { expectToBeCloseToTuple } from "../src/util";
import { Point, Vector, Matrix } from "../src/models";

test("multiplying by a translation matrix", () => {
  const transform = translation(5, -3, 2);
  const point = new Point(-3, 4, 5);
  expect(transform.multiply(point)).toEqual(new Point(2, 1, 7));
});

test("multiplying by the inverse of a translation matrix", () => {
  const transform = translation(5, -3, 2);
  const point = new Point(-3, 4, 5);
  expect(transform.inverse().multiply(point)).toEqual(new Point(-8, 7, 3));
});

test("translation does not affect vectors", () => {
  const transform = translation(5, -3, 2);
  const vector = new Vector(-3, 4, 5);
  expect(transform.multiply(vector)).toEqual(vector);
});

test("a scaling maxtrix applied to a point", () => {
  const transform = scaling(2, 3, 4);
  const point = new Point(-4, 6, 8);
  expect(transform.multiply(point)).toEqual(new Point(-8, 18, 32));
});

test("a scaling matrix applied to a vector", () => {
  const transform = scaling(2, 3, 4);
  const vector = new Vector(-4, 6, 8);
  expect(transform.multiply(vector)).toEqual(new Vector(-8, 18, 32));
});

test("multiplying the inverse of a scaling matrix", () => {
  const transform = new scaling(2, 3, 4);
  const vector = new Vector(-4, 6, 8);
  expect(transform.inverse().multiply(vector)).toEqual(new Vector(-2, 2, 2));
});

test("reflection is scaling by a negative value", () => {
  const transform = scaling(-1, 1, 1);
  const point = new Point(2, 3, 4);
  expect(transform.multiply(point)).toEqual(new Point(-2, 3, 4));
});

test("rotating a point around the x-axis", () => {
  const point = new Point(0, 1, 0);
  const hq = rotationX(Math.PI / 4);
  const fq = rotationX(Math.PI / 2);
  expect(hq).toBeDefined();
  expectToBeCloseToTuple(
    hq.multiply(point),
    new Point(0, Math.sqrt(2) / 2, Math.sqrt(2) / 2)
  );
  expectToBeCloseToTuple(fq.multiply(point), new Point(0, 0, 1));
});

test("the inverse of an x-rotation rotates in the opposite direction", () => {
  const point = new Point(0, 1, 0);
  const hq = rotationX(Math.PI / 4);
  expect(hq).toBeDefined();
  expectToBeCloseToTuple(
    hq.inverse().multiply(point),
    new Point(0, Math.sqrt(2) / 2, -Math.sqrt(2) / 2)
  );
});

test("rotation around the y-axis", () => {
  const point = new Point(0, 0, 1);
  const hq = rotationY(Math.PI / 4);
  const fq = rotationY(Math.PI / 2);
  expect(hq).toBeDefined();
  expectToBeCloseToTuple(
    hq.multiply(point),
    new Point(Math.sqrt(2) / 2, 0, Math.sqrt(2) / 2)
  );
  expectToBeCloseToTuple(fq.multiply(point), new Point(1, 0, 0));
});

test("rotation around the z-axis", () => {
  const point = new Point(0, 1, 0);
  const hq = rotationZ(Math.PI / 4);
  const fq = rotationZ(Math.PI / 2);
  expect(hq).toBeDefined();
  expectToBeCloseToTuple(
    hq.multiply(point),
    new Point(-Math.sqrt(2) / 2, Math.sqrt(2) / 2, 0)
  );
  expectToBeCloseToTuple(fq.multiply(point), new Point(-1, 0, 0));
});

test("a shearing transformation moves x in proportion to y", () => {
  const transform = shearing(1, 0, 0, 0, 0, 0);
  const point = new Point(2, 3, 4);
  expect(transform.multiply(point)).toEqual(new Point(5, 3, 4));
});

test("a shearing transformation moves x in proportion to z", () => {
  const transform = shearing(0, 1, 0, 0, 0, 0);
  const point = new Point(2, 3, 4);
  expect(transform.multiply(point)).toEqual(new Point(6, 3, 4));
});

test("a shearing transformation moves y in proportion to x", () => {
  const transform = shearing(0, 0, 1, 0, 0, 0);
  const point = new Point(2, 3, 4);
  expect(transform.multiply(point)).toEqual(new Point(2, 5, 4));
});

test("a shearing transformation moves y in proportion to z", () => {
  const transform = shearing(0, 0, 0, 1, 0, 0);
  const point = new Point(2, 3, 4);
  expect(transform.multiply(point)).toEqual(new Point(2, 7, 4));
});

test("a shearing transformation moves z in proportion to x", () => {
  const transform = shearing(0, 0, 0, 0, 1, 0);
  const point = new Point(2, 3, 4);
  expect(transform.multiply(point)).toEqual(new Point(2, 3, 6));
});

test("a shearing transformation moves z in proportion to y", () => {
  const transform = shearing(0, 0, 0, 0, 0, 1);
  const point = new Point(2, 3, 4);
  expect(transform.multiply(point)).toEqual(new Point(2, 3, 7));
});

test("individual transformations are applied in sequence", () => {
  const point = new Point(1, 0, 1);
  const a = rotationX(Math.PI / 2);
  const b = scaling(5, 5, 5);
  const c = translation(10, 5, 7);
  const p2 = a.multiply(point);
  const p3 = b.multiply(p2);
  const p4 = c.multiply(p3);
  expect(p4).toEqual(new Point(15, 0, 7));
});

test("chained transformations must be applied in reverse order", () => {
  const point = new Point(1, 0, 1);
  const a = rotationX(Math.PI / 2);
  const b = scaling(5, 5, 5);
  const c = translation(10, 5, 7);
  const t = c.multiply(b).multiply(a);
  expect(t.multiply(point)).toEqual(new Point(15, 0, 7));
});

test("the transformation matrix for the default orientation", () => {
  const from = new Point();
  const to = new Point(0, 0, -1);
  const up = new Vector(0, 1, 0);
  const t = viewTransform(from, to, up);
  expect(t).toEqual(Matrix.identity);
});

test("a view transformation matrix looking in a positive z direction", () => {
  const from = new Point();
  const to = new Point(0, 0, 1);
  const up = new Vector(0, 1, 0);
  const t = viewTransform(from, to, up);
  expect(t).toEqual(scaling(-1, 1, -1));
});

test("the view transformation moves the world", () => {
  const from = new Point(0, 0, 8);
  const to = new Point();
  const up = new Vector(0, 1, 0);
  const t = viewTransform(from, to, up);
  expect(t).toEqual(translation(0, 0, -8));
});

test("an arbitrary view transformation", () => {
  const from = new Point(1, 3, 2);
  const to = new Point(4, -2, 8);
  const up = new Vector(1, 1, 0);
  const t = viewTransform(from, to, up);
  const m = new Matrix([
    [-0.50709, 0.50709, 0.67612, -2.36643],
    [0.76772, 0.60609, 0.12122, -2.82843],
    [-0.35857, 0.59761, -0.71714, 0],
    [0, 0, 0, 1],
  ]);
  t.array.forEach((row, i) => {
    row.forEach((col, j) => expect(col).toBeCloseTo(m.get(i, j)));
  });
});
