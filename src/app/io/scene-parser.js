import {
  Camera,
  Light,
  Point,
  Vector,
  World,
  Matrix,
  Material,
  Color,
} from "../../models";
import {
  view,
  translate,
  scale,
  rotateX,
  rotateY,
  rotateZ,
  shear,
} from "../../models/transformations";
import {
  Sphere,
  Plane,
  Cube,
  Cone,
  Cylinder,
  Group,
  SmoothTriangle,
  Triangle,
  CsgOp,
} from "../../models/shapes";
import {
  CheckPattern,
  GradientPattern,
  RadialGradientPattern,
  RingPattern,
  StripePattern,
} from "../../models/patterns";

const transformFns = {
  view: view,
  translate: translate,
  scale: scale,
  rotateX: rotateX,
  rotateY: rotateY,
  rotateZ: rotateZ,
  shear: shear,
};

const transformFnArgs = {
  view: ({ from, to, up }) => {
    return {
      from: Point.of({ x: from.x, y: from.y, z: from.z }),
      to: Point.of({ x: to.x, y: to.y, z: to.z }),
      up: Vector.of({ x: up.x, y: up.y, z: up.z }),
    };
  },
};

const shapes = {
  sphere: Sphere.of,
  plane: Plane.of,
  cube: Cube.of,
  cone: Cone.of,
  cylinder: Cylinder.of,
  group: (props) => {
    if (props.objects) {
      props.objects = props.objects.map((o) => SceneParser.parseShape(o));
    }

    return Group.of(props);
  },
  smoothTriangle: (props) => {
    const { p1, p2, p3, n1, n2, n3 } = props;
    props.p1 = Point.of({ x: p1.x, y: p1.y, z: p1.z });
    props.p2 = Point.of({ x: p2.x, y: p2.y, z: p2.z });
    props.p3 = Point.of({ x: p3.x, y: p3.y, z: p3.z });
    props.n1 = Vector.of({ x: n1.x, y: n1.y, z: n1.z });
    props.n2 = Vector.of({ x: n2.x, y: n2.y, z: n2.z });
    props.n3 = Vector.of({ x: n3.x, y: n3.y, z: n3.z });
    return SmoothTriangle.of(props);
  },
  triangle: (props) => {
    const { p1, p2, p3 } = props;
    props.p1 = Point.of({ x: p1.x, y: p1.y, z: p1.z });
    props.p2 = Point.of({ x: p2.x, y: p2.y, z: p2.z });
    props.p3 = Point.of({ x: p3.x, y: p3.y, z: p3.z });
    return Triangle.of(props);
  },
  csg: (props) => {
    props.left = SceneParser.parseShape(props.left);
    props.right = SceneParser.parseShape(props.right);
    return CsgOp.of({ ...props, type: props.op });
  },
};

const colors = {
  blue: Color.blue,
  white: Color.white,
  red: Color.red,
  yellow: Color.yellow,
  black: Color.black,
  purple: Color.purple,
  green: Color.green,
  cyan: Color.cyan,
};

const patterns = {
  check: CheckPattern.of,
  gradient: GradientPattern.of,
  radialGradient: RadialGradientPattern.of,
  ring: RingPattern.of,
  stripe: StripePattern.of,
};

export class SceneParser {
  static parse(scene) {
    const camera = SceneParser.parseCamera(scene);
    const world = SceneParser.parseWorld(scene);
    return [camera, world];
  }

  static parseCamera(scene) {
    const { width, height, fov } = scene.camera;
    let camera = Camera.of({ width, height, fov });

    if (scene.camera.transform) {
      let transform = SceneParser.getTransform(scene.camera.transform);
      camera = camera.setTransform(transform);
    }

    return camera;
  }

  static parseWorld(scene) {
    const lights = scene.world
      .filter((obj) => obj.type === "light")
      .map(SceneParser.parseLight);

    const objects = scene.world
      .filter((obj) => obj.type !== "light")
      .map(SceneParser.parseShape);

    return World.of({ lights, objects });
  }

  static parseLight(light) {
    if (light.color) {
      light.color = SceneParser.parseColor(light.color);
    }
    return Light.of({ position: Point.of(light.position), color: light.color });
  }

  static parseShape(shape) {
    const { type } = shape;
    const constructor = shapes[type];

    if (shape.material) {
      shape.material = SceneParser.parseMaterial(shape.material);
    }

    if (shape.transform) {
      shape.transform = SceneParser.getTransform(shape.transform);
      if (type === "plane") {
        console.log(shape.transform);
      }
    }

    return constructor(shape);
  }

  static parseMaterial(material) {
    if (material.color) {
      material.color = SceneParser.parseColor(material.color);
    }

    if (material.pattern) {
      material.pattern = SceneParser.parsePattern(material.pattern);
    }

    return Material.of(material);
  }

  static parsePattern(pattern) {
    const { type } = pattern;
    const constructor = patterns[type];
    const colors = pattern.colors.map((c) => SceneParser.parseColor(c));
    const transform = SceneParser.getTransform(pattern.transform);
    return constructor({ colors, transform });
  }

  static parseColor(color) {
    return colors[color] ?? Color.hex(color);
  }

  static getTransform(props) {
    let transform = Matrix.identity;

    for (let [type, args] of Object.entries(props)) {
      type = type.replace(/[0-9]/g, "");
      const transformFn = transformFns[type];
      const transformArgs = transformFnArgs[type]
        ? transformFnArgs[type](args)
        : args;
      transform = transform.multiply(transformFn(transformArgs));
    }

    return transform;
  }

  static createGroup(props) {
    if (props.objects) {
      props.objects = props.objects.map((o) => SceneParser.parseShape(o));
    }

    return Group.of(props);
  }
}
