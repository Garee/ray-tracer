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

  intersect(ray) {
    return super.intersect(ray, (r) => {
      if (Math.abs(r.direction.y) < Epsilon) {
        return [];
      }
      const t = -r.origin.y / r.direction.y;
      return [new Intersection(t, this)];
    });
  }

  normalAt(point) {
    return super.normalAt(point, () => Vector.of({ y: 1 }));
  }
}
