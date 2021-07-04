import { Point } from "./point";
import { Vector } from "./vector";

function Projectile(position, velocity) {
  return {
    position: position || new Point(0, 1, 0),
    velocity: velocity || new Vector(1, 1, 0).normalize(),
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

console.log("Start:", p.position);

const interval = setInterval(() => {
  p = tick(env, p);
  console.count("Tick");
  console.dir(p.position);
  if (p.position.y <= 0) {
    clearInterval(interval);
  }
}, 1000);
