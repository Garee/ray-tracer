import { Point } from "../models";
import { Triangle, Group } from "../models/shapes";

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

  #triangulate(acc, vindices) {
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

  #parse() {
    const lines = this.raw.split(/\r?\n/);
    return lines.reduce((acc, line) => {
      if (!line) {
        return acc;
      }

      const [cmd, ...args] = line.replace(/\s+/g, " ").split(" ");
      const nargs = args.map((a) => Number(a));
      const [x, y, z] = nargs;
      switch (cmd.toLowerCase()) {
        case "v": // Vertex
          return acc.concat([
            {
              type: "vertex",
              object: Point.of({ x, y, z }),
            },
          ]);
        case "f": // Face
          return acc.concat(this.#triangulate(acc, nargs));
        case "g": // Group
          return acc.concat({ type: "group", object: Group.of() });
        default:
          return acc;
      }
    }, []);
  }
}
