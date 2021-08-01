import {
  Color,
  Point,
  Light,
  World,
  Camera,
  Vector,
  Material,
} from "../models";
import { OpType, CsgOp } from "../models/csg-op";
import { Cube, Sphere, Plane } from "../models/shapes";
import { translate, scale, view } from "../models/transformations";
import { CheckPattern } from "../models/patterns";

export function createWorld() {
  const light = Light.of({ position: Point.of({ x: -10, y: 10, z: -10 }) });

  const sphere = Sphere.of({
    material: Material.of({
      color: Color.blue,
    }),
  });

  const floor = Plane.of({
    material: Material.of({
      color: Color.white,
      reflective: 0.7,
      diffuse: 0.9,
    }),
    transform: translate({ y: -1 }),
  });

  return World.of({
    lights: [light],
    objects: [floor, sphere],
  });
}

export function createCamera(width, height, fov) {
  return Camera.of({ width, height, fov }).setTransform(
    view({
      from: Point.of({ z: -4 }),
      to: Point.origin,
      up: Vector.of({ y: 0.1 }),
    })
  );
}
