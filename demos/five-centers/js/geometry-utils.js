function calculateMidpoint(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    }
}

function calculateIntersect(line1, line2, isVector) {
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

    return { x, y }
}

function calculateDistanceBetweenTwoPoints(pt1, pt2) {
    return Math.sqrt(Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2))
}

function calculateIncenter(A, B, C) {
    const AB = calculateDistanceBetweenTwoPoints(A, B)
    const AC = calculateDistanceBetweenTwoPoints(A, C)
    const BC = calculateDistanceBetweenTwoPoints(B, C)

    return {
        x: (BC * A.x + AC * B.x + AB * C.x) / (AB + AC + BC),
        y: (BC * A.y + AC * B.y + AB * C.y) / (AB + AC + BC),
    }
}

function solveLinearEquation(pt1, pt2) {
    const m = 1. * (pt2.y - pt1.y) / (pt2.x - pt1.x);
    const b = pt1.y - m * pt1.x;
    return {
        m, b
    }
}

function solvePerpendicularLineEquation(originalM, pt) {
    const m = originalM == 0 ? 10000 : -1. / originalM;
    const b = pt.y - m * pt.x;
    return {
        m, b
    }
}

function calculateDistanceFromPointToLine(pt, line) {
    const {m: k , b: b} = solveLinearEquation({ x: line.x1, y: line.y1 }, { x: line.x2, y: line.y2 });
    const {m: m, b: c}  = solvePerpendicularLineEquation(k, pt);
    const x = (c - b) / (k - m);
    const y = k * x + b;
    return calculateDistanceBetweenTwoPoints(pt, { x: x, y: y });
}
