import { Color } from "../models";
import { Pattern } from "../models/patterns";

export function expectToBeCloseToTuple(a, b, digits = 4) {
  expect(a.x).toBeCloseTo(b.x, digits);
  expect(a.y).toBeCloseTo(b.y, digits);
  expect(a.z).toBeCloseTo(b.z, digits);
  expect(a.w).toEqual(b.w, digits);
}

export class TestPattern extends Pattern {
  colorAt({ x, y, z }) {
    return Color.of({ r: x, g: y, b: z });
  }
}
