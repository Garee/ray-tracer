export const defaultScene = {
  camera: {
    width: 200,
    height: 100,
    fov: 67.5,
    transform: {
      view: {
        from: {
          z: -4,
        },
        to: {},
        up: {
          y: 0.1,
        },
      },
    },
  },
  world: [
    {
      type: "light",
      position: {
        x: -10,
        y: 10,
        z: -10,
      },
    },
    {
      type: "sphere",
      material: {
        color: "blue",
        pattern: {
          type: "stripe",
          colors: ["blue", "red"],
          transform: {
            scale: {
              x: 0.2,
              y: 0.2,
              z: 0.2,
            },
            rotateZ: 67.5,
          },
        },
      },
    },
    {
      type: "plane",
      material: {
        color: "white",
        reflective: 0.7,
        diffuse: 0.9,
      },
      transform: {
        translate: {
          y: -1,
        },
      },
    },
  ],
  workers: 12,
};
