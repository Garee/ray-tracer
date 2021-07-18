import { Color } from "../color";
import { Matrix } from "../matrix";

export class Pattern {
  constructor(
    colors = [Color.white, Color.black],
    transform = Matrix.identity
  ) {
    if (new.target === Pattern) {
      throw new Error(`The abstract class 'Pattern' cannot be instantiated.`);
    }

    this.colors = colors;
    this.transform = transform;
  }

  at(obj, point) {
    const objPoint = obj.worldToObject(point);
    const patternPoint = this.transform.inverse().multiply(objPoint);
    const { x: r, y: g, z: b } = this.colorAt(patternPoint);
    return Color.of({ r, g, b });
  }

  colorAt() {
    throw new Error(`Missing implementation in subclass.`);
  }

  setTransform(transform) {
    return new this.constructor(this.colors, transform);
  }
}
