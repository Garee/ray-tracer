import { Point, Vector } from "../models";
import { SmoothTriangle, Triangle, Group } from "../models/shapes";

export class ObjParser {
  constructor(raw) {
    this.raw = raw;
    this.objects = this.#parse();
    this.groups = this.#populateGroups();
    this.root = this.toGroup();
  }

  static of(raw) {
    return new ObjParser(raw);
  }

  get vertices() {
    return this.#filterObjects(this.objects, "vertex");
  }

  get normals() {
    return this.#filterObjects(this.objects, "normal");
  }

  get triangles() {
    return this.#filterObjects(this.objects, "triangle");
  }

  toGroup() {
    if (this.groups.length > 0) {
      return Group.of({ objects: this.groups });
    }

    return Group.of({ objects: this.triangles });
  }

  #populateGroups() {
    const groups = [];
    this.objects.forEach((o) => {
      if (o.type === "group") {
        groups.push(Group.of());
      } else if (o.type === "triangle") {
        const group = groups.pop();
        if (group) {
          groups.push(group.addObject(o.object));
        }
      }
    });
    return groups;
  }

  #filterObjects(acc, type) {
    return acc.filter((a) => a.type === type).map((o) => o.object);
  }

  #createTriangles(acc, vindices) {
    const vertices = this.#filterObjects(acc, "vertex").filter((_, i) =>
      vindices.includes(i + 1)
    );
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

  #createSmoothTriangles(acc, args) {
    const vindices = args.map((arg) => {
      return Number(arg.slice(0, arg.indexOf("/")));
    });

    const nindices = args.map((arg) => {
      return Number(arg.slice(arg.lastIndexOf("/") + 1)) - 1;
    });

    const vertices = this.#filterObjects(acc, "vertex").filter((_, i) =>
      vindices.includes(i + 1)
    );

    const normals = this.#filterObjects(acc, "normal");

    const triangles = [];
    for (let i = 1; i < vertices.length - 1; i++) {
      const triangle = SmoothTriangle.of({
        p1: vertices[0],
        p2: vertices[i],
        p3: vertices[i + 1],
        n1: normals[nindices[0]],
        n2: normals[nindices[1]],
        n3: normals[nindices[2]],
      });
      triangles.push({ type: "triangle", object: triangle });
    }
    return triangles;
  }

  #triangulate(acc, args) {
    if (args[0].indexOf("/") !== -1) {
      return this.#createSmoothTriangles(acc, args);
    }

    const vindices = args.map((a) => Number(a));
    return this.#createTriangles(acc, vindices);
  }

  #parse() {
    const lines = this.raw.split(/\r?\n/);
    return lines.reduce((acc, line) => {
      if (!line) {
        return acc;
      }

      const [cmd, ...args] = line.replace(/\s+/g, " ").split(" ");
      const [x, y, z] = args.map((a) => Number(a));
      switch (cmd.toLowerCase()) {
        case "v": // Vertex
          return acc.concat([
            {
              type: "vertex",
              object: Point.of({ x, y, z }),
            },
          ]);
        case "vn": // Vertex Normal
          return acc.concat([
            {
              type: "normal",
              object: Vector.of({ x, y, z }),
            },
          ]);
        case "f": // Face
          return acc.concat(this.#triangulate(acc, args));
        case "g": // Group
          return acc.concat({ type: "group", object: Group.of() });
        default:
          return acc;
      }
    }, []);
  }
}
