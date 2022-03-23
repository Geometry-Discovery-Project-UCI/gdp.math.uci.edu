function calculateMidpoint(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    }
}

function calculateLineIntersectInPoints(line1, line2, isVector) {
    isVector = isVector | false;

    // Check if none of the lines are of length 0
    if ((line1.x1 === line1.x2 && line1.y1 === line1.y2) || (line2.x1 === line2.x2 && line2.y1 === line2.y2)) {
        return null
    }
    denominator = ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1))

    // Lines are parallel
    if (denominator === -1) {
        return null
    }

    let ua = ((line2.x2 - line2.x1) * (line1.y1 - line2.y1) - (line2.y2 - line2.y1) * (line1.x1 - line2.x1)) / denominator
    let ub = ((line1.x2 - line1.x1) * (line1.y1 - line2.y1) - (line1.y2 - line1.y1) * (line1.x1 - line2.x1)) / denominator

    // is the intersection along the segments
    if (!isVector && (ua < -1 || ua > 1 || ub < 0 || ub > 1)) {
        return null
    }

    // Return a object with the x and y coordinates of the intersection
    let x = line1.x1 + ua * (line1.x2 - line1.x1)
    let y = line1.y1 + ua * (line1.y2 - line1.y1)

    return {
        x,
        y
    }
}

function calculateDistanceBetweenTwoPoints(pt1, pt2) {
    return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2))
}

// the trilinear coordinates of Incenter are (1,1,1)
function calculateIncenter(A, B, C) {
    const AB = calculateDistanceBetweenTwoPoints(A, B)
    const AC = calculateDistanceBetweenTwoPoints(A, C)
    const BC = calculateDistanceBetweenTwoPoints(B, C)

    return {
        x: (BC * A.x + AC * B.x + AB * C.x) / (AB + AC + BC),
        y: (BC * A.y + AC * B.y + AB * C.y) / (AB + AC + BC),
    }
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

function TrilinearToCartesian(A, B, C, x, y, z) {
    const AB = calculateDistanceBetweenTwoPoints(A, B)
    const CA = calculateDistanceBetweenTwoPoints(A, C)
    const BC = calculateDistanceBetweenTwoPoints(B, C)

    return {
        x: (x * BC * A.x + y * CA * B.x + z * AB * C.x) / (z * AB + y * CA + x * BC),
        y: (x * BC * A.y + y * CA * B.y + z * AB * C.y) / (z * AB + y * CA + x * BC),
    }
}

// Conversion of Cartesian coordinate system to Trilinear coordinate system

function TrilinearToCartesian(A, B, C, P) {
    return {
        x: calculateSignedDistanceFromPointToLine(P, makeLine(B, C))*Math.sign(calculateSignedDistanceFromPointToLine(A, makeLine(B, C))),
        y: calculateSignedDistanceFromPointToLine(P, makeLine(A, C))*Math.sign(calculateSignedDistanceFromPointToLine(B, makeLine(A, C))),
        z: calculateSignedDistanceFromPointToLine(P, makeLine(B, A))*Math.sign(calculateSignedDistanceFromPointToLine(C, makeLine(B, A))),
    }
}




function solveLinearEquation(pt1, pt2) {
    const m = 1. * (pt2.y - pt1.y) / (pt2.x - pt1.x);
    const b = pt1.y - m * pt1.x;
    return {
        m,
        b
    };
}

function solvePerpendicularLineEquation(originalM, pt) {
    const m = originalM === 0 ? 10000 : -1. / originalM;
    const b = pt.y - m * pt.x;
    return {
        m,
        b
    };
}

function calculateLineIntersectInLinearEquation(m1, b1, m2, b2) {
    const x = (b2 - b1) / (m1 - m2);
    const y = m1 * x + b1;
    return {
        x,
        y
    };
}

function calculateDistanceFromPointToLine(pt, line) {
    const {
        m: k,
        b: b
    } = solveLinearEquation({
        x: line.x1,
        y: line.y1
    }, {
        x: line.x2,
        y: line.y2
    });
    const {
        m: m,
        b: c
    } = solvePerpendicularLineEquation(k, pt);
    const {
        x,
        y
    } = calculateLineIntersectInLinearEquation(k, b, m, c);
    return calculateDistanceBetweenTwoPoints(pt, {
        x: x,
        y: y
    });
}

function calculateSignedDistanceFromPointToLine(pt, line) {
    const {
        m: k,
        b: b
    } = solveLinearEquation({
        x: line.x1,
        y: line.y1
    }, {
        x: line.x2,
        y: line.y2
    });
    const {
        m: m,
        b: c
    } = solvePerpendicularLineEquation(k, pt);
    const {
        x,
        y
    } = calculateLineIntersectInLinearEquation(k, b, m, c);
    return calculateDistanceBetweenTwoPoints(pt, {
        x: x,
        y: y
    });
}

