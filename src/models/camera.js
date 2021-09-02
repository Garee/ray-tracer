import { Canvas } from "./canvas";
import { Matrix } from "./matrix";
import { Point } from "./point";
import { Ray } from "./ray";
import { toRadians } from "../util/maths";

/**
 * A representation of a virtual camera that resides in a scene.
 */
export class Camera {
  /**
   * Create a new Camera.
   *
   * @param {number} width - The width of the viewport in pixels.
   * @param {number} height - The height of the viewport in pixels.
   * @param {number} fov - The field-of-view in degrees.
   */
  constructor(width, height, fov, transform = Matrix.identity) {
    this.width = width;
    this.height = height;
    this.fov = toRadians(fov);
    this.transform = transform;
    this.pixelSize = (this.#halfWidth() * 2) / this.width;
  }

  /**
   * Create a new Camera from an object.
   *
   * @param {object} object - The object to create from.
   * @param {number} [object.width=100] - The width of the viewport in pixels.
   * @param {number} [object.height=50] - The height of the viewport in pixels.
   * @param {number} [object.fov=90] - The field-of-view in degrees.
   * @param {Matrix} [object.transform] - The transformation to apply.
   * @returns {Camera} A new camera created from the object.
   */
  static of({ width = 100, height = 50, fov = 90, transform } = {}) {
    return new Camera(width, height, fov, transform);
  }

  /* The aspect ratio of the camera */
  get aspectRatio() {
    return this.width / this.height;
  }

  /**
   * Get this camera with a transformation applied.
   *
   * @param {Matrix} transform - The transformation matrix to apply.
   * @returns {Camera} A new camera with the transformation applied.
   */
  setTransform(transform) {
    return Camera.of({
      width: this.width,
      height: this.height,
      fov: this.fov,
      transform,
    });
  }

  /**
   * Render the pixels for a given world to a canvas.
   *
   * @param {World} world - The world to render.
   * @param {Function} onRenderRow - A function to call when a row of pixels has been rendered.
   * @param {number} from - The index of the row to start rendering at.
   * @param {number} to - The number of rows to render.
   * @returns {Canvas} A canvas of rendered pixels.
   */
  render(world, onRenderRow, from = 0, to = this.height) {
    let canvas = Canvas.of({ width: this.width, height: this.height });
    for (let y = from; y < to; y++) {
      canvas = this.#renderRow(y, world, canvas);
      onRenderRow?.(y);
    }

    return canvas;
  }

  /**
   * Get the ray for a pixel with given (x,y) coordinates.
   *
   * @param {number} x - The x coordinate.
   * @param {number} y - The y coordinate.
   * @returns {Ray} The ray for the pixel at the given coordinates.
   */
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

  #renderRow(y, world, canvas) {
    for (let x = 0; x < this.width; x++) {
      const ray = this.rayForPixelAt(x, y);
      const color = world.colorAt(ray);
      canvas = canvas.writePixel({ x, y, color });
    }

    return canvas;
  }

  #halfView() {
    return Math.tan(this.fov / 2);
  }

  #halfWidth() {
    return this.aspectRatio >= 1
      ? this.#halfView()
      : this.#halfView() * this.aspectRatio;
  }

  #halfHeight() {
    return this.aspectRatio >= 1
      ? this.#halfView() / this.aspectRatio
      : this.#halfView();
  }
}
