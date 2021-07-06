import { determinantSimple, identity, Matrix } from "../src/matrix";
import { Tuple } from "../src/tuple";

test("construct and inspect a 4x4 matrix", () => {
  const m = new Matrix([
    [1, 2, 3, 4],
    [5.5, 6.5, 7.5, 8.5],
    [9, 10, 11, 12],
    [13.5, 14.5, 15.5, 16.5],
  ]);
  expect(m.get(0, 0)).toBe(1);
  expect(m.get(0, 3)).toBe(4);
  expect(m.get(1, 0)).toBe(5.5);
  expect(m.get(1, 2)).toBe(7.5);
  expect(m.get(2, 2)).toBe(11);
  expect(m.get(3, 0)).toBe(13.5);
  expect(m.get(3, 2)).toBe(15.5);
});

test("construct a 2x2 matrix", () => {
  const m = new Matrix([
    [-3, 5],
    [1, -2],
  ]);
  expect(m.get(0, 0)).toBe(-3);
  expect(m.get(0, 1)).toBe(5);
  expect(m.get(1, 0)).toBe(1);
  expect(m.get(1, 1)).toBe(-2);
});

test("construct a 3x3 matrix", () => {
  const m = new Matrix([
    [-3, 5, 0],
    [1, -2, -7],
    [0, 1, 1],
  ]);
  expect(m.get(0, 0)).toBe(-3);
  expect(m.get(1, 1)).toBe(-2);
  expect(m.get(2, 2)).toBe(1);
});

test("matrix equality", () => {
  const m = new Matrix([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 8, 7, 6],
    [5, 4, 3, 2],
  ]);
  const n = new Matrix([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 8, 7, 6],
    [5, 4, 3, 2],
  ]);
  expect(m).toEqual(n);
});

test("matrix inequality", () => {
  const m = new Matrix([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 8, 7, 6],
    [5, 4, 3, 2],
  ]);
  const n = new Matrix([
    [2, 3, 4, 5],
    [6, 7, 8, 9],
    [8, 7, 6, 5],
    [4, 3, 2, 1],
  ]);
  expect(m).not.toEqual(n);
});

test("multiply two matrices", () => {
  const m = new Matrix([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 8, 7, 6],
    [5, 4, 3, 2],
  ]);
  const n = new Matrix([
    [-2, 1, 2, 3],
    [3, 2, 1, -1],
    [4, 3, 6, 5],
    [1, 2, 7, 8],
  ]);
  expect(m.multiply(n)).toEqual(
    new Matrix([
      [20, 22, 50, 48],
      [44, 54, 114, 108],
      [40, 58, 110, 102],
      [16, 26, 46, 42],
    ])
  );
});

test("multiply a matrix and a tuple", () => {
  const m = new Matrix([
    [1, 2, 3, 4],
    [2, 4, 4, 2],
    [8, 6, 4, 1],
    [0, 0, 0, 1],
  ]);
  const t = new Tuple(1, 2, 3, 1);
  expect(m.multiply(t)).toEqual(new Tuple(18, 24, 33, 1));
});

test("multiply a matrix by the identity matrix", () => {
  const m = new Matrix([
    [0, 1, 2, 4],
    [1, 2, 4, 8],
    [2, 4, 8, 16],
    [4, 8, 16, 32],
  ]);
  expect(m.multiply(m.identity())).toEqual(m);
});

test("matrix transposition", () => {
  const m = new Matrix([
    [0, 9, 3, 0],
    [9, 8, 0, 8],
    [1, 8, 5, 3],
    [0, 0, 5, 8],
  ]);
  expect(m.transpose()).toEqual(
    new Matrix([
      [0, 9, 1, 0],
      [9, 8, 8, 0],
      [3, 0, 5, 5],
      [0, 8, 3, 8],
    ])
  );
});

test("tranposition of an identity matrix", () => {
  const i = new Matrix(identity(4));
  expect(i.transpose()).toEqual(i);
});

test("calculating the determinant of a 2x2 matrix", () => {
  const m = [
    [1, 5],
    [-3, 2],
  ];
  expect(determinantSimple(m)).toEqual(17);
});

test("submatrix of a 3x3 matrix is a 2x2 matrix", () => {
  const m = new Matrix([
    [1, 5, 0],
    [-3, 2, 7],
    [0, 6, -3],
  ]);
  expect(m.submatrix(0, 2)).toEqual(
    new Matrix([
      [-3, 2],
      [0, 6],
    ])
  );
});

test("submatrix of a 4x4 matrix is a 3x3 matrix", () => {
  const m = new Matrix([
    [-6, 1, 1, 6],
    [-8, 5, 8, 6],
    [-1, 0, 8, 2],
    [-7, 1, -1, 1],
  ]);
  expect(m.submatrix(2, 1)).toEqual(
    new Matrix([
      [-6, 1, 6],
      [-8, 8, 6],
      [-7, -1, 1],
    ])
  );
});

test("minor of a 3x3 matrix", () => {
  const m = new Matrix([
    [3, 5, 0],
    [2, -1, -7],
    [6, -1, 5],
  ]);
  const b = m.submatrix(1, 0);
  const det = determinantSimple(b.toArray());
  expect(det).toEqual(25);
  expect(m.minor(1, 0)).toEqual(det);
});

test("cofactor of a 3x3 matrix", () => {
  const m = new Matrix([
    [3, 5, 0],
    [2, -1, -7],
    [6, -1, 5],
  ]);
  expect(m.minor(0, 0)).toEqual(-12);
  expect(m.cofactor(0, 0)).toEqual(-12);
  expect(m.minor(1, 0)).toEqual(25);
  expect(m.cofactor(1, 0)).toEqual(-25);
});

test("calculating the determinant of a 3x3 matrix", () => {
  const m = new Matrix([
    [1, 2, 6],
    [-5, 8, -4],
    [2, 6, 4],
  ]);
  expect(m.cofactor(0, 0)).toEqual(56);
  expect(m.cofactor(0, 1)).toEqual(12);
  expect(m.cofactor(0, 2)).toEqual(-46);
  expect(m.determinant()).toEqual(-196);
});

test("calculating the determinant of a 4x4 matrix", () => {
  const m = new Matrix([
    [-2, -8, 3, 5],
    [-3, 1, 7, 3],
    [1, 2, -9, 6],
    [-6, 7, 7, -9],
  ]);
  expect(m.cofactor(0, 0)).toEqual(690);
  expect(m.cofactor(0, 1)).toEqual(447);
  expect(m.cofactor(0, 2)).toEqual(210);
  expect(m.cofactor(0, 3)).toEqual(51);
  expect(m.determinant()).toEqual(-4071);
});
