import { Color, White, Green, Red, Blue, Black } from "./color";
import { Point } from "./point";
import { Light } from "./light";
import { World } from "./world";
import { Camera } from "./camera";
import {
  viewTransform,
  translation,
  scaling,
  rotationX,
  rotationZ,
} from "./transformations";
import { Vector } from "./vector";
import { Sphere } from "./sphere";
import { Material } from "./material";
import { Plane } from "./plane";
import { RingPattern } from "./patterns/ring";
import { GradientPattern } from "./patterns/gradient";
import { CheckPattern } from "./patterns/check";

(() => {
  let width = 100;
  let height = 50;
  const fov = Math.PI / 3;
  const light = new Light(new Point(-10, 10, -10), White);
  let camera = new Camera(width, height, fov).setTransform(
    viewTransform(
      new Point(0, 1.5, -5),
      new Point(0, 1, 0),
      new Vector(0, 1, 0)
    )
  );

  const sphere1 = new Sphere()
    .setMaterial(
      new Material({
        diffuse: 0.7,
        ambient: 0.2,
        pattern: new CheckPattern(White, Blue).setTransform(
          rotationZ(Math.PI / 2).multiply(scaling(0.01, 0.01, 0.01))
        ),
      })
    )
    .setTransform(translation(-0.5, 1, 0.5));

  const sphere2 = new Sphere()
    .setMaterial(
      new Material({
        diffuse: 0.7,
        ambient: 0.2,
        pattern: new GradientPattern(Red, Blue).setTransform(
          scaling(0.01, 0.01, 0.01)
        ),
      })
    )
    .setTransform(translation(1.5, 0.5, -0.5).multiply(scaling(0.5, 0.5, 0.5)));

  const sphere3 = new Sphere()
    .setMaterial(
      new Material({
        diffuse: 0.7,
        specular: 0.3,
        pattern: new RingPattern(Green, Black).setTransform(
          scaling(0.01, 0.01, 0.01)
        ),
      })
    )
    .setTransform(
      translation(-1.5, 0.33, -0.75).multiply(scaling(0.33, 0.33, 0.33))
    );

  const floorPlane = new Plane().setMaterial(
    new Material({
      color: new Color(0, 0.3, 0),
    })
  );

  const background = new Plane()
    .setMaterial(
      new Material({
        color: new Color(0, 0, 0.2),
      })
    )
    .setTransform(translation(0, 0, 10).multiply(rotationX(Math.PI / 2)));

  const world = new World([light])
    .addObject(floorPlane)
    .addObject(background)
    .addObject(sphere1)
    .addObject(sphere2)
    .addObject(sphere3);

  addEventListener("DOMContentLoaded", () => {
    initForm();
    raytrace();
  });

  function raytrace() {
    const onRowRender = (row) => {
      const el = document.getElementById("progress");
      const pc = (((row + 1) / width) * 100).toFixed(2);
      if (pc < 100) {
        el.innerText = `Rendering: ${pc}%`;
      } else {
        el.innerText = "";
      }
    };
    camera.renderAsync(world, onRowRender).then(draw);
  }

  function draw(frame) {
    const el = document.getElementById("canvas");
    const ctx = el.getContext("2d");

    const imageData = ctx.createImageData(frame.width, frame.height);
    frame.scalePixels().forEach((p, i) => {
      const idx = i * 4;
      imageData.data[idx] = p.red;
      imageData.data[idx + 1] = p.green;
      imageData.data[idx + 2] = p.blue;
      imageData.data[idx + 3] = 255;
    });

    ctx.putImageData(imageData, 0, 0);
  }

  function initForm() {
    const wInput = document.getElementById("width-input");
    const hInput = document.getElementById("height-input");
    const form = document.getElementById("render-form");
    const canvas = document.getElementById("canvas");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      width = wInput.value;
      height = hInput.value;
      canvas.width = width;
      canvas.height = height;

      camera = new Camera(width, height, fov).setTransform(
        viewTransform(
          new Point(0, 1.5, -5),
          new Point(0, 1, 0),
          new Vector(0, 1, 0)
        )
      );

      raytrace();
    });
  }
})();
