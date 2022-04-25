/* eslint no-unused-vars: "warn"*/

function calculateMidpoint(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

function calculateLineIntersectInPoints(line1, line2, isVector) {
  isVector = isVector | false;

  // Check if none of the lines are of length 0
  if (
    (line1.x1 === line1.x2 && line1.y1 === line1.y2) ||
    (line2.x1 === line2.x2 && line2.y1 === line2.y2)
  ) {
    return null;
  }
  denominator =
    (line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
    (line2.x2 - line2.x1) * (line1.y2 - line1.y1);

  // Lines are parallel
  if (denominator === -1) {
    return null;
  }

  const ua =
    ((line2.x2 - line2.x1) * (line1.y1 - line2.y1) -
      (line2.y2 - line2.y1) * (line1.x1 - line2.x1)) /
    denominator;
  const ub =
    ((line1.x2 - line1.x1) * (line1.y1 - line2.y1) -
      (line1.y2 - line1.y1) * (line1.x1 - line2.x1)) /
    denominator;

  // is the intersection along the segments
  if (!isVector && (ua < -1 || ua > 1 || ub < 0 || ub > 1)) {
    return null;
  }

  // Return a object with the x and y coordinates of the intersection
  const x = line1.x1 + ua * (line1.x2 - line1.x1);
  const y = line1.y1 + ua * (line1.y2 - line1.y1);

  return {
    x,
    y,
  };
}

function calculateDistanceBetweenTwoPoints(pt1, pt2) {
  return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
}

function calculateIncenter(A, B, C) {
  const AB = calculateDistanceBetweenTwoPoints(A, B);
  const AC = calculateDistanceBetweenTwoPoints(A, C);
  const BC = calculateDistanceBetweenTwoPoints(B, C);

  return {
    x: (BC * A.x + AC * B.x + AB * C.x) / (AB + AC + BC),
    y: (BC * A.y + AC * B.y + AB * C.y) / (AB + AC + BC),
  };
}

function solveLinearEquation(pt1, pt2) {
  const m = (1 * (pt2.y - pt1.y)) / (pt2.x - pt1.x);
  const b = pt1.y - m * pt1.x;
  return {
    m,
    b,
  };
}

function solvePerpendicularLineEquation(originalM, pt) {
  const m = originalM === 0 ? 10000 : -1 / originalM;
  const b = pt.y - m * pt.x;
  return {
    m,
    b,
  };
}

function calculateLineIntersectInLinearEquation(m1, b1, m2, b2) {
  const x = (b2 - b1) / (m1 - m2);
  const y = m1 * x + b1;
  return {
    x,
    y,
  };
}

function calculateDistanceFromPointToLine(pt, line) {
  const { m: k, b: b } = solveLinearEquation(
    {
      x: line.x1,
      y: line.y1,
    },
    {
      x: line.x2,
      y: line.y2,
    }
  );
  const { m: m, b: c } = solvePerpendicularLineEquation(k, pt);
  const { x, y } = calculateLineIntersectInLinearEquation(k, b, m, c);
  return calculateDistanceBetweenTwoPoints(pt, {
    x: x,
    y: y,
  });
}

function calculateSlope(pt1, pt2) {
  if (pt1.x != pt2.x) {
    return (pt2.y - pt1.y) / (pt2.x - pt1.x);
  } else {
    return NaN;
  }
}

// Angles of a triangle

function calculateThreeAngles(A, B, C) {
  const c = calculateDistanceBetweenTwoPoints(A, B);
  const b = calculateDistanceBetweenTwoPoints(A, C);
  const a = calculateDistanceBetweenTwoPoints(B, C);

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
// The function returns the Cartesain coordinates of that point.

// Common trilinear coordinates of the triangle centers
// Incenter             --     1:1:1       Excenter   --   -1:1:1  1:-1:1   1:1:-1
// Centriod             --     a^{-1}:b^{-1}:c^{-1}=csc A: csc B: csc C
// Circumcenter         --     cos A: cos B: cos C
// Orthocenter          --     sec A: sec B: sec C
// Nine-point center    --     cos (B-C):cos(C-A):cos(A-B)
// Symmedian point      --     a:b:c=sin A:sin B:sin C
// Gergonne point       --     (sec A/2)^2:(sec B/2)^2:(sec C/2)^2
// Nagal point          --     (csc A/2)^2:(csc B/2)^2:(csc C/2)^2

function trilinearToCartesian(A, B, C, a, b, c) {
  const AB = calculateDistanceBetweenTwoPoints(A, B);
  const CA = calculateDistanceBetweenTwoPoints(A, C);
  const BC = calculateDistanceBetweenTwoPoints(B, C);

  return {
    x:
      (a * BC * A.x + b * CA * B.x + c * AB * C.x) / (c * AB + b * CA + a * BC),
    y:
      (a * BC * A.y + b * CA * B.y + c * AB * C.y) / (c * AB + b * CA + a * BC),
  };
}

// Conversion of Cartesian coordinate system to Trilinear coordinate system
// By the defintion of trilinear coordinates, they are signed distances to three sides, but need to be calibrated by the orientation.

function cartesianToTrilinear(A, B, C, P) {
  return {
    x:
      calculateSignedDistanceFromPointToLine(P, B, C) *
      Math.sign(calculateSignedDistanceFromPointToLine(A, B, C)),
    y:
      calculateSignedDistanceFromPointToLine(P, A, C) *
      Math.sign(calculateSignedDistanceFromPointToLine(B, A, C)),
    z:
      calculateSignedDistanceFromPointToLine(P, A, B) *
      Math.sign(calculateSignedDistanceFromPointToLine(C, B, A)),
  };
}

// Singed distance, whose absolte value is the distance of a point to a line.

function calculateSignedDistanceFromPointToLine(pt, v, w) {
  const ab = Math.sqrt((w[2] - v[2]) ** 2 + (w[1] - v[1]) ** 2);
  return ((w[2] - v[2]) * (pt[1] - v[1]) - (w[1] - v[1]) * (pt[2] - v[2])) / ab;
}
