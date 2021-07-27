import { ObjParser } from "../src/io";
import { Point } from "../src/models";
import { Triangle } from "../src/models/shapes";

test("ignoring unrecognised lines", () => {
  const { vertices } = ObjParser.of(__dirname + "/OBJ/scenario-1.obj");
  expect(vertices).toHaveLength(0);
});

test("vertex records", () => {
  const { vertices } = ObjParser.of(__dirname + "/OBJ/scenario-2.obj");
  expect(vertices).toEqual([
    Point.of({ x: -1, y: 1 }),
    Point.of({ x: -1, y: 0.5 }),
    Point.of({ x: 1 }),
    Point.of({ x: 1, y: 1 }),
  ]);
});

test("parsing triangle faces", () => {
  const { vertices, triangles, root } = ObjParser.of(
    __dirname + "/OBJ/scenario-3.obj"
  );
  const [v1, v2, v3, v4] = vertices;
  const [t1, t2] = triangles;
  expect([t1.p1, t1.p2, t1.p3]).toEqual([v1, v2, v3]);
  expect([t2.p1, t2.p2, t2.p3]).toEqual([v1, v3, v4]);
  expect(root.objects).toEqual(triangles);
});

test("triangulating polygons", () => {
  const { vertices, triangles, root } = ObjParser.of(
    __dirname + "/OBJ/scenario-4.obj"
  );
  const [v1, v2, v3, v4, v5] = vertices;
  const [t1, t2, t3] = triangles;
  expect([t1.p1, t1.p2, t1.p3]).toEqual([v1, v2, v3]);
  expect([t2.p1, t2.p2, t2.p3]).toEqual([v1, v3, v4]);
  expect([t3.p1, t3.p2, t3.p3]).toEqual([v1, v4, v5]);
  expect(root.objects).toEqual(triangles);
});
