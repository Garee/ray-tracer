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

  const cube = Cube.of({
    material: Material.of({
      color: Color.red,
    }),
    transform: scale({ x: 1.1, y: 1.1, z: 1.1 }),
  });

  const sphere = Sphere.of({
    material: Material.of({
      color: Color.yellow,
    }),
    transform: scale({ x: 1.5, y: 1.5, z: 1.5 }).multiply(
      translate({ x: 0.5, y: 0.5 })
    ),
  });

  const obj = CsgOp.of({ type: OpType.Difference, left: cube, right: sphere });

  const floor = Plane.of({
    material: Material.of({
      pattern: CheckPattern.of({
        colors: [Color.white, Color.of({ r: 0.1, g: 0.1, b: 0.1 })],
      }),
      color: Color.of({ r: 0.1, g: 0.1, b: 0.1 }),
      reflective: 0.2,
    }),
    transform: translate({ y: -1 }),
  });

  return World.of({
    lights: [light],
    objects: [floor, obj],
  });
}

export function createCamera(width, height, fov) {
  return Camera.of({ width, height, fov }).setTransform(
    view({
      from: Point.of({ x: 3, y: 0, z: -6 }),
      to: Point.of({ y: 0.1 }),
      up: Vector.of({ y: 0.1 }),
    })
  );
}
