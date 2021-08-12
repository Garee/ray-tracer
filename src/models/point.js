import { Tuple } from "./tuple";

/**
 * A representation of a 3-dimensional point in 3D space.
 */
export class Point extends Tuple {
  /**
   * Create a new 3D Point.
   *
   * @param {number} [x=0] The x coordinate.
   * @param {number} [y=0] The y coordinate.
   * @param {number} [z=0] The z coordinate.
   */
  constructor(x = 0, y = 0, z = 0) {
    super(x, y, z, 1);
  }

  /**
   * Create a new 3D point from an object.
   *
   * @param {Object} object - The object to create from.
   * @param {number} [object.x=0] - The x coordinate.
   * @param {number} [object.y=0] - The y coordinate.
   * @param {number} [object.z=0] - The z coordinate.
   * @returns {Point} An instance of the Point created using the object.
   */
  static of({ x = 0, y = 0, z = 0 } = {}) {
    return new Point(x, y, z);
  }

  /**
   * An instance of a point with x, y and z coordinates set to zero.
   */
  static origin = Point.of();

  /**
   * Add a tuple to the point. The tuple must represent a vector.
   *
   * @param {Tuple} tuple - The vector to add to the point.
   * @returns {Point} A new point after moving in the vector's direction.
   * @throws An error if the tuple represents a point.
   */
  add(tuple) {
    if (tuple.isPoint()) {
      throw new Error(`A 'Point' cannot add a 'Point'.`);
    }

    const { x, y, z } = super.add(tuple);
    return Point.of({ x, y, z });
  }
}
