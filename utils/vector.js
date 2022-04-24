/* eslint no-unused-vars: "warn"*/

/* A simple math vector library used for geometry calculation
 * Contact melissa yu (melissajiayu@gmail.com) for any issues/bugs for this library
 */

function getLineIntersection(P, v, Q, w) {
  const u = P.sub(Q);
  const t = w.crossProduct(u) / v.crossProduct(w);
  return P.add(v.scaleBy(t));
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  areEqual(one, other) {
    return Math.abs(one - other) < 0.00000001;
  }

  add(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  sub(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  scaleBy(number) {
    return new Vector(this.x * number, this.y * number);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  dotProduct(other) {
    return this.x * other.x + this.y * other.y;
  }

  normalize() {
    return this.scaleBy(1 / this.length());
  }

  haveSameDirectionWith(other) {
    const dotProduct = this.normalize().dotProduct(other.normalize());
    return areEqual(dotProduct, 1);
  }

  haveOppositeDirectionTo(other) {
    const dotProduct = this.normalize().dotProduct(other.normalize());
    return areEqual(dotProduct, -1);
  }

  isPerpendicularTo(other) {
    const dotProduct = this.normalize().dotProduct(other.normalize());
    return areEqual(dotProduct, 0);
  }

  // 2D vectors only
  crossProduct(other) {
    return this.x * other.y - this.y * other.x;
  }

  angleBetween(other) {
    return Math.acos(this.dotProduct(other) / (this.length() * other.length()));
  }

  rotate(theta) {
    return new Vector(
      this.x * Math.cos(theta) - this.y * Math.sin(theta),
      this.x * Math.sin(theta) + this.y * Math.cos(theta)
    );
  }

  negate() {
    return this.scaleBy(-1);
  }

  withLength(newLength) {
    return this.normalize().scaleBy(newLength);
  }

  projectOn(other) {
    const normalized = other.normalize();
    return normalized.scaleBy(this.dotProduct(normalized));
  }

  equalTo(other) {
    return areEqual(this.x, other.x) && this.areEqual(this.y, other.y);
  }
}
