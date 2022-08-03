<template>
  <TopicMeta :topic="topic" />
  <div id="Desargues-wrapper" style="padding-top: 40px;">
    <h2>Desargues's Theorem</h2>
    <canvas id="Desargues-canvas" width="800" height="500" />
  </div>
  <div id="Pascal-Brainchon-wrapper" style="padding-top: 40px;">
    <h2>Pappus' Theorem</h2>
    <canvas id="Pascal-Brainchon-canvas" width="500" height="500" />
  </div>

  <div id="Pascal-wrapper" style="padding-top: 40px;">
    <h2>Pascal's Theorem</h2>
    <canvas id="Pascal-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";
import { calculateLineIntersectInLinearEquation, calculateLineIntersectInPoints, findSlope, polarToCartesian, solveLinearEquation } from "@/utils/geometry";

const topic = indexTopicMap.get(6) as Topic;

/**
 * Type definitions
 */
type Intersection = fabric.Intersection & {
  points?: fabric.Point[]
};

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

type Circle = fabric.Circle & {
  [key: string]: any,
  intersects?: Circle[],
  upLine?: fabric.Line[],
  downLine?: fabric.Line[],
  crossLines?: Line[],
  label?: Label,
  leftBound?: Circle,
  rightBound?: Circle,
  moveLine?: Line,  // The line on which the point moves.
  upBound?: Circle,
  downBound?: Circle,
};

type Line = fabric.Line & {
  p1?: Circle,
  p2?: Circle,
  m?: number,
  b?: number,
  inter?: Circle,  // The intersection with another Line. So far only for part III
  thatLine?: Line,  // The other line to intersect with. So far only for part III
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

/**
 * Utility functions
 */
const log = console.log;

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

// TODO use rest parameter
function setLabelToPoint(labels: Label[], points: Circle[] | { top: number, left: number }[] | Coord[]): void {
  for (let index = 0; index < labels.length; index++) {
    const label = labels[index];
    const point = points[index];
    if ("left" in point) {
      label.left = point.left! + label.offSet.x;
      label.top = point.top! + label.offSet.y;
      if (isCircle(point)) {
        point.label = label;
      }
    } else {
      label.left = point.x + label.offSet.x;
      label.top = point.y + label.offSet.y;
    }
  }
}

function makeCircle(point: fabric.Point | Coord, radius?: number, fill?: any): Circle;
function makeCircle(x: number, y: number, radius?: any, fill?: string): Circle;
function makeCircle(x: number | fabric.Point | Coord, y?: number, radius?: any, fill?: string): Circle {
  if (typeof(x) !== "number") {
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
  });
  return point;
}

function coordToPoint(cd: Coord): fabric.Point {
  return new fabric.Point(cd.x, cd.y);
}

const makeLine = (pt1: Coord | fabric.Point | fabric.Circle, pt2: Coord | fabric.Point | fabric.Circle,
  strokeWidth?: number, stroke?: string): Line => {
  if (pt1 instanceof fabric.Circle) {
    pt1 = { x: pt1.left!, y: pt1.top! };
  }
  if (pt2 instanceof fabric.Circle) {
    pt2 = { x: pt2.left!, y: pt2.top! };
  }
  return new fabric.Line([pt1.x, pt1.y, pt2.x, pt2.y], {
    stroke: stroke || "black",
    hasControls: false,
    hasBorders: false,
    evented: false,
    strokeWidth: strokeWidth || 1,
  });
};

function getIntersectFromLines(line1: fabric.Line, line2: fabric.Line): Coord {
  const l1 = solveLinearEquation(new fabric.Point(line1.x1!, line1.y1!), new fabric.Point(line1.x2!, line1.y2!));
  const l2 = solveLinearEquation(new fabric.Point(line2.x1!, line2.y1!), new fabric.Point(line2.x2!, line2.y2!));
  return calculateLineIntersectInLinearEquation(l1.m, l1.b, l2.m, l2.b);
}

