import { Color } from "./color";

export class Material {
  constructor(props) {
    this.color = props?.color ?? new Color(1, 1, 1);
    this.ambient = props?.ambient ?? 0.1;
    this.diffuse = props?.diffuse ?? 0.9;
    this.specular = props?.specular ?? 0.9;
    this.shininess = props?.shininess ?? 200;
  }
}
