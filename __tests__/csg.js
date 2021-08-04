import { Sphere, Cube, CsgOp, OpType } from "../src/models/shapes";
import { intersectionAllowed } from "../src/models/intersections";
import { Intersection, Point, Vector, Ray } from "../src/models";
import { translate } from "../src/models/transformations";

test("CSG is created with an operation and two shapes", () => {
  const s1 = Sphere.of();
  const s2 = Cube.of();
  const op = CsgOp.of({ type: OpType.Union, left: s1, right: s2 });
  expect(op.type).toEqual("union");
  expect(op.left).toEqual(s1);
  expect(op.right).toEqual(s2);
  expect(s1.parent).toEqual(op);
  expect(s2.parent).toEqual(op);
});

test("evaluating the rule for a csg union operation", () => {
  const testCases = [
    [OpType.Union, true, true, true, false],
    [OpType.Union, true, true, false, true],
    [OpType.Union, true, false, true, false],
    [OpType.Union, true, false, false, true],
    [OpType.Union, false, true, true, false],
    [OpType.Union, false, true, false, false],
    [OpType.Union, false, false, true, true],
    [OpType.Union, false, false, false, true],
  ];

  testCases.forEach((testCase) => {
    // op: CSG operation
    // lhit: true if left shape hit (false if right)
    // inl: true if hit occurs inside the left shape
    // inr: true if hit occurs inside the right shape
    const [op, lhit, inl, inr, result] = testCase;
    expect(intersectionAllowed(op, lhit, inl, inr)).toEqual(result);
  });
});

test("evaluating the rule for a csg intersect operation", () => {
  const testCases = [
    [OpType.Intersect, true, true, true, true],
    [OpType.Intersect, true, true, false, false],
    [OpType.Intersect, true, false, true, true],
    [OpType.Intersect, true, false, false, false],
    [OpType.Intersect, false, true, true, true],
    [OpType.Intersect, false, true, false, true],
    [OpType.Intersect, false, false, true, false],
    [OpType.Intersect, false, false, false, false],
  ];

  testCases.forEach((testCase) => {
    const [op, lhit, inl, inr, result] = testCase;
    expect(intersectionAllowed(op, lhit, inl, inr)).toEqual(result);
  });
});

test("evaluating the rule for a csg difference operation", () => {
  const testCases = [
    [OpType.Difference, true, true, true, false],
    [OpType.Difference, true, true, false, true],
    [OpType.Difference, true, false, true, false],
    [OpType.Difference, true, false, false, true],
    [OpType.Difference, false, true, true, true],
    [OpType.Difference, false, true, false, true],
    [OpType.Difference, false, false, true, false],
    [OpType.Difference, false, false, false, false],
  ];

  testCases.forEach((testCase) => {
    const [op, lhit, inl, inr, result] = testCase;
    expect(intersectionAllowed(op, lhit, inl, inr)).toEqual(result);
  });
});

test("filtering a list of intersections", () => {
  const testCases = [
    [OpType.Union, 0, 3],
    [OpType.Intersect, 1, 2],
    [OpType.Difference, 0, 1],
  ];

  testCases.forEach((testCase) => {
    const [type, i0, i1] = testCase;
    const s1 = Sphere.of();
    const s2 = Cube.of();
    const op = CsgOp.of({ type, left: s1, right: s2 });
    const intersections = [
      Intersection.of({ t: 1, object: s1 }),
      Intersection.of({ t: 2, object: s2 }),
      Intersection.of({ t: 3, object: s1 }),
      Intersection.of({ t: 4, object: s2 }),
    ];
    const result = op.filter(intersections);
    expect(result).toEqual([intersections[i0], intersections[i1]]);
  });
});

test("a ray misses a csg object", () => {
  const op = CsgOp.of({
    type: OpType.Union,
    left: Sphere.of(),
    right: Cube.of(),
  });
  const ray = Ray.of({
    origin: Point.of({ y: 2, z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = op.intersect(ray);
  expect(intersections).toHaveLength(0);
});

test("a ray hits a csg object", () => {
  const s1 = Sphere.of();
  const s2 = Cube.of({
    transform: translate({ z: 0.5 }),
  });
  const op = CsgOp.of({
    type: OpType.Union,
    left: s1,
    right: s2,
  });
  const ray = Ray.of({
    origin: Point.of({ z: -5 }),
    direction: Vector.of({ z: 1 }),
  });
  const intersections = op.intersect(ray);
  expect(intersections).toHaveLength(2);
  expect(intersections[0].t).toEqual(4);
  expect(intersections[0].object).toEqual(s1);
  expect(intersections[1].t).toEqual(6.5);
  expect(intersections[1].object).toEqual(s2);
});
