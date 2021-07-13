import { Point, Vector, Ray } from "../src/models";
import { translate, scale } from "../src/models/transformations";

test("creating and querying a ray", () => {
  const origin = Point.of({ x: 1, y: 2, z: 3 });
  const direction = Vector.of({ x: 4, y: 5, z: 6 });
  const ray = Ray.of({ origin, direction });
  expect(ray.origin).toEqual(origin);
  expect(ray.direction).toEqual(direction);
});

test("computing a point from a distance", () => {
  const ray = Ray.of({
    origin: Point.of({ x: 2, y: 3, z: 4 }),
    direction: Vector.of({ x: 1 }),
  });
  expect(ray.position(0)).toEqual(Point.of({ x: 2, y: 3, z: 4 }));
  expect(ray.position(1)).toEqual(Point.of({ x: 3, y: 3, z: 4 }));
  expect(ray.position(-1)).toEqual(Point.of({ x: 1, y: 3, z: 4 }));
  expect(ray.position(2.5)).toEqual(Point.of({ x: 4.5, y: 3, z: 4 }));
});

test("translating a ray", () => {
  const ray = Ray.of({
    origin: Point.of({ x: 1, y: 2, z: 3 }),
    direction: Vector.of({ y: 1 }),
  });
  const move = translate({ x: 3, y: 4, z: 5 });
  expect(ray.transform(move)).toEqual(
    Ray.of({
      origin: Point.of({ x: 4, y: 6, z: 8 }),
      direction: Vector.of({ y: 1 }),
    })
  );
});

test("scale a ray", () => {
  const ray = Ray.of({
    origin: Point.of({ x: 1, y: 2, z: 3 }),
    direction: Vector.of({ y: 1 }),
  });
  expect(ray.transform(scale({ x: 2, y: 3, z: 4 }))).toEqual(
    Ray.of({
      origin: Point.of({ x: 2, y: 6, z: 12 }),
      direction: Vector.of({ y: 3 }),
    })
  );
});
