import { Material } from "../material";
import { Point } from "../point";
import { Matrix } from "../matrix";

export class Shape {
  constructor(material = Material.of(), transform = Matrix.identity, parent) {
    if (new.target === Shape) {
      throw new Error(`The abstract class 'Shape' cannot be instantiated.`);
    }

    this.center = Point.origin;
    this.material = material;
    this.transform = transform;
    this.parent = parent;
  }

  setTransform(transform) {
    return new this.constructor(this.material, transform);
  }

  setMaterial(material) {
    return new this.constructor(material, this.transform);
  }

  setParent(parent) {
    return new this.constructor(this.material, this.transform, parent);
  }

  intersect(ray) {
    return this._intersect(this.getTransformedRay(ray));
  }

  getTransformedRay(ray) {
    return ray.transform(this.transform.inverse());
  }

  normalAt(point) {
    const objPoint = this.worldToObject(point);
    const objNormal = this._normalAt(objPoint);
    return this.normalToWorld(objNormal);
  }

  worldToObject(point) {
    if (this.parent) {
      point = this.parent.worldToObject(point);
    }

    return this.transform.inverse().multiply(point);
  }

  normalToWorld(normal) {
    normal = this.transform.inverse().transpose().multiply(normal).normalize();

    if (this.parent) {
      normal = this.parent.normalToWorld(normal);
    }

    return normal;
  }

  _intersect() {
    throw new Error(`Missing implementation in subclass.`);
  }

  _normalAt() {
    throw new Error(`Missing implementation in subclass.`);
  }
}
