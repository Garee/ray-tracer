import {
  Color,
  Point,
  Light,
  World,
  Camera,
  Vector,
  Material,
} from "../models";
import { GradientPattern } from "../models/patterns/gradient";
import { Sphere, Plane } from "../models/shapes";
import { view, translate, rotateY, scale } from "../models/transformations";

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
        pattern: GradientPattern.of({
          colors: [Color.blue, Color.red],
          transform: rotateY(67.5).multiply(
            scale({ x: 0.25, y: 0.25, z: 0.25 })
          ),
        }),
        diffuse: 0.5,
        ambient: 0.3,
      })
    )
    .setTransform(
      translate({ x: 0.75, y: 0.75, z: -0.1 }).multiply(
        scale({ x: 0.75, y: 0.75, z: 0.75 })
      )
    );

  const floorPlane = Plane.of().setMaterial(
    Material.of({
      color: Color.white,
      reflective: 0.5,
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
