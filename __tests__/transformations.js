import {
  translate,
  scale,
  rotateX,
  rotateY,
  rotateZ,
  shear,
  view,
} from "../src/models/transformations";
import { expectToBeCloseToTuple } from "../src/util";
import { Point, Vector, Matrix } from "../src/models";

test("multiplying by a translate matrix", () => {
  const transform = translate({ x: 5, y: -3, z: 2 });
  const point = Point.of({ x: -3, y: 4, z: 5 });
  expect(transform.multiply(point)).toEqual(Point.of({ x: 2, y: 1, z: 7 }));
});

test("multiplying by the inverse of a translate matrix", () => {
  const transform = translate({ x: 5, y: -3, z: 2 });
  const point = Point.of({ x: -3, y: 4, z: 5 });
  expect(transform.inverse().multiply(point)).toEqual(
    Point.of({ x: -8, y: 7, z: 3 })
  );
});

test("translate does not affect vectors", () => {
  const transform = translate({ x: 5, y: -3, z: 2 });
  const vector = Vector.of({ x: -3, y: 4, z: 5 });
  expect(transform.multiply(vector)).toEqual(vector);
});

test("a scale maxtrix applied to a point", () => {
  const transform = scale({ x: 2, y: 3, z: 4 });
  const point = Point.of({ x: -4, y: 6, z: 8 });
  expect(transform.multiply(point)).toEqual(Point.of({ x: -8, y: 18, z: 32 }));
});

test("a scale matrix applied to a vector", () => {
  const transform = scale({ x: 2, y: 3, z: 4 });
  const vector = Vector.of({ x: -4, y: 6, z: 8 });
  expect(transform.multiply(vector)).toEqual(
    Vector.of({ x: -8, y: 18, z: 32 })
  );
});

test("multiplying the inverse of a scale matrix", () => {
  const transform = scale({ x: 2, y: 3, z: 4 });
  const vector = Vector.of({ x: -4, y: 6, z: 8 });
  expect(transform.inverse().multiply(vector)).toEqual(
    Vector.of({ x: -2, y: 2, z: 2 })
  );
});

test("reflection is scale by a negative value", () => {
  const transform = scale({ x: -1, y: 1, z: 1 });
  const point = Point.of({ x: 2, y: 3, z: 4 });
  expect(transform.multiply(point)).toEqual(Point.of({ x: -2, y: 3, z: 4 }));
});

test("rotating a point around the x-axis", () => {
  const point = Point.of({ y: 1 });
  const hq = rotateX(45);
  const fq = rotateX(90);
  expect(hq).toBeDefined();
  expectToBeCloseToTuple(
    hq.multiply(point),
    Point.of({ y: Math.sqrt(2) / 2, z: Math.sqrt(2) / 2 })
  );
  expectToBeCloseToTuple(fq.multiply(point), Point.of({ z: 1 }));
});

test("the inverse of an x-rotation rotates in the opposite direction", () => {
  const point = Point.of({ y: 1 });
  const hq = rotateX(45);
  expect(hq).toBeDefined();
  expectToBeCloseToTuple(
    hq.inverse().multiply(point),
    Point.of({ y: Math.sqrt(2) / 2, z: -Math.sqrt(2) / 2 })
  );
});

test("rotation around the y-axis", () => {
  const point = Point.of({ z: 1 });
  const hq = rotateY(45);
  const fq = rotateY(90);
  expect(hq).toBeDefined();
  expectToBeCloseToTuple(
    hq.multiply(point),
    Point.of({ x: Math.sqrt(2) / 2, z: Math.sqrt(2) / 2 })
  );
  expectToBeCloseToTuple(fq.multiply(point), Point.of({ x: 1 }));
});

test("rotation around the z-axis", () => {
  const point = Point.of({ y: 1 });
  const hq = rotateZ(45);
  const fq = rotateZ(90);
  expect(hq).toBeDefined();
  expectToBeCloseToTuple(
    hq.multiply(point),
    Point.of({ x: -Math.sqrt(2) / 2, y: Math.sqrt(2) / 2 })
  );
  expectToBeCloseToTuple(fq.multiply(point), Point.of({ x: -1 }));
});

