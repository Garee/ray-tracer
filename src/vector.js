import { Tuple } from "./tuple";

export class Vector extends Tuple {
  constructor(x, y, z) {
    super(x, y, z, 0);
  }

  subtract(t) {
    if (t.isPoint()) {
      throw new Error("You cannot subtract a Point from a Vector.");
    }

    const { x, y, z } = super.subtract(t);
    return new Vector(x, y, z, this.w);
  }
}
