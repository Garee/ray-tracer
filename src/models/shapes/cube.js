import { Shape } from "./shape";
import { Intersection } from "../intersection";
import { Vector } from "../vector";

export class Cube extends Shape {
  constructor(material, transform) {
    super(material, transform);
  }

  static of({ material, transform } = {}) {
    return new Cube(material, transform);
  }

  _intersect({ origin, direction }) {
    const [xtmin, xtmax] = this.#checkAxis(origin.x, direction.x);
    const [ytmin, ytmax] = this.#checkAxis(origin.y, direction.y);
    const [ztmin, ztmax] = this.#checkAxis(origin.z, direction.z);

    const tmin = Math.max(xtmin, ytmin, ztmin);
    const tmax = Math.min(xtmax, ytmax, ztmax);

    if (tmin > tmax) {
      return [];
    }

    return [
      Intersection.of({ t: tmin, object: this }),
      Intersection.of({ t: tmax, object: this }),
    ];
  }

  _normalAt({ x, y, z }) {
    const maxCoord = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));

    if (maxCoord == Math.abs(x)) {
      return Vector.of({ x });
    } else if (maxCoord == Math.abs(y)) {
      return Vector.of({ y });
    }

    return Vector.of({ z });
  }

  #checkAxis(origin, direction) {
    const tmin = (-1 - origin) / direction;
    const tmax = (1 - origin) / direction;
    return tmin > tmax ? [tmax, tmin] : [tmin, tmax];
  }
}
