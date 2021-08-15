import { Material } from "../material";
import { Point } from "../point";
import { Matrix } from "../matrix";
import { Intersection } from "../intersection";

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
    return new this.constructor(this.material, transform, this.parent);
  }

  setMaterial(material) {
    return new this.constructor(material, this.transform, this.parent);
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

  normalAt(point, hit) {
    const objPoint = this.worldToObject(point);
    const objNormal = this._normalAt(objPoint, hit);
    return this.normalToWorld(objNormal);
  }

  /**
   * Transform a point in world space to a point in object space.
   *
   * @param {Point} point - The point in world space to transform.
   * @returns {Point} The point in object space.
   */
  worldToObject(point) {
    if (this.parent) {
      point = this.parent.worldToObject(point);
    }

    return this.transform.inverse().multiply(point);
  }

  /**
   * Transform a normal vector in object space to one in world space.
   *
   * @param {Vector} normal - The normal vector in object space.
   * @returns {Vector} The vector in object space.
   */
  normalToWorld(normal) {
    // To keep normals perpendicular we must multiply by the inverse transpose
    // transformation matrix rather than just the transformation matrix.
    normal = this.transform.inverse().transpose().multiply(normal).normalize();

    if (this.parent) {
      normal = this.parent.normalToWorld(normal);
    }

    return normal;
  }

  intersectWithUV(t, u, v) {
    return Intersection.of({ t, u, v, object: this });
  }

  includes(s) {
    return this === s;
  }

  _intersect() {
    throw new Error(`Missing implementation in subclass.`);
  }

  _normalAt() {
    throw new Error(`Missing implementation in subclass.`);
  }
}
