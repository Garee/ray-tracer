import { Tuple } from "./tuple";

export class Point extends Tuple {
  constructor(x, y, z) {
    super(x, y, z);
  }

  add(t) {
    if (t.isPoint()) {
      throw new Error("You cannot add two Points.");
    }

    return super.add(t);
  }
}
