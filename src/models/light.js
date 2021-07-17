import { Color } from "./color";
import { Point } from "./point";
export class Light {
  constructor(position, intensity) {
    this.position = position;
    this.intensity = intensity;
  }

  static of({ position = Point.origin, intensity = Color.white } = {}) {
    return new Light(position, intensity);
  }
}

// The Phong Reflection Model
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
  // The ambient light contribution.
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
    diffuse = color.multiply(material.diffuse * lightDotNormal);
    // The cosine of the angle between the reflection vector and eye vector.
    const reflect = lightDir.multiply(-1).reflect(normal);
    const reflectDotEye = reflect.dot(eye);
    if (reflectDotEye < 0) {
      // The light reflects away from the eye.
      specular = Color.black;
    } else {
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
