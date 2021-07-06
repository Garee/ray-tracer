import { Matrix, multiply } from "../src/matrix";
import { Tuple } from "../src/tuple";

test("construct and inspect a 4x4 matrix", () => {
  const m = [
    [1, 2, 3, 4],
    [5.5, 6.5, 7.5, 8.5],
    [9, 10, 11, 12],
    [13.5, 14.5, 15.5, 16.5],
  ];
  expect(m[0][0]).toBe(1);
  expect(m[0][3]).toBe(4);
  expect(m[1][0]).toBe(5.5);
  expect(m[1][2]).toBe(7.5);
  expect(m[2][2]).toBe(11);
  expect(m[3][0]).toBe(13.5);
  expect(m[3][2]).toBe(15.5);
});

test("construct a 2x2 matrix", () => {
  const m = [
    [-3, 5],
    [1, -2],
  ];
  expect(m[0][0]).toBe(-3);
  expect(m[0][1]).toBe(5);
  expect(m[1][0]).toBe(1);
  expect(m[1][1]).toBe(-2);
});

test("construct a 3x3 matrix", () => {
  const m = [
    [-3, 5, 0],
    [1, -2, -7],
    [0, 1, 1],
  ];
  expect(m[0][0]).toBe(-3);
  expect(m[1][1]).toBe(-2);
  expect(m[2][2]).toBe(1);
});

test("matrix equality", () => {
  const m = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 8, 7, 6],
    [5, 4, 3, 2],
  ];
  const n = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 8, 7, 6],
    [5, 4, 3, 2],
  ];
  expect(m).toEqual(n);
});

test("matrix inequality", () => {
  const m = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 8, 7, 6],
    [5, 4, 3, 2],
  ];
  const n = [
    [2, 3, 4, 5],
    [6, 7, 8, 9],
    [8, 7, 6, 5],
    [4, 3, 2, 1],
  ];
  expect(m).not.toEqual(n);
});

test("multiply two matrices", () => {
  const m = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 8, 7, 6],
    [5, 4, 3, 2],
  ];
  const n = [
    [-2, 1, 2, 3],
    [3, 2, 1, -1],
    [4, 3, 6, 5],
    [1, 2, 7, 8],
  ];
  expect(multiply(m, n)).toEqual([
    [20, 22, 50, 48],
    [44, 54, 114, 108],
    [40, 58, 110, 102],
    [16, 26, 46, 42],
  ]);
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
