import { Tuple } from "./tuple";

/**
 * A representation of a 3 dimensional vector that indicates where
 * to go in 3D space and how far.
 */
export class Vector extends Tuple {
  /**
   * Create a new 3D Vector.
   *
   * @param {number} [x=0] - The x coordinate.
   * @param {number} [y=0] - The y coordinate.
   * @param {number} [z=0] - The z coordinate.
   */
  constructor(x = 0, y = 0, z = 0) {
    super(x, y, z, 0);
  }

  /**
   * Create a new 3D Vector from an object.
   *
   * @param {Object} object - The object to create from.
   * @param {number} [object.x=0] - The x coordinate.
   * @param {number} [object.y=0] - The y coordinate.
   * @param {number} [object.z=0] - The z coordinate.
   * @returns {Vector} An instance of the Vector created using the object.
   */
  static of({ x = 0, y = 0, z = 0 } = {}) {
    return new Vector(x, y, z);
  }

  /**
   * Subtract a tuple from the vector. The tuple must represent a vector.
   *
   * @param {Tuple} tuple - The vector to subtract.
   * @returns {Vector} A new vector representing the subtraction from the other vector.
   * @throws An error if the tuple represents a point.
   */
  subtract(tuple) {
    if (tuple.isPoint()) {
      throw new Error(`A 'Point' cannot be subtracted from a 'Vector'.`);
    }

    const { x, y, z } = super.subtract(tuple);
    return Vector.of({ x, y, z });
  }

  /**
   * Multiply a tuple with the vector.
   *
   * @param {Tuple} tuple - The tuple to multiply with.
   * @returns {Vector} A new vector representing the result of the multiplication.
   */
  multiply(tuple) {
    const { x, y, z } = super.multiply(tuple);
    return Vector.of({ x, y, z });
  }
}
