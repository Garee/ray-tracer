import { Pattern } from "./pattern";

export class GradientPattern extends Pattern {
  constructor(a, b, transform) {
    super(transform);
    this.a = a;
    this.b = b;
  }

  colorAt({ x }) {
    const distance = this.b.subtract(this.a);
    const fraction = x - Math.floor(x);
    return this.a.add(distance.multiply(fraction));
  }

  setTransform(transform) {
    return new GradientPattern(this.a, this.b, transform);
  }
}
