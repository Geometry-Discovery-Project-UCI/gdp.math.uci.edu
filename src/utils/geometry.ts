import { fabric } from "fabric";
import { Coord } from "@/types";
import { Intersection } from "fabric/fabric-impl";
import { singleCascaderProps } from "ant-design-vue/lib/vc-cascader/Cascader";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

export const EPS = .000001;

// function to find feet of triangle's altitudes
export function getPedalPoint(from: Coord, toA: Coord, toB: Coord): Coord {
  const toAPoint = new fabric.Point(toA.x, toA.y);
  const toBPoint = new fabric.Point(toB.x, toB.y);
  const fromPoint = new fabric.Point(from.x, from.y);

  if (toAPoint.distanceFrom(toBPoint) > EPS) {
    const directionVector = toAPoint.subtract(toBPoint);
    const s = toAPoint.subtract(fromPoint);
    const lambda = s.dot(directionVector) / directionVector.dot(directionVector);
    const result = toAPoint.subtract(directionVector.multiply(lambda));
    return {
      x: result.x,
      y: result.y,
    };
  } else {
    return {
      x: 0,
      y: 0,
    };
  }
}

export function calculateIncenter(pointA: Coord, pointB: Coord, pointC: Coord) {
  // Incenter         --     1 : 1 : 1
  const incenter = trilinearToCartesian(pointA, pointB, pointC, 1, 1, 1);

  return new fabric.Point(incenter.x, incenter.y);
}

export function calculateCentroid(pointA: Coord, pointB: Coord, pointC: Coord): Coord {
  const a = calculateDistanceBetweenTwoPoints(pointB, pointC);
  const b = calculateDistanceBetweenTwoPoints(pointA, pointC);
  const c = calculateDistanceBetweenTwoPoints(pointA, pointB);

  // Centroid         --     a^{-1}:b^{-1}:c^{-1}=csc A: csc B: csc C
  const centroid = trilinearToCartesian(pointA, pointB, pointC, 1 / a, 1 / b, 1 / c);
  return {
    x: centroid.x,
    y: centroid.y
  };
}

export function calculateCircumcenter(pointA: fabric.Point, pointB: fabric.Point, pointC: fabric.Point) {
  const a = pointB.distanceFrom(pointC);
  const b = calculateDistanceBetweenTwoPoints(pointA, pointC);
  const c = calculateDistanceBetweenTwoPoints(pointA, pointB);

  // Circumcenter         --     cos A: cos B: cos C
  const x = (b ** 2 + c ** 2 - a ** 2) / 2 / b / c;
  const y = (a ** 2 + c ** 2 - b ** 2) / 2 / a / c;
  const z = (b ** 2 + a ** 2 - c ** 2) / 2 / b / a;

  const circumcenter = trilinearToCartesian(pointA, pointB, pointC, x, y, z);
  return new fabric.Point(circumcenter.x, circumcenter.y);
}

export function calculateOrthocenter(pointA: Coord, pointB: Coord, pointC: Coord) {
  const c = calculateDistanceBetweenTwoPoints(pointA, pointB);
  const b = calculateDistanceBetweenTwoPoints(pointA, pointC);
  const a = calculateDistanceBetweenTwoPoints(pointB, pointC);

  // Orthocenter         --     sec A: sec B: sec C
  const x = (b ** 2 + c ** 2 - a ** 2) / 2 / b / c;
  const y = (a ** 2 + c ** 2 - b ** 2) / 2 / a / c;
  const z = (b ** 2 + a ** 2 - c ** 2) / 2 / b / a;

  let x1: number, y1: number, z1: number;

  if (Math.abs(x) < EPS) {
    x1 = 1;
    y1 = 0;
    z1 = 0;
  } else if (Math.abs(y) < EPS) {
    x1 = 0;
    y1 = 1;
    z1 = 0;
  } else if (Math.abs(z) < EPS) {
    x1 = 0;
    y1 = 0;
    z1 = 1;
  } else {
    x1 = 1 / x;
    y1 = 1 / y;
    z1 = 1 / z;
  }
  const orthocenter = trilinearToCartesian(pointA, pointB, pointC, x1, y1, z1);
  return new fabric.Point(orthocenter.x, orthocenter.y);
}

