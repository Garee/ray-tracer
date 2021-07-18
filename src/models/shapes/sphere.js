import { Shape } from "./shape";
import { discriminant } from "../../util/maths";
import { Intersection } from "../intersection";
import { Material } from "../material";

export class Sphere extends Shape {
  constructor(material, transform) {
    super(material, transform);
    this.radius = 1;
  }

  static of({ material, transform } = {}) {
    return new Sphere(material, transform);
  }

  static glassy({ refractive = 1.5 } = {}) {
    return Sphere.of({
      material: Material.of({
        ...this.material,
        transparency: 1.0,
        refractive,
      }),
    });
  }

  _intersect({ origin, direction }) {
    const toRay = origin.subtract(this.center);
    const a = direction.dot(direction);
    const b = 2 * direction.dot(toRay);
    const c = toRay.dot(toRay) - 1;
    const d = discriminant(a, b, c);

    if (d < 0) {
      return [];
    }

    const t1 = (-b - Math.sqrt(d)) / (2 * a);
    const t2 = (-b + Math.sqrt(d)) / (2 * a);
    return [
      Intersection.of({ t: t1, object: this }),
      Intersection.of({ t: t2, object: this }),
    ];
  }

  _normalAt(point) {
    return point.subtract(this.center);
  }
}
