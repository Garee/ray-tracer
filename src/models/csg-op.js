import { Shape } from "./shapes";
import { intersectionAllowed } from "./intersections";

export class CsgOp extends Shape {
  constructor(type, left, right) {
    super();
    this.type = type;
    this.left = left;
    this.right = right;
    this.left.parent = this;
    this.right.parent = this;
  }

  static of({ type, left, right }) {
    return new CsgOp(type, left, right);
  }

  filter(intersections) {
    let inl = false;
    let inr = false;

    return intersections.reduce((acc, i) => {
      const { object } = i;
      const lhit = this.left.includes(object);

      if (intersectionAllowed(this.type, lhit, inl, inr)) {
        acc.push(i);
      }

      if (lhit) {
        inl = !inl;
      } else {
        inr = !inr;
      }

      return acc;
    }, []);
  }

  includes(s) {
    return this.left === s || this.right === s;
  }

  _intersect(ray) {
    const lIntersections = this.left.intersect(ray);
    const rIntersections = this.right.intersect(ray);
    const intersections = lIntersections.concat(rIntersections);
    return this.filter(intersections.sort((a, b) => a.t - b.t));
  }
}

export const OpType = {
  Union: "union",
  Intersect: "intersect",
  Difference: "difference",
};
