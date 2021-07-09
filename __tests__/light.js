import { Point } from "../src/point";
import { Color } from "../src/color";
import { Light } from "../src/light";

test("a point light has a position and intensity", () => {
  const p = new Point(0, 0, 0);
  const i = new Color(1, 1, 1);
  const light = new Light(p, i);
  expect(light.position).toEqual(p);
  expect(light.intensity).toEqual(i);
});
