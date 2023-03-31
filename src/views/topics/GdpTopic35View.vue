<template>
  <TopicMeta :topic="topic" />

  <ATypographyParagraph> </ATypographyParagraph>
  <div id="Pappus-Area-wrapper">
    <ATypographyTitle :level="4">Animated Pappus's Area</ATypographyTitle>
    <canvas id="Pappus-Area-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import {
  calculateLineIntersectInLinearEquation,
  calculateSignedDistanceFromPointToLine,
  solveLinearEquation,
} from "@/utils/geometry";

const topic = indexTopicMap.get(35) as Topic;

function createCircle(x?: number, y?: number, radius?: number, fill?: string): fabric.Circle {
  return new fabric.Circle({
    originX: "center",
    originY: "center",
    left: x || 0,
    top: y || 0,
    hasControls: false,
    hasBorders: false,
    evented: false,
    radius: radius || 1,
    fill: fill || "transparent",
    cornerSize: 20,
  });
}

function createPolygon(vertices?: fabric.Point[], fill?: string): fabric.Polygon {
  return new fabric.Polygon(vertices || [], {
    fill: "transparent" || fill,
    stroke: "black",
    strokeWidth: 1.5,
    objectCaching: false,
    transparentCorners: false,
    cornerColor: "transparent",
    hasBorders: false,
    hasControls: false,
    hoverCursor: "normal",
    lockMovementX: true,
    lockMovementY: true,
  }).setControlsVisibility({
    mt: false,
    mb: false,
    ml: false,
    mr: false,
    mtr: false,
  });
}

function createLabel(text: string, fontSize?: number, color?: string) {
  return new fabric.Text(text, {
    hasControls: false,
    hasBorders: false,
    evented: false,
    fontSize: fontSize || 22,
    fill: color || "black",
  });
}

function createLine(points?: number[], color?: string, strokeWidth?: number) {
  return new fabric.Line(points || [], {
    hasControls: false,
    hasBorders: false,
    evented: false,
    stroke: color || "black",
    strokeWidth: strokeWidth || 1,
  });
}

function getIntersectFromLines(
  point1: fabric.Point,
  point2: fabric.Point,
  point3: fabric.Point,
  point4: fabric.Point
): fabric.Point {
  const l1 = solveLinearEquation(point1, point2);
  const l2 = solveLinearEquation(point3, point4);
  return calculateLineIntersectInLinearEquation(l1.m, l1.b, l2.m, l2.b);
}

