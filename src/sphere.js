import { Point } from "./point";
import { Intersection } from "./intersection";
import { Matrix } from "./matrix";
import { Material } from "./material";

export class Sphere {
  constructor(material, transform) {
    this.center = new Point();
    this.radius = 1;
    this.transform = transform ?? Matrix.identity();
    this.material = material ?? new Material();
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
    return new Sphere(this.material, transform);
  }

  setMaterial(material) {
    return new Sphere(material, this.transform);
  }

  normalAt(point) {
    const objPoint = this.transform.inverse().multiply(point);
    const objNormal = objPoint.subtract(this.center);
    const worldNormal = this.transform
      .inverse()
      .transpose()
      .multiply(objNormal);
    return worldNormal.normalize();
  }
}

function discriminant(a, b, c) {
  return b ** 2 - 4 * a * c;
}
