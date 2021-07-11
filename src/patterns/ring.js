import { Pattern } from "./pattern";

export class RingPattern extends Pattern {
  constructor(a, b, transform) {
    super(transform);
    this.a = a;
    this.b = b;
  }

  colorAt({ x, z }) {
    if (Math.floor(Math.sqrt(x ** 2 + z ** 2)) % 2 === 0) {
      return this.a;
    }

    return this.b;
  }

  setTransform(transform) {
    return new RingPattern(this.a, this.b, transform);
  }
}
