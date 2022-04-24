/* eslint no-unused-vars: "warn"*/

/** A Geometry Utility Library
 *  For Geometry Discovery Project
 *  by University of California, Irvine
 *
 * Geometry definition
 *  - Point is represented by a tuple [x, y]
 *  - Numbers are all doubles
 */

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

const findMidpoint = (pt0, pt1) => {
  return [(pt0[0] + pt1[0]) / 2, (pt0[1] + pt1[1]) / 2];
};

const findSlope = (pt0, pt1) => {
  if (pt0[0] != pt1[0]) {
    return (pt1[1] - pt0[1]) / (pt1[0] - pt0[0]);
  } else {
    return NaN;
  }
};

const isInside = (x1, y1, x2, y2, x3, y3, x, y) => {
  const A = area(x1, y1, x2, y2, x3, y3);
  const A1 = area(x, y, x2, y2, x3, y3);
  const A2 = area(x1, y1, x, y, x3, y3);
  const A3 = area(x1, y1, x2, y2, x, y);

  return Math.abs(A - A1 - A2 - A3) <= 0.0000001;
};

const findDistance = (pt0, pt1) => {
  return Math.sqrt((pt0[0] - pt1[0]) ** 2 + (pt0[1] - pt1[1]) ** 2);
};

const ptoPoint = (theta) => {
  return ptoPointRad(theta, ptoRadius);
};

const area = (x1, y1, x2, y2, x3, y3) => {
  return Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0;
};

const distToLine = (p, v, w) => {
  const l2 = findDistance(v, w);
  if (l2 === 0) return findDistance(p, v);
  const t =
    ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;

  return Math.sqrt(
    findDistance(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])])
  );
};

const pointAlongLine = (A, B, d) => {
  const dAB = findDistance(A, B);
  const Cx = ((B[0] - A[0]) * d) / dAB + A[0];
  const Cy = ((B[1] - A[1]) * d) / dAB + A[1];
  return [Cx, Cy];
};

const lineLineIntersection = (A, B, C, D) => {
  const a1 = B[1] - A[1];
  const b1 = A[0] - B[0];
  const c1 = a1 * A[0] + b1 * A[1];

  const a2 = D[1] - C[1];
  const b2 = C[0] - D[0];
  const c2 = a2 * C[0] + b2 * C[1];

  const determinant = a1 * b2 - a2 * b1;

  if (determinant == 0) {
    return null;
  } else {
    const x = (b2 * c1 - b1 * c2) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;
    return [x, y];
  }
};

const projectPoint2Line = (p, a, b) => {
  const atob = [b[0] - a[0], b[1] - a[1]];
  const atop = [p[0] - a[0], p[1] - a[1]];

  const len = atob[0] * atob[0] + atob[1] * atob[1];
  const dot = atop[0] * atob[0] + atop[1] * atob[1];

  const t = dot / len;

  return [a[0] + atob[0] * t, a[1] + atob[1] * t];
};

const drawFullLine = (pt, m, line) => {
  if (isNaN(m)) {
    m = 0;
  } else if (!isFinite(m)) {
    line.setAttributeNS(null, "x1", pt[0]);
    line.setAttributeNS(null, "y1", 0);
    line.setAttributeNS(null, "x2", pt[0]);
    line.setAttributeNS(null, "y2", CANVAS_HEIGHT);
    return null;
  }
  line.setAttributeNS(null, "x1", 0);
  line.setAttributeNS(null, "y1", -m * pt[0] + pt[1]);
  line.setAttributeNS(null, "x2", CANVAS_WIDTH);
  line.setAttributeNS(null, "y2", m * (CANVAS_WIDTH - pt[0]) + pt[1]);
};

const ptoPointRad = (theta, rad) => {
  return [rad * Math.cos(theta), -rad * Math.sin(theta)];
};

const drawLine = (a, b, l) => {
  l.setAttributeNS(null, "x1", a[0]);
  l.setAttributeNS(null, "y1", a[1]);
  l.setAttributeNS(null, "x2", b[0]);
  l.setAttributeNS(null, "y2", b[1]);
};

const makeString = (arr) => {
  return `${arr[0][0]},${arr[0][1]} ${arr[1][0]},${arr[1][1]} ${arr[2][0]},${arr[2][1]}`;
};

const makeSvgTriangle = (pt0, pt1, pt2, ptoTri) => {
  ptoTri.setAttributeNS(null, "points", makeString([pt0, pt1, pt2]));
};

const makeSvgCircle = (r, x, y) => {
  ptoCircle.setAttributeNS(r, x, y);
};

const getEquationFromPoint = (a, b) => {
  const m = (a[1] - b[1]) / (a[0] - b[0]);
  const bb = a[1] - m * a[0];
  return [m, bb];
};

const pedalPoint = (a, b, c, p) => {
  const equAB = getEquationFromPoint(a, b);
  const equAC = getEquationFromPoint(a, c);
  const equBC = getEquationFromPoint(b, c);

  const yAB = equAB[0] * p[0] + equAB[1];
  const yAC = equAC[0] * p[0] + equAC[1];
  const yBC = equBC[0] * p[0] + equBC[1];

  const abSign = yAB >= p[1];
  const acSign = yAC >= p[1];
  const bcSign = yBC >= p[1];
  if (abSign && acSign && bcSign) {
    return 1;
  }
  if (!abSign && acSign && bcSign) {
    return 2;
  }
  if (!abSign && !bcSign && acSign) {
    return 3;
  }
  if (!acSign && bcSign && abSign) {
    return 6;
  }
  if (!(abSign || bcSign || acSign)) {
    return 4;
  }
  if (!bcSign && !acSign && abSign) {
    return 5;
  }

  return 0;
};

const radiansToDegress = (r) => {
  const pi = 3.14;
  return r * (180 / pi);
};
