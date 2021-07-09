export function expectToBeCloseToTuple(a, b, digits = 2) {
  expect(a.x).toBeCloseTo(b.x, digits);
  expect(a.y).toBeCloseTo(b.y, digits);
  expect(a.z).toBeCloseTo(b.z, digits);
  expect(a.w).toEqual(b.w, digits);
}