function setLineFromPoints(line: fabric.Line, a: Coord, b: Coord): void {
  line.set({
    x1: a.x,
    y1: a.y,
    x2: b.x,
    y2: b.y,
  });
}

/**
 * Update the position of `inter` and `inter`'s `crossLines`
 * @param line1 The first line that intersects with line2
 * @param line2 The second line that intersects with line1
 * @param inter The intersection point
 */
function updateInterAndLine(line1: Line, line2: Line, inter: Circle): void {
  const newInter = calculateLineIntersectInPoints(line1, line2, true);
  if (newInter === null || newInter === undefined) return;
  inter.set({left: newInter.x, top: newInter.y});
  if (inter.crossLines !== undefined) {
    inter.crossLines.forEach(line => {
      line.set({
        x1: line.p1!.left,
        y1: line.p1!.top,
        x2: line.p2!.left,
        y2: line.p2!.top,
      });
    });
  }
}

/**
 * Part III
 */
function partThree() {
  const cvsDes = new fabric.Canvas("Desargues-canvas", {
    selection: false,
    backgroundColor: "floralwhite",
  });
  /**
   * Position initialization.
   */
  const cvsWidth = 800;
  // (2,5.5)--(0,6)--(1.5,4)
  const mul = 50;
  const yOffset = 470;
  const xOffset = 20;
  const pointC = makeCircle(xOffset + 2*mul, yOffset - 5.5*mul);
  const pointB = makeCircle(xOffset + 0*mul, yOffset - 6*mul);
  const pointA = makeCircle(xOffset + 1.5*mul, yOffset - 4*mul);
  // (5.5,1.125)--(0,0)--(2.25,2)
  const pointPrimeC = makeCircle(xOffset + mul*5.5, yOffset - mul*1.125);
  const pointPrimeB = makeCircle(xOffset + mul*0, yOffset - mul*0);
  const pointPrimeA = makeCircle(xOffset + mul*2.25, yOffset - mul*2);
  cvsDes.add(pointA, pointB, pointC, pointPrimeA, pointPrimeB, pointPrimeC);
  const aLabel = makeLabel("A", {x: 15, y: -10});
  const bLabel = makeLabel("B");
  const cLabel = makeLabel("C", {x: 15, y: -20});
  const aprimeLabel = makeLabel("A'");
  const bprimeLabel = makeLabel("B'");
  const cprimeLabel = makeLabel("C'");
  const movablePoints = [pointA, pointB, pointC, pointPrimeA, pointPrimeB, pointPrimeC];
  setLabelToPoint(
    [aLabel, bLabel, cLabel, aprimeLabel, bprimeLabel, cprimeLabel],
    movablePoints
  );
  // const pointsFromMovables = movablePoints.map(ele => new fabric.Point(ele.left!, ele.top!));
  // const [pa, pb, pc, ppa, ppb, ppc] = pointsFromMovables;
  cvsDes.add(aLabel, bLabel, cLabel, aprimeLabel, bprimeLabel, cprimeLabel);

  const aAprime = makeLine(pointA, pointPrimeA);
  const bBprime = makeLine(pointB, pointPrimeB);
  // const cCprime = makeLine(pointC, pointPrimeC);
  // cvsDes.add(aAprime, bBprime, cCprime);
  const pO = calculateLineIntersectInPoints(aAprime, bBprime, true);
  const pointO = makeCircle(pO!);
  const oBp = makeLine(pointO, pointPrimeB);
  const oCp = makeLine(pointO, pointPrimeC);
  const oAp = makeLine(pointO, pointPrimeA);
  pointB.moveLine = oBp;
  pointA.moveLine = oAp;
  pointC.moveLine = oCp;
  pointA.upBound = pointPrimeA;
  pointA.downBound = pointO;
  pointB.upBound = pointPrimeB;
  pointB.downBound = pointO;
  pointC.upBound = pointPrimeC;
  pointC.downBound = pointO;
  Object.assign(oAp, solveLinearEquation(
    {x: pointO.left!, y: pointO.top!}, {x: pointPrimeA.left!, y: pointPrimeA.top!}));
  Object.assign(oBp, solveLinearEquation(
    {x: pointO.left!, y: pointO.top!}, {x: pointPrimeB.left!, y: pointPrimeB.top!}));
  Object.assign(oCp, solveLinearEquation(
    {x: pointO.left!, y: pointO.top!}, {x: pointPrimeC.left!, y: pointPrimeC.top!}));
  cvsDes.add(pointO, oBp, oCp, oAp);
  log("obp", oBp);
  // Triangle part
  const ab = makeLine(pointA, pointB);
  const ac = makeLine(pointA, pointC);
  const bc = makeLine(pointB, pointC);
  const apBp = makeLine(pointPrimeA, pointPrimeB);
  const apCp = makeLine(pointPrimeA, pointPrimeC);
  const bpCp = makeLine(pointPrimeB, pointPrimeC);
  cvsDes.add(ab, ac, bc, apBp, apCp, bpCp);
  // Assign respective lines and points
  Object.assign(ab, {
    p1: pointA,
    p2: pointB,
    thatLine: apBp,
  });
  Object.assign(ac, {
    p1: pointA,
    p2: pointC,
    thatLine: apCp,
  });
  Object.assign(bc, {
    p1: pointC,
    p2: pointB,
    thatLine: bpCp,
  });
  Object.assign(apBp, {
    p1: pointPrimeA,
    p2: pointPrimeB,
    thatLine: ab,
  });
  Object.assign(apCp, {
    p1: pointPrimeA,
    p2: pointPrimeC,
    thatLine: ac,
  });
  Object.assign(bpCp, {
    p1: pointPrimeC,
    p2: pointPrimeB,
    thatLine: bc,
  });
  pointA.crossLines = [ab, ac];
  pointB.crossLines = [ab, bc];
  pointC.crossLines = [ac, bc];

  // Collinear & cocurrent
  const pointP = makeCircle(calculateLineIntersectInPoints(bc, bpCp, true)!, 3, "red");
  const cp = makeLine(pointC, pointP);
  const cpP = makeLine(pointPrimeC, pointP);

  const pointQ = makeCircle(calculateLineIntersectInPoints(ac, apCp, true)!, 3, "red");
  const pointR = makeCircle(calculateLineIntersectInPoints(ab, apBp, true)!, 3, "red");
  const aq = makeLine(pointA, pointQ);
  const apQ = makeLine(pointPrimeA, pointQ);
  const ar = makeLine(pointA, pointR);
  const apR = makeLine(pointPrimeA, pointR);
  const pq = makeLine(pointP, pointQ);
  pq.p1 = pointP;
  pq.p2 = pointQ;
  cvsDes.add(pointP, pointQ, pointR);
  cvsDes.add(cp, cpP, aq, apQ, ar, apR, pq);
  // Assigning intersections
  ab.inter = pointR;
  apBp.inter = pointR;
  ac.inter = pointQ;
  apCp.inter = pointQ;
  bc.inter = pointP;
  bpCp.inter = pointP;
  // Intersection lines
  pointR.crossLines = [ar, apR];
  ar.p1 = pointA;
  ar.p2 = pointR;
  apR.p1 = pointPrimeA;
  apR.p2 = pointR;
  pointQ.crossLines = [aq, apQ];
  aq.p1 = pointQ;
  aq.p2 = pointA;
  apQ.p1 = pointPrimeA;
  apQ.p2 = pointQ;
  pointP.crossLines = [cp, cpP];
  cp.p1 = pointC;
  cp.p2 = pointP;
  cpP.p1 = pointPrimeC;
  cpP.p2 = pointP;
  const oLabel = makeLabel("O", {x: -5, y: -30});
  const pLabel = makeLabel("P");
  const qLabel = makeLabel("Q", {x: -25, y: 0});
  const rLabel = makeLabel("R", {x: 10, y: 0});
  setLabelToPoint([oLabel, pLabel, qLabel, rLabel], [pointO, pointP, pointQ, pointR]);
  cvsDes.add(oLabel, pLabel, qLabel, rLabel);
  [pointPrimeA, pointPrimeB, pointPrimeC, pointO, pointP, pointQ, pointR].forEach(p => {
    p.set({lockMovementX: true, lockMovementY: true});
  });

  // Interaction
  const onPointMove = (e: IEvent): void => {
    const p = e.target! as Circle;
    // Restrict movement to line
    if (p.moveLine !== undefined) {
      // Restric boundries
      if (p.upBound !== undefined && p.top! > p.upBound.top!) p.top = p.upBound.top;
      if (p.downBound !== undefined && p.top! < p.downBound.top!) p.top = p.downBound.top;
      let x = (p.top! - p.moveLine.b!) / p.moveLine.m!;
      if (p.moveLine.m === Infinity) x = p.moveLine.x1!;
      p.set("left", x);
    }
    // TODO set up & down boundaries

    if (p.crossLines !== undefined) {
      p.crossLines.forEach(line => {
        // Adjust line position
        line.set({
          x1: line.p1!.left,
          y1: line.p1!.top,
          x2: line.p2!.left,
          y2: line.p2!.top,
        });
        // Adjust intersections accordingly
        if (line.inter !== undefined && line.inter.crossLines !== undefined) {
          updateInterAndLine(line, line.thatLine!, line.inter);
          setLabelToPoint([line.inter.label!], [line.inter]);
        }
      });
    }
    // Update the collinear PQ line
    // Extend to canvas width
    Object.assign(pq, solveLinearEquation({x: pq.p1!.left!, y: pq.p1!.top!}, {x:pq.p2!.left!, y:pq.p2!.top!}));
    pq.set({
      x1: 0,
      y1: pq.b,
      x2: cvsWidth,
      y2: cvsWidth*pq.m! + pq.b!,
    });
    // Update according to position change
    if (p.label !== undefined) {
      setLabelToPoint([p.label], [p]);
    }
  };
  cvsDes.on("object:moving", onPointMove);
}

