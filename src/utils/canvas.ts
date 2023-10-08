import { fabric } from "fabric";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

function _polygonPositionHandler(fn?: (points: fabric.Point[]) => void) {
  return function (this: { pointIndex: number }, _dim: any, _finalMatrix: any, fabricObject: fabric.Polygon) {
    const c = fabricObject.points!.map(function (pt: fabric.Point) {
      const transformPoint = new fabric.Point(pt.x - fabricObject.pathOffset.x, pt.y - fabricObject.pathOffset.y);
      return fabric.util.transformPoint(
        transformPoint,
        fabric.util.multiplyTransformMatrices(
          fabricObject.canvas!.viewportTransform!,
          fabricObject.calcTransformMatrix()
        )
      );
    });
    if (fn !== undefined) {
      fn(c);
    }
    return c[this.pointIndex];
  };
}

function _actionHandler(_eventData: any, transform: fabric.Transform, x: number, y: number) {
  type MyFabricObject = fabric.Polygon & { __corner: any };
  const polygon = transform.target as MyFabricObject;
  const currentControl: any = polygon.controls[polygon.__corner];
  const mouseLocalPosition = polygon.toLocalPoint(
    new fabric.Point(x, y),
    "center",
    "center"
  );
  const polygonBaseSize = polygon._getNonTransformedDimensions();
  const size = polygon._getTransformedDimensions(0, 0);
  const finalPointPosition = new fabric.Point(
    (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
    polygon.pathOffset.x,
    (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
    polygon.pathOffset.y,
  );
  polygon.points![currentControl.pointIndex] = finalPointPosition;
  return true;
}

function _anchorWrapper(anchorIndex: number, fn: (eventData: MouseEvent, transform: fabric.Transform, x: number, y: number) => any) {
  return function (eventData: MouseEvent, transform: fabric.Transform, x: number, y: number) {
    const fabricObject = transform.target as any;
    const absolutePoint = fabric.util.transformPoint(
      new fabric.Point(
        fabricObject.points![anchorIndex].x - fabricObject.pathOffset.x,
        fabricObject.points![anchorIndex].y - fabricObject.pathOffset.y,
      ),
      fabricObject.calcTransformMatrix()
    );
    const actionPerformed = fn(eventData, transform, x, y);
    const polygonBaseSize = fabricObject._getNonTransformedDimensions();
    const newX =
      (fabricObject.points![anchorIndex].x - fabricObject.pathOffset.x) /
      polygonBaseSize.x;
    const newY =
      (fabricObject.points![anchorIndex].y - fabricObject.pathOffset.y) /
      polygonBaseSize.y;
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
    return actionPerformed;
  };
}

export function makeMovablePolygon(vertexes: fabric.Point[], fn: (points: fabric.Point[]) => void) {
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
  polygon.controls = polygon.points!.reduce(function (acc: any, _point, index) {
    type MyFabricControl = fabric.Control & {
      pointIndex: number
    };
    const control = new fabric.Control({
      positionHandler: _polygonPositionHandler(fn),
      actionHandler: _anchorWrapper(
        index > 0 ? index - 1 : polygon.points!.length - 1,
        _actionHandler
      ),
      actionName: "modifyPolygon",
    }) as MyFabricControl;
    control.pointIndex = index;
    acc["p" + index] = control;
    return acc;
  }, {});
  return polygon;
}

export function makeLine(pt1: fabric.Point = new fabric.Point(0, 0), pt2: fabric.Point = new fabric.Point(0, 0), strokeWidth = 1, color = "black") {
  return new fabric.Line([pt1.x, pt1.y, pt2.x, pt2.y], {
    originX: "center",
    originY: "center",
    stroke: color,
    hasControls: false,
    hasBorders: false,
    evented: false,
    strokeWidth,
  });
}

export function makeLabel(text: string, fontSize = 24) {
  return new fabric.Text(text, {
    hasControls: false,
    hasBorders: false,
    evented: false,
    fontSize,
  });
}

export function makeCircle(radius = 5, center: fabric.Point = new fabric.Point(0, 0), fill = "transparent", strokeWidth = 1) {
  return new fabric.Circle({
    left: center.x,
    top: center.y,
    hasControls: false,
    hasBorders: false,
    evented: false,
    radius,
    fill,
    strokeWidth,
  });
}

export function makeSelectCircle(radius = 3, center: fabric.Point = new fabric.Point(0, 0), fill = "black", padding = 20, strokeWidth = 1){
  return new fabric.Circle({
    originX: "center",
    originY: "center",
    left: center.x,
    top: center.y,
    hasControls: false,
    hasBorders: false,
    evented: false,
    radius,
    fill,
    padding,
    strokeWidth,
  });
}

export function makeMovablePoint(pt: fabric.Point, radius?: number) {
  return new fabric.Circle({
    originX: "center",
    originY: "center",
    left: pt.x,
    top: pt.y,
    hasControls: false,
    hasBorders: false,
    evented: true,
    radius: radius || 5,
    fill: "blue",
    strokeWidth: 0,
  });
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
