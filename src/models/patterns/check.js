import { Pattern } from "./pattern";
import { isEven } from "../../util/maths";

export class CheckPattern extends Pattern {
  constructor(colors, transform) {
    super(colors, transform);
  }

  static of({ colors, transform } = {}) {
    return new CheckPattern(colors, transform);
  }

  colorAt({ x, y, z }) {
    const [a, b] = this.colors;
    const sum = Math.floor(x) + Math.floor(y) + Math.floor(z);
    return isEven(sum) ? a : b;
  }
}
