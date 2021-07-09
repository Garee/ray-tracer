import { Point } from "./point";
import { Intersection } from "./intersection";
import { Matrix } from "./matrix";

export class Sphere {
  constructor() {
    this.center = new Point(0, 0, 0);
    this.radius = 1;
    this.transform = Matrix.identity();
  }

  intersect(ray) {
    ray = ray.transform(this.transform.inverse());

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
    return [new Intersection(t1, this), new Intersection(t2, this)];
  }

  setTransform(transform) {
    this.transform = transform;
  }
}

function discriminant(a, b, c) {
  return b ** 2 - 4 * a * c;
}
