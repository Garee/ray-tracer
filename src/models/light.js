import { Color } from "./color";
import { Point } from "./point";

/**
 * A representation of a point light source.
 */
export class Light {
  /**
   * Create a new Light.
   *
   * @param {Point} position - The position of the light source.
   * @param {number} intensity - The intensity of the light source.
   */
  constructor(position, intensity) {
    this.position = position;
    this.intensity = intensity;
  }

  /**
   * Create a new Light from an object.
   *
   * @param {object} [object=] - The object to create from.
   * @param {Point} [object.position=Point.origin] - The position of the light source.
   * @param {number} [object.intensity=Color.white] - The color of the light source.
   * @returns {Light} A light created from the object.
   */
  static of({ position = Point.origin, intensity = Color.white } = {}) {
    return new Light(position, intensity);
  }
}

/**
 * Shade an object using the Phong Reflection Model.
 *
 * @param {Material} material - The object's material.
 * @param {Shape} object - The object to shade that is being illuminated.
 * @param {Light} light - The light source.
 * @param {Point} point - The point on the object to shade.
 * @param {Vector} eye - The eye vector.
 * @param {Vector} normal - The surface normal vector.
 * @param {boolean} [inShadow=false] - Determines if the object is shadowed.
 * @return {Color} The shaded color at the point.
 */
export function lighting(
  material, // TODO: Remove this as it's available in object.
  object,
  light,
  point,
  eye,
  normal,
  inShadow = false
) {
  let materialColor = material.color;
  if (material.pattern) {
    materialColor = material.pattern.at(object, point);
  }
  // Combine the surface color with the light's colour.
  const color = materialColor.multiply(light.intensity);
  // Compute the ambient light contribution from other objects in the environment.
  const ambient = color.multiply(material.ambient);
  // The direction to the light source.
  const lightDir = light.position.subtract(point).normalize();
  // The cosine of the angle between the light vector and normal vector.
  const lightDotNormal = lightDir.dot(normal);

  let diffuse, specular;
  if (lightDotNormal < 0) {
    // The light is on the other side of the surface.
    diffuse = Color.black;
    specular = Color.black;
  } else {
    // Compute the diffuse light contribution.
    diffuse = color.multiply(material.diffuse * lightDotNormal);
    // The cosine of the angle between the reflection vector and eye vector.
    const reflect = lightDir.multiply(-1).reflect(normal);
    const reflectDotEye = reflect.dot(eye);
    if (reflectDotEye < 0) {
      // The light reflects away from the eye.
      specular = Color.black;
    } else {
      // Compute the specular light contribution.
      const factor = Math.pow(reflectDotEye, material.shininess);
      specular = light.intensity.multiply(material.specular * factor);
    }
  }

  let result = ambient;
  if (!inShadow) {
    result = result.add(diffuse).add(specular);
  }

  const { x: r, y: g, z: b } = result;
  return Color.of({ r, g, b });
}
