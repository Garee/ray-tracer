export class Tuple {
  constructor(x, y, z, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  add(t) {
    const x = this.x + t.x;
    const y = this.y + t.y;
    const z = this.z + t.z;
    const w = this.w + t.w;
    return new Tuple(x, y, z, w);
  }

  subtract(t) {
    const x = this.x - t.x;
    const y = this.y - t.y;
    const z = this.z - t.z;
    const w = this.w - t.w;
    return new Tuple(x, y, z, w);
  }

  negate() {
    const t = new Tuple(0, 0, 0, this.w);
    return t.subtract(this);
  }

  multiply(scalar) {
    const x = this.x * scalar;
    const y = this.y * scalar;
    const z = this.z * scalar;
    return new Tuple(x, y, z, this.w);
  }

  divide(scalar) {
    const x = this.x / scalar;
    const y = this.y / scalar;
    const z = this.z / scalar;
    return new Tuple(x, y, z, this.w);
  }

  isPoint() {
    return !!this.w;
  }

  isVector() {
    return !this.w;
  }

  magnitude() {
    const x = this.x ** 2;
    const y = this.y ** 2;
    const z = this.z ** 2;
    return Math.sqrt(x + y + z);
  }

  normalize() {
    const x = this.x / this.magnitude();
    const y = this.y / this.magnitude();
    const z = this.z / this.magnitude();
    return new Tuple(x, y, z, this.w);
  }

  toArray() {
    return [[this.x], [this.y], [this.z], [this.w]];
  }
}
