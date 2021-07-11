export class Intersection {
  constructor(t, obj) {
    this.t = t;
    this.obj = obj;
  }

  static of({ t, obj } = {}) {
    return new Intersection(t, obj);
  }
}

export function hit(intersections) {
  return intersections
    .filter((i) => i.t >= 0)
    .sort((a, b) => a.t - b.t)
    .shift();
}
