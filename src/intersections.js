export function prepareComputations(intersection, ray) {
  const { t, obj } = intersection;
  const point = ray.position(intersection.t);
  const eye = ray.direction.multiply(-1);

  // Does the normal point away from the eye vector?
  let normal = intersection.obj.normalAt(point);
  const inside = normal.dot(eye) < 0;
  if (inside) {
    normal = normal.multiply(-1); // Yes.
  }

  const overPoint = point.add(normal.multiply(0.0005));

  return {
    t,
    obj,
    point,
    overPoint,
    eye,
    normal,
    inside,
  };
}
