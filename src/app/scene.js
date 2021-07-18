import {
  Color,
  Point,
  Light,
  World,
  Camera,
  Vector,
  Material,
} from "../models";
import { GradientPattern } from "../models/patterns";
import { Plane, Cube, Sphere, Group } from "../models/shapes";
import { view, translate, rotateY, scale } from "../models/transformations";

export function createWorld() {
  const light = Light.of({ position: Point.of({ x: -10, y: 10, z: -10 }) });

  const cube = Cube.of({
    material: Material.of({
      pattern: GradientPattern.of({ colors: [Color.purple, Color.blue] }),
      diffuse: 0.7,
      ambient: 0.2,
    }),
    transform: translate({ x: -0.5, y: 1, z: 0.5 }).multiply(rotateY(45)),
  });

  const sphere = Sphere.of({
    material: Material.of({ color: Color.green }),
    transform: translate({ y: 1, x: 2 }),
  });

  const group = Group.of({
    objects: [cube, sphere],
    transform: scale({ x: 0.5, y: 0.5, z: 0.5 }),
  });

  const floorPlane = Plane.of().setMaterial(
    Material.of({
      color: Color.white,
      reflective: 0.75,
    })
  );

  return World.of({ lights: [light], objects: [floorPlane, group] });
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
