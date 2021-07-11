export const Epsilon = 0.000001;

export function discriminant(a, b, c) {
  return b ** 2 - 4 * a * c;
}

export function isEven(a) {
  return Math.floor(a) % 2 === 0;
}