/**
 * Part II
 */

function partTwo() {
  const cvsPascal = new fabric.Canvas("Pascal-canvas", {
    selection: false,
    backgroundColor: "aliceblue",
  });
  const RADIUS = 80;
  const center = { x: 150, y: 350 } as Coord;
  const centerPoint = makeCircle(center, 5, "red");
  let pointA = coordToPoint(polarToCartesian(RADIUS, 10, center));
  let pointB = coordToPoint(polarToCartesian(RADIUS, 45, center));
  let pointC = coordToPoint(polarToCartesian(RADIUS, 80, center));
  let pointD = coordToPoint(polarToCartesian(RADIUS, 110, center));
  let pointE = coordToPoint(polarToCartesian(RADIUS, 225, center));
  let pointF = coordToPoint(polarToCartesian(RADIUS, 310, center));

  const aLabel = makeLabel("A", { x: 20, y: -5 });
  const bLabel = makeLabel("B", { x: -20, y: 0 });
  const cLabel = makeLabel("C", { x: -10, y: 10 });
  const dLabel = makeLabel("D", { x: -35, y: -20 });
  const eLabel = makeLabel("E", { x: -10, y: 5 });
  const fLabel = makeLabel("F", { x: 5, y: 10 });
  setLabelToPoint([aLabel, bLabel, cLabel, dLabel, eLabel, fLabel],
    [pointA, pointB, pointC, pointD, pointE, pointF]);
  cvsPascal.add(aLabel, bLabel, cLabel, dLabel, eLabel, fLabel);

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
  cvsPascal.add(circle);

  const xLable = makeLabel("X", { x: 15, y: -5 });
  const yLable = makeLabel("Y");
  const zLable = makeLabel("Z", { x: 15, y: -10 });
  const pointX = new fabric.Point(0, 0);
  const pointY = new fabric.Point(0, 0);
  const pointZ = new fabric.Point(0, 0);
  const xy = makeLine(pointX, pointY, 1, "red");

  const dx = makeLine(pointX, pointD, 1, "blue");
  const bx = makeLine(pointB, pointX, 1, "blue");
  const cz = makeLine(pointC, pointZ, 1, "blue");
  const az = makeLine(pointA, pointZ, 1, "blue");
  const by = makeLine(pointB, pointY, 1, "blue");
  const fy = makeLine(pointF, pointY, 1, "blue");

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

  const poly = makeMovablePolygon([pointA, pointB, pointC, pointD, pointE, pointF],
    function (coords: fabric.Point[]) {
      [pointA, pointB, pointC, pointD, pointE, pointF] = coords;
      setLabelToPoint([aLabel, bLabel, cLabel, dLabel, eLabel, fLabel],
        coords);
      pointX.setFromPoint(
        calculateLineIntersectInPoints(  // de - ab
          makeLine(pointD, pointE),
          makeLine(pointA, pointB),
          true
        ) as fabric.Point
      );
      pointY.setFromPoint(
        calculateLineIntersectInPoints(  // ef - bc
          makeLine(pointF, pointE),
          makeLine(pointC, pointB),
          true
        ) as fabric.Point
      );
      pointZ.setFromPoint(
        calculateLineIntersectInPoints(  // af - dc
          makeLine(pointF, pointA),
          makeLine(pointC, pointD),
          true
        ) as fabric.Point
      );
      setLabelToPoint([xLable, yLable, zLable], [pointX, pointY, pointZ]);
      setLineFromPoints(dx, pointX, pointD);
      setLineFromPoints(bx, pointB, pointX);
      setLineFromPoints(cz, pointC, pointZ);
      setLineFromPoints(az, pointA, pointZ);
      setLineFromPoints(by, pointB, pointY);
      setLineFromPoints(fy, pointF, pointY);
      const { m, b } = solveLinearEquation(pointX, pointY);
      const y1 = m*500 + b;
      setLineFromPoints(xy, { x: 500, y: y1 }, { x: 0, y: b});
    },
    circleRestrict
  );
  cvsPascal.add(dx, bx, cz, az, by, fy, xy);
  cvsPascal.add(poly, xLable, yLable, zLable);
  log("poly", poly);

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

  function makeMovablePolygon(vertexes: fabric.Point[], fn: (points: fabric.Point[]) => void, fn2: (p: fabric.Point) => fabric.Point) {
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

export default defineComponent(
  {
    setup() {
      return { topic };
    },
    mounted() {
      const canvas = new fabric.Canvas("Pascal-Brainchon-canvas", {
        selection: false,
        backgroundColor: "floralwhite",
      });

      const bottomLine = new fabric.Line(  // # TODO use reduce
        [0, 400, 500, 400],
        {
          stroke: "black",
          hasControls: false,
          hasBorders: false,
          evented: false,
          strokeWidth: 2,
        }
      ) as Line;
      Object.assign(bottomLine, solveLinearEquation(
        new fabric.Point(bottomLine.x1!, bottomLine.y1!), new fabric.Point(bottomLine.x2!, bottomLine.y2!)
      ));
      // y = -0.12x + 100
      const upperLine = new fabric.Line(
        [0, 130, 500, 40],
        {
          stroke: "black",
          hasControls: false,
          hasBorders: false,
          evented: false,
          strokeWidth: 2,
        }
      ) as Line;
      Object.assign(upperLine, solveLinearEquation(
        new fabric.Point(upperLine.x1!, upperLine.y1!), new fabric.Point(upperLine.x2!, upperLine.y2!)
      ));

      const aLabel = makeLabel("A", { x: -20, y: 15 });
      const bLabel = makeLabel("B", { x: 0, y: 15 });
      const cLabel = makeLabel("C", { x: 5, y: 15 });
      const aprimeLabel = makeLabel("A'", { x: -20, y: -40 });
      const bprimeLabel = makeLabel("B'", { x: 0, y: -40 });
      const cprimeLabel = makeLabel("C'", { x: 0, y: -40 });
      const xLabel = makeLabel("X", { x: 20, y: 0 });
      const yLabel = makeLabel("Y", { x: -5, y: 20 });
      const zLabel = makeLabel("Z", { x: -30, y: 0 });

      const pointA = makeCircle(50, 400);
      const pointB = makeCircle(250, 400);
      const pointC = makeCircle(450, 400);
      const pointPrimeA = makeCircle(50, upperLine.m! * 50 + upperLine.b!);
      const pointPrimeB = makeCircle(250, upperLine.m! * 250 + upperLine.b!);
      const pointPrimeC = makeCircle(450, upperLine.m! * 450 + upperLine.b!);

      const movablePoints = [pointA, pointB, pointC, pointPrimeA, pointPrimeB, pointPrimeC];

      setLabelToPoint(
        [aLabel, bLabel, cLabel, aprimeLabel, bprimeLabel, cprimeLabel],
        movablePoints
      );

      const pointsFromMovables = movablePoints.map(ele => new fabric.Point(ele.left!, ele.top!));
      const [pA, pB, pC, ppA, ppB, ppC] = pointsFromMovables;
      const aBprime = makeLine(pA, ppB, undefined, "blue");
      const aCprime = makeLine(pA, ppC, undefined, "blue");
      const bAprime = makeLine(pB, ppA, undefined, "blue");
      const bCprime = makeLine(pB, ppC, undefined, "blue");
      const cAprime = makeLine(pC, ppA, undefined, "blue");
      const cBprime = makeLine(pC, ppB, undefined, "blue");

      const pZ = fabric.Intersection.intersectLineLine(
        pA, ppB, ppA, pB).points![0];

      const pY = (fabric.Intersection.intersectLineLine(
        pA, ppC, ppA, pC) as Intersection).points![0];
      const pX = (fabric.Intersection.intersectLineLine(
        pB, ppC, pC, ppB) as Intersection).points![0];
      const [pointX, pointY, pointZ] = [pX, pY, pZ].map(p => makeCircle(p, undefined, 3));
      // Disable user dragging on intersections
      pointX.set({lockMovementX: true, lockMovementY: true});
      pointY.set({lockMovementX: true, lockMovementY: true});
      pointZ.set({lockMovementX: true, lockMovementY: true});

      setLabelToPoint([zLabel, yLabel, xLabel], [pointZ, pointY, pointX]);

      pointA.rightBound = pointB;
      pointB.leftBound = pointA;
      pointB.rightBound = pointC;
      pointC.leftBound = pointB;
      pointPrimeA.rightBound = pointPrimeB;
      pointPrimeB.leftBound = pointPrimeA;
      pointPrimeB.rightBound = pointPrimeC;
      pointPrimeC.leftBound = pointPrimeB;

      const COLL_OFF_SET = 100;
      const collinearLine = makeLine(pZ, pX, 2, "red") as Line;
      collinearLine.p1 = pointZ;
      collinearLine.p2 = pointX;
      Object.assign(collinearLine, solveLinearEquation(
        new fabric.Point(collinearLine.p1!.left!, collinearLine.p1!.top!), new fabric.Point(collinearLine.p2!.left!, collinearLine.p2!.top!)
      ));
      collinearLine.set({
        x1: collinearLine.p1!.left! - COLL_OFF_SET,
        y1: collinearLine.m! * (collinearLine.p1!.left! - COLL_OFF_SET) + collinearLine.b!,
        x2: collinearLine.p2!.left! + COLL_OFF_SET,
        y2: collinearLine.m! * (collinearLine.p2!.left! + COLL_OFF_SET) + collinearLine.b!,
      });
      log("coll", collinearLine);

      // Bind related lines and intersects to points
      pointA.upLine = [aBprime, aCprime];
      pointA.intersects = [pointZ, pointY];
      pointB.upLine = [bAprime, bCprime];
      pointB.intersects = [pointZ, pointX];
      pointC.upLine = [cAprime, cBprime];
      pointC.intersects = [pointY, pointX];
      pointPrimeA.downLine = [bAprime, cAprime];
      pointPrimeA.intersects = [pointZ, pointY];
      pointPrimeB.downLine = [aBprime, cBprime];
      pointPrimeB.intersects = [pointZ, pointX];
      pointPrimeC.downLine = [aCprime, bCprime];
      pointPrimeC.intersects = [pointY, pointX];

      // Bind lines to intersects
      pointZ.crossLines = [aBprime, bAprime];
      pointY.crossLines = [cAprime, aCprime];
      pointX.crossLines = [bCprime, cBprime];

      const onPointMove = (e: IEvent): void => {
        const p = e.target! as Circle;
        // Setting the boundaries of the point's position
        if (p.leftBound !== undefined && p.left! < p.leftBound.left!) {
          p.left = p.leftBound.left;
        }
        if (p.rightBound !== undefined && p.left! > p.rightBound.left!) {
          p.left = p.rightBound.left;
        }
        if (p.upLine !== undefined) {
          p.top = 400;  // Hard-coded for now
        } else if (p.downLine !== undefined) {
          p.top = upperLine.m! * p.left! + upperLine.b!;
        }

        if (p.upLine !== undefined) {
          p.upLine.forEach(line => line.set({ x1: p.left }));
        }
        if (p.downLine !== undefined) {
          p.downLine.forEach(line => line.set({ x2: p.left, y2: p.top }));
        }

        if (p.intersects !== undefined) {
            p.intersects.forEach(inter => {
              const [l1, l2] = inter.crossLines!;
              const intersect = getIntersectFromLines(l1, l2);
              const coord = { left: intersect.x, top: intersect.y };
              inter.set(coord);
            if (inter.label !== undefined) {
              setLabelToPoint([inter.label!], [coord]);
            }
            });
            Object.assign(collinearLine, solveLinearEquation(
              {x: collinearLine.p1!.left!, y: collinearLine.p1!.top!}, {x: collinearLine.p2!.left!, y: collinearLine.p2!.top!}
            ));
            collinearLine.set({
              x1: collinearLine.p1!.left! - COLL_OFF_SET,
              y1: collinearLine.m! * (collinearLine.p1!.left! - COLL_OFF_SET) + collinearLine.b!,
              x2: collinearLine.p2!.left! + COLL_OFF_SET,
              y2: collinearLine.m! * (collinearLine.p2!.left! + COLL_OFF_SET) + collinearLine.b!,
            });
        }

        if (p.label !== undefined) {
          setLabelToPoint([p.label!], [{ top: p.top!, left: p.left! }]);
        }
      };

      canvas.on("object:moving", onPointMove);

      canvas.add(aLabel, bLabel, cLabel,
        aprimeLabel, bprimeLabel, cprimeLabel, xLabel, yLabel, zLabel);
      canvas.add(...movablePoints);
      canvas.add(aBprime, aCprime, bAprime, bCprime, cAprime, cBprime, collinearLine);
      canvas.add(pointX, pointY, pointZ);
      canvas.add(bottomLine, upperLine);

      /**
       * Part two of animation Pascal Theorem
       */
      partTwo();

      /**
       * Part three of animation: Desargues' Theorem
       */
      partThree();
    },
  },
);

/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
</script>
