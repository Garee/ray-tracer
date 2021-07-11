import { Point } from "./point";

export class Ray {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }

  static of({ origin = Point.origin, direction } = {}) {
    return new Ray(origin, direction);
  }

  position(t) {
    return this.direction.multiply(t).add(this.origin);
  }

  transform(transformation) {
    const origin = transformation.multiply(this.origin);
    const direction = transformation.multiply(this.direction);
    return Ray.of({ origin, direction });
  }
}
