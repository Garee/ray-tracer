import { Tuple } from "./tuple";

export class Matrix {
  constructor(array = []) {
    this.array = array;
  }

  static from(array) {
    return new Matrix(array);
  }

  static n = 4;

  static identity = Matrix.from(identity(Matrix.n));

  get(x, y) {
    return this.array[x][y];
  }

  multiply(m) {
    if (m instanceof Tuple) {
      const n = multiply(this.array, m.array);
      return Tuple.of({ x: n[0][0], y: n[1][0], z: n[2][0], w: m.w });
    }

    const array = multiply(this.array, m.array);
    return Matrix.from(array);
  }

  identity() {
    const [rows] = dim(this.array);
    return Matrix.from(identity(rows));
  }

  transpose() {
    return Matrix.from(transpose(this.array));
  }

  submatrix(row, col) {
    return Matrix.from(submatrix(this.array, row, col));
  }

  minor(row, col) {
    return minor(this.array, row, col);
  }

  cofactor(row, col) {
    return cofactor(this.array, row, col);
  }

  determinant() {
    return determinant(this.array);
  }

  invertable() {
    return invertable(this.array);
  }

  inverse() {
    return Matrix.from(inverse(this.array));
  }
}

export function multiply(m, n) {
  const [mrow, mcol] = dim(m);
  const [nrow, ncol] = dim(n);

  if (mcol !== nrow) {
    throw new Error(
      `Cannot multiply matrices m and n when columns(m) !== rows(n)`
    );
  }

  const result = zeros(mrow, ncol);
  for (let r = 0; r < mrow; r++) {
    for (let c = 0; c < ncol; c++) {
      for (let i = 0; i < mrow; i++) {
        result[r][c] += m[r][i] * n[i][c];
      }
    }
  }

  return result;
}

function dim(m) {
  const rows = m[0] instanceof Array ? m.length : 1;
  const columns = m[0] instanceof Array ? m[0].length : m.length;
  return [rows, columns];
}

function zeros(rows, cols) {
  const m = new Array(rows);
  for (let r = 0; r < rows; r++) {
    m[r] = new Array(cols).fill(0);
  }
  return m;
}

function identity(n) {
  const z = zeros(n, n);
  for (let i = 0; i < n; i++) {
    z[i][i] = 1;
  }
  return z;
}

function transpose(m) {
  const [rows, cols] = dim(m);
  const z = zeros(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      z[c][r] = m[r][c];
    }
  }
  return z;
}

function determinantSimple(m) {
  const a = m[0][0];
  const b = m[0][1];
  const c = m[1][0];
  const d = m[1][1];
  return a * d - b * c;
}

function determinant(m) {
  const [rows, cols] = dim(m);
  if (rows == 2) {
    return determinantSimple(m);
  }

  let det = 0;
  for (let c = 0; c < cols; c++) {
    det += m[0][c] * cofactor(m, 0, c);
  }
  return det;
}

function submatrix(m, row, col) {
  const s = m.map((r) => {
    const rr = [...r];
    rr.splice(col, 1);
    return rr;
  });
  s.splice(row, 1);
  return s;
}

function minor(m, row, col) {
  const s = submatrix(m, row, col);
  return determinant(s);
}

function cofactor(m, row, col) {
  const negate = (row + col) % 2 === 1;
  const min = minor(m, row, col);
  return negate ? -min : min;
}

function invertable(m) {
  return determinant(m) !== 0;
}

function inverse(m) {
  if (!invertable(m)) {
    throw new Error("The matrix is not invertable");
  }

  const det = determinant(m);
  const [rows, cols] = dim(m);
  const inv = zeros(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      inv[c][r] = cofactor(m, r, c) / det;
    }
  }

  return inv;
}
