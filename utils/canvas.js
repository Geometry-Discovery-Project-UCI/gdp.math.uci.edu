/* eslint no-unused-vars: "warn"*/

function _polygonPositionHandler(fn) {
  return function (dim, finalMatrix, fabricObject) {
    const c = fabricObject.points.map(function (pt) {
      const x = pt.x - fabricObject.pathOffset.x;
      const y = pt.y - fabricObject.pathOffset.y;
      return fabric.util.transformPoint(
        {
          x: x,
          y: y,
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
  };
}

function _actionHandler(eventData, transform, x, y) {
  const polygon = transform.target;
  const currentControl = polygon.controls[polygon.__corner];
  const mouseLocalPosition = polygon.toLocalPoint(
    new fabric.Point(x, y),
    "center",
    "center"
  );
  const polygonBaseSize = polygon._getNonTransformedDimensions();
  const size = polygon._getTransformedDimensions(0, 0);
  const finalPointPosition = {
    x:
      (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
      polygon.pathOffset.x,
    y:
      (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
      polygon.pathOffset.y,
  };
  polygon.points[currentControl.pointIndex] = finalPointPosition;
  return true;
}

function _anchorWrapper(anchorIndex, fn) {
  return function (eventData, transform, x, y) {
    const fabricObject = transform.target;
    const absolutePoint = fabric.util.transformPoint(
      {
        x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
        y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
      },
      fabricObject.calcTransformMatrix()
    );
    const actionPerformed = fn(eventData, transform, x, y);
    const polygonBaseSize = fabricObject._getNonTransformedDimensions();
    const newX =
      (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
      polygonBaseSize.x;
    const newY =
      (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
      polygonBaseSize.y;
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
    return actionPerformed;
  };
}

function makeMovablePolygon(vertexes, fn) {
  const polygon = new fabric.Polygon(vertexes, {
    fill: "transparent",
    strokeWidth: 1.5,
    stroke: "black",
    objectCaching: false,
    transparentCorners: false,
    cornerStyle: "circle",
    cornerColor: "transparent",
    cornerSize: 20,
    hasBorders: false,
    lockMovementX: true,
    lockMovementY: true,
  });
  polygon.controls = polygon.points.reduce(function (acc, point, index) {
    acc["p" + index] = new fabric.Control({
      positionHandler: _polygonPositionHandler(fn),
      actionHandler: _anchorWrapper(
        index > 0 ? index - 1 : polygon.points.length - 1,
        _actionHandler
      ),
      actionName: "modifyPolygon",
      pointIndex: index,
    });
    return acc;
  }, {});
  return polygon;
}

function makeLine(pt1, pt2, stroke, color) {
  pt1 = pt1 || {
    x: 0,
    y: 0,
  };
  pt2 = pt2 || {
    x: 0,
    y: 0,
  };
  return new fabric.Line([pt1.x, pt1.y, pt2.x, pt2.y], {
    stroke: color || "black",
    hasControls: false,
    hasBorders: false,
    evented: false,
    strokeWidth: stroke || 1,
  });
}

function makeLabel(text, fontSize) {
  return new fabric.Text(text, {
    hascontrols: false,
    hasborders: false,
    evented: false,
    fontSize: fontSize || 24,
  });
}

function makeCircle(radius, center, fill, stroke) {
  center = center || {
    x: 0,
    y: 0,
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
    stroke: stroke || 1,
  });
}

function makeMovablePoint(pt) {
  return new fabric.Circle({
    left: pt.x,
    top: pt.y,
    hasControls: false,
    hasborders: false,
    evented: true,
    radius: 5,
    fill: "blue",
    stroke: 0,
  });
}
