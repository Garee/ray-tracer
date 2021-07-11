import { Color } from "./color";

export class Material {
  constructor({
    color = Color.white,
    ambient = 0.1,
    diffuse = 0.9,
    specular = 0.9,
    shininess = 200,
    pattern = undefined,
  } = {}) {
    this.color = color;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
    this.pattern = pattern;
  }

  static of(props) {
    return new Material(props);
  }
}
