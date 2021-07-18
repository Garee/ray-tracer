import { Shape } from "./shape";
import { Intersection } from "../intersection";
import { Vector } from "../vector";
import { discriminant, Epsilon } from "../../util";

export class Cone extends Shape {
  constructor(
    material,
    transform,
    min = -Infinity,
    max = Infinity,
    closed = false
  ) {
    super(material, transform);
    this.min = min;
    this.max = max;
    this.closed = closed;
  }

  static of({ material, transform, min, max, closed } = {}) {
    return new Cone(material, transform, min, max, closed);
  }

  _intersect({ origin, direction }) {
    const a = direction.x ** 2 - direction.y ** 2 + direction.z ** 2;
    const b =
      2 * origin.x * direction.x -
      2 * origin.y * direction.y +
      2 * origin.z * direction.z;
    const c = origin.x ** 2 - origin.y ** 2 + origin.z ** 2;

    if ((a <= 0 && a >= -Epsilon) || (a >= 0 && a <= Epsilon)) {
      if ((b <= 0 && b >= -Epsilon) || (b >= 0 && b <= Epsilon)) {
        return [];
      }

      return [
        Intersection.of({ t: -c / (2 * b), object: this }),
        ...this.#intersectCap({ origin, direction }),
      ];
    }

    const d = discriminant(a, b, c);

    if (d < 0) {
      return [];
    }

    let t0 = (-b - Math.sqrt(d)) / (2 * a);
    let t1 = (-b + Math.sqrt(d)) / (2 * a);

    [t0, t1] = t0 > t1 ? [t1, t0] : [t0, t1];

    const y0 = origin.y + t0 * direction.y;
    const y1 = origin.y + t1 * direction.y;

    const intersections = [];
    if (this.min < y0 && y0 < this.max) {
      intersections.push(Intersection.of({ t: t0, object: this }));
    }

    if (this.min < y1 && y1 < this.max) {
      intersections.push(Intersection.of({ t: t1, object: this }));
    }

    return [...intersections, ...this.#intersectCap({ origin, direction })];
  }

  _normalAt({ x, y, z }) {
    const dist = x ** 2 + z ** 2;
    if (dist < 1 && y >= this.max - Epsilon) {
      return Vector.of({ y: 1 });
    } else if (dist < 1 && y <= this.min + Epsilon) {
      return Vector.of({ y: -1 });
    }

    const ny = Math.sqrt(x ** 2 + z ** 2);
    return Vector.of({ x, y: y > 0 ? -ny : ny, z });
  }

  #intersectCap({ origin, direction }) {
    const { y } = direction;
    if (!this.closed || (y <= 0 && y >= -Epsilon) || (y >= 0 && y <= Epsilon)) {
      return [];
    }

    const intersections = [];

    const tmin = (this.min - origin.y) / y;
    if (this.#checkCap({ origin, direction }, tmin, this.min)) {
      intersections.push(Intersection.of({ t: tmin, object: this }));
    }

    const tmax = (this.max - origin.y) / y;
    if (this.#checkCap({ origin, direction }, tmax, this.max)) {
      intersections.push(Intersection.of({ t: tmax, object: this }));
    }

    return intersections;
  }

  #checkCap({ origin, direction }, t, y) {
    const x = origin.x + t * direction.x;
    const z = origin.z + t * direction.z;
    return x ** 2 + z ** 2 <= Math.abs(y);
  }
}
