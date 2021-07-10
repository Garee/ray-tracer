import { Point } from "../src/point";
import { White } from "../src/color";
import { Light } from "../src/light";

test("a point light has a position and intensity", () => {
  const p = new Point();
  const light = new Light(p, White);
  expect(light.position).toEqual(p);
  expect(light.intensity).toEqual(White);
});
