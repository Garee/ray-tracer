export class Intersection {
  constructor(t, object, u, v) {
    this.t = t;
    this.u = u;
    this.v = v;
    this.object = object;
  }

  static of({ t, u, v, object } = {}) {
    return new Intersection(t, object, u, v);
  }
}
