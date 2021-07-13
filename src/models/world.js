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
  constructor(lights, objects) {
    this.lights = lights;
    this.objects = objects;
  }

  static of({
    lights = [this.defaultLight],
    objects = this.defaultObjects,
  } = {}) {
    return new World(lights, objects);
  }

  static defaultLight = Light.of({
    position: Point.of({ x: -10, y: 10, z: -10 }),
    intensity: Color.white,
  });

  static defaultObjects = [
    Sphere.of().setMaterial(
      Material.of({
        color: Color.of({ r: 0.8, g: 1, b: 0.6 }),
        diffuse: 0.7,
        specular: 0.2,
      })
    ),
    Sphere.of().setTransform(scale({ x: 0.5, y: 0.5, z: 0.5 })),
  ];

  static default = World.of();

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

  shadeHit(computations) {
    const { object, point, overPoint, eye, normal } = computations;
    const colors = this.lights.map((light) => {
      const isShadowed = this.isShadowed(overPoint);
      return lighting(
        object.material,
        object,
        light,
        point,
        eye,
        normal,
        isShadowed
      );
    });
    return colors.reduce((acc, color) => {
      const { x: r, y: g, z: b } = acc.add(color);
      return Color.of({ r, g, b });
    }, Color.black);
  }

  colorAt(ray) {
    const int = hit(this.intersect(ray));
    if (!int) {
      return Color.black;
    }

    const comps = prepareComputations(int, ray);
    return this.shadeHit(comps);
  }

  isShadowed(point) {
    return this.lights.some((light) => {
      const v = light.position.subtract(point);
      const distance = v.magnitude();
      const direction = v.normalize();
      const ray = Ray.of({ origin: point, direction });
      const int = hit(this.intersect(ray));
      return !!int && int.t < distance;
    });
  }
}