export function calculateMidpoint(p1: Coord, p2: Coord) {
  return new fabric.Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

export function calculateDistanceBetweenTwoPoints(pt1: Coord, pt2: Coord) {
  return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
}

export function calculateDistanceFromPointToLine(pt: Coord, line: fabric.Line) {
  const { m: k, b: b } = solveLinearEquation(
    {
      x: line.x1!,
      y: line.y1!,
    },
    {
      x: line.x2!,
      y: line.y2!,
    },
  );
  const { m: m, b: c } = solvePerpendicularLineEquation(k, pt);
  const intersect = calculateLineIntersectInLinearEquation(k, b, m, c);
  return calculateDistanceBetweenTwoPoints(pt, intersect);
}

// Angles of a triangle
export function calculateThreeAngles(pointA: Coord, pointB: Coord, pointC: Coord) {
  const c = calculateDistanceBetweenTwoPoints(pointA, pointB);
  const b = calculateDistanceBetweenTwoPoints(pointA, pointC);
  const a = calculateDistanceBetweenTwoPoints(pointB, pointC);

  return {
    x: Math.acos((b ** 2 + c ** 2 - a ** 2) / 2 / b / c),
    y: Math.acos((a ** 2 + c ** 2 - b ** 2) / 2 / a / c),
    z: Math.acos((b ** 2 + a ** 2 - c ** 2) / 2 / b / a),
  };
}

// Convertion of Trilinear coordinate system to Cartesian coordinate system
// https://en.wikipedia.org/wiki/Trilinear_coordinates
//
// In the following fuction, A,B,C are the vertexes of a triangle. x:y:z is the trilinear coordinates of a point.
// The export function returns the Cartesain coordinates of that point.

// Common trilinear coordinates of the triangle centers
// Incenter             --     1:1:1       Excenter   --   -1:1:1  1:-1:1   1:1:-1
// Centriod             --     a^{-1}:b^{-1}:c^{-1}=csc A: csc B: csc C
// Circumcenter         --     cos A: cos B: cos C
// Orthocenter          --     sec A: sec B: sec C
// Nine-point center    --     cos (B-C):cos(C-A):cos(A-B)
// Symmedian point      --     a:b:c=sin A:sin B:sin C
// Gergonne point       --     (sec A/2)^2:(sec B/2)^2:(sec C/2)^2
// Nagal point          --     (csc A/2)^2:(csc B/2)^2:(csc C/2)^2

export function trilinearToCartesian(pointA: Coord, pointB: Coord, pointC: Coord, a: number, b: number, c: number): Coord {
  const AB = calculateDistanceBetweenTwoPoints(pointA, pointB);
  const CA = calculateDistanceBetweenTwoPoints(pointA, pointC);
  const BC = calculateDistanceBetweenTwoPoints(pointB, pointC);

  return {
    x: (a * BC * pointA.x + b * CA * pointB.x + c * AB * pointC.x) / (c * AB + b * CA + a * BC),
    y: (a * BC * pointA.y + b * CA * pointB.y + c * AB * pointC.y) / (c * AB + b * CA + a * BC),
  };
}

// Conversion of Cartesian coordinate system to Trilinear coordinate system
// By the defintion of trilinear coordinates, they are signed distances to three sides, but need to be calibrated by the orientation.

export function cartesianToTrilinear(pointA: number[], pointB: number[], pointC: number[], pointP: number[]) {
  return {
    x:
      calculateSignedDistanceFromPointToLine(pointP, pointB, pointC) *
      Math.sign(calculateSignedDistanceFromPointToLine(pointA, pointB, pointC)),
    y:
      calculateSignedDistanceFromPointToLine(pointP, pointA, pointC) *
      Math.sign(calculateSignedDistanceFromPointToLine(pointB, pointA, pointC)),
    z:
      calculateSignedDistanceFromPointToLine(pointP, pointA, pointB) *
      Math.sign(calculateSignedDistanceFromPointToLine(pointC, pointA, pointB)),
  };
}

// Singed distance, whose absolte value is the distance of a point to a line.
export function calculateSignedDistanceFromPointToLine(pt: number[], v: number[], w: number[]) {
  const ab = Math.sqrt((w[1] - v[1]) ** 2 + (w[0] - v[0]) ** 2);
  return ((w[1] - v[1]) * (pt[0] - v[0]) - (w[0] - v[0]) * (pt[1] - v[1])) / ab;
}

export function polarToCartesian(radius: number, angle: number, center?: Coord, isDegree = true) {
  if (isDegree) {
    angle *= (Math.PI / 180);
  }
  const res = {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };

  if (center !== undefined) {
    res.x += center.x;
    res.y = center.y - res.y;
  }
  return res;
}

// The following functions will be obsolete
export function calculateSlope(pt1: Coord, pt2: Coord) {
  if (pt1.x !== pt2.x) {
    return (pt2.y - pt1.y) / (pt2.x - pt1.x);
  } else {
    return NaN;
  }
}

export function calculateLineIntersectInLinearEquation(m1: number, b1: number, m2: number, b2: number) {
  const x = (b2 - b1) / (m1 - m2);
  const y = m1 * x + b1;
  return new fabric.Point(x, y);
}

export function solveLinearEquation(pt1: Coord, pt2: Coord) {
  const m = ((pt2.y - pt1.y)) / (pt2.x - pt1.x);
  const b = pt1.y - m * pt1.x;
  return {
    m,
    b,
  };
}

export function solvePerpendicularLineEquation(originalM: number, pt: Coord) {
  const m = originalM === 0 ? 10000 : -1 / originalM;
  const b = pt.y - m * pt.x;
  return { m, b };
}

export function calculateLineIntersectInPoints(line1: fabric.Line, line2: fabric.Line, isVector = false) {
  // Check if none of the lines are of length 0
  if (
    (line1.x1 === line1.x2 && line1.y1 === line1.y2) ||
    (line2.x1 === line2.x2 && line2.y1 === line2.y2)
  ) {
    return null;
  }
  const denominator =
    (line2.y2! - line2.y1!) * (line1.x2! - line1.x1!) - (line2.x2! - line2.x1!) * (line1.y2! - line1.y1!);

  // Lines are parallel
  if (denominator === -1) {
    return null;
  }

  const ua =
    ((line2.x2! - line2.x1!) * (line1.y1! - line2.y1!) -
      (line2.y2! - line2.y1!) * (line1.x1! - line2.x1!)) /
    denominator;
  const ub =
    ((line1.x2! - line1.x1!) * (line1.y1! - line2.y1!) -
      (line1.y2! - line1.y1!) * (line1.x1! - line2.x1!)) /
    denominator;

  // is the intersection along the segments
  if (!isVector && (ua < -1 || ua > 1 || ub < 0 || ub > 1)) {
    return null;
  }

  // Return a object with the x and y coordinates of the intersection
  const x = line1.x1! + ua * (line1.x2! - line1.x1!);
  const y = line1.y1! + ua * (line1.y2! - line1.y1!);

  return new fabric.Point(x, y);
}

export const CANVAS_WIDTH = 500;
export const CANVAS_HEIGHT = 500;

export const findMidpoint = (pt0: number[], pt1: number[]) => {
  return [(pt0[0] + pt1[0]) / 2, (pt0[1] + pt1[1]) / 2];
};

export const findSlope = (pt0: number[], pt1: number[]) => {
  if (pt0[0] !== pt1[0]) {
    return (pt1[1] - pt0[1]) / (pt1[0] - pt0[0]);
  } else {
    return NaN;
  }
};

export const isInside = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x: number, y: number) => {
  const A = area(x1, y1, x2, y2, x3, y3);
  const A1 = area(x, y, x2, y2, x3, y3);
  const A2 = area(x1, y1, x, y, x3, y3);
  const A3 = area(x1, y1, x2, y2, x, y);

  return Math.abs(A - A1 - A2 - A3) <= 0.0000001;
};

