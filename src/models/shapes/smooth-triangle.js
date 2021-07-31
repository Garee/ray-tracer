import { Epsilon } from "../../util";
import { Shape } from "./shape";

export class SmoothTriangle extends Shape {
  constructor(p1, p2, p3, n1, n2, n3, material, transform) {
    super(material, transform);
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.n1 = n1;
    this.n2 = n2;
    this.n3 = n3;
    this.e1 = this.p2.subtract(this.p1);
    this.e2 = this.p3.subtract(this.p1);
    this.normal = this.e2.cross(this.e1).normalize();
  }

  static of({ p1, p2, p3, n1, n2, n3, material, transform } = {}) {
    return new SmoothTriangle(p1, p2, p3, n1, n2, n3, material, transform);
  }

  _intersect({ origin, direction }) {
    const dirCrossE2 = direction.cross(this.e2);
    const det = this.e1.dot(dirCrossE2);
    if (Math.abs(det) < Epsilon) {
      return [];
    }

    const f = 1 / det;
    const p1ToOrigin = origin.subtract(this.p1);
    const u = f * p1ToOrigin.dot(dirCrossE2);
    if (u < 0 || u > 1) {
      return [];
    }

    const originCrossE1 = p1ToOrigin.cross(this.e1);
    const v = f * direction.dot(originCrossE1);
    if (v < 0 || u + v > 1) {
      return [];
    }

    const t = f * this.e2.dot(originCrossE1);
    return [this.intersectWithUV(t, u, v)];
  }

  _normalAt(_point, { u, v }) {
    return this.n2
      .multiply(u)
      .add(this.n3.multiply(v).add(this.n1.multiply(1 - u - v)));
  }
}
