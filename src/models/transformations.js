import { Matrix } from "./matrix";
import { toRadians } from "../util/maths";

/**
 * Matrix transformations that are used to move and deform points.
 * The w=0 value of a vector causes the transformations to disappear.
 */

/**
 * Get the translation transformation matrix that can be used
 * to move a point along the x, y, and z axes.
 *
 * @param {object} point - The point to move.
 * @param {number} [point.x=0] - The units to move along the x axis.
 * @param {number} [point.y=0] - The units to move along the y axis.
 * @param {number} [point.z=0] - The units to move along the z axis.
 * @returns {Matrix} A matrix representing the translation.
 */
export function translate({ x = 0, y = 0, z = 0 } = {}) {
  return Matrix.from([
    [1, 0, 0, x],
    [0, 1, 0, y],
    [0, 0, 1, z],
    [0, 0, 0, 1],
  ]);
}

// Moves a point by multiplication.
// Makes it larger if > 1, or smaller if < 1.

/**
 * Get the scale transformation matrix that can be used to
 * increase or decrease the size of a point. It will become
 * larger if >1, remain the same if =0 or =1, and smaller if <1.
 *
 * @param {object} point - The point to scale.
 * @param {number} [point.x=0] - The units to scale along the x axis.
 * @param {number} [point.y=0] - The units to scale along the y axis.
 * @param {number} [point.z=0] - The units to scale along the z axis.
 * @returns {Matrix} A matrix representing the scaling.
 */
export function scale({ x = 0, y = 0, z = 0 } = {}) {
  return Matrix.from([
    [x, 0, 0, 0],
    [0, y, 0, 0],
    [0, 0, z, 0],
    [0, 0, 0, 1],
  ]);
}

/**
 * Get the reflection transformation matrix that can be used to
 * move a point to the other side of an axis. It's the same as
 * scaling using a negative value.
 *
 * @param {object} point - The point to reflect.
 * @param {number} [point.x=0] - The units to reflect along the x axis.
 * @param {number} [point.y=0] - The units to reflect along the y axis.
 * @param {number} [point.z=0] - The units to reflect along the z axis.
 * @returns {Matrix} A matrix representing the reflection.
 */
export function reflect({ x = 0, y = 0, z = 0 } = {}) {
  return Matrix.from([
    [-x, 0, 0, 0],
    [0, -y, 0, 0],
    [0, 0, -z, 0],
    [0, 0, 0, 1],
  ]);
}

/**
 * Get the rotation transformation matrix that can be used to rotate
 * a point around the x axis.
 *
 * @param {number} [degrees=180] - The degrees of rotation.
 * @returns {Matrix} A matrix representing the rotation.
 */
export function rotateX(degrees = 180) {
  const radians = toRadians(degrees);
  return Matrix.from([
    [1, 0, 0, 0],
    [0, Math.cos(radians), -Math.sin(radians), 0],
    [0, Math.sin(radians), Math.cos(radians), 0],
    [0, 0, 0, 1],
  ]);
}

/**
 * Get the rotation transformation matrix that can be used to rotate
 * a point around the y axis.
 *
 * @param {number} [degrees=180] - The degrees of rotation.
 * @returns {Matrix} A matrix representing the rotation.
 */
export function rotateY(degrees = 180) {
  const radians = toRadians(degrees);
  return Matrix.from([
    [Math.cos(radians), 0, Math.sin(radians), 0],
    [0, 1, 0, 0],
    [-Math.sin(radians), 0, Math.cos(radians), 0],
    [0, 0, 0, 1],
  ]);
}

/**
 * Get the rotation transformation matrix that can be used to rotate
 * a point around the z axis.
 *
 * @param {number} [degrees=180] - The degrees of rotation.
 * @returns {Matrix} A matrix representing the rotation.
 */
export function rotateZ(degrees = 180) {
  const radians = toRadians(degrees);
  return Matrix.from([
    [Math.cos(radians), -Math.sin(radians), 0, 0],
    [Math.sin(radians), Math.cos(radians), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);
}

/**
 * Get the shearing transformation matrix that can be used to
 * move a point to slant straight lines. When applied to a point,
 * it changes each component of the point in proportion to the other
 * two components. So the x component change in proportion to y and z etc.
 *
 * @param {object} point - The point to shear.
 * @param {number} [point.xy=0] - The units of x in proportion to y.
 * @param {number} [point.xz=0] - The units of x in proportion to z.
 * @param {number} [point.yx=0] - The units of y in proportion to x.
 * @param {number} [point.yz=0] - The units of y in proportion to z.
 * @param {number} [point.zx=0] - The units of z in proportion to x.
 * @param {number} [point.zy=0] - The units of z in proportion to y.
 * @returns {Matrix} A matrix representing the shearing.
 */
export function shear({ xy = 0, xz = 0, yx = 0, yz = 0, zx = 0, zy = 0 } = {}) {
  return Matrix.from([
    [1, xy, xz, 0],
    [yx, 1, yz, 0],
    [zx, zy, 1, 0],
    [0, 0, 0, 1],
  ]);
}

/**
 * Get the transformation matrix that orients the world
 * relative to a position.
 *
 * @param {object} options - The transformation options.
 * @param {Point} view.from - The position from which to orient the world.
 * @param {Point} view.to - The position to look towards.
 * @param {Vector} view.up - The vector that indicates which direction is up.
 * @returns {Matrix} A matrix representing the view.
 */
export function view({ from, to, up }) {
  const forward = to.subtract(from).normalize();
  const left = forward.cross(up.normalize());
  const trueUp = left.cross(forward);
  const orient = Matrix.from([
    [left.x, left.y, left.z, 0],
    [trueUp.x, trueUp.y, trueUp.z, 0],
    [-forward.x, -forward.y, -forward.z, 0],
    [0, 0, 0, 1],
  ]);
  return orient.multiply(translate({ x: -from.x, y: -from.y, z: -from.z }));
}

/**
 * Chain multiple transformations together.
 *
 * Matrix multiplication is associative, meaning we can chain
 * transformations by multiplying them all together.
 *
 * The order is important as matrix multiplication is not commutative
 * i.e. AxB is not always the same as BxA.
 *
 * Chained transformations must be applied in reverse order.
 *
 * @param {Matrix[]} [transformations=] - An array of transformation matrices.
 * @returns {Matrix} A matrix that combines all transformations.
 */
export function chain(...transformations) {
  return transformations?.reduce((acc, t) => {
    return acc.multiply(t);
  }, Matrix.identity);
}
