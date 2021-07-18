import {
  Color,
  Point,
  Light,
  World,
  Camera,
  Vector,
  Material,
} from "../models";
import { Plane, Sphere, Group, Cylinder } from "../models/shapes";
import {
  view,
  translate,
  rotateX,
  rotateY,
  rotateZ,
  scale,
} from "../models/transformations";

export function createWorld() {
  const light = Light.of({ position: Point.of({ x: -10, y: 10, z: -10 }) });

  const hexagon = createHexagon().setTransform(
    translate({ y: 1 }).multiply(rotateX(-45))
  );

  const floorPlane = Plane.of().setMaterial(
    Material.of({
      color: Color.white,
      reflective: 0.75,
    })
  );

  return World.of({ lights: [light], objects: [floorPlane, hexagon] });
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

function createHexagonCorner() {
  return Sphere.of({
    material: Material.of({ color: Color.blue }),
    transform: translate({ z: -1 }).multiply(
      scale({ x: 0.25, y: 0.25, z: 0.25 })
    ),
  });
}

function createHexagonEdge() {
  return Cylinder.of({
    min: 0,
    max: 1,
    material: Material.of({ color: Color.blue }),
    transform: translate({ z: -1 })
      .multiply(rotateY(-30))
      .multiply(rotateZ(-90))
      .multiply(scale({ x: 0.25, y: 1, z: 0.25 })),
  });
}

function createHexagonSide() {
  return Group.of({
    objects: [createHexagonCorner(), createHexagonEdge()],
  });
}

function createHexagon() {
  const sides = new Array(6).fill(undefined).map((_, i) => {
    return createHexagonSide().setTransform(rotateY(i * 60));
  });
  return Group.of({ objects: sides });
}
