import { Black, Color, White } from "../src/color";
import { Point } from "../src/point";
import { StripePattern } from "../src/patterns/stripe";
import { Sphere } from "../src/sphere";
import { scaling, translation } from "../src/transformations";
import { Matrix } from "../src/matrix";
import { Pattern } from "../src/patterns/pattern";
import { GradientPattern } from "../src/patterns/gradient";
import { RingPattern } from "../src/patterns/ring";
import { Material } from "../src/material";
import { CheckPattern } from "../src/patterns/check";

test("creating a stripe pattern", () => {
  const pattern = new StripePattern(White, Black);
  expect(pattern.a).toEqual(White);
  expect(pattern.b).toEqual(Black);
});

test("a stripe pattern is constant in y", () => {
  const pattern = new StripePattern(White, Black);
  expect(pattern.colorAt(new Point())).toEqual(White);
  expect(pattern.colorAt(new Point(0, 1, 0))).toEqual(White);
  expect(pattern.colorAt(new Point(0, 2, 0))).toEqual(White);
});

test("a stripe pattern is constant in z", () => {
  const pattern = new StripePattern(White, Black);
  expect(pattern.colorAt(new Point())).toEqual(White);
  expect(pattern.colorAt(new Point(0, 0, 1))).toEqual(White);
  expect(pattern.colorAt(new Point(0, 0, 2))).toEqual(White);
});

test("a stripe pattern alternates in x", () => {
  const pattern = new StripePattern(White, Black);
  expect(pattern.colorAt(new Point())).toEqual(White);
  expect(pattern.colorAt(new Point(0.9, 0, 0))).toEqual(White);
  expect(pattern.colorAt(new Point(1, 0, 0))).toEqual(Black);
  expect(pattern.colorAt(new Point(-0.1, 0, 0))).toEqual(Black);
  expect(pattern.colorAt(new Point(-1, 0, 0))).toEqual(Black);
  expect(pattern.colorAt(new Point(-1.1, 0, 0))).toEqual(White);
});

test("stripes with an object transformation", () => {
  const sphere = new Sphere().setTransform(scaling(2, 2, 2));
  const pattern = new StripePattern(White, Black);
  expect(pattern.at(sphere, new Point(1.5, 0, 0))).toEqual(White);
});

test("stripes with a pattern transformation", () => {
  const sphere = new Sphere();
  const pattern = new StripePattern(White, Black).setTransform(
    scaling(2, 2, 2)
  );
  expect(pattern.at(sphere, new Point(1.5, 0, 0))).toEqual(White);
});

test("stripes with both an object and a pattern transformation", () => {
  const sphere = new Sphere().setTransform(scaling(2, 2, 2));
  const pattern = new StripePattern(White, Black).setTransform(
    translation(0.5, 0, 0)
  );
  expect(pattern.at(sphere, new Point(2.5, 0, 0))).toEqual(White);
});

class TestPattern extends Pattern {
  constructor(transform) {
    super(transform);
  }

  colorAt(point) {
    const { x, y, z } = point;
    return new Color(x, y, z);
  }

  setTransform(transform) {
    return new TestPattern(transform);
  }
}

test("the default pattern transformation", () => {
  const pattern = new TestPattern();
  expect(pattern.transform).toEqual(Matrix.identity());
});

test("assigning a transformation", () => {
  const pattern = new TestPattern().setTransform(translation(1, 2, 3));
  expect(pattern.transform).toEqual(translation(1, 2, 3));
});

test("a pattern with an object transformation", () => {
  const sphere = new Sphere().setTransform(scaling(2, 2, 2));
  const pattern = new TestPattern();
  const color = pattern.at(sphere, new Point(2, 3, 4));
  expect(color).toEqual(new Color(1, 1.5, 2));
});

test("a pattern with a pattern transformation", () => {
  const sphere = new Sphere();
  const pattern = new TestPattern().setTransform(scaling(2, 2, 2));
  const color = pattern.at(sphere, new Point(2, 3, 4));
  expect(color).toEqual(new Color(1, 1.5, 2));
});

test("a pattern with both an object and a pattern transformation", () => {
  const sphere = new Sphere().setTransform(scaling(2, 2, 2));
  const pattern = new TestPattern().setTransform(translation(0.5, 1, 1.5));
  const color = pattern.at(sphere, new Point(2.5, 3, 3.5));
  expect(color).toEqual(new Color(0.75, 0.5, 0.25));
});

test("a gradient linearly interpolates between colors", () => {
  const pattern = new GradientPattern(White, Black);
  const obj = new Sphere();
  expect(pattern.colorAt(new Point())).toEqual(White);
  expect(pattern.at(obj, new Point())).toEqual(White);
  expect(pattern.colorAt(new Point(0.25, 0, 0))).toEqual(
    new Color(0.75, 0.75, 0.75)
  );
  expect(pattern.at(obj, new Point(0.25, 0, 0))).toEqual(
    new Color(0.75, 0.75, 0.75)
  );
  expect(pattern.colorAt(new Point(0.5, 0, 0))).toEqual(
    new Color(0.5, 0.5, 0.5)
  );
  expect(pattern.colorAt(new Point(0.75, 0, 0))).toEqual(
    new Color(0.25, 0.25, 0.25)
  );
});

test("a ring should extend in both x and z", () => {
  const pattern = new RingPattern(White, Black);
  const obj = new Sphere(new Material({ pattern }));
  expect(pattern.colorAt(new Point())).toEqual(White);
  expect(pattern.at(obj, new Point())).toEqual(White);
  expect(pattern.colorAt(new Point(1, 0, 0))).toEqual(Black);
  expect(pattern.at(obj, new Point(1, 0, 0))).toEqual(Black);
  expect(pattern.colorAt(new Point(0, 0, 1))).toEqual(Black);
  expect(pattern.at(obj, new Point(0, 0, 1))).toEqual(Black);
  expect(pattern.colorAt(new Point(0.708, 0, 0.708))).toEqual(Black);
  expect(pattern.at(obj, new Point(0.708, 0, 0.708))).toEqual(Black);
});

test("a check should repeat in x", () => {
  const pattern = new CheckPattern(White, Black);
  expect(pattern.colorAt(new Point())).toEqual(White);
  expect(pattern.colorAt(new Point(0.99, 0, 0))).toEqual(White);
  expect(pattern.colorAt(new Point(1, 0, 0))).toEqual(Black);
  expect(pattern.colorAt(new Point(2, 0, 0))).toEqual(White);
});

test("a check should repeat in y", () => {
  const pattern = new CheckPattern(White, Black);
  expect(pattern.colorAt(new Point())).toEqual(White);
  expect(pattern.colorAt(new Point(0, 0.99, 0))).toEqual(White);
  expect(pattern.colorAt(new Point(0, 1, 0))).toEqual(Black);
  expect(pattern.colorAt(new Point(0, 2, 0))).toEqual(White);
});

test("a check should repeat in z", () => {
  const pattern = new CheckPattern(White, Black);
  expect(pattern.colorAt(new Point())).toEqual(White);
  expect(pattern.colorAt(new Point(0, 0, 0.99))).toEqual(White);
  expect(pattern.colorAt(new Point(0, 0, 1))).toEqual(Black);
  expect(pattern.colorAt(new Point(0, 0, 2))).toEqual(White);
});
