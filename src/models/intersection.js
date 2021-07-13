export class Intersection {
  constructor(t, object) {
    this.t = t;
    this.object = object;
  }

  static of({ t, object } = {}) {
    return new Intersection(t, object);
  }
}
