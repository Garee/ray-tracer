import { Tuple } from "./tuple";

export class Color extends Tuple {
  constructor(red = 0, green = 0, blue = 0) {
    super(red, green, blue);
  }

  get red() {
    return this.x;
  }

  get green() {
    return this.y;
  }

  get blue() {
    return this.z;
  }

  multiply(c) {
    if (c instanceof Color) {
      return this.#multiplyColor(c);
    }

    // Scalar
    return super.multiply(c);
  }

  #multiplyColor(c) {
    const red = this.red * c.red;
    const green = this.green * c.green;
    const blue = this.blue * c.blue;
    return new Color(red, green, blue);
  }
}

export const Black = new Color(0, 0, 0);
export const White = new Color(1, 1, 1);
export const Red = new Color(1, 0, 0);
export const Green = new Color(0, 1, 0);
export const Blue = new Color(0, 0, 1);
