import { Sphere } from "./shapes/sphere";
import { Material } from "./material";
import { scaling } from "./transformations";
import { Light, lighting } from "./light";
import { Point } from "./point";
import { Color } from "./color";
import { prepareComputations } from "./intersections";
import { hit } from "./intersection";
import { Ray } from "./ray";

export class World {
  constructor(lights, objs) {
    this.lights = lights;
    this.objs = objs;
  }

  static defaultLight = new Light(new Point(-10, 10, -10), Color.white);

  static defaultObjects = [
    new Sphere().setMaterial(
      new Material({
        color: Color.of({ r: 0.8, g: 1, b: 0.6 }),
        diffuse: 0.7,
        specular: 0.2,
      })
    ),
    new Sphere().setTransform(scaling(0.5, 0.5, 0.5)),
  ];

  static default(light) {
    const lights = light ? [light] : [World.defaultLight];
    return new World(lights, World.defaultObjects);
  }

  addObject(obj) {
    const objs = this.objs ?? [];
    return new World(this.lights, [...objs, obj]);
  }

  contains(obj) {
    return this.objs.some((o) => o === obj);
  }

  intersect(ray) {
    return this.objs
      .reduce((acc, obj) => {
        return [...acc, ...obj.intersect(ray)];
      }, [])
      .sort((a, b) => a.t - b.t);
  }

  shadeHit(computations) {
    const { obj, point, overPoint, eye, normal } = computations;
    const colors = this.lights.map((light) => {
      const isShadowed = this.isShadowed(overPoint);
      return lighting(obj.material, obj, light, point, eye, normal, isShadowed);
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
      const ray = new Ray(point, direction);
      const int = hit(this.intersect(ray));
      return !!int && int.t < distance;
    });
  }
}