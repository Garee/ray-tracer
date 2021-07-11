import { Point, Light } from "../src/models";
import { White } from "../src/models/color";

test("a point light has a position and intensity", () => {
  const p = new Point();
  const light = new Light(p, White);
  expect(light.position).toEqual(p);
  expect(light.intensity).toEqual(White);
});
