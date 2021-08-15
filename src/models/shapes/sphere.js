import { Shape } from "./shape";
import { discriminant } from "../../util/maths";
import { Intersection } from "../intersection";
import { Material } from "../material";

/**
 * A representation of a Sphere.
 */
export class Sphere extends Shape {
  /**
   * Create a new Sphere.
   *
   * @param {Material} [material=] - The material properties of the sphere.
   * @param {Matrix} [transform=] - The initial transformation to apply.
   */
  constructor(material, transform) {
    super(material, transform);
    this.radius = 1;
  }

  /**
   * Create a new Sphere from an object.
   *
   * @param {object} [object=] - The object to create from.
   * @param {Material} [object.material=] - The material properties of the sphere.
   * @param {Matrix} [object.transform=] - The initial transformation to apply.
   * @returns {Sphere} A sphere created from the object.
   */
  static of({ material, transform } = {}) {
    return new Sphere(material, transform);
  }

  /**
   * Create a new glassy looking sphere.
   *
   * @param {object} [object=] - The properties object to create the sphere from.
   * @param {number} [object.refractive=1.5] - The refractive index of the sphere.
   * @returns {Sphere} A new  glossy sphere.
   */
  static glassy({ refractive = 1.5 } = {}) {
    return Sphere.of({
      material: Material.of({
        ...this.material,
        transparency: 1.0,
        refractive,
      }),
    });
  }

  /**
   * Get a rays intersections with this sphere.
   *
   * @param {Ray} ray - The ray to intersect with.
   * @param {Point} ray.origin - The origin of the ray.
   * @param {Vector} ray.direction - The direction of the ray.
   * @returns {Intersection[]} An array of intersections with this sphere.
   */
  _intersect({ origin, direction }) {
    const toRay = origin.subtract(this.center);
    const a = direction.dot(direction);
    const b = 2 * direction.dot(toRay);
    const c = toRay.dot(toRay) - 1;
    const d = discriminant(a, b, c);

    if (d < 0) {
      return [];
    }

    const t1 = (-b - Math.sqrt(d)) / (2 * a);
    const t2 = (-b + Math.sqrt(d)) / (2 * a);
    return [
      Intersection.of({ t: t1, object: this }),
      Intersection.of({ t: t2, object: this }),
    ];
  }

  /**
   * Get the normal vector at a given point.
   *
   * @param {Point} point - The point at which to obtain the normal vector.
   * @returns {Vector} The normal vector at the point.
   */
  _normalAt(point) {
    return point.subtract(this.center);
  }
}
