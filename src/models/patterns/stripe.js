import { Pattern } from "./pattern";
import { isEven } from "../../util/maths";

export class StripePattern extends Pattern {
  constructor(colors, transform) {
    super(colors, transform);
  }

  static of({ colors, transform } = {}) {
    return new StripePattern(colors, transform);
  }

  colorAt({ x }) {
    const [a, b] = this.colors;
    return isEven(x) ? a : b;
  }
}
