import { Tuple } from "./tuple";

export class Point extends Tuple {
  constructor(x = 0, y = 0, z = 0) {
    super(x, y, z, 1);
  }

  static of({ x = 0, y = 0, z = 0 } = {}) {
    return new Point(x, y, z);
  }

  static origin = Point.of();

  add(t) {
    if (t.isPoint()) {
      throw new Error("You cannot add two Points.");
    }

    const { x, y, z } = super.add(t);
    return new Point(x, y, z, this.w);
  }
}
