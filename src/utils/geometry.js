export const EPS = .000001;

// function to find feet of triangle's altitudes
export function getPedalPoint(from, toA, toB) {
  const toAPoint = new fabric.Point(toA.x, toA.y);
  const toBPoint = new fabric.Point(toB.x, toB.y);
  const fromPoint = new fabric.Point(from.x, from.y);

  if (toAPoint.distanceFrom(toBPoint) > EPS) {
    const directionVector = toAPoint.subtract(toBPoint);
    const s = toAPoint.subtract(fromPoint);
    const lambda = s.dot(directionVector) / directionVector.dot(directionVector);
    let result = toAPoint.subtract(directionVector.multiply(lambda));
    return {
      x: result.x,
      y: result.y,
    };
  }
  else {
    return {
      x: 0,
      y: 0,
    };

  }
}

export function calculateIncenter(A, B, C) {
   // Centroid         --     1 : 1 : 1
  const incenter = trilinearToCartesian(A, B, C, 1,1,1);
  
  return {
    x: incenter.x,
    y: incenter.y,
  };
}

export function calculateCentroid(A, B, C) {
  const a = calculateDistanceBetweenTwoPoints(B, C);
  const b = calculateDistanceBetweenTwoPoints(A, C);
  const c = calculateDistanceBetweenTwoPoints(A, B);

  // Centroid         --     a^{-1}:b^{-1}:c^{-1}=csc A: csc B: csc C
  const centroid = trilinearToCartesian(A, B, C, 1 / a, 1 / b, 1 / c);
  return {
    x: centroid.x,
    y: centroid.y
  }
}


export function calculateCircumcenter(A, B, C) {
  const a = B.distanceFrom(C);
  const b = calculateDistanceBetweenTwoPoints(A, C);
  const c = calculateDistanceBetweenTwoPoints(A, B);


  // Circumcenter         --     cos A: cos B: cos C
  const x = (b ** 2 + c ** 2 - a ** 2) / 2 / b / c;
  const y = (a ** 2 + c ** 2 - b ** 2) / 2 / a / c;
  const z = (b ** 2 + a ** 2 - c ** 2) / 2 / b / a;

  const circumcenter = trilinearToCartesian(A, B, C, x, y, z);
  return {
    x: circumcenter.x,
    y: circumcenter.y
  }
}

export function calculateOrthocenter(A, B, C) {
  const c = calculateDistanceBetweenTwoPoints(A, B);
  const b = calculateDistanceBetweenTwoPoints(A, C);
  const a = calculateDistanceBetweenTwoPoints(B, C);

  // Orthocenter         --     sec A: sec B: sec C
  let x = (b ** 2 + c ** 2 - a ** 2) / 2 / b / c;
  let y = (a ** 2 + c ** 2 - b ** 2) / 2 / a / c;
  let z = (b ** 2 + a ** 2 - c ** 2) / 2 / b / a;

  if (Math.abs(x) < EPS) {
    var x1 = 1;
    var y1 = 0;
    var z1 = 0
  }
  else {
    if (Math.abs(y) < EPS) {
      var x1 = 0;
      var y1 = 1;
      var z1 = 0
    } else {
      if (Math.abs(z) < EPS) {
        var x1 = 0;
        var y1 = 0;
        var z1 = 1
      } else {
        var x1 = 1 / x;
        var y1 = 1 / y;
        var z1 = 1 / z
      }
    }
  }


  const orthocenter = trilinearToCartesian(A, B, C, x1, y1, z1);
  return {
    x: orthocenter.x,
    y: orthocenter.y
  }

}

export function calculateMidpoint(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}


export function calculateDistanceBetweenTwoPoints(pt1, pt2) {
  return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2));
}




export function calculateDistanceFromPointToLine(pt, line) {
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



// Angles of a triangle

export function calculateThreeAngles(A, B, C) {
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

export function trilinearToCartesian(A, B, C, a, b, c) {
  const AB = calculateDistanceBetweenTwoPoints(A, B);
  const CA = calculateDistanceBetweenTwoPoints(A, C);
  const BC = calculateDistanceBetweenTwoPoints(B, C);

  return {
    x: (a * BC * A.x + b * CA * B.x + c * AB * C.x) / (c * AB + b * CA + a * BC),
    y: (a * BC * A.y + b * CA * B.y + c * AB * C.y) / (c * AB + b * CA + a * BC),
  };
}

// Conversion of Cartesian coordinate system to Trilinear coordinate system
// By the defintion of trilinear coordinates, they are signed distances to three sides, but need to be calibrated by the orientation.

export function cartesianToTrilinear(A, B, C, P) {
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

export function calculateSignedDistanceFromPointToLine(pt, v, w) {
  const ab = Math.sqrt((w[2] - v[2]) ** 2 + (w[1] - v[1]) ** 2);
  return ((w[2] - v[2]) * (pt[1] - v[1]) - (w[1] - v[1]) * (pt[2] - v[2])) / ab;
}


export function polarToCartesian(radius, angle, center, isDegree=true) {
  if (isDegree) {
    angle *= (Math.PI / 180)
  }
  let res = {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  }
  if (center) {
    res.x += center.x
    res.y = center.y - res.y
  }
  return res
}


// The following functions will be obsolete

export function calculateSlope(pt1, pt2) {
  if (pt1.x !== pt2.x) {
    return (pt2.y - pt1.y) / (pt2.x - pt1.x);
  } else {
    return NaN;
  }
}


export function calculateLineIntersectInLinearEquation(m1, b1, m2, b2) {
  const x = (b2 - b1) / (m1 - m2);
  const y = m1 * x + b1;
  return {
    x,
    y,
  };
}

export function solveLinearEquation(pt1, pt2) {
  const m = ((pt2.y - pt1.y)) / (pt2.x - pt1.x);
  const b = pt1.y - m * pt1.x;
  return {
    m,
    b,
  };
}

export function solvePerpendicularLineEquation(originalM, pt) {
  const m = originalM === 0 ? 10000 : -1 / originalM;
  const b = pt.y - m * pt.x;
  return {
    m,
    b,
  };
}

export function calculateLineIntersectInPoints(line1, line2, isVector) {
  isVector = isVector | false;

  // Check if none of the lines are of length 0
  if (
    (line1.x1 === line1.x2 && line1.y1 === line1.y2) ||
    (line2.x1 === line2.x2 && line2.y1 === line2.y2)
  ) {
    return null;
  }
  const denominator =
    (line2.y2 - line2.y1) * (line1.x2 - line1.x1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1);

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







