import { Epsilon } from "../util";

export function prepareComputations(intersection, ray) {
  const { t, object } = intersection;
  const point = ray.position(intersection.t);
  const eye = ray.direction.multiply(-1);

  // Does the normal point away from the eye vector?
  let normal = object.normalAt(point);
  const inside = normal.dot(eye) < 0;
  if (inside) {
    normal = normal.multiply(-1); // Yes.
  }

  const overPoint = point.add(normal.multiply(Epsilon));
  const reflect = ray.direction.reflect(normal);

  return {
    t,
    object,
    point,
    overPoint,
    eye,
    normal,
    inside,
    reflect,
  };
}

export function hit(intersections) {
  return intersections
    .filter((i) => i.t >= 0)
    .sort((a, b) => a.t - b.t)
    .shift();
}
