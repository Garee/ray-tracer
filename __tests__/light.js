import { Point, Light } from "../src/models";
import { Color } from "../src/models/color";

test("a point light has a position and intensity", () => {
  const light = new Light(Point.origin, Color.white);
  expect(light.position).toEqual(Point.origin);
  expect(light.intensity).toEqual(Color.white);
});
