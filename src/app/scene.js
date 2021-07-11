import {
  Color,
  Point,
  Light,
  World,
  Camera,
  Vector,
  Material,
} from "../models";
import { Sphere, Plane } from "../models/shapes";
import { viewTransform, translation } from "../models/transformations";

export function createWorld() {
  const light = new Light(Point.of({ x: -10, y: 10, z: -10 }), Color.white);

  const sphere1 = Sphere.of()
    .setMaterial(
      Material.of({
        color: Color.green,
        diffuse: 0.7,
        ambient: 0.2,
      })
    )
    .setTransform(translation(-0.5, 1, 0.5));

  const floorPlane = Plane.of().setMaterial(
    Material.of({
      color: Color.white,
    })
  );

  return new World([light]).addObject(floorPlane).addObject(sphere1);
}

export function createCamera(width, height, fov) {
  return new Camera(width, height, fov).setTransform(
    viewTransform(
      Point.of({ y: 1.5, z: -5 }),
      Point.of({ y: 1 }),
      Vector.of({ y: 1 })
    )
  );
}
