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
  const { vertices, triangles } = ObjParser.of(
    __dirname + "/OBJ/scenario-3.obj"
  );
  const [v1, v2, v3, v4] = vertices;
  const [t1, t2] = triangles;
  expect(t1).toEqual(Triangle.of({ p1: v1, p2: v2, p3: v3 }));
  expect(t2).toEqual(Triangle.of({ p1: v1, p2: v3, p3: v4 }));
});
