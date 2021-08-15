import { Point } from "./point";

/**
 * A representation of a ray, or line, that is used for ray casting to
 * find intersections with objects in a scene.
 */
export class Ray {
  /**
   * Create a new Ray.
   *
   * @param {Point} origin - The point of origin for the ray.
   * @param {Vector} direction - The direction the ray should travel.
   */
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }

  /**
   * Create a new Ray from an object.
   *
   * @param {object} object - The object to create from.
   * @param {Point} [object.origin=Point.origin] - The point of origin for the ray.
   * @param {Vector} [object.direction=] - The direction the ray should travel.
   * @returns {Ray} A ray created from the object.
   */
  static of({ origin = Point.origin, direction } = {}) {
    return new Ray(origin, direction);
  }

  /**
   * Get the position after travelling for {@link t} time units along the ray.
   *
   * @param {number} t - The time travelled along the rays path.
   * @returns {Point} The point after travelling along the ray for the given time.
   */
  position(t) {
    return this.direction.multiply(t).add(this.origin);
  }

  /**
   * Apply a transformation the the ray.
   *
   * Moving a ray away from an object (in the opposite direction) is
   * equivalent to moving the object away from a ray. We can transform rays
   * to transform objects that they intersect with.
   *
   * A ray has an inverse relationship with an object.
   *
   * @param {Matrix} transformation - The transformation matrix to apply.
   * @returns {Ray} A new ray with the transformation applied.
   */
  transform(transformation) {
    const origin = transformation.multiply(this.origin);
    const direction = transformation.multiply(this.direction);
    return Ray.of({ origin, direction });
  }
}
