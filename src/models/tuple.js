/**
 * A representation of a tuple with three dimensional coordinates.
 */
export class Tuple {
  /**
   * Create a new Tuple.
   *
   * @param {number} x The x coordinate.
   * @param {number} y The y coordinate.
   * @param {number} z The z coordinate.
   * @param {number} w The tuple classifier.
   */
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * Create a new Tuple.
   *
   * @param {object} args An object containing arguments to use during construction.
   * @returns An instance of a Tuple with the provided options.
   */
  static of({ x = 0, y = 0, z = 0, w = 0 } = {}) {
    return new Tuple(x, y, z, w);
  }

  /**
   * The Tuple represented as an array/vector.
   */
  get array() {
    return [[this.x], [this.y], [this.z], [this.w]];
  }

  /**
   * The tuple represented as an array/vector with fixed decimal places.
   */
  get fixed() {
    return this.array.map((x) => x[0].toFixed(3));
  }

  /**
   * Add a Tuple.
   *
   * @param {Tuple} tuple The tuple to add.
   * @returns the result of adding the tuple.
   */
  add({ x, y, z, w }) {
    return Tuple.of({
      x: this.x + x,
      y: this.y + y,
      z: this.z + z,
      w: this.w + w,
    });
  }

  /**
   * Subtract a Tuple.
   *
   * @param {Tuple} tuple The tuple to subtract.
   * @returns The result of subtracting the tuple.
   */
  subtract({ x, y, z, w }) {
    return Tuple.of({
      x: this.x - x,
      y: this.y - y,
      z: this.z - z,
      w: this.w - w,
    });
  }

  /**
   * Negate the tuple
   *
   * @returns The negated tuple.
   */
  negate() {
    return Tuple.of({ w: this.w }).subtract(this);
  }

  /**
   * Multiply a Tuple by a scalar value.
   *
   * @param {number} scalar The scalar value.
   * @returns The result of the multiplication.
   */
  multiply(scalar) {
    return Tuple.of({
      x: this.x * scalar,
      y: this.y * scalar,
      z: this.z * scalar,
      w: this.w,
    });
  }

  /**
   * Divide a Tuple by a scalar value.
   *
   * @param {number} scalar The scalar value.
   * @returns The result of the division.
   */
  divide(scalar) {
    return Tuple.of({
      x: this.x / scalar,
      y: this.y / scalar,
      z: this.z / scalar,
      w: this.w,
    });
  }

  /**
   * Is this a Tuple representation of a Point?
   *
   * @returns True if the Tuple is a Point, otherwise false?
   */
  isPoint() {
    return this.w === 1;
  }

  /**
   * Is this a Tuple representation of a Vector?
   *
   * @returns True if the Tuple is a Point, otherwise false?
   */
  isVector() {
    return this.w === 0;
  }

  /**
   * Get the magnitude of a Tuple.
   *
   * @returns the magnitude of the Tuple.
   */
  magnitude() {
    const x = this.x ** 2;
    const y = this.y ** 2;
    const z = this.z ** 2;
    return Math.sqrt(x + y + z);
  }

  /**
   * Get the normalized Tuple.
   *
   * @returns the normalized Tuple.
   */
  normalize() {
    const x = this.x / this.magnitude();
    const y = this.y / this.magnitude();
    const z = this.z / this.magnitude();
    return Tuple.of({ x, y, z, w: this.w });
  }

  /**
   * Calculate the dot product with another Tuple.
   *
   * @param {Tuple} tuple The other tuple.
   * @returns The result of the dot product.
   */
  dot({ x, y, z }) {
    return this.x * x + this.y * y + this.z * z;
  }

  /**
   * Calculate the cross product with another Tuple.
   *
   * @param {Tuple} tuple The other tuple.
   * @returns The result of the cross product.
   */
  cross({ x, y, z }) {
    return Tuple.of({
      x: this.y * z - this.z * y,
      y: this.z * x - this.x * z,
      z: this.x * y - this.y * x,
      w: this.w,
    });
  }

  /**
   * Calculate the reflection vector from a normal.
   *
   * @param {Vector} normal The normal vector.
   * @returns The reflection vector.
   */
  reflect(normal) {
    return this.subtract(normal.multiply(this.dot(normal) * 2));
  }
}
