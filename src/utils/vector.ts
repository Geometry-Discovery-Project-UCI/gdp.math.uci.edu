/* eslint no-unused-vars: "warn"*/

/* A simple math vector library used for geometry calculation
 * Contact Melissa Yu (melissajiayu@gmail.com) for any issues/bugs for this library
 */
  export class Vector {
    x: number;
    y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
    public get length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    public static sub(first: Vector, other: Vector) {
        return new Vector(first.x - other.x, first.y - other.y);
    }
    public static areEqual(first: Vector, other: Vector) {
      return Math.abs(Vector.sub(first, other).length) < 0.00000001;
    }
    public static areEqualNum(first: number, second: number) {
        return Math.abs(first - second) < 0.00000001;
    }
    public static add(first: Vector, other: Vector) {
      return new Vector(first.x + other.x, first.y + other.y);
    }
    public static scaleBy(first: Vector, number: number) {
      return new Vector(first.x * number, first.y * number);
    }
    public static dotProduct(first: Vector, other: Vector) {
      return first.x * other.x + first.y * other.y;
    }
    public static normalize(first: Vector) {
      return Vector.scaleBy(first, 1 / first.length);
    }
    public static haveSameDirectionWith(first: Vector, other: Vector) {
      const dotProduct = Vector.dotProduct(Vector.normalize(first), Vector.normalize(other));
      return Vector.areEqualNum(dotProduct, 1);
    }
    public static haveOppositeDirectionTo(first: Vector, other: Vector) {
        const dotProduct = Vector.dotProduct(Vector.normalize(first), Vector.normalize(other));
        return Vector.areEqualNum(dotProduct, -1);
    }
    public static isPerpendicularTo(first: Vector, other: Vector) {
        const dotProduct = Vector.dotProduct(Vector.normalize(first), Vector.normalize(other));
        return Vector.areEqualNum(dotProduct, 0);
    }
    // 2D vectors only
    public static crossProduct(first: Vector, other: Vector) {
      return first.x * other.y - first.y * other.x;
    }
    public static angleBetween(first: Vector, other: Vector) {
      return Math.acos(Vector.dotProduct(first, other) / (first.length * other.length));
    }
    public static rotate(first: Vector, theta: number) {
      return new Vector(
        first.x * Math.cos(theta) - first.y * Math.sin(theta),
        first.x * Math.sin(theta) + first.y * Math.cos(theta)
      );
    }
    public static negate(first: Vector) {
      return Vector.scaleBy(first, -1);
    }
    public static withLength(first: Vector, newLength: number) {
      return Vector.scaleBy(Vector.normalize(first), newLength);
    }
    public static projectOn(first: Vector, other: Vector) {
      const normalized = Vector.normalize(other);
      return Vector.scaleBy(normalized, Vector.dotProduct(first, normalized));
    }
    public static equalTo(first: Vector, other: Vector) {
      return Vector.areEqualNum(first.x, other.x) && Vector.areEqualNum(first.y, other.y);
    }
  }
