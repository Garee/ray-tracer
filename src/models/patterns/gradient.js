import { Pattern } from "./pattern";

export class GradientPattern extends Pattern {
  constructor(colors, transform) {
    super(colors, transform);
  }

  static of(colors, transform) {
    return new GradientPattern(colors, transform);
  }

  colorAt({ x }) {
    const [a, b] = this.colors;
    const distance = b.subtract(a);
    const fraction = x - Math.floor(x);
    return distance.multiply(fraction).add(a);
  }
}
