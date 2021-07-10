import { Sphere } from "./sphere";
import { Material } from "./material";
import { scaling } from "./transformations";
import { Light, lighting } from "./light";
import { Point } from "./point";
import { Color, White, Black } from "./color";
import { prepareComputations } from "./intersections";
import { hit } from "./intersection";

export class World {
  constructor(lights, objs) {
    this.lights = lights;
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
    const { obj, point, eye, normal } = computations;
    const colors = this.lights.map((light) => {
      return lighting(obj.material, light, point, eye, normal);
    });
    // TODO:  Add multiple light support.
    /*return colors.reduce((acc, color) => {
      const { x, y, z } = acc.add(color);
      return new Color(x, y, z);
    }, Black);*/
    return colors[0];
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
