import { Tuple } from "./tuple";

export class Color extends Tuple {
  constructor(red = 0, green = 0, blue = 0) {
    super(red, green, blue);
  }

  static of({ r = 0, g = 0, b = 0 } = {}) {
    return new Color(r, g, b);
  }

  static hex(hex) {
    hex = hex.replace("#", "");
    const r = parseInt("0x" + hex.slice(0, 2)) / 255;
    const g = parseInt("0x" + hex.slice(2, 4)) / 255;
    const b = parseInt("0x" + hex.slice(4, 6)) / 255;
    return Color.of({ r, g, b });
  }

  static black = Color.of();
  static white = Color.of({ r: 1, g: 1, b: 1 });
  static red = Color.of({ r: 1 });
  static green = Color.of({ g: 1 });
  static blue = Color.of({ b: 1 });
  static yellow = Color.of({ r: 1, g: 1 });
  static purple = Color.of({ r: 1, b: 1 });
  static cyan = Color.of({ g: 1, b: 1 });

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
    const { x: r, y: g, z: b } = super.multiply(c);
    return Color.of({ r, g, b });
  }

  #multiplyColor(c) {
    const r = this.red * c.red;
    const g = this.green * c.green;
    const b = this.blue * c.blue;
    return Color.of({ r, g, b });
  }
}
