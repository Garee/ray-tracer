import { Sphere } from "./shapes/sphere";
import { Material } from "./material";
import { scale } from "./transformations";
import { Light, lighting } from "./light";
import { Point } from "./point";
import { Color } from "./color";
import { prepareComputations } from "./intersections";
import { hit } from "./intersections";
import { Ray } from "./ray";

export class World {
  #maxBounces = 5;

  constructor(lights, objects) {
    this.lights = lights;
    this.objects = objects;
  }

  static of({
    lights = [this.defaultLight()],
    objects = this.defaultObjects(),
  } = {}) {
    return new World(lights, objects);
  }

  static defaultLight = () =>
    Light.of({
      position: Point.of({ x: -10, y: 10, z: -10 }),
      intensity: Color.white,
    });

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

  static default = () => World.of();

  addObject(obj) {
    const objects = this.objects ?? [];
    return World.of({ lights: this.lights, objects: [...objects, obj] });
  }

  contains(obj) {
    return this.objects.some((o) => o === obj);
  }

  intersect(ray) {
    return this.objects
      .reduce((acc, obj) => {
        return [...acc, ...obj.intersect(ray)];
      }, [])
      .sort((a, b) => a.t - b.t);
  }

  // Return the color via reflection when the struck surface is reflective.
  reflectedColor({ object, overPoint, reflect }, remaining = this.#maxBounces) {
    if (remaining <= 0 || object.material.reflective === 0) {
      return Color.black;
    }

    const ray = Ray.of({ origin: overPoint, direction: reflect });
    const color = this.colorAt(ray, remaining - 1);
    return color.multiply(object.material.reflective);
  }

  shadeHit(comps, remaining = this.#maxBounces) {
    const { object, point, overPoint, eye, normal } = comps;
    const colors = this.lights.map((light) => {
      const isShadowed = this.isShadowed(overPoint);
      const surface = lighting(
        object.material,
        object,
        light,
        point,
        eye,
        normal,
        isShadowed
      );
      const reflected = this.reflectedColor(comps, remaining);
      return surface.add(reflected);
    });
    return colors.reduce((acc, color) => {
      const { x: r, y: g, z: b } = acc.add(color);
      return Color.of({ r, g, b });
    }, Color.black);
  }

  colorAt(ray, remaining = this.#maxBounces) {
    const intersection = hit(this.intersect(ray));
    if (!intersection) {
      return Color.black;
    }

    const comps = prepareComputations(intersection, ray);
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
