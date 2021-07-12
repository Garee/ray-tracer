import { Matrix } from "./matrix";
import { toRadians } from "../util/maths";

// Moves a point by adding to it.
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
export function scale({ x = 0, y = 0, z = 0 } = {}) {
  return Matrix.from([
    [x, 0, 0, 0],
    [0, y, 0, 0],
    [0, 0, z, 0],
    [0, 0, 0, 1],
  ]);
}

export function rotateX(degrees = 360) {
  const radians = toRadians(degrees);
  return Matrix.from([
    [1, 0, 0, 0],
    [0, Math.cos(radians), -Math.sin(radians), 0],
    [0, Math.sin(radians), Math.cos(radians), 0],
    [0, 0, 0, 1],
  ]);
}

export function rotateY(degrees = 360) {
  const radians = toRadians(degrees);
  return Matrix.from([
    [Math.cos(radians), 0, Math.sin(radians), 0],
    [0, 1, 0, 0],
    [-Math.sin(radians), 0, Math.cos(radians), 0],
    [0, 0, 0, 1],
  ]);
}

export function rotateZ(degrees = 360) {
  const radians = toRadians(degrees);
  return Matrix.from([
    [Math.cos(radians), -Math.sin(radians), 0, 0],
    [Math.sin(radians), Math.cos(radians), 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);
}

export function shear({ xy = 0, xz = 0, yx = 0, yz = 0, zx = 0, zy = 0 } = {}) {
  return Matrix.from([
    [1, xy, xz, 0],
    [yx, 1, yz, 0],
    [zx, zy, 1, 0],
    [0, 0, 0, 1],
  ]);
}

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
