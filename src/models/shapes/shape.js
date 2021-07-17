import { Material } from "../material";
import { Point } from "../point";
import { Matrix } from "../matrix";

export class Shape {
  constructor(material = Material.of(), transform = Matrix.identity) {
    if (new.target === Shape) {
      throw new Error(`The abstract class 'Shape' cannot be instantiated.`);
    }

    this.center = Point.origin;
    this.material = material;
    this.transform = transform;
  }

  setTransform(transform) {
    return new this.constructor(this.material, transform);
  }

  setMaterial(material) {
    return new this.constructor(material, this.transform);
  }

  intersect(ray) {
    return this._intersect(this.getTransformedRay(ray));
  }

  getTransformedRay(ray) {
    return ray.transform(this.transform.inverse());
  }

  normalAt(point) {
    const objPoint = this.transform.inverse().multiply(point);
    const objNormal = this._normalAt(objPoint);
    const worldNormal = this.transform
      .inverse()
      .transpose()
      .multiply(objNormal);
    return worldNormal.normalize();
  }

  _intersect() {
    throw new Error(`Missing implementation in subclass.`);
  }

  _normalAt() {
    throw new Error(`Missing implementation in subclass.`);
  }
}
