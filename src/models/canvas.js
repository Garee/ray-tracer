import { Color } from "./color";

/**
 * A representation of a 2D rectangular grid of pixels.
 *
 * The coordinates are zero based and (x=0,y=0) is the top left
 * corner of the canvas.
 */
export class Canvas {
  /**
   * Create a new Canvas.
   *
   * @param {number} width - The width of the canvas in pixels.
   * @param {number} height - The height of the canvas in pixels.
   * @param {*} [pixels=] - The pixels to populate the canvas with.
   */
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels || this.#getInitialPixels();
  }

  /**
   * Create a new Canvas from an object.
   *
   * @param {Object} object - The object to create from.
   * @param {number} [object.width=100] - The width of the canvas in pixels.
   * @param {number} [object.height=50] - The height of the canvas in pixels.
   * @param {*} [pixels=] - The pixels to populate the canvas with.
   * @returns {Canvas} The canvas created from the object.
   */
  static of({ width = 100, height = 50, pixels } = {}) {
    return new Canvas(width, height, pixels);
  }

  /**
   * Get the pixel color at a specific (x,y) coordinate location.
   *
   * @param {Object} location - The location of the pixel.
   * @param {number} location.x - The x coordinate of the pixel.
   * @param {number} location.y - The y coordinate of the pixel.
   * @returns {Color} A new color representing the pixel at the given (x,y) location.
   */
  getPixel({ x, y }) {
    const { red, green, blue } = this.pixels[y * this.width + x];
    return Color.of({ r: red, g: green, b: blue });
  }

  /**
   * Change the color of the pixel at the given (x,y) coordinate location.
   *
   * @param {Object} operation - The write operation details.
   * @param {number} operation.x - The x coordinate of the pixel.
   * @param {number} operation.y - The y coordinate of the pixel.
   * @param {Color} operation.color - The color to write at the pixel.
   * @returns {Canvas} A new canvas with the updated pixel.
   */
  writePixel({ x, y, color }) {
    const pixels = [...this.pixels];
    pixels[y * this.width + x] = color;
    return Canvas.of({ width: this.width, height: this.height, pixels });
  }

  /**
   * Set all canvas pixels to a color.
   *
   * @param {Color} [color=Color.black] - The color to set each canvas pixel to.
   * @returns {Canvas} A new canvas will all pixels to set the given color.
   */
  fill(color = Color.black) {
    return Canvas.of({
      width: this.width,
      height: this.height,
      pixels: this.#getInitialPixels(color),
    });
  }

  /**
   * Get the RGBA color representation of all canvas pixels.
   *
   * @typedef {{red: number, green: number, blue: number, alpha: number}} Rgba
   * @returns {Rgba[]} An array of color objects with the color and alpha components.
   */
  toRgba() {
    return this.pixels.map((p) => p.toRgba());
  }

  /**
   * Convert the canvas into the Portable Pixmap (PPM) format.
   *
   * PPM (http://netpbm.sourceforge.net)
   *
   * @returns {string[]} The lines of a PPM file representation.
   */
  toPpm() {
    const rgbStrs = this.toRgba().map((p) => `${p.red} ${p.green} ${p.blue}`);

    const data = [];
    for (let row = 0; row < this.height; row++) {
      let line = "";
      for (let col = 0; col < this.width; col++) {
        const rgb = rgbStrs[col * this.height + row];
        line += rgb + " ";
      }
      data.push(line.trim());
    }

    const maxLineLen = 70;
    const maxTokens = Math.floor(maxLineLen / (3 + 1)); // rgb + space
    const lines = [];
    data.forEach((line) => {
      let tokens = line.split(" ");
      while (tokens.length > maxTokens) {
        const toPush = tokens.splice(0, maxTokens).join(" ").trim();
        lines.push(toPush);
        line = tokens.join(" ").trim();
      }

      lines.push(line);
    });

    lines.push("\n");

    return this.#getPpmHeader().concat(lines);
  }

  /**
   * @private
   * Get the PPM header lines for this canvas.
   *
   * @returns {string[]} The three PPM header lines.
   */
  #getPpmHeader() {
    const flavour = "P3";
    const dim = `${this.width} ${this.height}`;
    const maxColor = `255`;
    return [flavour, dim, maxColor];
  }

  /**
   * @private
   * Get the initial canvas pixel array populated with a fill color.
   *
   * @param {Color} [fill=Color.black] - The fill color.
   * @returns {Color[]} An array of canvas dimensions populated with the fill color.
   */
  #getInitialPixels(fill = Color.black) {
    return new Array(this.width * this.height).fill(fill);
  }
}
