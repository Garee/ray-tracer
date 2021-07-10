import { Black, Color } from "./color";

export class Light {
  constructor(position, intensity) {
    this.position = position;
    this.intensity = intensity;
  }
}

// The Phong Reflection Model
export function lighting(
  material,
  light,
  point,
  eye,
  normal,
  inShadow = false
) {
  // Combine the surface color with the light's colour.
  const color = material.color.multiply(light.intensity);
  // The ambient light contribution.
  const ambient = color.multiply(material.ambient);
  // The direction to the light source.
  const lightDir = light.position.subtract(point).normalize();
  // The cosine of the angle between the light vector and normal vector.
  const lightDotNormal = lightDir.dot(normal);

  let diffuse, specular;
  if (lightDotNormal < 0) {
    // The light is on the other side of the surface.
    diffuse = Black;
    specular = Black;
  } else {
    diffuse = color.multiply(material.diffuse * lightDotNormal);
    // The cosine of the angle between the reflection vector and eye vector.
    const reflect = lightDir.multiply(-1).reflect(normal);
    const reflectDotEye = reflect.dot(eye);
    if (reflectDotEye < 0) {
      // The light reflects away from the eye.
      specular = Black;
    } else {
      const factor = Math.pow(reflectDotEye, material.shininess);
      specular = light.intensity.multiply(material.specular * factor);
    }
  }

  let result = ambient;
  if (!inShadow) {
    result = result.add(diffuse).add(specular);
  }

  const { x, y, z } = result;
  return new Color(x, y, z);
}
