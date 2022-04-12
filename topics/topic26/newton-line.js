const canvas = new fabric.Canvas("newton-line-canvas", {
    selection: false,
    backgroundColor: 'floralwhite'
});

const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;

// Functions from canvas.js
function _polygonPositionHandler(fn) {
    return function (dim, finalMatrix, fabricObject) {
        const c = fabricObject.points.map(function (pt) {
            const x = (pt.x - fabricObject.pathOffset.x),
                y = (pt.y - fabricObject.pathOffset.y);
            return fabric.util.transformPoint({
                    x: x,
                    y: y
                },
                fabric.util.multiplyTransformMatrices(
                    fabricObject.canvas.viewportTransform,
                    fabricObject.calcTransformMatrix()
                )
            );
        });
        if (fn instanceof Function) {
            fn(c);
        }
        return c[this.pointIndex];
    }
};

function _actionHandler(eventData, transform, x, y) {
    const polygon = transform.target,
        currentControl = polygon.controls[polygon.__corner],
        mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
        polygonBaseSize = polygon._getNonTransformedDimensions(),
        size = polygon._getTransformedDimensions(0, 0),
        finalPointPosition = {
            x: mouseLocalPosition.x * polygonBaseSize.x / size.x + polygon.pathOffset.x,
            y: mouseLocalPosition.y * polygonBaseSize.y / size.y + polygon.pathOffset.y
        };
    polygon.points[currentControl.pointIndex] = finalPointPosition;
    return true;
};

function _anchorWrapper(anchorIndex, fn) {
    return function (eventData, transform, x, y) {
        const fabricObject = transform.target,
            absolutePoint = fabric.util.transformPoint({
                x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
                y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
            }, fabricObject.calcTransformMatrix()),
            actionPerformed = fn(eventData, transform, x, y),
            newDim = fabricObject._setPositionDimensions({}),
            polygonBaseSize = fabricObject._getNonTransformedDimensions(),
            newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
            newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
        return actionPerformed;
    }
};

function makeMovablePolygon(vertexes, fn) {
    const polygon = new fabric.Polygon(vertexes, {
        fill: 'transparent',
        strokeWidth: 1.5,
        stroke: 'black',
        objectCaching: false,
        transparentCorners: false,
        cornerStyle: 'circle',
        cornerColor: 'transparent',
        cornerSize: 20,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true
    });
    polygon.controls = polygon.points.reduce(function (acc, point, index) {
        acc['p' + index] = new fabric.Control({
            positionHandler: _polygonPositionHandler(fn),
            actionHandler: _anchorWrapper(index > 0 ? index - 1 : polygon.points.length - 1, _actionHandler),
            actionName: 'modifyPolygon',
            pointIndex: index
        });
        return acc;
    }, {});
    return polygon;
};

function makeLine(pt1, pt2, stroke) {
    pt1 = pt1 || {
        x: 0,
        y: 0
    };
    pt2 = pt2 || {
        x: 0,
        y: 0
    };
    return new fabric.Line([pt1.x, pt1.y, pt2.x, pt2.y], {
        stroke: "black",
        hasControls: false,
        hasBorders: false,
        evented: false,
        stroke: stroke || 1
    });
};

function makeLabel(text, fontSize) {
    return new fabric.Text(text, {
        hascontrols: false,
        hasborders: false,
        evented: false,
        fontSize: fontSize || 24
    });
};


// Functions from geometry.js
function calculateSlope(pt1, pt2) {
    if (pt1.x != pt2.x) {
        return (pt2.y - pt1.y) / (pt2.x - pt1.x);
    } else {
        return NaN;
    }
};

function calculateMidpoint(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    }
}

function makeFullLine(pt1, pt2, stroke) {
    pt1 = pt1 || {
        x: 0,
        y: 0
    };
    pt2 = pt2 || {
        x: 0,
        y: 0
    };
    
    m = calculateSlope(pt1, pt2);

    if (isNaN(m)) {
        m = 0;
    } else if (!isFinite(m)) {
        pt1 = {
            x: pt1[0],
            y: 0
        };
        pt2 = {
            x: pt1[0],
            y: 500
        };
    }

    pt1 = {
        x: 0,
        y: -m * pt1[0] + pt1[1]
    };
    pt2 = {
        x: 300,
        y: m * (300 - pt1[0] + pt1[1])
    };

    return new fabric.Line([pt1.x, pt1.y, pt2.x, pt2.y], {
        stroke: "black",
        hasControls: false,
        hasBorders: false,
        evented: false,
        stroke: stroke || 1
    });
};

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


// Creates line and label objects
const diagAC = makeLine();
const diagBD = makeLine();

const newtonLine = makeLine();
const lineBE = makeLine();
const lineCE = makeLine();
const lineBF = makeLine();
const lineAF = makeLine();
const lineEF = makeLine();

const aLabel = makeLabel("A");
const bLabel = makeLabel("B");
const cLabel = makeLabel("C");
const dLabel = makeLabel("D");
const eLabel = makeLabel("E");
const fLabel = makeLabel("F");
const lLabel = makeLabel("L");
const mLabel = makeLabel("M");
const nLabel = makeLabel("N");

