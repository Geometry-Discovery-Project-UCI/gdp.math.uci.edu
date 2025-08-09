import { fabric } from "fabric";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

function _polygonPositionHandler(fn?: (points: fabric.Point[]) => void, border?: number[]) {
  return function (this: { pointIndex: number }, _dim: any, _finalMatrix: any, fabricObject: fabric.Polygon) {
    const c = fabricObject.points!.map(function (pt: fabric.Point) {
      if (border) {
        const [BORDER_WIDTH, BORDER_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT] = border;
        pt.x = Math.max(BORDER_WIDTH, Math.min(CANVAS_WIDTH - BORDER_WIDTH, pt.x));
        pt.y = Math.max(BORDER_HEIGHT, Math.min(CANVAS_HEIGHT - BORDER_HEIGHT, pt.y));
      }
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
// Interface for the fading text manager
interface FadingTextManager {
  text: fabric.Text;
  animationId: number | null;
  isAnimating: boolean;
  userHasDragged: boolean;
  startFadeAnimation: () => void;
  stopFadeAnimation: () => void;
  remove: () => void;
}

// Create fading instruction text
export function createFadingText(
  canvas: fabric.Canvas,
  message = "drag the points to begin exploring",
  options: {
    left?: number;
    top?: number;
    fontSize?: number;
    fill?: string;
    fontFamily?: string;
    fadeSpeed?: number;
  } = {}
): FadingTextManager {
  const {
    left = canvas.width ? canvas.width / 2 : 250,
    top = canvas.height ? canvas.height / 2 : 250,
    fontSize = 18,
    fill = "#666",
    fontFamily = "Arial",
    fadeSpeed = 0.02
  } = options;

  const text = new fabric.Text(message, {
    left,
    top,
    originX: "center",
    originY: "center",
    fontSize,
    fill,
    fontFamily,
    selectable: false,
    evented: false,
    opacity: 1,
  });

  canvas.add(text);

  let animationId: number | null = null;
  let isAnimating = false;
  let userHasDragged = false;
  let fadeDirection = -1; // -1 for fade out, 1 for fade in
  let currentOpacity = 1;

  const animate = () => {
    if (!isAnimating || userHasDragged) return;

    currentOpacity += fadeDirection * fadeSpeed;

    // Clamp opacity between 0.3 and 1
    if (currentOpacity <= 0.3) {
      currentOpacity = 0.3;
      fadeDirection = 1; // Start fading in
    } else if (currentOpacity >= 1) {
      currentOpacity = 1;
      fadeDirection = -1; // Start fading out
    }

    text.set({ opacity: currentOpacity });
    canvas.renderAll();

    animationId = requestAnimationFrame(animate);
  };

  const startFadeAnimation = () => {
    if (!isAnimating && !userHasDragged) {
      isAnimating = true;
      animate();
    }
  };

  const stopFadeAnimation = () => {
    isAnimating = false;
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  const handleClick = () => {
    remove();
    canvas.off("mouse:down", handleClick);
  };
  canvas.on("mouse:down", handleClick);
  const remove = () => {
    if (!userHasDragged) {
      userHasDragged = true;
      stopFadeAnimation();
      canvas.remove(text);
      canvas.renderAll();
    }
  };

  // Start the animation immediately
  startFadeAnimation();

  return {
    text,
    animationId,
    isAnimating,
    userHasDragged,
    startFadeAnimation,
    stopFadeAnimation,
    remove
  };
}
// borderInfo : [borderWidth, borderHeight, canvasWidth, canvasHeight]]
export function makeMovablePolygon(vertexes: fabric.Point[], fn: (points: fabric.Point[]) => void, border?: number[]) {
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
      positionHandler: _polygonPositionHandler(fn, border),
      actionHandler: _anchorWrapper(
        index > 0 ? index - 1 : polygon.points!.length - 1,
        _actionHandler,
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

export function makeSelectCircle(radius = 3, center: fabric.Point = new fabric.Point(0, 0), fill = "black", padding = 20, strokeWidth = 1) {
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

export function setBorder(canvas: fabric.Canvas, borderWidth?:  number,borderHeight?: number) {
  canvas.on("object:moving", ({ target: obj }) => {
    if (obj === undefined) {
      return;
    }
    obj.setCoords();
    const minLeft = borderWidth || 0;
    const minTop = borderHeight || 0;
    const maxLeft = (canvas.width || 0) - (borderWidth || 0);
    const maxTop = (canvas.height || 0) - (borderHeight || 0);
    obj.set({
      left: Math.min(Math.max(obj.left || 0, minLeft), maxLeft),
      top: Math.min(Math.max(obj.top || 0, minTop), maxTop),
    });
  });
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

