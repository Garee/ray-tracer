import { Color, Point, Matrix } from "../src/models";
import {
  GradientPattern,
  RingPattern,
  CheckPattern,
  StripePattern,
  Pattern,
} from "../src/models/patterns";
import { Sphere } from "../src/models/shapes";
import { scale, translate } from "../src/models/transformations";

class TestPattern extends Pattern {
  colorAt({ x, y, z }) {
    return Color.of({ r: x, g: y, b: z });
  }
}

describe("StripePattern", () => {
  let colors, pattern, sphere;

  beforeEach(() => {
    colors = [Color.white, Color.black];
    pattern = StripePattern.of({ colors });
    sphere = Sphere.of();
  });

  test("creating a stripe pattern", () => {
    expect(pattern.colors).toEqual(colors);
  });

  test("a stripe pattern is constant in y", () => {
    expect(pattern.colorAt(Point.origin)).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ y: 1 }))).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ y: 2 }))).toEqual(Color.white);
  });

  test("a stripe pattern is constant in z", () => {
    expect(pattern.colorAt(Point.origin)).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ z: 1 }))).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ z: 2 }))).toEqual(Color.white);
  });

  test("a stripe pattern alternates in x", () => {
    expect(pattern.colorAt(Point.origin)).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ x: 0.9 }))).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ x: 1 }))).toEqual(Color.black);
    expect(pattern.colorAt(Point.of({ x: -0.1 }))).toEqual(Color.black);
    expect(pattern.colorAt(Point.of({ x: -1 }))).toEqual(Color.black);
    expect(pattern.colorAt(Point.of({ x: -1.1 }))).toEqual(Color.white);
  });

  test("stripes with an object transformation", () => {
    sphere = sphere.setTransform(scale({ x: 2, y: 2, z: 2 }));
    expect(pattern.at(sphere, Point.of({ x: 1.5 }))).toEqual(Color.white);
  });

  test("stripes with a pattern transformation", () => {
    pattern = pattern.setTransform(scale({ x: 2, y: 2, z: 2 }));
    expect(pattern.at(sphere, Point.of({ x: 1.5 }))).toEqual(Color.white);
  });

  test("stripes with both an object and a pattern transformation", () => {
    sphere = sphere.setTransform(scale({ x: 2, y: 2, z: 2 }));
    pattern = pattern.setTransform(translate({ x: 0.5 }));
    expect(pattern.at(sphere, Point.of({ x: 2.5 }))).toEqual(Color.white);
  });
});

describe("TestPattern", () => {
  let colors, pattern, sphere;

  beforeEach(() => {
    colors = [Color.white, Color.black];
    pattern = new TestPattern();
    sphere = Sphere.of();
  });

  test("the default pattern transformation", () => {
    expect(pattern.colors).toEqual(colors);
    expect(pattern.transform).toEqual(Matrix.identity);
  });

  test("assigning a transformation", () => {
    pattern = pattern.setTransform(translate({ x: 1, y: 2, z: 3 }));
    expect(pattern.transform).toEqual(translate({ x: 1, y: 2, z: 3 }));
  });

  test("a pattern with an object transformation", () => {
    sphere = sphere.setTransform(scale({ x: 2, y: 2, z: 2 }));
    const color = pattern.at(sphere, Point.of({ x: 2, y: 3, z: 4 }));
    expect(color).toEqual(Color.of({ r: 1, g: 1.5, b: 2 }));
  });

  test("a pattern with a pattern transformation", () => {
    pattern = pattern.setTransform(scale({ x: 2, y: 2, z: 2 }));
    const color = pattern.at(sphere, Point.of({ x: 2, y: 3, z: 4 }));
    expect(color).toEqual(Color.of({ r: 1, g: 1.5, b: 2 }));
  });

  test("a pattern with both an object and a pattern transformation", () => {
    sphere = sphere.setTransform(scale({ x: 2, y: 2, z: 2 }));
    pattern = pattern.setTransform(translate({ x: 0.5, y: 1, z: 1.5 }));
    const color = pattern.at(sphere, Point.of({ x: 2.5, y: 3, z: 3.5 }));
    expect(color).toEqual(Color.of({ r: 0.75, g: 0.5, b: 0.25 }));
  });
});

describe("GradientPattern", () => {
  test("a gradient linearly interpolates between colors", () => {
    const pattern = GradientPattern.of({ colors: [Color.white, Color.black] });
    expect(pattern.colorAt(Point.origin)).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ x: 0.25 }))).toEqual(
      Color.of({ r: 0.75, g: 0.75, b: 0.75 })
    );
    expect(pattern.colorAt(Point.of({ x: 0.5 }))).toEqual(
      Color.of({ r: 0.5, g: 0.5, b: 0.5 })
    );
    expect(pattern.colorAt(Point.of({ x: 0.75 }))).toEqual(
      Color.of({ r: 0.25, g: 0.25, b: 0.25 })
    );
  });
});

describe("RingPattern", () => {
  test("a ring should extend in both x and z", () => {
    const pattern = RingPattern.of({ colors: [Color.white, Color.black] });
    expect(pattern.colorAt(Point.origin)).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ x: 1 }))).toEqual(Color.black);
    expect(pattern.colorAt(Point.of({ z: 1 }))).toEqual(Color.black);
    expect(pattern.colorAt(Point.of({ x: 0.708, z: 0.708 }))).toEqual(
      Color.black
    );
  });
});

describe("CheckPattern", () => {
  let colors, pattern;

  beforeEach(() => {
    colors = [Color.white, Color.black];
    pattern = CheckPattern.of({ colors });
  });

  test("a check should repeat in x", () => {
    expect(pattern.colorAt(Point.origin)).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ x: 0.99 }))).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ x: 1 }))).toEqual(Color.black);
    expect(pattern.colorAt(Point.of({ x: 2 }))).toEqual(Color.white);
  });

  test("a check should repeat in y", () => {
    expect(pattern.colorAt(Point.origin)).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ y: 0.99 }))).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ y: 1 }))).toEqual(Color.black);
    expect(pattern.colorAt(Point.of({ y: 2 }))).toEqual(Color.white);
  });

  test("a check should repeat in z", () => {
    expect(pattern.colorAt(Point.origin)).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ z: 0.99 }))).toEqual(Color.white);
    expect(pattern.colorAt(Point.of({ z: 1 }))).toEqual(Color.black);
    expect(pattern.colorAt(Point.of({ z: 2 }))).toEqual(Color.white);
  });
});
