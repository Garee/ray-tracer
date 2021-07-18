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
import { view, translate, scale } from "../models/transformations";

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
    .setTransform(translate({ x: -0.5, y: 1, z: 0.5 }));

  const sphere2 = Sphere.of()
    .setMaterial(
      Material.of({
        color: Color.of({ r: 20 }),
        diffuse: 0.01,
        ambient: 0.01,
        transparency: 0.9,
        reflective: 0.9,
        refractive: 1,
      })
    )
    .setTransform(
      translate({ x: 0.75, y: 0.75, z: -0.3 }).multiply(
        scale({ x: 0.75, y: 0.75, z: 0.75 })
      )
    );

  const floorPlane = Plane.of().setMaterial(
    Material.of({
      color: Color.white,
      reflective: 1,
    })
  );

  return World.of({ lights: [light], objects: [floorPlane, sphere1, sphere2] });
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
