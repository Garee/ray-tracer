import { Tuple } from "./tuple";

export class Vector extends Tuple {
  constructor(x = 0, y = 0, z = 0) {
    super(x, y, z, 0);
  }

  static of({ x = 0, y = 0, z = 0 } = {}) {
    return new Vector(x, y, z);
  }

  subtract(t) {
    if (t.isPoint()) {
      throw new Error(`A 'Point' cannot be subtracted from a 'Vector'.`);
    }

    const { x, y, z } = super.subtract(t);
    return Vector.of({ x, y, z });
  }

  multiply(t) {
    const { x, y, z } = super.multiply(t);
    return Vector.of({ x, y, z });
  }
}
