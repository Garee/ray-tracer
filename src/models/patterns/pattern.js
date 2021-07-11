import { Color } from "../color";
import { Matrix } from "../matrix";

export class Pattern {
  constructor(transform) {
    if (new.target === Pattern) {
      throw new Error("The abstract class 'Pattern' cannot be instantiated.");
    }

    this.transform = transform ?? Matrix.identity();
  }

  setTransform(transform) {
    return new Pattern(transform);
  }

  at(obj, point) {
    const objPoint = obj.transform.inverse().multiply(point);
    const patternPoint = this.transform.inverse().multiply(objPoint);
    const { x, y, z } = this.colorAt(patternPoint);
    return new Color(x, y, z);
  }

  colorAt() {
    throw new Error("Missing implementation in subclass.");
  }
}
