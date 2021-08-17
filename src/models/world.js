import { Sphere } from "./shapes/sphere";
import { Material } from "./material";
import { scale } from "./transformations";
import { Light, lighting } from "./light";
import { Point } from "./point";
import { Color } from "./color";
import {
  prepareComputations,
  totalInternalReflection,
  schlick,
} from "./intersections";
import { hit } from "./intersections";
import { Ray } from "./ray";

/**
 * A representation of the world which contains our rendering scene.
 *
 * The world contains many objects and one or more light sources to
 * illuminate them.
 */
export class World {
  // The maximum number of times a ray can bounce off objects.
  #maxBounces = 5;

  /**
   * Create a new World.
   *
   * @param {Light[]} lights - The light sources in the world.
   * @param {Shape[]} objects - The objects in the world.
   */
  constructor(lights, objects) {
    this.lights = lights;
    this.objects = objects;
  }

  /**
   * Create a new World from an object.
   *
   * @param {object} object - The object to create from.
   * @param {Light[]} [object.lights=] - The light sources in the world.
   * @param {Shape[]} [object.objects=] - The objects in the world.
   * @return {World} A new world create from the object.
   */
  static of({
    lights = [this.defaultLight()],
    objects = this.defaultObjects(),
  } = {}) {
    return new World(lights, objects);
  }

  /**
   * Get the default light source in a world.
   *
   * @returns {Light} The default light source.
   */
  static defaultLight = () =>
    Light.of({
      position: Point.of({ x: -10, y: 10, z: -10 }),
      intensity: Color.white,
    });

  /**
   * Get the default objects in a world.
   *
   * @returns {Shape[]} The default objects.
   */
  static defaultObjects = () => [
    Sphere.of({
      material: Material.of({
        color: Color.of({ r: 0.8, g: 1, b: 0.6 }),
        diffuse: 0.7,
        specular: 0.2,
      }),
    }),
    Sphere.of({ transform: scale({ x: 0.5, y: 0.5, z: 0.5 }) }),
  ];

  /**
   * Get the default world that is populated with the default
   * light sources and objects.
   *
   * @returns {World} The default world.
   */
  static default = () => World.of();

  /**
   * Add an object to the world.
   *
   * @param {Shape} obj - The object to add.
   * @returns {World} A new world with the object included.
   */
  addObject(obj) {
    const objects = this.objects ?? [];
    return World.of({ lights: this.lights, objects: [...objects, obj] });
  }

  /**
   * Check to see if the world contains a given object.
   *
   * @param {Shape} obj - The object to check.
   * @returns {boolean} True if {@link obj} is in the world, otherwise false.
   */
  contains(obj) {
    return this.objects.some((o) => o === obj);
  }

  /**
   * Get all intersections that occur between a given ray and the
   * world's objects.
   *
   * @param {Ray} ray - The ray to intersect with the objects.
   * @returns {Intersection[]} The intersections that occur.
   */
  intersect(ray) {
    return this.objects
      .reduce((acc, obj) => {
        return [...acc, ...obj.intersect(ray)];
      }, [])
      .sort((a, b) => a.t - b.t);
  }

  /**
   * Return the color via reflection when the struck surface is reflective.
   */
  reflectedColor({ object, overPoint, reflect }, remaining = this.#maxBounces) {
    if (remaining <= 0 || object.material.reflective === 0) {
      return Color.black;
    }

    const ray = Ray.of({ origin: overPoint, direction: reflect });
    const color = this.colorAt(ray, remaining - 1);
    return color.multiply(object.material.reflective);
  }

  refractedColor(
    { object, eye, normal, n1, n2, underPoint },
    remaining = this.#maxBounces
  ) {
    const [isTIR, cosI, sin2t, ratio] = totalInternalReflection({
      n1,
      n2,
      eye,
      normal,
    });
    if (remaining <= 0 || object.material.transparency === 0 || isTIR) {
      return Color.black;
    }

    const cosT = Math.sqrt(1 - sin2t);
    const direction = normal
      .multiply(ratio * cosI - cosT)
      .subtract(eye.multiply(ratio));
    const ray = Ray.of({ origin: underPoint, direction });
    const color = this.colorAt(ray, remaining - 1);
    return color.multiply(object.material.transparency);
  }

  /**
   * Compute the color to shade at the intersection encapsulated by
   * the precomputed intersection computations.
   *
   * @param {object} comps - Precomputed quantities relating to an intersection.
   * @param {number} remaining - The number of ray bounces remaining.
   * @returns {Color} The color to shade at the intersection.
   */
  shadeHit(comps, remaining = this.#maxBounces) {
    const { object, point, overPoint, eye, normal } = comps;
    const { material } = object;
    const colors = this.lights.map((light) => {
      const isShadowed = this.isShadowed(overPoint);
      const surface = lighting(object, light, point, eye, normal, isShadowed);

      const reflected = this.reflectedColor(comps, remaining);
      const refracted = this.refractedColor(comps, remaining);

      if (material.reflective > 0 && material.transparency > 0) {
        const reflectance = schlick(comps);
        return surface
          .add(reflected.multiply(reflectance))
          .add(refracted.multiply(1 - reflectance));
      }

      return surface.add(reflected).add(refracted);
    });
    return colors.reduce((acc, color) => {
      const { x: r, y: g, z: b } = acc.add(color);
      return Color.of({ r, g, b });
    }, Color.black);
  }

  /**
   * Compute the color at the intersection of a ray with a world object.
   *
   * @param {Ray} ray - The ray that intersects the world.
   * @param {number} remaining - The number of ray bounces remaining.
   * @returns {Color} The color to shade at the intersection of this ray.
   */
  colorAt(ray, remaining = this.#maxBounces) {
    const intersection = hit(this.intersect(ray));
    if (!intersection) {
      return Color.black;
    }

    const comps = prepareComputations(intersection, ray, [intersection]);
    return this.shadeHit(comps, remaining);
  }

  isShadowed(point) {
    return this.lights.some((light) => {
      const v = light.position.subtract(point);
      const distance = v.magnitude();
      const direction = v.normalize();
      const ray = Ray.of({ origin: point, direction });
      const intersection = hit(this.intersect(ray));
      return !!intersection && intersection.t < distance;
    });
  }
}
