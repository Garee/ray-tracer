import { Shape } from "./shape";
import { discriminant } from "./math";
import { Intersection } from "./intersection";
export class Sphere extends Shape {
  constructor(material, transform) {
    super(material, transform);
    this.radius = 1;
  }

  setTransform(transform) {
    return new Sphere(this.material, transform);
  }

  setMaterial(material) {
    return new Sphere(material, this.transform);
  }

  intersect(ray) {
    return super.intersect(ray, (r) => {
      const toRay = r.origin.subtract(this.center);
      const a = r.direction.dot(r.direction);
      const b = 2 * r.direction.dot(toRay);
      const c = toRay.dot(toRay) - 1;
      const d = discriminant(a, b, c);

      if (d < 0) {
        return [];
      }

      const t1 = (-b - Math.sqrt(d)) / (2 * a);
      const t2 = (-b + Math.sqrt(d)) / (2 * a);
      return [new Intersection(t1, this), new Intersection(t2, this)];
    });
  }

  normalAt(point) {
    return super.normalAt(point, (objPoint) => objPoint.subtract(this.center));
  }
}