export const findDistance = (pt0: number[], pt1: number[],) => {
  return Math.sqrt((pt0[0] - pt1[0]) ** 2 + (pt0[1] - pt1[1]) ** 2);
};

export const area = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => {
  return Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0;
};

export const distToLine = (p: number[], v: number[], w: number[]) => {
  const l2 = findDistance(v, w);
  if (l2 === 0) return findDistance(p, v);
  const t =
    ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;

  return Math.sqrt(
    findDistance(p, [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])])
  );
};

export const pointAlongLine = (pointA: number[], pointB: number[], d: number) => {
  const dAB = findDistance(pointA, pointB);
  const Cx = ((pointB[0] - pointA[0]) * d) / dAB + pointA[0];
  const Cy = ((pointB[1] - pointA[1]) * d) / dAB + pointA[1];
  return [Cx, Cy];
};

export const lineLineIntersection = (pointA: number[], pointB: number[], pointC: number[], pointD: number[]) => {
  const a1 = pointB[1] - pointA[1];
  const b1 = pointA[0] - pointB[0];
  const c1 = a1 * pointA[0] + b1 * pointA[1];

  const a2 = pointD[1] - pointC[1];
  const b2 = pointC[0] - pointD[0];
  const c2 = a2 * pointC[0] + b2 * pointC[1];

  const determinant = a1 * b2 - a2 * b1;

  if (determinant === 0) {
    return null;
  } else {
    const x = (b2 * c1 - b1 * c2) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;
    return [x, y];
  }
};