test("a shear transformation moves x in proportion to y", () => {
  const transform = shear({ xy: 1 });
  const point = Point.of({ x: 2, y: 3, z: 4 });
  expect(transform.multiply(point)).toEqual(Point.of({ x: 5, y: 3, z: 4 }));
});

test("a shear transformation moves x in proportion to z", () => {
  const transform = shear({ xz: 1 });
  const point = Point.of({ x: 2, y: 3, z: 4 });
  expect(transform.multiply(point)).toEqual(Point.of({ x: 6, y: 3, z: 4 }));
});

test("a shear transformation moves y in proportion to x", () => {
  const transform = shear({ yx: 1 });
  const point = Point.of({ x: 2, y: 3, z: 4 });
  expect(transform.multiply(point)).toEqual(Point.of({ x: 2, y: 5, z: 4 }));
});

test("a shear transformation moves y in proportion to z", () => {
  const transform = shear({ yz: 1 });
  const point = Point.of({ x: 2, y: 3, z: 4 });
  expect(transform.multiply(point)).toEqual(Point.of({ x: 2, y: 7, z: 4 }));
});

test("a shear transformation moves z in proportion to x", () => {
  const transform = shear({ zx: 1 });
  const point = Point.of({ x: 2, y: 3, z: 4 });
  expect(transform.multiply(point)).toEqual(Point.of({ x: 2, y: 3, z: 6 }));
});

test("a shear transformation moves z in proportion to y", () => {
  const transform = shear({ zy: 1 });
  const point = Point.of({ x: 2, y: 3, z: 4 });
  expect(transform.multiply(point)).toEqual(Point.of({ x: 2, y: 3, z: 7 }));
});

test("individual transformations are applied in sequence", () => {
  const point = Point.of({ x: 1, z: 1 });
  const a = rotateX(90);
  const b = scale({ x: 5, y: 5, z: 5 });
  const c = translate({ x: 10, y: 5, z: 7 });
  const p2 = a.multiply(point);
  const p3 = b.multiply(p2);
  const p4 = c.multiply(p3);
  expect(p4).toEqual(Point.of({ x: 15, z: 7 }));
});

test("chained transformations must be applied in reverse order", () => {
  const point = Point.of({ x: 1, z: 1 });
  const a = rotateX(90);
  const b = scale({ x: 5, y: 5, z: 5 });
  const c = translate({ x: 10, y: 5, z: 7 });
  const t = c.multiply(b).multiply(a);
  expect(t.multiply(point)).toEqual(Point.of({ x: 15, z: 7 }));
});

test("the transformation matrix for the default orientation", () => {
  const from = Point.origin;
  const to = Point.of({ z: -1 });
  const up = Vector.of({ y: 1 });
  const t = view({ from, to, up });
  expect(t).toEqual(Matrix.identity);
});

test("a view transformation matrix looking in a positive z direction", () => {
  const from = Point.origin;
  const to = Point.of({ z: 1 });
  const up = Vector.of({ y: 1 });
  const t = view({ from, to, up });
  expect(t).toEqual(scale({ x: -1, y: 1, z: -1 }));
});

test("the view transformation moves the world", () => {
  const from = Point.of({ z: 8 });
  const to = Point.origin;
  const up = Vector.of({ y: 1 });
  const t = view({ from, to, up });
  expect(t).toEqual(translate({ z: -8 }));
});

test("an arbitrary view transformation", () => {
  const from = Point.of({ x: 1, y: 3, z: 2 });
  const to = Point.of({ x: 4, y: -2, z: 8 });
  const up = Vector.of({ x: 1, y: 1 });
  const t = view({ from, to, up });
  const m = Matrix.from([
    [-0.50709, 0.50709, 0.67612, -2.36643],
    [0.76772, 0.60609, 0.12122, -2.82843],
    [-0.35857, 0.59761, -0.71714, 0],
    [0, 0, 0, 1],
  ]);
  t.array.forEach((row, i) => {
    row.forEach((col, j) => expect(col).toBeCloseTo(m.get(i, j)));
  });
});