// Creates movable quadrilateral
const quadrilateral = makeMovablePolygon([{
    x: 150,
    y: 250
}, {
    x: 100,
    y: 400
}, {
    x: 300,
    y: 400
}, {
    x: 270,
    y: 320

}], function (coords) {

    // Change quadrilateral color
    quadrilateral.set({
        stroke: "green"
    });

    // Update the labels for the quadrilateral with the new coordinates
    aLabel.set({
        left: coords[0].x-25,
        top: coords[0].y-25
    });

    bLabel.set({
        left: coords[1].x-15,
        top: coords[1].y
    });

    cLabel.set({
        left: coords[2].x,
        top: coords[2].y
    });

    dLabel.set({
        left: coords[3].x+5,
        top: coords[3].y-25
    });

    // Update the coordinates for the diagonals of the quadrilateral
    diagAC.set({
        x1: coords[0].x,
        y1: coords[0].y,
        x2: coords[2].x,
        y2: coords[2].y,
        stroke: "gray"
    });

    diagBD.set({
        x1: coords[1].x,
        y1: coords[1].y,
        x2: coords[3].x,
        y2: coords[3].y,
        stroke: "gray"
    });

    // Calculate the midpoints of the diagonals 
    // (Newton's Line passes through these two points)
    const midpoint1 = calculateMidpoint(coords[0],coords[2]);
    const midpoint2 = calculateMidpoint(coords[1],coords[3]);

    // Calculate the slope between two midpoints
    // (Slope of Newton's Line)
    const slope = calculateSlope(midpoint1,midpoint2);

    // Update the coordinates for the Newton's Line
    if (!isFinite(slope)) {
        newtonLine.set({
            x1: midpoint1.x,
            y1: 0,
            x2: midpoint1.x,
            y2: CANVAS_HEIGHT,
            stroke: "red"
        });
    } else if (isNaN(slope)) {
        newtonLine.set({
            x1: 0,
            y1: midpoint1.y,
            x2: CANVAS_WIDTH,
            y2: midpoint1.y,
            stroke: "red"
        });
    } else if (slope == 0) {
        newtonLine.set({
            x1: 0,
            y1: midpoint1.y,
            x2: CANVAS_WIDTH,
            y2: midpoint1.y,
            stroke: "red"
        });
    } else {
        newtonLine.set({
            x1: 0,
            y1: -slope * midpoint1.x + midpoint1.y,
            x2: CANVAS_WIDTH,
            y2: slope * (CANVAS_WIDTH - midpoint1.x) + midpoint1.y,
            stroke: "red"
        })
    };

    const pointE = calculateLineIntersectInPoints(makeLine(coords[1],coords[0]),makeLine(coords[2],coords[3]), true);

    eLabel.set({
        left: pointE.x-7,
        top: pointE.y-30
    });

    lineBE.set({
        x1: coords[0].x-1,
        y1: coords[0].y,
        x2: pointE.x,
        y2: pointE.y,
        strokeWidth: 1.5
    });

    lineCE.set({
        x1: coords[3].x,
        y1: coords[3].y,
        x2: pointE.x,
        y2: pointE.y,
        strokeWidth: 1.5
    });

    const pointF = calculateLineIntersectInPoints(makeLine(coords[0],coords[3]),makeLine(coords[1],coords[2]), true);

    fLabel.set({
        left: pointF.x+10,
        top: pointF.y-2
    });

    lineAF.set({
        x1: coords[3].x,
        y1: coords[3].y,
        x2: pointF.x,
        y2: pointF.y,
        strokeWidth: 1.5
    });

    lineBF.set({
        x1: coords[2].x,
        y1: coords[2].y-1,
        x2: pointF.x,
        y2: pointF.y,
        strokeWidth: 1.5
    });

    lineEF.set({
        x1: pointE.x,
        y1: pointE.y,
        x2: pointF.x,
        y2: pointF.y-1,
        strokeWidth: 1.5
    });

    const pointM = calculateLineIntersectInPoints(makeLine(coords[1], coords[3]), newtonLine, true);
    mLabel.set({
        left: pointM.x,
        top: pointM.y,
        fontSize: 18
    });

    const pointN = calculateLineIntersectInPoints(makeLine(coords[0], coords[2]), newtonLine, true);
    nLabel.set({
        left: pointN.x-23,
        top: pointN.y-10,
        fontSize: 18
    });

    const pointL = calculateLineIntersectInPoints(makeLine(pointE, pointF), newtonLine, true);
    lLabel.set({
        left: pointL.x+15,
        top: pointL.y-10,
        fontSize: 18
    });
});


canvas.add(quadrilateral);

canvas.add(diagAC);
canvas.add(diagBD);

canvas.add(newtonLine);

canvas.add(lineBE);
canvas.add(lineCE);
canvas.add(lineAF);
canvas.add(lineBF);
canvas.add(lineEF);

canvas.add(aLabel);
canvas.add(bLabel);
canvas.add(cLabel);
canvas.add(dLabel);
canvas.add(eLabel);
canvas.add(fLabel);
canvas.add(mLabel);
canvas.add(nLabel);
canvas.add(lLabel);