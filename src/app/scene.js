import {
  Color,
  Point,
  Light,
  World,
  Camera,
  Vector,
  Material,
} from "../models";
import { CheckPattern } from "../models/patterns";
import { Plane, Cube } from "../models/shapes";
import { view, translate, scale } from "../models/transformations";

export function createWorld(objects) {
  const light = Light.of({ position: Point.of({ x: -10, y: 10, z: -10 }) });

  const background = Cube.of({
    material: Material.of({
      color: Color.blue,
    }),
    transform: scale({ x: 20, y: 20, z: 4 }).multiply(translate({ z: 2 })),
  });

  const floorPlane = Plane.of({
    material: Material.of({
      pattern: CheckPattern.of({
        colors: [Color.black, Color.of({ r: 0.1, g: 0.1, b: 0.1 })],
      }),
      color: Color.of({ r: 0.1, g: 0.1, b: 0.1 }),
      reflective: 0.2,
    }),
    transform: translate({ y: -1 }),
  });

  const diamond = objects[0].setMaterial(Material.of({ color: Color.red }));

  return World.of({
    lights: [light],
    objects: [floorPlane, background, diamond],
  });
}

export function createCamera(width, height, fov) {
  return Camera.of({ width, height, fov }).setTransform(
    view({
      from: Point.of({ x: 1, y: 0, z: -6 }),
      to: Point.of({ y: 0.1 }),
      up: Vector.of({ y: 0.1 }),
    })
  );
}
