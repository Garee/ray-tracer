import { Tuple } from "./tuple";

export class Matrix {
  mdarray = [];

  constructor(mdarray) {
    this.mdarray = mdarray;
  }

  get(x, y) {
    return this.mdarray[x][y];
  }

  multiply(m) {
    if (m instanceof Tuple) {
      const n = multiply(this.mdarray, m.toArray());
      return new Tuple(n[0][0], n[1][0], n[2][0], m.w);
    }

    const mdarray = multiply(this.mdarray, m.toArray());
    return new Matrix(mdarray);
  }

  identity() {
    const [rows] = dim(this.mdarray);
    return new Matrix(identity(rows));
  }

  transpose() {
    return new Matrix(transpose(this.mdarray));
  }

  submatrix(row, col) {
    return new Matrix(submatrix(this.mdarray, row, col));
  }

  minor(row, col) {
    return minor(this.mdarray, row, col);
  }

  cofactor(row, col) {
    return cofactor(this.mdarray, row, col);
  }

  toArray() {
    return this.mdarray;
  }
}

export function multiply(m, n) {
  const [mrow, mcol] = dim(m);
  const [nrow, ncol] = dim(n);

  if (mcol !== nrow) {
    throw new Error(
      "Cannot multiply matrices (m,n) when columns(m) !== rows(n)"
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

export function dim(m) {
  const rows = m[0] instanceof Array ? m.length : 1;
  const columns = m[0] instanceof Array ? m[0].length : m.length;
  return [rows, columns];
}

export function zeros(rows, cols) {
  const m = new Array(rows);
  for (let r = 0; r < rows; r++) {
    m[r] = new Array(cols).fill(0);
  }
  return m;
}

export function identity(n) {
  const z = zeros(n, n);
  for (let i = 0; i < n; i++) {
    z[i][i] = 1;
  }
  return z;
}

export function transpose(m) {
  const [rows, cols] = dim(m);
  const z = zeros(rows, cols);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      z[c][r] = m[r][c];
    }
  }
  return z;
}

export function determinantSimple(m) {
  const a = m[0][0];
  const b = m[0][1];
  const c = m[1][0];
  const d = m[1][1];
  return a * d - b * c;
}

export function submatrix(m, row, col) {
  const s = m.map((r) => {
    const rr = [...r];
    rr.splice(col, 1);
    return rr;
  });
  s.splice(row, 1);
  return s;
}

export function minor(m, row, col) {
  const s = submatrix(m, row, col);
  return determinantSimple(s);
}

export function cofactor(m, row, col) {
  const negate = (row + col) % 2 === 1;
  const min = minor(m, row, col);
  return negate ? -min : min;
}
