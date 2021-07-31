import * as fs from "fs";
import { ObjParser } from "../src/io";
import { Point, Vector } from "../src/models";

test("ignoring unrecognised lines", () => {
  const { vertices } = from(__dirname + "/OBJ/scenario-1.obj");
  expect(vertices).toHaveLength(0);
});

test("vertex records", () => {
  const { vertices } = from(__dirname + "/OBJ/scenario-2.obj");
  expect(vertices).toEqual([
    Point.of({ x: -1, y: 1 }),
    Point.of({ x: -1, y: 0.5 }),
    Point.of({ x: 1 }),
    Point.of({ x: 1, y: 1 }),
  ]);
});

test("parsing triangle faces", () => {
  const { vertices, triangles } = from(__dirname + "/OBJ/scenario-3.obj");
  const [v1, v2, v3, v4] = vertices;
  const [t1, t2] = triangles;
  expect([t1.p1, t1.p2, t1.p3]).toEqual([v1, v2, v3]);
  expect([t2.p1, t2.p2, t2.p3]).toEqual([v1, v3, v4]);
});

test("triangulating polygons", () => {
  const { vertices, triangles } = from(__dirname + "/OBJ/scenario-4.obj");
  const [v1, v2, v3, v4, v5] = vertices;
  const [t1, t2, t3] = triangles;
  expect([t1.p1, t1.p2, t1.p3]).toEqual([v1, v2, v3]);
  expect([t2.p1, t2.p2, t2.p3]).toEqual([v1, v3, v4]);
  expect([t3.p1, t3.p2, t3.p3]).toEqual([v1, v4, v5]);
});

test("triangles in groups", () => {
  const { vertices, triangles, groups } = from(
    __dirname + "/OBJ/scenario-5.obj"
  );
  const [v1, v2, v3, v4] = vertices;
  const [t1, t2] = triangles;
  const [g1, g2] = groups;
  expect([t1.p1, t1.p2, t1.p3]).toEqual([v1, v2, v3]);
  expect([t2.p1, t2.p2, t2.p3]).toEqual([v1, v3, v4]);
  expect(g1.contains(t1)).toBe(true);
  expect(g2.contains(t2)).toBe(true);
});

test("converting an OBJ file to a group", () => {
  const parser = from(__dirname + "/OBJ/scenario-6.obj");
  const [g1, g2] = parser.groups;
  const root = parser.toGroup();
  expect(root.contains(g1)).toBe(true);
  expect(root.contains(g2)).toBe(true);
});

test("vertex normal records", () => {
  const parser = from(__dirname + "/OBJ/scenario-7.obj");
  const [n1, n2, n3] = parser.normals;
  expect(n1).toEqual(Vector.of({ z: 1 }));
  expect(n2).toEqual(Vector.of({ x: 0.707, z: -0.707 }));
  expect(n3).toEqual(Vector.of({ x: 1, y: 2, z: 3 }));
});

test("faces with normals", () => {
  const parser = from(__dirname + "/OBJ/scenario-8.obj");
  const [v1, v2, v3] = parser.vertices;
  const [n1, n2, n3] = parser.normals;
  const root = parser.toGroup();
  const [t1, t2] = root.objects;
  expect([t1.p1, t1.p2, t1.p3]).toEqual([v1, v2, v3]);
  expect([t1.n1, t1.n2, t1.n3]).toEqual([n3, n1, n2]);
  expect(t1).toEqual(t2);
});

function from(fpath) {
  const file = fs.readFileSync(fpath);
  return new ObjParser(file.toString());
}
