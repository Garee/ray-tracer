export function expectToBeCloseToTuple(a, b) {
  expect(a.x).toBeCloseTo(b.x);
  expect(a.y).toBeCloseTo(b.y);
  expect(a.z).toBeCloseTo(b.z);
  expect(a.w).toEqual(b.w);
}
