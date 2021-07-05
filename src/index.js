import { Point } from "./point";
import { Vector } from "./vector";
import { Canvas } from "./canvas";
import { Color } from "./color";

function Projectile(position, velocity) {
  return {
    position: position || new Point(0, 1, 0),
    velocity: velocity || new Vector(1, 1.8, 0).normalize().multiply(11.25),
  };
}

function Environment(gravity, wind) {
  return {
    gravity: gravity || new Vector(0, -0.1, 0),
    wind: wind || new Vector(-0.01, 0, 0),
  };
}

function tick(env, p) {
  const pos = p.position.add(p.velocity);
  const vel = p.velocity.add(env.gravity).add(env.wind);
  return new Projectile(pos, vel);
}

const env = new Environment();
let p = new Projectile();

const red = new Color(1, 0, 0);
const black = new Color(0, 0, 0);

const width = 900;
const height = 550;
let c = new Canvas(width, height).fill(black);

function render(c) {
  const el = document.getElementById("canvas");
  const ctx = el.getContext("2d");

  const imageData = ctx.createImageData(c.width, c.height);
  c.scalePixels().forEach((p, i) => {
    const idx = i * 4;
    imageData.data[idx] = p.red;
    imageData.data[idx + 1] = p.green;
    imageData.data[idx + 2] = p.blue;
    imageData.data[idx + 3] = 255;
  });

  ctx.putImageData(imageData, 0, 0);
}

const interval = setInterval(() => {
  p = tick(env, p);

  const x = Math.round(p.position.x);
  const y = c.height - Math.round(p.position.y);
  c = c.writePixel(x, y, red);

  if (p.position.y <= 0) {
    clearInterval(interval);
    render(c);
  }
});
