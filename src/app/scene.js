export const defaultScene = {
  camera: {
    width: 800,
    height: 600,
    fov: 45,
    transform: {
      view: {
        from: {
          x: -6,
          y: 6,
          z: -10,
        },
        to: {
          x: 6,
          z: 6,
        },
        up: {
          x: -0.45,
          y: 1,
        },
      },
    },
  },
  world: [
    {
      type: "light",
      position: {
        x: 50,
        y: 100,
        z: -50,
      },
    },
    {
      type: "cube",
      material: {
        color: "white",
        ambient: 1,
        diffuse: 0,
        specular: 0,
      },
      transform: {
        rotateY: 20,
        translate: {
          z: 500,
        },
        scale: {
          x: 5000,
          y: 5000,
          z: 1,
        },
      },
    },
    {
      type: "sphere",
      material: {
        color: "#5f678c",
        diffuse: 0.2,
        ambient: 0,
        specular: 1,
        shininess: 200,
        reflective: 0.7,
        transparency: 0.7,
        refractive: 1.5,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3.5,
          y: 3.5,
          z: 3.5,
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "white",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3,
          y: 3,
          z: 3,
        },
        translate: {
          x: 3, //4
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "#88d3e9",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3.5,
          y: 3.5,
          z: 3.5,
        },
        translate: {
          x: 4.5, //8.5
          y: 1, //1.5
          z: -0.5,
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "#ef5263",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3.5,
          y: 3.5,
          z: 3.5,
        },
        translate: {
          z: 2, //4
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "white",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 2,
          y: 2,
          z: 2,
        },
        translate: {
          x: 4,
          z: 4,
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "#5f678c",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3,
          y: 3,
          z: 3,
        },
        translate: {
          x: 6.5, //7.5
          y: 0.5,
          z: 4,
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "white",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3,
          y: 3,
          z: 3,
        },
        translate: {
          x: -0.25,
          y: 0.25,
          z: 5, //8
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "#88d3e9",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3.5,
          y: 3.5,
          z: 3.5,
        },
        translate: {
          x: 4,
          y: 0, //1
          z: 7.5,
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "#ef5263",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3,
          y: 3,
          z: 3,
        },
        translate: {
          x: 10,
          y: 1.5, //2
          z: 7.5,
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "white",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 2,
          y: 2,
          z: 2,
        },
        translate: {
          x: 10, //8
          y: 2,
          z: 12,
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "white",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 2,
          y: 2,
          z: 2,
        },
        translate: {
          x: 21,
          y: 1.5,
          z: 9,
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "#88d3e9",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3.5,
          y: 3.5,
          z: 3.5,
        },
        translate: {
          x: 0, //-0.5
          y: -2.5, //-5
          z: 0.25,
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "#ef5263",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3.5,
          y: 3.5,
          z: 3.5,
        },
        translate: {
          x: 2.5, //4
          y: -2, //-4
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "white",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3.5,
          y: 3.5,
          z: 3.5,
        },
        translate: {
          x: 5.5, //8.5
          y: -2.5, //-4
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "white",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3.5,
          y: 3.5,
          z: 3.5,
        },
        translate: {
          y: -2.5, //-4
          z: 3,
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "#5f678c",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3.5,
          y: 3.5,
          z: 3.5,
        },
        translate: {
          x: -0.5,
          y: -2.5,
          z: 5,
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "white",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3.5,
          y: 3.5,
          z: 3.5,
        },
        translate: {
          x: 1,
          y: -7,
          z: 4,
        },
      },
    },
    {
      type: "cube",
      material: {
        color: "white",
        diffuse: 0.7,
        ambient: 0.1,
        specular: 0,
        reflective: 0.1,
      },
      transform: {
        translate0: {
          x: 1,
          y: -1,
          z: 1,
        },
        scale0: {
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        scale: {
          x: 3.5,
          y: 3.5,
          z: 3.5,
        },
        translate: {
          x: -0.5,
          y: -5.5,
          z: 5,
        },
      },
    },
  ],
  workers: 12,
};
