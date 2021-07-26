import * as fs from "fs";
import { Point } from "../models";
import { Triangle } from "../models/shapes/triangle";

export class ObjParser {
  constructor(fpath) {
    this.file = fs.readFileSync(fpath);
    this.objects = this.#parse();
  }

  static of(fpath) {
    return new ObjParser(fpath);
  }

  get vertices() {
    return this.objects.filter((o) => o.type === "vertex").map((o) => o.object);
  }

  get triangles() {
    return this.objects
      .filter((o) => o.type === "triangle")
      .map((o) => o.object);
  }

  #parseTriangle(acc, x, y, z) {
    const [p1, p2, p3] = [
      acc[x - 1].object,
      acc[y - 1].object,
      acc[z - 1].object,
    ];
    return Triangle.of({ p1, p2, p3 });
  }

  #parse() {
    const lines = this.file.toString().split(/\r?\n/);
    return lines.reduce((acc, line) => {
      const [cmd, x, y, z] = line.split(" ");
      switch (cmd.toLowerCase()) {
        case "v": // Vertex
          return acc.concat([
            {
              type: "vertex",
              object: Point.of({ x: Number(x), y: Number(y), z: Number(z) }),
            },
          ]);
        case "f": // Face
          return acc.concat([
            { type: "triangle", object: this.#parseTriangle(acc, x, y, z) },
          ]);
        default:
          return acc;
      }
    }, []);
  }
}
