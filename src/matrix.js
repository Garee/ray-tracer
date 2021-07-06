import { Tuple } from "./tuple";

export class Matrix {
  constructor(mdarray) {
    this.mdarray = mdarray;
  }

  multiply(m) {
    if (m instanceof Tuple) {
      const n = multiply(this.mdarray, m.toArray());
      return new Tuple(n[0][0], n[1][0], n[2][0], m.w);
    }

    return multiply(this.mdarray, m);
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
