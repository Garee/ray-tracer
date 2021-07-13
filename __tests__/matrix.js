import { Matrix, Tuple } from "../src/models";

test("construct and inspect a 4x4 matrix", () => {
  const m = Matrix.from([
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
  const m = Matrix.from([
    [-3, 5],
    [1, -2],
  ]);
  expect(m.get(0, 0)).toBe(-3);
  expect(m.get(0, 1)).toBe(5);
  expect(m.get(1, 0)).toBe(1);
  expect(m.get(1, 1)).toBe(-2);
});

test("construct a 3x3 matrix", () => {
  const m = Matrix.from([
    [-3, 5, 0],
    [1, -2, -7],
    [0, 1, 1],
  ]);
  expect(m.get(0, 0)).toBe(-3);
  expect(m.get(1, 1)).toBe(-2);
  expect(m.get(2, 2)).toBe(1);
});

test("matrix equality", () => {
  const m = Matrix.from([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 8, 7, 6],
    [5, 4, 3, 2],
  ]);
  const n = Matrix.from([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 8, 7, 6],
    [5, 4, 3, 2],
  ]);
  expect(m).toEqual(n);
});

test("matrix inequality", () => {
  const m = Matrix.from([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 8, 7, 6],
    [5, 4, 3, 2],
  ]);
  const n = Matrix.from([
    [2, 3, 4, 5],
    [6, 7, 8, 9],
    [8, 7, 6, 5],
    [4, 3, 2, 1],
  ]);
  expect(m).not.toEqual(n);
});

test("multiply two matrices", () => {
  const m = Matrix.from([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 8, 7, 6],
    [5, 4, 3, 2],
  ]);
  const n = Matrix.from([
    [-2, 1, 2, 3],
    [3, 2, 1, -1],
    [4, 3, 6, 5],
    [1, 2, 7, 8],
  ]);
  expect(m.multiply(n)).toEqual(
    Matrix.from([
      [20, 22, 50, 48],
      [44, 54, 114, 108],
      [40, 58, 110, 102],
      [16, 26, 46, 42],
    ])
  );
});

test("multiply a matrix and a tuple", () => {
  const m = Matrix.from([
    [1, 2, 3, 4],
    [2, 4, 4, 2],
    [8, 6, 4, 1],
    [0, 0, 0, 1],
  ]);
  const t = Tuple.of({ x: 1, y: 2, z: 3, w: 1 });
  expect(m.multiply(t)).toEqual(Tuple.of({ x: 18, y: 24, z: 33, w: 1 }));
});

test("multiply a matrix by the identity matrix", () => {
  const m = Matrix.from([
    [0, 1, 2, 4],
    [1, 2, 4, 8],
    [2, 4, 8, 16],
    [4, 8, 16, 32],
  ]);
  expect(m.multiply(m.identity())).toEqual(m);
});

test("matrix transposition", () => {
  const m = Matrix.from([
    [0, 9, 3, 0],
    [9, 8, 0, 8],
    [1, 8, 5, 3],
    [0, 0, 5, 8],
  ]);
  expect(m.transpose()).toEqual(
    Matrix.from([
      [0, 9, 1, 0],
      [9, 8, 8, 0],
      [3, 0, 5, 5],
      [0, 8, 3, 8],
    ])
  );
});

test("tranposition of an identity matrix", () => {
  const i = Matrix.identity;
  expect(i.transpose()).toEqual(i);
});

test("calculating the determinant of a 2x2 matrix", () => {
  const m = Matrix.from([
    [1, 5],
    [-3, 2],
  ]);
  expect(m.determinant()).toEqual(17);
});

test("submatrix of a 3x3 matrix is a 2x2 matrix", () => {
  const m = Matrix.from([
    [1, 5, 0],
    [-3, 2, 7],
    [0, 6, -3],
  ]);
  expect(m.submatrix(0, 2)).toEqual(
    Matrix.from([
      [-3, 2],
      [0, 6],
    ])
  );
});

