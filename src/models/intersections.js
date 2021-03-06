import { Epsilon } from "../util";
import { OpType } from "./shapes";

/**
 * Compute useful quantities about a ray-object intersection.
 *
 * - The point in world space where the intersection occurred.
 * - The eye vector that points towards the camera.
 * - The surface normal vector.
 * - Whether the intersection occurred inside the object.
 *
 * @param {Intersection} intersection - The intersection that occurred.
 * @param {Ray} ray - The ray that intersected with an object.
 * @param {Intersections[]} intersections - All ray intersections.
 * @returns Precomputed quantities relating to the intersection.
 */
export function prepareComputations(intersection, ray, intersections = []) {
  const { t, object } = intersection;
  const point = ray.position(intersection.t);
  const eye = ray.direction.multiply(-1);

  // Does the normal point away from the eye vector?
  let normal = object.normalAt(point, intersection);
  const inside = normal.dot(eye) < 0;
  if (inside) {
    normal = normal.multiply(-1); // Yes.
  }

  const normalOffset = normal.multiply(Epsilon);
  const underPoint = point.subtract(normalOffset);
  const overPoint = point.add(normalOffset);
  const reflect = ray.direction.reflect(normal);

  let n1 = 1;
  let n2 = 1;
  let containers = [];
  for (const i of intersections) {
    const isHit = i === intersection;
    if (isHit) {
      n1 = containers.length
        ? containers[containers.length - 1].material.refractive
        : 1;
    }

    const { object } = i;
    if (containers.includes(object)) {
      containers = containers.filter((o) => o !== object);
    } else {
      containers.push(object);
    }

    if (isHit) {
      n2 = containers.length
        ? containers[containers.length - 1].material.refractive
        : 1;
      break;
    }
  }

  return {
    t,
    object,
    point,
    underPoint,
    overPoint,
    eye,
    normal,
    inside,
    reflect,
    n1,
    n2,
  };
}

/**
 * Get the intersection that is visible from the ray origin.
 *
 * This is the intersection with the lowest non-negative t value.
 *
 * @param {Intersection[]} intersections - The ray-object intersections.
 * @returns {Intersection} The intersection that is visible.
 */
export function hit(intersections) {
  return intersections
    .filter((i) => i.t >= 0)
    .sort((a, b) => a.t - b.t)
    .shift();
}

// An approximation of the fresnel effect.
// Return 0-1 inclusive, representing the fraction of light reflected.
export function schlick({ n1, n2, eye, normal }) {
  let [isTIR, cosI, sin2t] = totalInternalReflection({
    n1,
    n2,
    eye,
    normal,
  });
  if (isTIR) {
    return 1;
  }

  if (n1 > n2) {
    cosI = Math.sqrt(1 - sin2t);
  }

  const r0 = ((n1 - n2) / (n1 + n2)) ** 2;
  return r0 + (1 - r0) * (1 - cosI) ** 5;
}

export function totalInternalReflection({ n1, n2, eye, normal }) {
  const ratio = n1 / n2;
  const cosI = eye.dot(normal);
  const sin2t = ratio ** 2 * (1 - cosI ** 2);
  return [n1 > n2 && sin2t > 1, cosI, sin2t, ratio];
}

export function intersectionAllowed(op, lhit, inl, inr) {
  switch (op) {
    case OpType.Union:
      return (lhit && !inr) || (!lhit && !inl);
    case OpType.Intersect:
      return (lhit && inr) || (!lhit && inl);
    case OpType.Difference:
      return (lhit && !inr) || (!lhit && inl);
    default:
      return false;
  }
}
