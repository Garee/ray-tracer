import {
  Color,
  Point,
  Light,
  World,
  Camera,
  Vector,
  Material,
} from "../models";
import { Plane, Cone } from "../models/shapes";
import { view, translate } from "../models/transformations";

export function createWorld() {
  const light = Light.of({ position: Point.of({ x: -10, y: 10, z: -10 }) });

  const cube = Cone.of({
    min: -1,
    max: 0,
    material: Material.of({
      color: Color.purple,
      diffuse: 0.7,
      ambient: 0.2,
    }),
    transform: translate({ x: -0.5, y: 1, z: 0.5 }),
  });

  const floorPlane = Plane.of().setMaterial(
    Material.of({
      color: Color.white,
      reflective: 1,
    })
  );

  return World.of({ lights: [light], objects: [floorPlane, cube] });
}

export function createCamera(width, height, fov) {
  return Camera.of({ width, height, fov }).setTransform(
    view({
      from: Point.of({ y: 1.5, z: -5 }),
      to: Point.of({ y: 1 }),
      up: Vector.of({ y: 1 }),
    })
  );
}
