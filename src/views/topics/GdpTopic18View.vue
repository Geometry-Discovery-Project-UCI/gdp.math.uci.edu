<template>
  <TopicMeta :topic="topic" />

  <div id="Lemoine-line-wrapper" style="padding-top: 40px;">
    <canvas id="Lemoine-line-canvas" width="800" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { calculateLineIntersectInLinearEquation, findSlope, polarToCartesian, solveLinearEquation, solvePerpendicularLineEquation } from "@/utils/geometry";

/**
 * Type definitions
 */
type Circle = fabric.Circle & {
  label?: Label,
  crossLines?: Line[],
};

type Point = fabric.Point & {
  label?: Label,
  tangent?: Line,
  // tanCross?: Line,  // The line that crosses this point's tangent
  crossLines?: Line[],  // The (two) lines that cross at this point
  collP?: Circle,
  lerpLine?: Line,
};

type Line = fabric.Line & {
  p1?: Point,
  p2?: Point,
  m?: number,
  b?: number,
  eq?: LinearEq,
  inter?: Circle,  // The intersection with another Line. So far only for part III
  thatLine?: Line,  // The other line to intersect with. So far only for part III
  tan?: Circle,  // tangent point on circle. For part IV
};

interface Coord {
  x: number,
  y: number,
}

type Label = fabric.Text & {
  // The offset of a label away from the point it attatches to, so that
  // they won't mix in a mess.
  offSet: Coord,
};

interface LinearEq {
  m: number,
  b: number,
}

/**
 * Utility functions
 */
const makeLabel = (text: string, offSet = { x: 0, y: 0 }, fontSize = 24): Label => {
  const label = new fabric.Text(text, {
    hasControls: false,
    hasBorders: false,
    evented: false,
    fontSize,
  }) as Label;
  label.offSet = offSet;
  return label;
};

function isCircle(point: Circle | { top: number, left: number } | Coord): point is Circle {
  return point instanceof fabric.Circle;
}

function setLabelToPoint(labels: Label[], points: Circle[] | Coord[]): void {
  for (let index = 0; index < labels.length; index++) {
    const label = labels[index];
    const point = points[index];
    if ("left" in point) {
      label.left = point.left! + label.offSet.x;
      label.top = point.top! + label.offSet.y;
      if (isCircle(point)) {
        point.label = label;
      }
    } else if ("x" in point) {
      label.left = point.x + label.offSet.x;
      label.top = point.y + label.offSet.y;
    }
  }
}

function makeCircle(point: fabric.Point | Coord, radius?: number, fill?: any): Circle;
function makeCircle(x: number, y: number, radius?: any, fill?: string): Circle;
function makeCircle(x: number | fabric.Point | Coord, y?: number, radius?: any, fill?: string): Circle {
  if (typeof (x) !== "number") {
    fill = radius;
    radius = y;
    y = x.y;
    x = x.x;
  }
  const point = new fabric.Circle({
    left: x,
    top: y,
    hasControls: false,
    hasBorders: false,
    evented: true,
    radius: radius || 3,
    fill: fill || "black",
    originX: "center",
    originY: "center",
    padding: 20,
  });
  return point;
}

function coordToPoint(cd: Coord): Point {
  return new fabric.Point(cd.x, cd.y) as Point;
}

const makeLine = (pt1?: Coord | fabric.Point, pt2?: Coord | fabric.Point,
  strokeWidth?: number, stroke?: string): Line => {
  if (pt1 === undefined || pt2 === undefined) {
    return new fabric.Line(undefined, {
      stroke: stroke || "black",
      hasControls: false,
      hasBorders: false,
      evented: false,
      strokeWidth: strokeWidth || 1,
    }) as Line;
  }
  const line = new fabric.Line([pt1.x, pt1.y, pt2.x, pt2.y], {
    stroke: stroke || "black",
    hasControls: false,
    hasBorders: false,
    evented: false,
    strokeWidth: strokeWidth || 1,
  }) as Line;
  if (pt1 instanceof fabric.Point && pt2 instanceof fabric.Point) {
    line.p1 = pt1;
    line.p2 = pt2;
  }
  return line;
};

