<template>
  <TopicMeta :topic="topic" />

  <ATypographyParagraph> </ATypographyParagraph>
  <div id="complete-quadrilateral-wrapper">
    <ATypographyTitle :level="4">Animated Complete Quadrilateral </ATypographyTitle>
    <canvas id="complete-quadrilateral-canvas" width="700" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import {
  solveLinearEquation,
  calculateLineIntersectInLinearEquation,
  calculateLineIntersectInPoints,
} from "@/utils/geometry";
const topic = indexTopicMap.get(15) as Topic;

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
  });
}

function createPolygon(vertices?: fabric.Point[]): fabric.Polygon {
  return new fabric.Polygon(vertices || [], {
    fill: "transparent",
    stroke: "red",
    strokeWidth: 1.5,
    objectCaching: false,
    transparentCorners: false,
    cornerColor: "transparent",
    hasBorders: false,
    hasControls: false,
    hoverCursor: "normal",
    lockMovementX: true,
    lockMovementY: true,
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

function coordToPoint(cd: Coord): fabric.Point {
  return new fabric.Point(cd.x, cd.y);
}
interface Coord {
  x: number;
  y: number;
}

const polygonABDF = createPolygon();

const lineBC: fabric.Line = createLine([], "red");
const lineFE: fabric.Line = createLine([], "red");
const lineCD: fabric.Line = createLine([], "red");
const lineDE: fabric.Line = createLine([], "red");

const extendedLineBF = createLine([]);
const extendedLineCE = createLine([]);
const extendedLineAD = createLine([]);

const lineAG: fabric.Line = createLine([]);
const lineBH: fabric.Line = createLine([]);
const lineCH: fabric.Line = createLine([]);

const labelA = createLabel("A");
const labelB = createLabel("B");
const labelC = createLabel("C");
const labelD = createLabel("D");
const labelE = createLabel("E");
const labelF = createLabel("F");
const labelG = createLabel("G");
const labelH = createLabel("H");

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("complete-quadrilateral-canvas", {
      selection: false,
      backgroundColor: "floralwhite",
    });

    const vertexA = createCircle(300, 75, 3, "black").set({ evented: true });
    const vertexB = createCircle(260, 120, 3, "black").set({ evented: true });
    const vertexD = createCircle(295, 180, 3, "black").set({ evented: true });
    const vertexF = createCircle(325, 160, 3, "black").set({ evented: true });

    function moveVertices() {
      const pointA = { x: vertexA.left, y: vertexA.top } as Coord;
      const pointB = { x: vertexB.left, y: vertexB.top } as Coord;
      //const pointC = { x: 0, y: 0 } as Coord;
      const pointD = { x: vertexD.left, y: vertexD.top } as Coord;
      //const pointE = { x: 0, y: 350 } as Coord;
      const pointF = { x: vertexF.left, y: vertexF.top } as Coord;

      const vertices = [
        coordToPoint(pointA),
        coordToPoint(pointB),
        coordToPoint(pointD),
        coordToPoint(pointF),
      ];

      polygonABDF.set({
        points: vertices,
      });

      console.log(vertices);

      const linearEuqationAB = solveLinearEquation(pointA, pointB);
      const linearEuqationDF = solveLinearEquation(pointD, pointF);

      const linearEuqationAF = solveLinearEquation(pointA, pointF);
      const linearEuqationBD = solveLinearEquation(pointB, pointD);

      const pointC = calculateLineIntersectInLinearEquation(
        linearEuqationAB.m,
        linearEuqationAB.b,
        linearEuqationDF.m,
        linearEuqationDF.b
      );
      const pointE = calculateLineIntersectInLinearEquation(
        linearEuqationAF.m,
        linearEuqationAF.b,
        linearEuqationBD.m,
        linearEuqationBD.b
      );

      console.log(pointE);
      console.log(pointC);

      // const lineAB = solveLinearEquation(pointA, pointB);
      // //pointC.x = (pointC.y - lineAB.b) / lineAB.m
      // const lineAF = solveLinearEquation(pointA, pointF);
      // pointE.x = (pointE.y - lineAF.b) / lineAF.m;

      lineBC.set({
        x1: pointB.x,
        y1: pointB.y,
        x2: pointC.x,
        y2: pointC.y,
      });

      lineFE.set({
        x1: pointF.x,
        y1: pointF.y,
        x2: pointE.x,
        y2: pointE.y,
      });

      lineCD.set({
        x1: pointC.x,
        y1: pointC.y,
        x2: pointD.x,
        y2: pointD.y,
      });

      lineDE.set({
        x1: pointD.x,
        y1: pointD.y,
        x2: pointE.x,
        y2: pointE.y,
      });

      extendedLineAD.set({
        x1: coordToPoint(pointA).lerp(coordToPoint(pointD), 10).x,
        y1: coordToPoint(pointA).lerp(coordToPoint(pointD), 10).y,
        x2: coordToPoint(pointA).lerp(coordToPoint(pointD), -10).x,
        y2: coordToPoint(pointA).lerp(coordToPoint(pointD), -10).y,
      });

      extendedLineBF.set({
        x1: coordToPoint(pointB).lerp(coordToPoint(pointF), 10).x,
        y1: coordToPoint(pointB).lerp(coordToPoint(pointF), 10).y,
        x2: coordToPoint(pointB).lerp(coordToPoint(pointF), -10).x,
        y2: coordToPoint(pointB).lerp(coordToPoint(pointF), -10).y,
      });

      extendedLineCE.set({
        x1: coordToPoint(pointC).lerp(coordToPoint(pointE), 10).x,
        y1: coordToPoint(pointC).lerp(coordToPoint(pointE), 10).y,
        x2: coordToPoint(pointC).lerp(coordToPoint(pointE), -10).x,
        y2: coordToPoint(pointC).lerp(coordToPoint(pointE), -10).y,
      });

      const pointG: fabric.Point | null = calculateLineIntersectInPoints(
        extendedLineAD,
        extendedLineCE
      );

      const pointH: fabric.Point | null = calculateLineIntersectInPoints(
        extendedLineBF,
        extendedLineCE
      );

      lineBH.set({
        x1: pointB.x,
        y1: pointB.y,
        x2: pointH!.x,
        y2: pointH!.y,
        strokeDashArray: [5, 5],
      });
      lineCH.set({
        x1: pointC.x,
        y1: pointC.y,
        x2: pointH!.x,
        y2: pointH!.y,
        strokeDashArray: [5, 5],
      });
      lineAG.set({
        x1: pointA.x,
        y1: pointA.y,
        x2: pointG!.x,
        y2: pointG!.y,
        strokeDashArray: [5, 5],
      });

      labelA.set({
        left: pointA.x - 8,
        top: pointA.y - 28,
      });
      labelB.set({
        left: pointB.x - 20,
        top: pointB.y - 20,
      });
      labelC.set({
        left: pointC.x - 20,
        top: pointC.y - 15,
      });
      labelD.set({
        left: pointD.x - 25,
        top: pointD.y - 15,
      });
      labelE.set({
        left: pointE.x,
        top: pointE.y,
      });
      labelF.set({
        left: pointF.x + 5,
        top: pointF.y - 25,
      });
      labelG.set({
        left: pointG!.x - 8,
        top: pointG!.y,
      });
      labelH.set({
        left: pointH!.x - 5,
        top: pointH!.y,
      });
    }

    moveVertices();
    canvas.on("object:moving", moveVertices);
    canvas.add(polygonABDF);
    canvas.add(lineBC, lineFE, lineCD, lineDE);
    canvas.add(lineBH, lineCH, lineAG);
    canvas.add(labelA, labelB, labelC, labelD, labelE, labelF, labelG, labelH);
    canvas.add(vertexA, vertexB, vertexD, vertexF);
  },
});
</script>
