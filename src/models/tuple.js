export class Tuple {
  constructor(x = 0, y = 0, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static of({ x = 0, y = 0, z = 0, w = 0 } = {}) {
    return new Tuple(x, y, z, w);
  }

  add({ x, y, z, w }) {
    return Tuple.of({
      x: this.x + x,
      y: this.y + y,
      z: this.z + z,
      w: this.w + w,
    });
  }

  subtract({ x, y, z, w }) {
    return Tuple.of({
      x: this.x - x,
      y: this.y - y,
      z: this.z - z,
      w: this.w - w,
    });
  }

  negate() {
    return Tuple.of({ w: this.w }).subtract(this);
  }

  multiply(scalar) {
    return Tuple.of({
      x: this.x * scalar,
      y: this.y * scalar,
      z: this.z * scalar,
      w: this.w,
    });
  }

  divide(scalar) {
    return Tuple.of({
      x: this.x / scalar,
      y: this.y / scalar,
      z: this.z / scalar,
      w: this.w,
    });
  }

  isPoint() {
    return this.w === 1;
  }

  isVector() {
    return this.w === 0;
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
    return Tuple.of({ x, y, z, w: this.w });
  }

  dot({ x, y, z }) {
    return this.x * x + this.y * y + this.z * z;
  }

  cross({ x, y, z }) {
    return Tuple.of({
      x: this.y * z - this.z * y,
      y: this.z * x - this.x * z,
      z: this.x * y - this.y * x,
      w: this.w,
    });
  }

  reflect(normal) {
    return this.subtract(normal.multiply(this.dot(normal) * 2));
  }

  get array() {
    return [[this.x], [this.y], [this.z], [this.w]];
  }

  get fixed() {
    return this.array.map((x) => x[0].toFixed(3));
  }
}
