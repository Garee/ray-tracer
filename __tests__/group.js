import { Group, Sphere } from "../src/models/shapes";
import { Matrix, Point, Vector, Ray } from "../src/models";
import { translate, scale, rotateY } from "../src/models/transformations";

let group;
beforeEach(() => {
  group = Group.of();
});

test("creating a new group", () => {
  expect(group.transform).toEqual(Matrix.identity);
});

test("adding a child to a group", () => {
  const shape = Sphere.of();
  group = group.addObject(shape);
  expect(group.isEmpty()).toBe(false);
  expect(group.contains(shape)).toBe(true);
  expect(shape.parent).toEqual(group);
});

test("intersecting a ray with an empty group", () => {
  const ray = Ray.of({ origin: Point.origin, direction: Vector.of({ z: 1 }) });
  const intersections = group.intersect(ray);
  expect(intersections).toHaveLength(0);
});

test("intersecting a ray with a non-empty group", () => {
  const s1 = Sphere.of();
  const s2 = Sphere.of({
    transform: translate({ z: -3 }),
  });
  const s3 = Sphere.of({
    transform: translate({ x: 5 }),
  });
  group = group.addObject(s1).addObject(s2).addObject(s3);
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = group._intersect(ray);
  expect(intersections).toHaveLength(4);
  expect(intersections[0].object).toEqual(s2);
  expect(intersections[1].object).toEqual(s2);
  expect(intersections[2].object).toEqual(s1);
  expect(intersections[3].object).toEqual(s1);
});

test("intersecting a transformed group", () => {
  const sphere = Sphere.of({ transform: translate({ x: 5 }) });
  group = group.setTransform(scale({ x: 2, y: 2, z: 2 })).addObject(sphere);
  const ray = Ray.of({
    origin: Point.of({ x: 10, z: -10 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = group.intersect(ray);
  expect(intersections).toHaveLength(2);
});

test("converting a point from world to object space", () => {
  const sphere = Sphere.of({
    transform: translate({ x: 5 }),
  });
  const g2 = Group.of({
    objects: [sphere],
    transform: scale({ x: 2, y: 2, z: 2 }),
  });
  const g1 = Group.of({
    objects: [g2],
    transform: rotateY(90),
  });
  expect(g1).toBeDefined();
  const objPoint = sphere.worldToObject(Point.of({ x: -2, z: -10 }));
  const expected = Point.of({ z: -1 });
  expect(objPoint.fixed).toEqual(expected.fixed);
});

test("converting a normal from object to world space", () => {
  const sphere = Sphere.of({
    transform: translate({ x: 5 }),
  });
  const g2 = Group.of({
    objects: [sphere],
    transform: scale({ x: 1, y: 2, z: 3 }),
  });
  const g1 = Group.of({
    objects: [g2],
    transform: rotateY(90),
  });
  expect(g1).toBeDefined();
  const worldNormal = sphere.normalToWorld(
    Vector.of({
      x: Math.sqrt(3) / 3,
      y: Math.sqrt(3) / 3,
      z: Math.sqrt(3) / 3,
    })
  );
  const expected = Vector.of({ x: 0.2857, y: 0.4286, z: -0.8571 });
  expect(worldNormal.fixed).toEqual(expected.fixed);
});

test("finding the normal on a child object", () => {
  const sphere = Sphere.of({
    transform: translate({ x: 5 }),
  });
  const g2 = Group.of({
    objects: [sphere],
    transform: scale({ x: 1, y: 2, z: 3 }),
  });
  const g1 = Group.of({
    objects: [g2],
    transform: rotateY(90),
  });
  expect(g1).toBeDefined();
  const normal = sphere.normalAt(
    Point.of({
      x: 1.7321,
      y: 1.1547,
      z: -5.5774,
    })
  );
  const expected = Vector.of({ x: 0.2857, y: 0.4286, z: -0.8571 });
  expect(normal.fixed).toEqual(expected.fixed);
});
