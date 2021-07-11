import { Point, Light } from "../src/models";
import { Color } from "../src/models/color";

test("a point light has a position and intensity", () => {
  const p = new Point();
  const light = new Light(p, Color.white);
  expect(light.position).toEqual(p);
  expect(light.intensity).toEqual(Color.white);
});