test("submatrix of a 4x4 matrix is a 3x3 matrix", () => {
  const m = Matrix.from([
    [-6, 1, 1, 6],
    [-8, 5, 8, 6],
    [-1, 0, 8, 2],
    [-7, 1, -1, 1],
  ]);
  expect(m.submatrix(2, 1)).toEqual(
    Matrix.from([
      [-6, 1, 6],
      [-8, 8, 6],
      [-7, -1, 1],
    ])
  );
});

test("minor of a 3x3 matrix", () => {
  const m = Matrix.from([
    [3, 5, 0],
    [2, -1, -7],
    [6, -1, 5],
  ]);
  const b = m.submatrix(1, 0);
  const det = b.determinant();
  expect(det).toEqual(25);
  expect(m.minor(1, 0)).toEqual(det);
});

test("cofactor of a 3x3 matrix", () => {
  const m = Matrix.from([
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
  const m = Matrix.from([
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
  const m = Matrix.from([
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

test("testing invertible matrix for invertability", () => {
  const m = Matrix.from([
    [6, 4, 4, 4],
    [5, 5, 7, 6],
    [4, -9, 3, -7],
    [9, 1, 7, -6],
  ]);
  expect(m.determinant()).toEqual(-2120);
  expect(m.invertable()).toBe(true);
});

test("testing non-invertible matrix for invertability", () => {
  const m = Matrix.from([
    [4, 2, -2, -3],
    [9, 6, 2, 6],
    [0, -5, 1, -5],
    [0, 0, 0, 0],
  ]);
  expect(m.determinant()).toEqual(0);
  expect(m.invertable()).toBe(false);
});

test("inverse of a matrix", () => {
  const m = Matrix.from([
    [-5, 2, 6, -8],
    [1, -5, 1, 8],
    [7, 7, -6, -7],
    [1, -3, 7, 4],
  ]);
  expect(m.determinant()).toEqual(532);
  expect(m.cofactor(2, 3)).toEqual(-160);
  expect(m.cofactor(3, 2)).toEqual(105);
  const n = m.inverse();
  expect(n.get(3, 2)).toBeCloseTo(-160 / 532);
  expect(n.get(2, 3)).toBeCloseTo(105 / 532);
});

test("calculating the inverse of another matrix", () => {
  const m = Matrix.from([
    [8, -5, 9, 2],
    [7, 5, 6, 1],
    [-6, 0, 9, 6],
    [-3, 0, -9, -4],
  ]);
  const n = [
    [-0.15385, -0.15385, -0.28205, -0.53846],
    [-0.07692, 0.12308, 0.02564, 0.03077],
    [0.35897, 0.35897, 0.4359, 0.92308],
    [-0.69231, -0.69231, -0.76923, -1.92308],
  ];
  m.inverse().array.forEach((row, i) => {
    row.forEach((col, j) => expect(col).toBeCloseTo(n[i][j]));
  });
});

test("calculating the inverse of a third matrix", () => {
  const m = Matrix.from([
    [9, 3, 0, 9],
    [-5, -2, -6, -3],
    [-4, 9, 6, 4],
    [-7, 6, 6, 2],
  ]);
  const n = [
    [-0.04074, -0.07778, 0.14444, -0.22222],
    [-0.07778, 0.03333, 0.36667, -0.33333],
    [-0.02901, -0.1463, -0.10926, 0.12963],
    [0.17778, 0.06667, -0.26667, 0.33333],
  ];
  m.inverse().array.forEach((row, i) => {
    row.forEach((col, j) => expect(col).toBeCloseTo(n[i][j]));
  });
});

test("multiply a product by its inverse", () => {
  const m = Matrix.from([
    [3, -9, 7, 3],
    [3, -8, 2, -9],
    [-4, 4, 4, 1],
    [-6, 5, -1, 1],
  ]);
  const n = Matrix.from([
    [8, 2, 2, 2],
    [3, -1, 7, 0],
    [7, 0, 5, 4],
    [6, -2, 0, 5],
  ]);
  const o = m.multiply(n);
  o.multiply(n.inverse()).array.forEach((r, i) => {
    r.forEach((c, j) => expect(c).toBeCloseTo(m.get(i, j)));
  });
});
