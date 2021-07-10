import { Sphere } from "./sphere";
import { Material } from "./material";
import { scaling } from "./transformations";
import { Light, lighting } from "./light";
import { Point } from "./point";
import { Color, White, Black } from "./color";
import { prepareComputations } from "./intersections";
import { hit } from "./intersection";

export class World {
  constructor(light, objs) {
    if (light) {
      this.lights = [light];
    }
    this.objs = objs;
  }

  static defaultLight = new Light(new Point(-10, 10, -10), White);

  static defaultObjects = [
    new Sphere().setMaterial(
      new Material({
        color: new Color(0.8, 1, 0.6),
        diffuse: 0.7,
        specular: 0.2,
      })
    ),
    new Sphere().setTransform(scaling(0.5, 0.5, 0.5)),
  ];

  static default(light) {
    return new World(light ?? World.defaultLight, World.defaultObjects);
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
    const { obj, point, eye, normal } = computations;
    const colors = this.lights.map((light) => {
      return lighting(obj.material, light, point, eye, normal);
    });
    return colors.reduce((acc, color) => acc.add(color), Black);
  }

  colorAt(ray) {
    const int = hit(this.intersect(ray));
    if (!int) {
      return Black;
    }

    const comps = prepareComputations(int, ray);
    return this.shadeHit(comps);
  }
}
