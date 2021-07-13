import { Intersection } from "../intersection";
import { Shape } from "./shape";
import { Vector } from "../vector";
import { Epsilon } from "../../util/maths";

export class Plane extends Shape {
  constructor(material, transform) {
    super(material, transform);
  }

  static of({ material, transform } = {}) {
    return new Plane(material, transform);
  }

  _intersect(ray) {
    if (Math.abs(ray.direction.y) < Epsilon) {
      return [];
    }
    const t = -ray.origin.y / ray.direction.y;
    return [Intersection.of({ t, object: this })];
  }

  _normalAt() {
    return Vector.of({ y: 1 });
  }
}