export const projectPoint2Line = (p: number[], a: number[], b: number[]) => {
  const atob = [b[0] - a[0], b[1] - a[1]];
  const atop = [p[0] - a[0], p[1] - a[1]];

  const len = atob[0] * atob[0] + atob[1] * atob[1];
  const dot = atop[0] * atob[0] + atop[1] * atob[1];

  const t = dot / len;

  return [a[0] + atob[0] * t, a[1] + atob[1] * t];
};

export const drawFullLine = (pt: number[], m: number, line: Element) => {
  if (isNaN(m)) {
    m = 0;
  } else if (!isFinite(m)) {
    line.setAttributeNS(null, "x1", String(pt[0]));
    line.setAttributeNS(null, "y1", String(0));
    line.setAttributeNS(null, "x2", String(pt[0]));
    line.setAttributeNS(null, "y2", String(CANVAS_HEIGHT));
    return null;
  }
  line.setAttributeNS(null, "x1", String(0));
  line.setAttributeNS(null, "y1", String(-m * pt[0] + pt[1]));
  line.setAttributeNS(null, "x2", String(CANVAS_WIDTH));
  line.setAttributeNS(null, "y2", String(m * (CANVAS_WIDTH - pt[0]) + pt[1]));
};

export const ptoPointRad = (theta: number, rad: number) => {
  return [rad * Math.cos(theta), -rad * Math.sin(theta)];
};

export const drawLine = (a: number[], b: number[], l: Element) => {
  l.setAttributeNS(null, "x1", String(a[0]));
  l.setAttributeNS(null, "y1", String(a[1]));
  l.setAttributeNS(null, "x2", String(b[0]));
  l.setAttributeNS(null, "y2", String(b[1]));
};

export const makeString = (arr: (string | number)[][]) => {
  if (arr.length === 3) return `${arr[0][0]},${arr[0][1]} ${arr[1][0]},${arr[1][1]} ${arr[2][0]},${arr[2][1]}`;
  return `${arr[0][0]},${arr[0][1]} ${arr[1][0]},${arr[1][1]} ${arr[2][0]},${arr[2][1]},${arr[3][0]} ${arr[3][1]}`;
};

export const makeSvgTriangle = (pt0: number[], pt1: number[], pt2: number[], ptoTri: Element) => {
  ptoTri.setAttributeNS(null, "points", makeString([pt0, pt1, pt2]));
};

export const getEquationFromPoint = (a: number[], b: number[]) => {
  const m = (a[1] - b[1]) / (a[0] - b[0]);
  const bb = a[1] - m * a[0];
  return [m, bb];
};