export default defineComponent({
  setup() {
    return { topic };
  },

  mounted() {
    (() => {
      const canvas = new fabric.Canvas("Pappus-Area-canvas", {
        selection: false,
        backgroundColor: "floralwhite",
      });

      const vertexA = createCircle(300, 180, 3, "red").set({ evented: true });
      const vertexB = createCircle(100, 330, 3, "red").set({ evented: true });
      const vertexC = createCircle(400, 330, 3, "red").set({ evented: true });
      const vertexD = createCircle(350, 140, 3, "red").set({ evented: true });
      const vertexE = createCircle(250, 130, 3, "red").set({ evented: true });

      const pointA = new fabric.Point(vertexA.left as number, vertexA.top as number);
      const pointB = new fabric.Point(vertexB.left as number, vertexB.top as number);
      const pointC = new fabric.Point(vertexC.left as number, vertexC.top as number);
      const pointD = new fabric.Point(vertexD.left as number, vertexD.top as number);
      const pointE = new fabric.Point(vertexE.left as number, vertexE.top as number);

      const triangleABC = createPolygon();
      const polygonABHE = createPolygon();
      const polygonADGC = createPolygon();
      const polygonBQPK = createPolygon();
      const polygonQCMP = createPolygon();

      const lineFD = createLine();
      const lineFE = createLine();
      const lineFA = createLine();
      const lineLB = createLine();
      const lineTC = createLine();
      const lineAQ = createLine();

      const labelA = createLabel("A");
      const labelB = createLabel("B");
      const labelC = createLabel("C");
      const labelD = createLabel("D");
      const labelE = createLabel("E");
      const labelF = createLabel("F");
      const labelG = createLabel("G");
      const labelH = createLabel("H");
      const labelK = createLabel("K");
      const labelL = createLabel("L");
      const labelM = createLabel("M");
      const labelP = createLabel("P");
      const labelQ = createLabel("Q");
      const lableT = createLabel("T");

      const updateCanvas = () => {
        pointA.setXY(vertexA.left as number, vertexA.top as number);
        pointB.setXY(vertexB.left as number, vertexB.top as number);
        pointC.setXY(vertexC.left as number, vertexC.top as number);
        pointD.setXY(vertexD.left as number, vertexD.top as number);
        pointE.setXY(vertexE.left as number, vertexE.top as number);

        const vertices = [pointA, pointB, pointC];

        const pointG = new fabric.Point(
          pointD.x - pointA.x + pointC.x,
          pointD.y - pointA.y + pointC.y
        );
        const pointH = new fabric.Point(
          pointE.x - pointA.x + pointB.x,
          pointE.y - pointA.y + pointB.y
        );
        const pointF: fabric.Point = getIntersectFromLines(pointH, pointE, pointD, pointG);
        const pointFA = new fabric.Point(pointF.x - pointA.x, pointF.y - pointA.y);

        const pointL: fabric.Point = getIntersectFromLines(
          new fabric.Point(pointFA.x + pointB.x, pointFA.y + pointB.y),
          pointB,
          pointE,
          pointH
        );
        const pointT: fabric.Point = getIntersectFromLines(
          new fabric.Point(pointFA.x + pointC.x, pointFA.y + pointC.y),
          pointC,
          pointD,
          pointG
        );

        const pointM = new fabric.Point(pointC.x - pointFA.x, pointC.y - pointFA.y);
        const pointK = new fabric.Point(pointB.x - pointFA.x, pointB.y - pointFA.y);

        const pointQ: fabric.Point = getIntersectFromLines(pointF, pointA, pointB, pointC);

        const pointP: fabric.Point = getIntersectFromLines(pointK, pointM, pointF, pointA);

        triangleABC.set({ points: vertices });

        polygonABHE.set({
          points: [pointA, pointB, pointH, pointE],
          fill: "#fbbcbc",
        });
        polygonADGC.set({
          points: [pointA, pointD, pointG, pointC],
          fill: "#b4b1f1",
        });
        polygonBQPK.set({
          points: [pointB, pointQ, pointP, pointK],
          fill: "#fbbcbc",
        });
        polygonQCMP.set({
          points: [pointQ, pointC, pointM, pointP],
          fill: "#b4b1f1",
        });

        lineFD.set({ x1: pointF.x, y1: pointF.y, x2: pointD.x, y2: pointD.y, strokeWidth: 1.5 });
        lineFE.set({ x1: pointF.x, y1: pointF.y, x2: pointE.x, y2: pointE.y, strokeWidth: 1.5 });
        lineFA.set({
          x1: pointF.x,
          y1: pointF.y,
          x2: pointA.x,
          y2: pointA.y,
          strokeWidth: 1,
          stroke: "red",
        });
        lineLB.set({
          x1: pointL.x,
          y1: pointL.y,
          x2: pointB.x,
          y2: pointB.y,
          strokeWidth: 1,
          strokeDashArray: [5, 5],
        });
        lineTC.set({
          x1: pointT.x,
          y1: pointT.y,
          x2: pointC.x,
          y2: pointC.y,
          strokeWidth: 1,
          strokeDashArray: [5, 5],
        });
        lineAQ.set({
          x1: pointA.x,
          y1: pointA.y,
          x2: pointQ.x,
          y2: pointQ.y,
          strokeWidth: 1,
          strokeDashArray: [5, 5],
        });

        labelA.set({
          left: pointA.x - 6,
          top: pointA.y - 30,
        });
        labelB.set({
          left: pointB.x - 25,
          top: pointB.y - 8,
        });
        labelC.set({
          left: pointC.x + 10,
          top: pointC.y - 8,
        });
        labelD.set({
          left: pointD.x - 5,
          top: pointD.y - 28,
        });
        labelE.set({
          left: pointE.x - 8,
          top: pointE.y - 28,
        });
        labelF.set({
          left: pointF.x - 3,
          top: pointF.y - 25,
        });
        labelG.set({
          left: pointG.x + 5,
          top: pointG.y - 12,
        });
        labelH.set({
          left: pointH.x - 25,
          top: pointH.y - 10,
        });
        labelL.set({
          left: pointL.x - 8,
          top: pointL.y - 28,
        });
        lableT.set({
          left: pointT.x + 5,
          top: pointT.y - 12,
        });
        labelQ.set({
          left: pointQ.x + 3,
          top: pointQ.y - 28,
        });
        labelP.set({
          left: pointP.x,
          top: pointP.y,
        });
        labelK.set({
          left: pointK.x - 20,
          top: pointK.y - 5,
        });
        labelM.set({
          left: pointM.x + 5,
          top: pointM.y - 5,
        });
      };

      const limitMovement = () => {
        pointA.setXY(vertexA.left as number, vertexA.top as number);
        pointB.setXY(vertexB.left as number, vertexB.top as number);
        pointC.setXY(vertexC.left as number, vertexC.top as number);
        pointD.setXY(vertexD.left as number, vertexD.top as number);
        pointE.setXY(vertexE.left as number, vertexE.top as number);

        const pointG = new fabric.Point(
          pointD.x - pointA.x + pointC.x,
          pointD.y - pointA.y + pointC.y
        );
        const pointH = new fabric.Point(
          pointE.x - pointA.x + pointB.x,
          pointE.y - pointA.y + pointB.y
        );
        const pointF: fabric.Point = getIntersectFromLines(pointH, pointE, pointD, pointG);

        const movingObject = canvas.getActiveObject();
        if (!movingObject) return;

        // Restrict movement of point E
        if (movingObject === vertexE) {
          const signedDistanceE = calculateSignedDistanceFromPointToLine(
            [vertexE.left ?? 0, vertexE.top ?? 0],
            [pointA.x, pointA.y],
            [pointF.x, pointF.y]
          );
          if (signedDistanceE <= 0) {
            vertexE.set({ left: 250, top: 130 });
          }
          console.log(signedDistanceE);
        }
        // Restrict movement of point D
        if (movingObject === vertexD) {
          const signedDistanceD = calculateSignedDistanceFromPointToLine(
            [vertexD.left ?? 0, vertexD.top ?? 0],
            [pointA.x, pointA.y],
            [pointF.x, pointF.y]
          );
          if (signedDistanceD >= 0) {
            vertexD.set({ left: 350, top: 140 });
          }
          console.log(signedDistanceD);
        }
        updateCanvas();
      };

      updateCanvas();
      canvas.on("object:moving", () => {
        updateCanvas();
        limitMovement();
      });

      canvas.add(triangleABC, labelA, labelB, labelC, vertexA, vertexB, vertexC, vertexD, vertexE);
      canvas.add(
        labelD,
        labelE,
        labelG,
        labelH,
        labelF,
        labelL,
        lableT,
        labelQ,
        labelP,
        labelK,
        labelM
      );
      canvas.add(polygonABHE, polygonADGC, polygonBQPK, polygonQCMP);
      canvas.add(lineFD, lineFE, lineLB, lineTC, lineFA, lineAQ);
      canvas.add(vertexA, vertexB, vertexC, vertexD, vertexE);
    })();
  },
});
</script>
