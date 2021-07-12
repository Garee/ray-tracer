import { Matrix } from "./matrix";

// Moves a point by adding to it.
export function translate(x, y, z) {
  return Matrix.from([
    [1, 0, 0, x],
    [0, 1, 0, y],
    [0, 0, 1, z],
    [0, 0, 0, 1],
  ]);
}

// Moves a point by multiplication.
// Makes it larger if > 1, or smaller if < 1.
export function scale(x, y, z) {
  return Matrix.from([
    [x, 0, 0, 0],
    [0, y, 0, 0],
    [0, 0, z, 0],
    [0, 0, 0, 1],
  ]);
}

export function rotateX(rad) {
  return Matrix.from([
    [1, 0, 0, 0],
    [0, Math.cos(rad), -Math.sin(rad), 0],
    [0, Math.sin(rad), Math.cos(rad), 0],
    [0, 0, 0, 1],
  ]);
}

export function rotateY(rad) {
  return Matrix.from([
    [Math.cos(rad), 0, Math.sin(rad), 0],
    [0, 1, 0, 0],
    [-Math.sin(rad), 0, Math.cos(rad), 0],
    [0, 0, 0, 1],
  ]);
}

export function rotateZ(rad) {
  return Matrix.from([
    [Math.cos(rad), -Math.sin(rad), 0, 0],
    [Math.sin(rad), Math.cos(rad), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);
}

export function shear(xy, xz, yx, yz, zx, zy) {
  return Matrix.from([
    [1, xy, xz, 0],
    [yx, 1, yz, 0],
    [zx, zy, 1, 0],
    [0, 0, 0, 1],
  ]);
}

export function view(from, to, up) {
  const forward = to.subtract(from).normalize();
  const left = forward.cross(up.normalize());
  const trueUp = left.cross(forward);
  const orient = Matrix.from([
    [left.x, left.y, left.z, 0],
    [trueUp.x, trueUp.y, trueUp.z, 0],
    [-forward.x, -forward.y, -forward.z, 0],
    [0, 0, 0, 1],
  ]);
  return orient.multiply(translate(-from.x, -from.y, -from.z));
}
