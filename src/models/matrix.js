import { Tuple } from "./tuple";

/**
 * A representation of a 4x4 matrix.
 */
export class Matrix {
  /**
   * Create a new Matrix.
   *
   * @param {number[][]} [array=[]] - A 4x4 array of numbers to populate the matrix with.
   */
  constructor(array = []) {
    this.array = array;
  }

  /**
   * Create a new array.
   *
   * @param {number[][]} array A 4x4 array of numbers to populate the matrix with.
   * @returns {Matrix} The populated 4x4 matrix.
   */
  static from(array) {
    return new Matrix(array);
  }

  /**
   * The row and column dimension of the matrix.
   */
  static n = 4;

  /**
   * A 4x4 identity matrix. Multiplying by this matrix
   * results in the original matrix.
   */
  static identity = Matrix.from(identity(Matrix.n));

  /**
   * Get a value from the matrix.
   *
   * @param {number} row - The row position of the value.
   * @param {number} col - The column position of the value.
   * @returns {number} The value at row x column y.
   */
  get(row, col) {
    return this.array[row][col];
  }

  /**
   * Multiply the matrix by another matrix or tuple.
   *
   * It computes the dot product of every row-column combination.
   *
   * This is used to perform transformations like scaling, rotation
   * and translation. They can all be applied at once by multiplying them
   * together.
   *
   * @param {Matrix|Tuple} by - The matrix or tuple to multiply by.
   * @returns {Matrix|Tuple} The result of the matrix multiplication.
   */
  multiply(by) {
    if (by instanceof Tuple) {
      const n = multiply(this.array, by.array);
      return Tuple.of({ x: n[0][0], y: n[1][0], z: n[2][0], w: by.w });
    }

    // It is a Matrix.
    const array = multiply(this.array, by.array);
    return Matrix.from(array);
  }

  /**
   * Turn a matrix's rows into columns and vice-versa.
   *
   * Can be used to translate vectors between object and world space.
   *
   * @returns {Matrix} A new matrix with the rows as columns and columns as rows.
   */
  transpose() {
    return Matrix.from(transpose(this.array));
  }

  /**
   * Get the submatrix that remains when a single row and column is
   * removed from the matrix.
   *
   * @param {number} row - The row position.
   * @param {number} col - The column position.
   * @returns {Matrix} A new matrix with the row and column removed.
   */
  submatrix(row, col) {
    return Matrix.from(submatrix(this.array, row, col));
  }

  /**
   * Get the determinant of a submatrix.
   *
   * @param {number} row - The row position.
   * @param {number} col - The column position.
   * @returns {number} The determinant of the submatrix.
   */
  minor(row, col) {
    return minor(this.array, row, col);
  }

  /**
   * Get the cofactor of a submatrix.
   *
   * This is the minor with the value sign possibly changed, based
   * on the row and column provided:
   *   + - +
   *   - + -
   *   + - +
   *
   * @param {number} row - The row position.
   * @param {number} col - The column position.
   * @returns {number} The cofactor of the matrix.
   */
  cofactor(row, col) {
    return cofactor(this.array, row, col);
  }

  /**
   * Get the determinant value which determines if the system of equations
   * has a solution. If 0, there is no solution.
   *
   * @returns {number} The determinant of the matrix.
   */
  determinant() {
    return determinant(this.array);
  }

  /**
   * Is this matrix invertable?
   *
   * @returns {boolean} True if the matrix is invertable, otherwise false.
   */
  invertable() {
    return invertable(this.array);
  }

  /**
   * Invert the matrix.
   *
   * This is the reverse of matrix multiplication.
   *
   * @returns {Matrix} A new inverted matrix.
   */
  inverse() {
    return Matrix.from(inverse(this.array));
  }
}

/**
 * Multiply the matrix by another matrix or vector.
 *
 * @param {number[][]} m - The left hand side matrix.
 * @param {number[][]} n - The right hand side matrix/vector.
 * @returns {number[][]} The result of the matrix multiplication.
 */
function multiply(m, n) {
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

/**
 * Get the dimensions of an NxN matrix.
 *
 * @param {number[][]} m - The matrix.
 * @returns {number[]} An array with the row and column dimensions.
 */
function dim(m) {
  const rows = m[0] instanceof Array ? m.length : 1;
  const columns = m[0] instanceof Array ? m[0].length : m.length;
  return [rows, columns];
}

/**
 * Create a new matrix of zeros and with a given dimension.
 *
 * @param {number} rows - The dimension of rows.
 * @param {number} cols - The dimension of columns.
 * @returns {number[][]} - A matrix of dimension rows x cols.
 */
function zeros(rows, cols) {
  const m = new Array(rows);
  for (let r = 0; r < rows; r++) {
    m[r] = new Array(cols).fill(0);
  }
  return m;
}

/**
 * Get an identity matrix of a given dimension.
 *
 * @param {number} n - The row and column dimension.
 * @returns {number[][]} An nxn identity matrix.
 */
function identity(n) {
  const z = zeros(n, n);
  for (let i = 0; i < n; i++) {
    z[i][i] = 1;
  }
  return z;
}

/**
 * Get the transpose of a matrix.
 *
 * @param {number[][]} m - The matrix to transpose.
 * @returns {number[][]} The transposed matrix.
 */
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

/**
 * Get the determinant of a 2x2 matrix.
 *
 * @param {number[][]} m - The 2x2 matrix.
 * @returns {number} The determinant of the matrix.
 */
function determinantSimple(m) {
  const a = m[0][0];
  const b = m[0][1];
  const c = m[1][0];
  const d = m[1][1];
  return a * d - b * c;
}

/**
 * Get the determinant of an nxn matrix.
 *
 * @param {number[][]} m - The matrix.
 * @returns {number} The determinant of the matrix.
 */
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

/**
 * Get the submatrix of a matrix.
 *
 * @param {number[][]} m - The matrix.
 * @param {number} row - The row position.
 * @param {number} col - The column position.
 * @returns {number[][]} - The submatrix with row and col removed.
 */
function submatrix(m, row, col) {
  const s = m.map((r) => {
    const rr = [...r];
    rr.splice(col, 1);
    return rr;
  });
  s.splice(row, 1);
  return s;
}

/**
 * Get the minor of a matrix.
 *
 * @param {number[][]} m - The matrix.
 * @param {number} row - The row position.
 * @param {number} col - The column position.
 * @returns {number} - The minor of the matrix.
 */
function minor(m, row, col) {
  const s = submatrix(m, row, col);
  return determinant(s);
}

/**
 * Get the cofactor of a matrix.
 *
 * @param {number[][]} m - The matrix.
 * @param {number} row - The row position.
 * @param {number} col - The column position.
 * @returns {number} - The minor of the matrix.
 */
function cofactor(m, row, col) {
  const negate = (row + col) % 2 === 1;
  const min = minor(m, row, col);
  return negate ? -min : min;
}

/**
 * Is a matrix invertable?
 *
 * @param {number[][]} m - The matrix to check.
 * @returns {boolean} True if m is invertable, otherwise false.
 */
function invertable(m) {
  return determinant(m) !== 0;
}

/**
 * Invert a matrix.
 *
 * @param {number[][]} m - The matrix to invert.
 * @returns {number[][]} The inverted matrix.
 */
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
