import { Color } from "./color";

export class Canvas {
  #maxColor = 255;
  #maxLineLen = 70;

  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels || this.#initPixels();
  }

  static of({ width = 100, height = 50, pixels } = {}) {
    return new Canvas(width, height, pixels);
  }

  getPixel({ x, y }) {
    return this.pixels[y * this.width + x];
  }

  writePixel({ x, y, color }) {
    const pixels = [...this.pixels];
    pixels[y * this.width + x] = color;
    return Canvas.of({ width: this.width, height: this.height, pixels });
  }

  fill(color = Color.black) {
    return Canvas.of({
      width: this.width,
      height: this.height,
      pixels: this.#initPixels(color),
    });
  }

  // TODO: Refactor this function.
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

    const maxTokens = Math.floor(this.#maxLineLen / (3 + 1)); // rgb + space
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

  toRgba() {
    return this.pixels.map((p) => this.#toRgba(p));
  }

  #toRgba(px) {
    const max = this.#maxColor;
    const red = Math.max(Math.min(Math.round(px.red * max), max), 0);
    const green = Math.max(Math.min(Math.round(px.green * max), max), 0);
    const blue = Math.max(Math.min(Math.round(px.blue * max), max), 0);
    return { red, green, blue, alpha: max };
  }

  #getPpmHeader() {
    const flavour = "P3";
    const dim = `${this.width} ${this.height}`;
    const maxColor = `${this.#maxColor}`;
    return [flavour, dim, maxColor];
  }

  #initPixels(fill = Color.black) {
    return new Array(this.width * this.height).fill(fill);
  }
}
