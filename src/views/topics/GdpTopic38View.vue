<template>
  <TopicMeta :topic="topic" />

  <div id="rouths-theorem-wrapper">
    <ATypographyTitle :level="4">Animated Routh's Theorem</ATypographyTitle>
    <canvas id="routh-theorem-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";
import {
  calculateSlope,
  calculateLineIntersectInPoints,
  solveLinearEquation,
  calculateDistanceBetweenTwoPoints,
} from "@/utils/geometry";

const topic = indexTopicMap.get(38) as Topic;

type Circle = fabric.Circle & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  moveLine?: Line; // The line on which the point moves.
  upBound?: Circle; // The upper bound of the line.
  downBound?: Circle; // The lower bound of the line.
};

type Line = fabric.Line & {
  p1?: Circle;
  p2?: Circle;
  m?: number;
  b?: number;
};

interface Coord {
  x: number;
  y: number;
}

const makeLine = (
  pt1: Coord | fabric.Point | fabric.Circle,
  pt2: Coord | fabric.Point | fabric.Circle,
  strokeWidth?: number,
  stroke?: string
): Line => {
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

function makeCircle(point: fabric.Point | Coord, radius?: number, fill?: any): Circle;
function makeCircle(x: number, y: number, radius?: any, fill?: string): Circle;
function makeCircle(
  x: number | fabric.Point | Coord,
  y?: number,
  radius?: any,
  fill?: string
): Circle {
  if (typeof x !== "number") {
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

function createLabel(text: string, fontSize?: number, color?: string) {
  return new fabric.Text(text, {
    hasControls: false,
    hasBorders: false,
    evented: false,
    fontSize: fontSize || 24,
    fill: color || "black",
  });
}

function circleToCoord(...circle: Circle[]): fabric.Point[] {
  return circle.map((c) => new fabric.Point(c.left!, c.top!));
}

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("routh-theorem-canvas", {
      selection: false,
      backgroundColor: "floralwhite",
    });

    const vertexes = [
      new fabric.Point(320, 100),
      new fabric.Point(50, 400),
      new fabric.Point(450, 400),
    ];

    const lineAB = makeLine(vertexes[0], vertexes[1]);
    const lineBC = makeLine(vertexes[1], vertexes[2]);
    const lineCA = makeLine(vertexes[2], vertexes[0]);

    const aLabel = createLabel("A");
    const bLabel = createLabel("B");
    const cLabel = createLabel("C");
    const dLabel = createLabel("D");
    const eLabel = createLabel("E");
    const fLabel = createLabel("F");

    const rLabel = createLabel("R", 20, "red");
    const pLabel = createLabel("P", 20, "red");
    const qLabel = createLabel("Q", 20, "red");

    const valueX = createLabel("0");
    const valueY = createLabel("0");
    const valueZ = createLabel("0");

    const valueTrianglePQR = createLabel("1");

    const triangle = new fabric.Polygon(vertexes, {
      fill: "transparent",
      strokeWidth: 1.5,
      stroke: "black",
      objectCaching: false,
      transparentCorners: false,
      cornerStyle: "circle",
      cornerColor: "transparent",
      cornerSize: 20,
      hasBorders: false,
      evented: false,
    });

    const pointA = makeCircle(vertexes[0]);
    const pointB = makeCircle(vertexes[1]);
    const pointC = makeCircle(vertexes[2]);

    const slopeAB = calculateSlope(vertexes[0], vertexes[1]);
    const slopeCA = calculateSlope(vertexes[2], vertexes[0]);

    const pointD = makeCircle(200, 400);
    const pointE = makeCircle(400, slopeCA * (400 - vertexes[2].x) + vertexes[2].y);
    const pointF = makeCircle(200, slopeAB * (200 - vertexes[1].x) + vertexes[1].y);

    const lineAD = makeLine(pointD, vertexes[0], 1, "green");
    const lineBE = makeLine(pointE, vertexes[1], 1, "green");
    const lineCF = makeLine(pointF, vertexes[2], 1, "green");

    const pointR = makeCircle(
      calculateLineIntersectInPoints(lineBE, lineAD, true)!,
      2,
      "transparent"
    );
    const pointP = makeCircle(
      calculateLineIntersectInPoints(lineBE, lineCF, true)!,
      2,
      "transparent"
    );
    const pointQ = makeCircle(
      calculateLineIntersectInPoints(lineAD, lineCF, true)!,
      2,
      "transparent"
    );

    function setLabelToPoint() {
      aLabel.set({
        left: vertexes[0].x - 10,
        top: vertexes[0].y - 30,
      });
      bLabel.set({
        left: vertexes[1].x - 20,
        top: vertexes[1].y - 5,
      });
      cLabel.set({
        left: vertexes[2].x + 5,
        top: vertexes[2].y - 5,
      });
      dLabel.set({
        left: pointD.left! - 10,
        top: pointD.top! + 3,
      });
      eLabel.set({
        left: pointE.left! + 8,
        top: pointE.top! - 18,
      });
      fLabel.set({
        left: pointF.left! - 20,
        top: pointF.top! - 20,
      });
      rLabel.set({
        left: pointR.left! - 15,
        top: pointR.top! - 25,
      });
      pLabel.set({
        left: pointP.left! - 5,
        top: pointP.top! - 25,
      });
      qLabel.set({
        left: pointQ.left! - 12,
        top: pointQ.top! - 30,
      });
    }

    function calcArea() {
      const pointCoords = circleToCoord(pointA, pointB, pointC, pointD, pointE, pointF);
      const x =
        calculateDistanceBetweenTwoPoints(pointCoords[1], pointCoords[3]) /
        calculateDistanceBetweenTwoPoints(pointCoords[3], pointCoords[2]);
      valueX.set({
        text: x.toFixed(2),
        left: 80,
        top: 35,
        strokeWidth: 0.3,
        fontSize: 17,
      });
      const y =
        calculateDistanceBetweenTwoPoints(pointCoords[2], pointCoords[4]) /
        calculateDistanceBetweenTwoPoints(pointCoords[0], pointCoords[4]);
      valueY.set({
        text: y.toFixed(2),
        left: 173,
        top: 35,
        strokeWidth: 0.3,
        fontSize: 17,
      });
      const z =
        calculateDistanceBetweenTwoPoints(pointCoords[0], pointCoords[5]) /
        calculateDistanceBetweenTwoPoints(pointCoords[5], pointCoords[1]);
      valueZ.set({
        text: z.toFixed(2),
        left: 265,
        top: 35,
        strokeWidth: 0.3,
        fontSize: 17,
      });
      const areaPQR =
        (Math.pow(x * y * z - 1, 2) / (x * z + z + 1)) * (x * y + x + 1) * (y * z + y + 1);

      valueTrianglePQR.set({
        text: areaPQR.toFixed(2),
        left: 100,
        top: 119,
        fontSize: 17,
      });
    }

    const trianglePQR = new fabric.Polygon(circleToCoord(pointP, pointQ, pointR), {
      fill: "pink",
      strokeWidth: 1,
      stroke: "transparent",
      objectCaching: false,
      transparentCorners: false,
    });
    trianglePQR.selectable = false;
    trianglePQR.evented = false;

    [pointR, pointP, pointQ].forEach((p) => {
      p.set({ lockMovementX: true, lockMovementY: true, evented: false });
    });

    Object.assign(lineAB, solveLinearEquation(vertexes[0], vertexes[1]));
    Object.assign(lineBC, solveLinearEquation(vertexes[1], vertexes[2]));
    Object.assign(lineCA, solveLinearEquation(vertexes[2], vertexes[0]));

    pointD.moveLine = lineBC;
    pointE.moveLine = lineCA;
    pointF.moveLine = lineAB;
    pointD.upBound = pointB;
    pointD.downBound = pointC;
    pointE.upBound = pointA;
    pointE.downBound = pointC;
    pointF.upBound = pointA;
    pointF.downBound = pointB;

    const onPointMove = (e: IEvent): void => {
      const p = e.target as Circle;
      if (p.moveLine !== undefined) {
        // Restric boundries
        if (p.upBound !== undefined && p.top! < p.upBound.top!) p.top = p.upBound.top;
        if (p.downBound !== undefined && p.top! > p.downBound.top!) p.top = p.downBound.top;
        let x = (p.top! - p.moveLine.b!) / p.moveLine.m!;
        if (p.moveLine.m === 0) {
          if (p.upBound !== undefined && p.left! < p.upBound.left!) p.left = p.upBound.left;
          if (p.downBound !== undefined && p.left! > p.downBound.left!) p.left = p.downBound.left;
          x = p.left!;
        }
        p.set("left", x);
      }

      lineAD.set({
        x1: pointD.left!,
        y1: pointD.top!,
        x2: vertexes[0].x,
        y2: vertexes[0].y,
      });
      lineBE.set({
        x1: pointE.left!,
        y1: pointE.top!,
        x2: vertexes[1].x,
        y2: vertexes[1].y,
      });
      lineCF.set({
        x1: pointF.left!,
        y1: pointF.top!,
        x2: vertexes[2].x,
        y2: vertexes[2].y,
      });

      pointR.set({
        left: calculateLineIntersectInPoints(lineBE, lineAD, true)!.x,
        top: calculateLineIntersectInPoints(lineBE, lineAD, true)!.y,
      });
      pointP.set({
        left: calculateLineIntersectInPoints(lineBE, lineCF, true)!.x,
        top: calculateLineIntersectInPoints(lineBE, lineCF, true)!.y,
      });

      pointQ.set({
        left: calculateLineIntersectInPoints(lineAD, lineCF, true)!.x,
        top: calculateLineIntersectInPoints(lineAD, lineCF, true)!.y,
      });

      trianglePQR.set("points", circleToCoord(pointP, pointQ, pointR));
      setLabelToPoint();
      calcArea();
    };

    setLabelToPoint();
    calcArea();
    canvas.on("object:moving", onPointMove);

    const equationText = [
      ["BD", "DC"],
      ["CE", "AE"],
      ["AF", "FB"],
    ];
    equationText.forEach((equation, i) => {
      canvas.add(
        new fabric.Text(equation[0]).set({
          left: 35 + i * 91,
          top: 25,
          strokeWidth: 0.3,
          stroke: "black",
          fill: "black",
          fontSize: 15,
          evented: false,
        })
      );
      canvas.add(
        new fabric.Text(equation[1]).set({
          left: 35 + i * 91,
          top: 45,
          strokeWidth: 0.3,
          stroke: "black",
          fill: "black",
          fontSize: 15,
          evented: false,
        })
      );
    });
    canvas.add(
      new fabric.Text("_____               _____              _____", {
        left: 24,
        top: 27,
        strokeWidth: 0.3,
        stroke: "black",
        fill: "black",
        fontSize: 15,
        evented: false,
      })
    );
    canvas.add(
      new fabric.Text("=                       =                      =", {
        left: 65,
        top: 35,
        strokeWidth: 0.3,
        stroke: "black",
        fill: "black",
        fontSize: 15,
        evented: false,
      })
    );

    canvas.add(
      new fabric.Text("S△ABC =  1", {
        left: 30,
        top: 80,
        strokeWidth: 0.3,
        stroke: "black",
        fill: "black",
        fontSize: 15,
        evented: false,
      })
    );
    canvas.add(
      new fabric.Text("S△PQR =", {
        left: 30,
        top: 120,
        strokeWidth: 0.3,
        stroke: "black",
        fill: "black",
        fontSize: 15,

        evented: false,
      })
    );

    canvas.add(triangle, trianglePQR);
    canvas.add(pointD, pointE, pointF);
    canvas.add(pointR, pointP, pointQ);
    canvas.add(lineAD, lineBE, lineCF);
    canvas.add(aLabel, bLabel, cLabel, dLabel, eLabel, fLabel, rLabel, pLabel, qLabel);
    canvas.add(valueX, valueY, valueZ);
    canvas.add(valueTrianglePQR);
  },
});
</script>