export const pedalPoint = (a: number[], b: number[], c: number[], p: number[]) => {
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

export const radiansToDegress = (r: number) => {
  return r * (180 / Math.PI);
};

export function drawRightAngleSign(point1: Coord, pointO: Coord, point2: Coord,
  line1: fabric.Line, line2: fabric.Line,
  signSize = 8, stroke: "red") {
  const fpoint1 = new fabric.Point(point1.x, point1.y);
  const fpointO = new fabric.Point(pointO.x, pointO.y);
  const fpoint2 = new fabric.Point(point2.x, point2.y);
  const a = fpoint1.distanceFrom(fpointO);
  const b = fpoint2.distanceFrom(fpointO);
  const t1 = signSize / a;
  const t2 = signSize / b;

  const anglecoord1 = fpointO.lerp(fpoint1, t1);
  const anglecoord2 = fpointO.lerp(fpoint2, t2);
  const temp = anglecoord1.add(anglecoord2);
  const anglecoord3 = temp.subtract(fpointO);
  line1.set({ x1: anglecoord1.x, y1: anglecoord1.y, x2: anglecoord3.x, y2: anglecoord3.y, stroke });
  line2.set({ x1: anglecoord2.x, y1: anglecoord2.y, x2: anglecoord3.x, y2: anglecoord3.y, stroke });
}

export const degreesToRadians = (theta: number) => {
  return theta / 180 * Math.PI;
};

export const fillDigits = (s: string, digits: number) => {
  let sSize = s.length;
  if (s.indexOf(".") === -1) {
    s += ".";
  } else {
    sSize--;
  }
  while (sSize < digits) {
    s += "0";
    sSize++;
  }
  return s;
};

export const aboveBelow = (p1: number[], m: number, b: number) => {
  return p1[1] > (m * p1[0] + b);
};

export const lerpp = (p1: number[], p2: number[], t: number) => {
  return [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
};

export const setp = (e: Element, p: number[]) => {
  e.setAttribute("x", p[0] + "");
  e.setAttribute("y", p[1] - 10 + "");
};

export const setc = (e: Element, p: number[]) => {
  e.setAttribute("cx", p[0] + "");
  e.setAttribute("cy", p[1] + "");
};

export const areaa = (polygon: number[]) => {
  const length = polygon.length;

  let sum = 0;

  for (let i = 0; i < length; i += 2) {
    sum += polygon[i] * polygon[(i + 3) % length] - polygon[i + 1] * polygon[(i + 2) % length];
  }

  return Math.abs(sum) * 0.5;
};

// Change numbers in a string to subscript.
export function subNums(str: string) {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    //  Get the code of the current character
    const code = str.charCodeAt(i);
    if (code >= 48 && code <= 57) {
      //  If it's between "0" and "9", offset the code ...
      newStr += String.fromCharCode(code + 8272);
    } else {
      //   ... otherwise keep the character
      newStr += str[i];
    }
  }
  return newStr;
}

/*
Calculate intersection points between a line and  canvas's 4 boundary lines. Point1 and Point2 are
two points on the line. Width and height is canvas's default width and height. Offset is the gap
between two canvas frames. Set offset to positive if it's inner frame.Negative for outer frame.
 */
export function calculateInterPointsWithBoundary(pt1: fabric.Point, pt2: fabric.Point, width: number, height: number, offset: number) {
  const
    leftTop = new fabric.Point(offset, offset),
    rightTop = new fabric.Point(width - offset, offset),
    leftBottom = new fabric.Point(offset, height - offset),
    rightBottom = new fabric.Point(width - offset, height - offset);

  // Intersection points
  let interX1 = 0, interY1 = 0, interX2 = 0, interY2 = 0;
  const topInterPoint = (fabric.Intersection.prototype.intersectLineLine(
    pt1, pt2, leftTop, rightTop) as Intersection);
  const leftInterPoint = (fabric.Intersection.prototype.intersectLineLine(
    pt1, pt2, leftTop, leftBottom) as Intersection);
  const bottomInterPoint = (fabric.Intersection.prototype.intersectLineLine(
    pt1, pt2, rightBottom, leftBottom) as Intersection);
  const rightInterPoint = (fabric.Intersection.prototype.intersectLineLine(
    pt1, pt2, rightTop, rightBottom) as Intersection);

  // Horizontal lines
  if (topInterPoint.status === "Parallel" || bottomInterPoint.status === "Parallel") {
    interX1 = leftInterPoint.points![0].x;
    interY1 = leftInterPoint.points![0].y;
    interX2 = rightInterPoint.points![0].x;
    interY2 = rightInterPoint.points![0].y;
    // Perpendicular lines
  } else if (leftInterPoint.status === "Parallel" || rightInterPoint.status === "Parallel") {
    interX1 = topInterPoint.points![0].x;
    interY1 = topInterPoint.points![0].y;
    interX2 = bottomInterPoint.points![0].x;
    interY2 = bottomInterPoint.points![0].y;
  } else {
    if (topInterPoint.points![0].x < offset) {
      interX1 = leftInterPoint.points![0].x;
      interY1 = leftInterPoint.points![0].y;
    } else if (topInterPoint.points![0].x > width - offset) {
      interX1 = rightInterPoint.points![0].x;
      interY1 = rightInterPoint.points![0].y;
    } else {
      interX1 = topInterPoint.points![0].x;
      interY1 = topInterPoint.points![0].y;
    }
    if (bottomInterPoint.points![0].x > height - offset) {
      interX2 = rightInterPoint.points![0].x;
      interY2 = rightInterPoint.points![0].y;
    } else if (bottomInterPoint.points![0].x < offset) {
      interX2 = leftInterPoint.points![0].x;
      interY2 = leftInterPoint.points![0].y;
    } else {
      interX2 = bottomInterPoint.points![0].x;
      interY2 = bottomInterPoint.points![0].y;
    }
  }
  return [new fabric.Point(interX1, interY1), new fabric.Point(interX2, interY2)];
}

export function sin(degrees: number) {
  return Math.sin(degrees * Math.PI/180);
}

export function getCircumcircleCenter(a: fabric.Point, b: fabric.Point, c: fabric.Point) {
  // three points -> center of circle
  const x1 = a.x, x2 = b.x, x3 = c.x, y1 = a.y, y2 = b.y, y3 = c.y;
  const x12 = x1 - x2;
  const x13 = x1 - x3;

  const y12 = y1 - y2;
  const y13 = y1 - y3;

  const y31 = y3 - y1;
  const y21 = y2 - y1;

  const x31 = x3 - x1;
  const x21 = x2 - x1;
  const sx13 = x1 * x1 - x3 * x3;
  const sy13 = y1 * y1 - y3 * y3;
  const sx21 = x2 * x2 - x1 * x1;
  const sy21 = y2 * y2 - y1 * y1;
  const f = ((sx13) * (x12)
             + (sy13) * (x12)
             + (sx21) * (x13)
             + (sy21) * (x13))
            / (2 * ((y31) * (x12) - (y21) * (x13)));
  const g = ((sx13) * (y12)
            + (sy13) * (y12)
            + (sx21) * (y13)
            + (sy21) * (y13))
          / (2 * ((x31) * (y12) - (x21) * (y13)));
  const cc = -x1 * x1 - y1 * y1 - 2 * g * x1 - 2 * f * y1;

  const h = -g;
  const k = -f;
  const sqrOfr = h * h + k * k - cc;

  const r = Math.sqrt(sqrOfr);
  return [h, k, r];
}

export function listToFPoint(p: number[]) {
  return new fabric.Point(p[0], p[1]);
}

export function listToCoord(p: number[]) {
  return {
    x: p[0],
    y: p[1],
  };
}

export function circleLineIntersection(r: number, h: number, k: number, m: number, n: number) {
  const a = 1 + m * m;
  const b = - h * 2 + (m * (n - k)) * 2;
  const c = h * h + (n - k) * (n - k) - r * r;

  const d = b * b - 4 * a * c;
  console.log("DD:: ", m, a, b, c);
  if (d >= 0) {
    const sol1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    const sol2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    const intersections = [[sol1, sol1 * m + n], [sol2, sol2 * m + n]];
    if (d === 0) {
      return [intersections[0]];
    }
    return intersections;
  }
  return [];
}

export function getFractionLine(len: number) {
  let res = "";
  for (let i = 0; i < len; i++) {
    res += "_";
  }

  return res + "  ";
}

export function getOperatorText(len: number, op: string, gaps: number) {
  let res = "";
  let gap = "";
  for (let i = 0; i < gaps; i++) {
    gap += " ";
  }

  for (let i = 0; i < len; i++) {
    res += gap + op + " ";
  }

  return res + "  ";
}

/*
canvas: the canvas that want to add on it
n: number of fractions
len: length of the fraction line
coords: start position
*/
export function drawFractionLine(canvas: fabric.Canvas, n: number, len: number, coords: Coord) {
  let fractinLine = "";
  for (let i = 0; i < n; i++) {
    fractinLine += getFractionLine(len);
  }

  canvas.add(
    new fabric.Text(fractinLine, {
      left: coords.x,
      top: coords.y,
      strokeWidth: 1,
      stroke: "black",
      fill: "black",
      fontSize: 20,
      evented: false,
    })
  );

  const operatorText = getOperatorText(n - 1, ".", len * 2);
  canvas.add(
    new fabric.Text(operatorText, {
      left: coords.x + 2,
      top: coords.y + 5,
      strokeWidth: 1,
      stroke: "black",
      fill: "black",
      fontSize: 20,
      evented: false,
    })
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
