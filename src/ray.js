export class Ray {
  constructor(origin, direction) {
    this.origin = origin;
    this.direction = direction;
  }

  position(t) {
    return this.direction.multiply(t).add(this.origin);
  }
}
