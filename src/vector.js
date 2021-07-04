import { Tuple } from "./tuple";

export class Vector extends Tuple {
  constructor(x, y, z) {
    super(x, y, z, 0);
  }

  subtract(t) {
    if (t.isPoint()) {
      throw new Error("You cannot subtract a Point from a Vector.");
    }

    return super.subtract(t);
  }

  dot(t) {
    const x = this.x * t.x;
    const y = this.y * t.y;
    const z = this.z * t.z;
    return x + y + z;
  }

  cross(t) {
    const x = this.y * t.z - this.z * t.y;
    const y = this.z * t.x - this.x * t.z;
    const z = this.x * t.y - this.y * t.x;
    return new Tuple(x, y, z, this.w);
  }
}
