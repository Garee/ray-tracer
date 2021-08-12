import { Tuple } from "./tuple";

/**
 * A representation of a color that consists of red, green and blue
 * components. The mixture of these values produces a wide range of
 * possible colors.
 *
 * Each component has a range of 0-1 where 0 means the color is
 * absent and 1 means the color is fully present.
 *
 * (1,1,1) is white and (0,0,0) is black.
 *
 * We represent a color as tuple as it supports addition, subtraction,
 * and multiplication in the same way.
 */
export class Color extends Tuple {
  /**
   * Create a new Color.
   *
   * @param {number} [red=0] - The red color component.
   * @param {number} [green=0] - The green color component.
   * @param {number} [blue=0] - The blue color component.
   */
  constructor(red = 0, green = 0, blue = 0) {
    super(red, green, blue);
  }

  /**
   * Create a new Color from an object.
   *
   * @param {Object} object - The object to create from.
   * @param {number} [object.r=0] - The red color component.
   * @param {number} [object.g=0] - The green color component.
   * @param {number} [object.b=0] - The blue color component.
   * @returns {Color} A new color created from the object.
   */
  static of({ r = 0, g = 0, b = 0 } = {}) {
    return new Color(r, g, b);
  }

  /**
   * Create a new Color from a hexadecimal string.
   *
   * The format is #RRGGBB where RR is a hex value between 00-FF that
   * represents the red color component.
   *
   * #FFFFFF = (255,255,255) = (1,1,1) = White
   *
   * @param {string} hex The hexadecimal representation of the color.
   * @returns {Color} A new color created from the hex string.
   */
  static hex(hex) {
    hex = hex.replace("#", "");
    const r = parseInt("0x" + hex.slice(0, 2)) / 255;
    const g = parseInt("0x" + hex.slice(2, 4)) / 255;
    const b = parseInt("0x" + hex.slice(4, 6)) / 255;
    return Color.of({ r, g, b });
  }

  /**
   * An instance of the color black.
   */
  static black = Color.of();

  /**
   * An instance of the color white.
   */
  static white = Color.of({ r: 1, g: 1, b: 1 });

  /**
   * An instance of the color red.
   */
  static red = Color.of({ r: 1 });

  /**
   * An instance of the color green.
   */
  static green = Color.of({ g: 1 });

  /**
   * An instance of the color blue.
   */
  static blue = Color.of({ b: 1 });

  /**
   * An instance of the color yellow.
   */
  static yellow = Color.of({ r: 1, g: 1 });

  /**
   * An instance of the color purple.
   */
  static purple = Color.of({ r: 1, b: 1 });

  /**
   * An instance of the color cyan.
   */
  static cyan = Color.of({ g: 1, b: 1 });

  /**
   * The red color component.
   */
  get red() {
    return this.x;
  }

  /**
   * The green color component.
   */
  get green() {
    return this.y;
  }

  /**
   * The blue color component.
   */
  get blue() {
    return this.z;
  }

  /**
   * Multiply the color by another color or scalar value.
   *
   * @param {Color|number} value - The color or scalar to multiply by.
   * @returns {Color} A new color representing the result of the multiplication.
   */
  multiply(value) {
    if (value instanceof Color) {
      return this.#multiplyColor(value);
    }

    // 'value' must be a scalar.
    const { x: r, y: g, z: b } = super.multiply(value);
    return Color.of({ r, g, b });
  }

  /**
   * @private
   * Multiply the color by another color.
   *
   * @param {Color} color - The color to multiply by.
   * @returns {Color} A new color representing the result of the multiplication.
   */
  #multiplyColor({ red, green, blue }) {
    const r = this.red * red;
    const g = this.green * green;
    const b = this.blue * blue;
    return Color.of({ r, g, b });
  }
}
