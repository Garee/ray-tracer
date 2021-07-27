import * as fs from "fs";
import { Point } from "../models";
import { Triangle, Group } from "../models/shapes";

export class ObjParser {
  constructor(fpath) {
    this.file = fs.readFileSync(fpath);
    this.objects = this.#parse();
    this.root = Group.of({ objects: this.triangles });
  }

  static of(fpath) {
    return new ObjParser(fpath);
  }

  get vertices() {
    return this.#filterObjects(this.objects, "vertex");
  }

  get triangles() {
    return this.#filterObjects(this.objects, "triangle");
  }

  #filterObjects(acc, type) {
    return acc.filter((a) => a.type === type).map((o) => o.object);
  }

  #triangulate(acc) {
    const vertices = this.#filterObjects(acc, "vertex");
    const triangles = [];
    for (let i = 1; i < vertices.length - 1; i++) {
      const triangle = Triangle.of({
        p1: vertices[0],
        p2: vertices[i],
        p3: vertices[i + 1],
      });
      triangles.push({ type: "triangle", object: triangle });
    }
    return triangles;
  }

  #parse() {
    const lines = this.file.toString().split(/\r?\n/);
    return lines.reduce((acc, line) => {
      const [cmd, ...args] = line.split(" ");
      const vertices = args.map((a) => Number(a));
      const [x, y, z] = vertices;
      switch (cmd.toLowerCase()) {
        case "v": // Vertex
          return acc.concat([
            {
              type: "vertex",
              object: Point.of({ x, y, z }),
            },
          ]);
        case "f": // Face
          return acc.concat(this.#triangulate(acc, vertices));
        default:
          return acc;
      }
    }, []);
  }
}
