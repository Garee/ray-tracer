import { Material } from "../material";
import { Point } from "../point";
import { Matrix } from "../matrix";

export class Shape {
  constructor(material = new Material(), transform = Matrix.identity) {
    this.center = Point.origin;
    this.material = material;
    this.transform = transform;
  }

  setTransform(transform) {
    return new Shape(this.material, transform);
  }

  setMaterial(material) {
    return new Shape(material, this.transform);
  }

  getTransformedRay(ray) {
    return ray.transform(this.transform.inverse());
  }

  intersect(ray, using) {
    return using(this.getTransformedRay(ray));
  }

  normalAt(point, using) {
    const objPoint = this.transform.inverse().multiply(point);
    const objNormal = using(objPoint);
    const worldNormal = this.transform
      .inverse()
      .transpose()
      .multiply(objNormal);
    return worldNormal.normalize();
  }
}
