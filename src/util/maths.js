/**
 * A quantity which approaches zero. It is almost zero, but not exactly.
 */
export const Epsilon = 0.000001;

/**
 * Calculate the discriminant from the quadratic formula.
 * if < 0 there are no real roots.
 * if === 0 there is one real root.
 * if > 0 there are two distinct real roots.
 *
 * @param {number} a The a value.
 * @param {number} b The b value.
 * @param {number} c The c value.
 * @returns the discriminant.
 */
export function discriminant(a, b, c) {
  return b ** 2 - 4 * a * c;
}

/**
 * Check that a number is even.
 *
 * @param {number} n the number to check.
 * @returns true if n is even, otherwise false.
 */
export function isEven(n) {
  return Math.floor(n) % 2 === 0;
}

/**
 * Convert a number in degrees to radians.
 *
 * @param {number} degrees the number in degrees.
 * @returns the number in radians.
 */
export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert a number in radians to degrees.
 *
 * @param {number} radians the number in radians.
 * @returns the number in degrees.
 */
export function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}
