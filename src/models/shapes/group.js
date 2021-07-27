import { Shape } from "./shape";

export class Group extends Shape {
  constructor(material, transform, objects = new Set()) {
    super(material, transform);
    this.objects = new Set(objects);
    this.objects?.forEach((o) => (o.parent = this));
  }

  static of({ material, transform, objects } = {}) {
    return new Group(material, transform, objects);
  }

  addObject(object) {
    return Group.of({
      material: this.material,
      transform: this.transform,
      objects: new Set([...this.objects, object]),
    });
  }

  isEmpty() {
    return this.objects.size === 0;
  }

  contains(object) {
    return this.objects.has(object);
  }

  setMaterial(material) {
    return Group.of({
      material: material,
      transform: this.transform,
      objects: this.objects,
      parent: this.parent,
    });
  }

  setTransform(transform) {
    return Group.of({
      material: this.material,
      transform: transform,
      objects: this.objects,
      parent: this.parent,
    });
  }

  _intersect(ray) {
    const intersections = Array.from(this.objects.values()).reduce(
      (acc, obj) => {
        return acc.concat(obj.intersect(ray));
      },
      []
    );
    return intersections.sort((a, b) => a.t - b.t);
  }
}
