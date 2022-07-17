<template>
  <TopicMeta :topic="topic" />
  <div id="Pascal-Brainchon-wrapper">
    <canvas id="Pascal-Brainchon-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";
import { calculateLineIntersectInLinearEquation, solveLinearEquation } from "@/utils/geometry";

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
  crossLines?: fabric.Line[],
  label?: Label,
  leftBound?: Circle,
  rightBound?: Circle,
};

type Line = fabric.Line & {
  p1?: Circle,
  p2?: Circle,
  m?: number,
  b?: number,
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

function isCircle(point: Circle | { top: number, left: number }): point is Circle {
  return point instanceof fabric.Circle;
}

function setLabelToPoint(labels: Label[], points: Circle[] | { top: number, left: number }[]): void;
function setLabelToPoint(labels: Label[], points: (Circle | { top: number, left: number })[]): void {
  for (let index = 0; index < labels.length; index++) {
    const label = labels[index];
    const point = points[index];
    label.left = point.left! + label.offSet.x;
    label.top = point.top! + label.offSet.y;
    if (isCircle(point)) {
      point.label = label;
    }
  }
}

function makeCircle(point: fabric.Point, radius?: number, fill?: any): Circle;
function makeCircle(x: number, y: number, radius?: number, fill?: string): Circle;
function makeCircle(x: number | fabric.Point, y?: number, radius?: number, fill?: string): Circle {
  if (x instanceof fabric.Point) {
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

const makeLine = (pt1: Coord | fabric.Point, pt2: Coord | fabric.Point,
  strokeWidth?: number, stroke?: string): fabric.Line => {
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

      const pZ = (fabric.Intersection.intersectLineLine(
        pA, ppB, ppA, pB) as Intersection).points![0];
      const pY = (fabric.Intersection.intersectLineLine(
        pA, ppC, ppA, pC) as Intersection).points![0];
      const pX = (fabric.Intersection.intersectLineLine(
        pB, ppC, pC, ppB) as Intersection).points![0]
      const [pointX, pointY, pointZ] = [pX, pY, pZ].map(p => makeCircle(p, undefined, 3))
      log("pointX", pointX)
      // Disable user dragging on intersections
      pointX.set({lockMovementX: true, lockMovementY: true})
      pointY.set({lockMovementX: true, lockMovementY: true})
      pointZ.set({lockMovementX: true, lockMovementY: true})

      setLabelToPoint([zLabel, yLabel, xLabel], [pointZ, pointY, pointX])

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
        // Setting the boundaris of the point's position
        if (p.leftBound !== undefined && p.left! < p.leftBound.left!) {
          p.left = p.leftBound.left
        }
        if (p.rightBound !== undefined && p.left! > p.rightBound.left!) {
          p.left = p.rightBound.left
        }
        if (p.upLine !== undefined) {
          p.top = 400 // Hard-coded for now
        } else if (p.downLine !== undefined) {
          p.top = upperLine.m! * p.left! + upperLine.b!
        }

        if (p.upLine !== undefined) {
          p.upLine.forEach(line => line.set({ x1: p.left }));
        }
        if (p.downLine !== undefined) {
          p.downLine.forEach(line => line.set({ x2: p.left, y2: p.top }));
        }

        if (p.intersects !== undefined) {
            p.intersects.forEach(inter => {
              const [l1, l2] = inter.crossLines!
              const intersect = getIntersectFromLines(l1, l2)
              const coord = { left: intersect.x, top: intersect.y }
              inter.set(coord)
            if (inter.label !== undefined) {
              setLabelToPoint([inter.label!], [coord]);
            }
            })
            Object.assign(collinearLine, solveLinearEquation(
              {x: collinearLine.p1!.left, y: collinearLine.p1!.top}, {x: collinearLine.p2!.left, y: collinearLine.p2!.top}
            ))
            collinearLine.set({
              x1: collinearLine.p1!.left! - COLL_OFF_SET,
              y1: collinearLine.m! * (collinearLine.p1!.left! - COLL_OFF_SET) + collinearLine.b!,
              x2: collinearLine.p2!.left! + COLL_OFF_SET,
              y2: collinearLine.m! * (collinearLine.p2!.left! + COLL_OFF_SET) + collinearLine.b!,
            })
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
      // const pB = new fabric.Point(90, 100);

      /**
       * Part two of animation Pascal Theorem
       */
    },
  },
);

/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
</script>
