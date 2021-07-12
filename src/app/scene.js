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
import { view, translate } from "../models/transformations";

export function createWorld() {
  const light = Light.of({ position: Point.of({ x: -10, y: 10, z: -10 }) });

  const sphere1 = Sphere.of()
    .setMaterial(
      Material.of({
        color: Color.green,
        diffuse: 0.7,
        ambient: 0.2,
      })
    )
    .setTransform(translate(-0.5, 1, 0.5));

  const floorPlane = Plane.of().setMaterial(
    Material.of({
      color: Color.white,
    })
  );

  return World.of({ lights: [light], objects: [floorPlane, sphere1] });
}

export function createCamera(width, height, fov) {
  return Camera.of({ width, height, fov }).setTransform(
    view(Point.of({ y: 1.5, z: -5 }), Point.of({ y: 1 }), Vector.of({ y: 1 }))
  );
}
