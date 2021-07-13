import { isEven } from "../../util/maths";
import { Pattern } from "./pattern";

export class RingPattern extends Pattern {
  constructor(colors, transform) {
    super(colors, transform);
  }

  static of({ colors, transform } = {}) {
    return new RingPattern(colors, transform);
  }

  colorAt({ x, z }) {
    const [a, b] = this.colors;
    return isEven(Math.sqrt(x ** 2 + z ** 2)) ? a : b;
  }
}
