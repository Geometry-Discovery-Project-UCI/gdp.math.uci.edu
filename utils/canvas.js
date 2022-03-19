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
}

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
}

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
}

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
}

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
}

function makeLabel(text, fontSize) {
    return new fabric.Text(text, {
        hascontrols: false,
        hasborders: false,
        evented: false,
        fontSize: fontSize || 24
    });
}

function makeCircle(radius, center, fill, stroke) {
    center = center || {
        x: 0,
        y: 0
    };
    radius = radius || 5;
    return new fabric.Circle({
        left: center.x,
        top: center.y,
        hasControls: false,
        hasborders: false,
        evented: false,
        radius,
        fill: fill || "transparent",
        stroke: stroke || 1
    })
}