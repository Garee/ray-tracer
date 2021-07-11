import { Color } from "./color";

export class Canvas {
  #maxColor = 255;
  #maxLineLen = 70;

  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels || this.#initPixels();
  }

  getPixel(x, y) {
    return this.pixels[y * this.width + x];
  }

  writePixel(x, y, color) {
    const pixels = [...this.pixels];
    pixels[y * this.width + x] = color;
    return new Canvas(this.width, this.height, pixels);
  }

  fill(color) {
    const pixels = this.#initPixels(color);
    return new Canvas(this.width, this.height, pixels);
  }

  // TODO: Refactor this function.
  toPpm() {
    const rgbStrs = this.scalePixels().map(
      (p) => `${p.red} ${p.green} ${p.blue}`
    );

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

  #getPpmHeader() {
    const flavour = "P3";
    const dim = `${this.width} ${this.height}`;
    const maxColor = `${this.#maxColor}`;
    return [flavour, dim, maxColor];
  }

  #scalePixel(px, max = this.#maxColor) {
    const r = Math.max(Math.min(Math.round(px.red * max), this.#maxColor), 0);
    const g = Math.max(Math.min(Math.round(px.green * max), this.#maxColor), 0);
    const b = Math.max(Math.min(Math.round(px.blue * max), this.#maxColor), 0);
    return Color.of({ r, g, b });
  }

  scalePixels() {
    return this.pixels.map((p) => this.#scalePixel(p));
  }

  #initPixels(color = Color.black) {
    return new Array(this.width * this.height).fill(color);
  }
}
