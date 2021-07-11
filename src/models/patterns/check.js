import { Pattern } from "./pattern";

export class CheckPattern extends Pattern {
  constructor(a, b, transform) {
    super(transform);
    this.a = a;
    this.b = b;
  }

  colorAt({ x, y, z }) {
    const sum = Math.floor(x) + Math.floor(y) + Math.floor(z);
    return sum % 2 === 0 ? this.a : this.b;
  }

  setTransform(transform) {
    return new CheckPattern(this.a, this.b, transform);
  }
}
