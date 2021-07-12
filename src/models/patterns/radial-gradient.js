import { Pattern } from "./pattern";
import { isEven } from "../../util/maths";

export class RadialGradientPattern extends Pattern {
  constructor(colors, transform) {
    super(colors, transform);
  }

  static of(colors, transform) {
    return new RadialGradientPattern(colors, transform);
  }

  colorAt({ x, z }) {
    let [a, b] = this.colors;
    if (!isEven(Math.sqrt(x ** 2 + z ** 2))) {
      const tmp = a;
      a = b;
      b = tmp;
    }
    const distance = b.subtract(a);
    const fraction = x - Math.floor(x);
    return distance.multiply(fraction).add(a);
  }
}
