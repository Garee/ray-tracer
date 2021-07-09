export class Intersection {
  constructor(t, obj) {
    this.t = t;
    this.obj = obj;
  }
}

export function hit(intersections) {
  return intersections
    .filter((i) => i.t >= 0)
    .sort((a, b) => a.t - b.t)
    .shift();
}