function getTangentLine(inter: Coord, radius: number, center: Coord): LinearEq {
  const { m } = solveLinearEquation(inter, center);
  return solvePerpendicularLineEquation(m, inter);
}

function setLineFromPoints(line: Line, a: Coord | Circle, b: Coord | Circle, offSet?: number): void {
  if (!("x" in b) || !("y" in b)) {
    b = { x: b.left!, y: b.top! };
  } else {
    b = { x: b.x, y: b.y };
  }
  if (!("x" in a) || !("y" in a)) {
    a = { x: a.left!, y: a.top! };
  } else {
    a = { x: a.x, y: a.y };
  }
  if (offSet !== undefined) {
    if (a.x < b.x) {
      offSet = -offSet;
    }
    a.x += offSet;
    a.y = a.x * line.m! + line.b!;

  }
  line.set({
    x1: a.x,
    y1: a.y,
    x2: b.x,
    y2: b.y,
  });
}
const topic = indexTopicMap.get(18) as Topic;

export default defineComponent(
  {
    setup() {
      return { topic };
    },
    mounted() {
      const cvs = new fabric.Canvas("Lemoine-line-canvas", {
        selection: false,
        backgroundColor: "floralwhite",
      });
      const RADIUS = 80;
      const center = { x: 200, y: 200 } as Coord;
      const circle = new fabric.Circle({
        radius: RADIUS,
        fill: "",
        strokeWidth: 1,
        stroke: "black",
        left: center.x - RADIUS,
        top: center.y - RADIUS,
        hasControls: false,
        selectable: false,
      });
      cvs.add(circle);
      const pointA = coordToPoint(polarToCartesian(RADIUS, 55, center));
      const pointB = coordToPoint(polarToCartesian(RADIUS, 230, center));
      const pointC = coordToPoint(polarToCartesian(RADIUS, 300, center));
      const circleA = makeCircle(pointA);
      const circleB = makeCircle(pointB);
      const circleC = makeCircle(pointC);
      circleA.set({ selectable: false, evented: false });
      circleB.set({ selectable: false, evented: false });
      circleC.set({ selectable: false, evented: false });
      const tanA = makeLine();
      const tanB = makeLine();
      const tanC = makeLine();
      tanA.set({ stroke: "DeepPink" });
      tanB.set({ stroke: "DeepPink" });
      tanC.set({ stroke: "DeepPink" });
      pointA.tangent = tanA;
      pointB.tangent = tanB;
      pointC.tangent = tanC;
      const ab = makeLine(pointA, pointB);
      const bc = makeLine(pointB, pointC);
      const ac = makeLine(pointA, pointC);
      pointA.crossLines = [ab, ac];
      pointB.crossLines = [ab, bc];
      pointC.crossLines = [bc, ac];

      const x = makeCircle(0, 0, undefined, "red");
      const y = makeCircle(0, 0, undefined, "red");
      const z = makeCircle(0, 0, undefined, "red");
      x.crossLines = [pointA.tangent, bc];
      y.crossLines = [pointB.tangent, ac];
      z.crossLines = [pointC.tangent, ab];
      pointA.collP = x;
      pointB.collP = y;
      pointC.collP = z;
      const labelX = makeLabel("X");
      const labelY = makeLabel("Y");
      const labelZ = makeLabel("Z");
      const coll = makeLine();
      cvs.add(labelX, labelY, labelZ, coll, x, y, z);
      const labelA = makeLabel("A", { x: 10, y: -20 });
      const labelB = makeLabel("B", { x: -15, y: 5 });
      const labelC = makeLabel("C", { x: 15, y: -10 });
      const labels = [labelA, labelB, labelC];
      cvs.add(pointA.tangent, pointB.tangent, pointC.tangent, labelA, labelB, labelC);
      const ay = makeLine();
      const bz = makeLine();
      const cx = makeLine();
      ay.set({ stroke: "LimeGreen" });
      bz.set({ stroke: "LimeGreen" });
      cx.set({ stroke: "LimeGreen" });
      ay.inter = y;
      bz.inter = z;
      cx.inter = x;
      pointA.lerpLine = ay;
      pointB.lerpLine = bz;
      pointC.lerpLine = cx;
      cvs.add(ay, bz, cx, circleA, circleB, circleC);
      const inits = [pointA, pointB, pointC];
      const initCircles = [circleA, circleB, circleC];

      function circleRestrict(p: fabric.Point): fabric.Point {
        let rad = Math.atan(-findSlope([center.x, center.y], [p.x, p.y]));
        if (p.x < center.x) {
          rad -= Math.PI;
        }
        const coord = polarToCartesian(
          RADIUS,
          rad,
          center,
          false
        );
        p.setFromPoint(coord);
        return p;
      }
      const triangle = makeMovablePolygon([pointA, pointB, pointC],
        function (coords: fabric.Point[]) {
          const offSet = 30;
          for (let i = 0; i < 3; i++) {
            const p = inits[i];
            p.setXY(coords[i].x, coords[i].y);
            // log("tan", pointA.tangent);
            p.tangent?.set(getTangentLine(p, RADIUS, center));
            setLineFromPoints(p.tangent!, p, p.collP!);
            p.crossLines!.forEach(line => {
              line.set(solveLinearEquation(line.p1!, line.p2!));
            });
            // after updating the lines, update intersections
            const l1 = p.collP!.crossLines![0];
            const l2 = p.collP!.crossLines![1];
            const c = calculateLineIntersectInLinearEquation(l1.m!, l1.b!, l2.m!, l2.b!);
            p.collP!.set({ left: c.x, top: c.y });
            // update exteded lines
            setLineFromPoints(p.lerpLine!, p, p.lerpLine!.inter!);
            setLineFromPoints(p.tangent!, p, p.collP!, offSet);
            initCircles[i].set({ left: inits[i].x, top: inits[i].y });
          }
          coll.eq = solveLinearEquation({ x: x.left!, y: x.top! }, { x: y.left!, y: y.top! });
          const lo = Math.min(x.left!, y.left!, z.left!);
          const hi = Math.max(x.left!, y.left!, z.left!);
          const ratio = (hi - lo) / 130;
          const left = Math.max(lo - offSet, lo - offSet * ratio);
          const right = Math.min(hi + offSet, hi + offSet * ratio);
          // const left = 0;
          // const right = cvs.width!;
          coll.set({ x1: left, y1: left * coll.eq.m! + coll.eq!.b, x2: right, y2: right * coll.eq.m! + coll.eq!.b });
          setLabelToPoint([labelX, labelY, labelZ], [x, y, z]);
          setLabelToPoint(labels, inits);
        },
        circleRestrict
      );
      cvs.add(triangle);
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

      function _actionHandler(_eventData: any, transform: fabric.Transform, x: number, y: number, fn: (p: fabric.Point) => fabric.Point) {
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
        polygon.points![currentControl.pointIndex] = fn(finalPointPosition);
        return true;
      }

      function _anchorWrapper(anchorIndex: number, fn: (eventData: MouseEvent, transform: fabric.Transform, x: number, y: number, fn2: (p: fabric.Point) => fabric.Point) => any,
        fn2: (p: fabric.Point) => fabric.Point) {
        return function (eventData: MouseEvent, transform: fabric.Transform, x: number, y: number) {
          const fabricObject = transform.target as any;
          const absolutePoint = fabric.util.transformPoint(
            new fabric.Point(
              fabricObject.points![anchorIndex].x - fabricObject.pathOffset.x,
              fabricObject.points![anchorIndex].y - fabricObject.pathOffset.y,
            ),
            fabricObject.calcTransformMatrix()
          );
          const actionPerformed = fn(eventData, transform, x, y, fn2);
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

      function makeMovablePolygon(vertexes: Point[], fn: (points: fabric.Point[]) => void, fn2: (p: fabric.Point) => fabric.Point) {
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
              _actionHandler,
              fn2
            ),
            actionName: "modifyPolygon",
          }) as MyFabricControl;
          control.pointIndex = index;
          acc["p" + index] = control;
          return acc;
        }, {});
        return polygon;
      }
    }
  },
);
</script>
