import { Shape } from "./shape";
import { discriminant } from "../../util/maths";
import { Intersection } from "../intersection";

export class Sphere extends Shape {
  constructor(material, transform) {
    super(material, transform);
    this.radius = 1;
  }

  static of({ material, transform } = {}) {
    return new Sphere(material, transform);
  }

  _intersect(ray) {
    const toRay = ray.origin.subtract(this.center);
    const a = ray.direction.dot(ray.direction);
    const b = 2 * ray.direction.dot(toRay);
    const c = toRay.dot(toRay) - 1;
    const d = discriminant(a, b, c);

    if (d < 0) {
      return [];
    }

    const t1 = (-b - Math.sqrt(d)) / (2 * a);
    const t2 = (-b + Math.sqrt(d)) / (2 * a);
    return [
      Intersection.of({ t: t1, obj: this }),
      Intersection.of({ t: t2, obj: this }),
    ];
  }

  _normalAt(point) {
    return point.subtract(this.center);
  }
}
