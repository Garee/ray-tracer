/**
 * A representation of a ray intersection with an object.
 */
export class Intersection {
  /**
   * Create a new Intersection.
   *
   * @param {number} t - The unit of time at which the intersection occurs.
   * @param {Shape} object - The object that the ray intersects.
   * @param {number} u - The u value.
   * @param {number} v - The v value.
   */
  constructor(t, object, u, v) {
    this.t = t;
    this.u = u;
    this.v = v;
    this.object = object;
  }

  /**
   * Create a new Intersection from an object.
   *
   * @param {object} object - The object to create from.
   * @param {number} object.t - The unit of time at which the intersection occurs.
   * @param {Shape} object.object - The object that the ray intersects.
   * @param {number} object.u - The u value.
   * @param {number} object.v - The v value.
   * @returns {Intersection} An intersection created from the object.
   */
  static of({ t, u, v, object } = {}) {
    return new Intersection(t, object, u, v);
  }
}
