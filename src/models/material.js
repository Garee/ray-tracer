import { Color } from "./color";

/**
 * A representation of an objects material properties.
 */
export class Material {
  /**
   * Create a new Material.
   *
   * @param {object} [object=] - The object properties to create from.
   * @param {Color} [object.color=Color.white] - The color.
   * @param {number} [object.ambient=0.1] - The intensity of light reflected from other objects.Color
   * @param {number} [object.diffuse=0.9] - The intensity light reflected from a matte surface.
   * @param {number} [object.specular=0.9] - The intensity of the reflection of the light source (specular highlight.)
   * @param {number} [object.shininess=200] - The how large the highlight should be (typically between 10-200.)
   */
  constructor({
    color = Color.white,
    ambient = 0.1,
    diffuse = 0.9,
    specular = 0.9,
    shininess = 200,
    pattern = undefined,
    reflective = 0.0,
    transparency = 0.0,
    refractive = 1.0,
  } = {}) {
    this.color = color;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
    this.shininess = shininess;
    this.pattern = pattern;
    this.reflective = reflective;
    this.transparency = transparency;
    this.refractive = refractive;
  }

  static of(props) {
    return new Material(props);
  }
}
