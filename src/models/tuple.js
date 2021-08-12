/**
 * A representation of a tuple with three dimensional coordinates.
 *
 * A Tuple is an ordered list of "things". For our purposes it's an
 * ordered list of x, y, and z coordinates, in addition to a flag
 * that determines what these coordinates represent.
 *
 * The x coordinate represents the position in the left-to-right axis.
 * A positive value is right and a negative value is left.
 *
 * The y coordinate represents the position in the up-and-down axis.
 * A positive value is up and a negative value is down.
 *
 * The z coordinate represents the position in the forward-to-backward axis.
 * A position value is forwards and a negative value is backwards.
 *
 * The w property determines whether the Tuple represents a Point or a Vector.
 * Point=1 and Vector=0 therefore Point+Vector=Vector and Vector+Vector=Vector.
 * Similarly, Point-Vector=Vector and Vector-Vector=Vector.
 */
export class Tuple {
  /**
   * Create a new Tuple.
   *
   * @param {number} x - The x coordinate.
   * @param {number} y - The y coordinate.
   * @param {number} z - The z coordinate.
   * @param {number} w - The tuple classifier where a Point=1 and Vector=0.
   */
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * Create a new Tuple from an object.
   *
   * @param {Object} object - The object to create from.
   * @param {number} [object.x=0] - The x coordinate.
   * @param {number} [object.y=0] - The y coordinate.
   * @param {number} [object.z=0] - The z coordinate.
   * @param {number} [object.w=0] - The tuple classifier.
   * @returns {Tuple} An instance of a Tuple created from the object.
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
   * The tuple represented as an array/vector and fixed to 3 decimal places.
   */
  get fixed() {
    return this.array.map((x) => x[0].toFixed(3));
  }

  /**
   * Add a Tuple.
   *
   * Adding a vector to a point moves "forward" in that direction.
   *
   * @param {Tuple} tuple - The tuple to add.
   * @returns {Tuple} A new tuple representing the result of adding the tuple.
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
   * Subtracting a vector from a point moves "backwards" from that point.
   *
   * @param {Tuple} tuple - The tuple to subtract.
   * @returns {Tuple} A new tuple representing the result of subtracting the tuple.
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
   * Negate the tuple.
   *
   * If a vector points in a direction this will get the vector that
   * points in the opposite direction.
   *
   * @returns {Tuple} A new tuple representing the negated tuple.
   */
  negate() {
    return Tuple.of({ w: this.w }).subtract(this);
  }

  /**
   * Multiply a tuple by a scalar value.
   *
   * Multiplying a tuple by N tells us what point lies N times further
   * in that direction.
   *
   * @param {number} scalar - The scalar value.
   * @returns {Tuple} A new tuple representing the result of the multiplication.
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
   * Divide a tuple by a scalar value.
   *
   * Dividing a tuple by N tells us what point lies N times backwards
   * in the opposite direction.
   *
   * @param {number} scalar - The scalar value.
   * @returns {Tuple} A new tuple representing the result of the division.
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
   * Is this a tuple representation of a point?
   *
   * @returns {boolean} True if the Tuple is a point, otherwise false.
   */
  isPoint() {
    return this.w === 1;
  }

  /**
   * Is this a tuple representation of a vector?
   *
   * @returns {boolean} True if the Tuple is a vector, otherwise false.
   */
  isVector() {
    return this.w === 0;
  }

  /**
   * Get the magnitude of a tuple.
   *
   * This is the distance (length) of a vector. It's how far you would
   * travel in a straight line if you were to walk from on end of it to
   * the other.
   *
   * @returns {number} The magnitude of the Tuple.
   */
  magnitude() {
    const x = this.x ** 2;
    const y = this.y ** 2;
    const z = this.z ** 2;
    return Math.sqrt(x + y + z);
  }

  /**
   * Transform the vector into a unit vector.
   *
   * The unit vector has magnitude=1 and is used to anchor calculations
   * to a common scale.
   *
   * @returns {Tuple} A new tuple representing the normalized tuple.
   */
  normalize() {
    const x = this.x / this.magnitude();
    const y = this.y / this.magnitude();
    const z = this.z / this.magnitude();
    return Tuple.of({ x, y, z, w: this.w });
  }

  /**
   * Calculate the dot product with another tuple.
   *
   * This is the cosine of the angle between vectors. The smaller the
   * dot product, the larger the angle between vectors.
   *
   * A value of 1 means the vectors are identical.
   * A value of -1 means the vectors point in opposite directions.
   *
   * @param {Tuple} tuple - The other tuple.
   * @returns {number} The result of the dot product.
   */
  dot({ x, y, z }) {
    return this.x * x + this.y * y + this.z * z;
  }

  /**
   * Calculate the cross product with another tuple.
   *
   * If you take the cross product of X and Y vectors, you get Z.
   * Y cross X = -Z, Y cross Z = X, etc.
   *
   * @param {Tuple} tuple - The other tuple.
   * @returns {Tuple} A new tuple representing the result of the cross product.
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
   * @param {Tuple} normal - The normal vector.
   * @returns {Tuple} A new tuple representing the reflection vector.
   */
  reflect(normal) {
    return this.subtract(normal.multiply(this.dot(normal) * 2));
  }
}
