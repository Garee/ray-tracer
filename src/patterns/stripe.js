import { Pattern } from "./pattern";

export class StripePattern extends Pattern {
  constructor(a, b, transform) {
    super(transform);
    this.a = a;
    this.b = b;
  }

  colorAt(point) {
    if (Math.floor(point.x) % 2 === 0) {
      return this.a;
    }

    return this.b;
  }

  setTransform(transform) {
    return new StripePattern(this.a, this.b, transform);
  }
}
