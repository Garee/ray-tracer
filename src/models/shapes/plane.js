import { Intersection } from "../intersection";
import { Shape } from "./shape";
import { Vector } from "../vector";

export class Plane extends Shape {
  constructor(material, transform) {
    super(material, transform);
  }

  // TODO: Refactor to pass class down to Shape.
  setTransform(transform) {
    return new Plane(this.material, transform);
  }

  setMaterial(material) {
    return new Plane(material, this.transform);
  }

  intersect(ray) {
    return super.intersect(ray, (r) => {
      if (Math.abs(r.direction.y) < 0.000001) {
        return [];
      }
      const t = -r.origin.y / r.direction.y;
      return [new Intersection(t, this)];
    });
  }

  normalAt(point) {
    return super.normalAt(point, () => new Vector(0, 1, 0));
  }
}
