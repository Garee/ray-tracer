import { Canvas } from "./canvas";
import { Matrix } from "./matrix";
import { Point } from "./point";
import { Ray } from "./ray";
import { toDegrees, toRadians } from "../util/maths";
export class Camera {
  constructor(width, height, fov) {
    this.width = width;
    this.height = height;
    this.fov = toRadians(fov);
    this.transform = Matrix.identity;
    this.pixelSize = (this.#halfWidth() * 2) / this.width;
  }

  static of({ width = 100, height = 50, fov = 90 } = {}) {
    return new Camera(width, height, fov);
  }

  render(world, onRenderRow, from = 0, to = this.height) {
    let canvas = Canvas.of({ width: this.width, height: this.height });
    for (let y = from; y < to; y++) {
      canvas = this.renderRow(y, world, canvas);
      onRenderRow?.(y);
    }

    return canvas;
  }

  renderRow(y, world, canvas) {
    for (let x = 0; x < this.width; x++) {
      const ray = this.rayForPixelAt(x, y);
      const color = world.colorAt(ray);
      canvas = canvas.writePixel(x, y, color);
    }

    return canvas;
  }

  rayForPixelAt(x, y) {
    // The offsets from the edge of the canvas to the pixel center.
    const xOffset = (x + 0.5) * this.pixelSize;
    const yOffset = (y + 0.5) * this.pixelSize;
    // The untransformed co-ordinates of the pixel in world space.
    const xWorld = this.#halfWidth() - xOffset;
    const yWorld = this.#halfHeight() - yOffset;
    // Compute the ray's direction vector.
    const zCanvas = -1;
    const invTransform = this.transform.inverse();
    const px = invTransform.multiply(
      Point.of({ x: xWorld, y: yWorld, z: zCanvas })
    );
    const origin = invTransform.multiply(Point.origin);
    const direction = px.subtract(origin).normalize();
    return Ray.of({ origin, direction });
  }

  setTransform(transform) {
    const c = Camera.of({
      width: this.width,
      height: this.height,
      fov: toDegrees(this.fov),
    });
    c.transform = transform;
    return c;
  }

  aspectRatio() {
    return this.width / this.height;
  }

  #halfView() {
    return Math.tan(this.fov / 2);
  }

  #halfWidth() {
    const aspectRatio = this.aspectRatio();
    if (aspectRatio >= 1) {
      return this.#halfView();
    }

    return this.#halfView() * aspectRatio;
  }

  #halfHeight() {
    const aspectRatio = this.aspectRatio();
    if (aspectRatio >= 1) {
      return this.#halfView() / aspectRatio;
    }

    return this.#halfView();
  }
}
