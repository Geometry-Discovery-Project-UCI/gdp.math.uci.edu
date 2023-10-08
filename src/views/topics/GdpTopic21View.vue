<template>
  <TopicMeta :topic="topic" />
  <div id="maclaurin-theorem-wrapper">
    <ATypographyTitle :level="4">Maclaurin's Theorem</ATypographyTitle>
    <canvas id="maclaurin-theorem-canvas" width="700" height="700" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Coord, Topic } from "@/types";
import { fabric } from "fabric";
import { makeCircle, makeLabel, makeLine, makeMovablePoint } from "@/utils/canvas";
import {
  calculateLineIntersectInLinearEquation,
  findSlope,
  lineLineIntersection,
  polarToCartesian,
  solveLinearEquation,
  solvePerpendicularLineEquation,
} from "@/utils/geometry";

const topic = indexTopicMap.get(21) as Topic;

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("maclaurin-theorem-canvas", {
      selection: false,
    });

    function createPolygon(vertices?: fabric.Point[]): fabric.Polygon {
      return new fabric.Polygon(vertices || [], {
        fill: "transparent",
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
        evented: true,
      });
    }

    function coordToPoint(cd: Coord): fabric.Point {
      return new fabric.Point(cd.x, cd.y);
    }

    const RADIUS = 80;
    const center = { x: 280, y: 350 } as Coord;
    const circumCircle = makeCircle(RADIUS, coordToPoint(center));
    circumCircle.set({
      originX: "center",
      originY: "center",
      stroke: "black",
    });

    const pointG = makeMovablePoint(coordToPoint(polarToCartesian(RADIUS, 125, center)), 3).set({
      fill: "transparent",
      padding: 10,
    });
    const pointF = makeMovablePoint(coordToPoint(polarToCartesian(RADIUS, 50, center)), 3).set({
      fill: "transparent",
      padding: 10,
    });
    const pointE = makeMovablePoint(coordToPoint(polarToCartesian(RADIUS, 355, center)), 3).set({
      fill: "transparent",
      padding: 10,
    });
    const pointH = makeMovablePoint(coordToPoint(polarToCartesian(RADIUS, 205, center)), 3).set({
      fill: "transparent",
      padding: 10,
    });

    const circleG = makeCircle(3, new fabric.Point(pointG.left!, pointG.top!)).set({
      fill: "red",
      originX: "center",
      originY: "center",
    });

    const circleF = makeCircle(3, new fabric.Point(pointF.left!, pointF.top!)).set({
      fill: "red",
      originX: "center",
      originY: "center",
    });

    const circleE = makeCircle(3, new fabric.Point(pointE.left!, pointE.top!)).set({
      fill: "red",
      originX: "center",
      originY: "center",
    });

    const circleH = makeCircle(3, new fabric.Point(pointH.left!, pointH.top!)).set({
      fill: "red",
      originX: "center",
      originY: "center",
    });

    const polygonGFHE = createPolygon();
    const triangleTRI = createPolygon();

    const pointR = makeCircle();
    const pointI = makeCircle();
    const pointT = makeCircle();
    const pointO = makeCircle();

    pointO.set({
      left: center.x,
      top: center.y,
      originX: "center",
      originY: "center",
      radius: 2,
      fill: "black",
    });

    const pointP = makeCircle();
    const pointQ = makeCircle();
    const pointA = makeCircle();
    const pointB = makeCircle();
    const pointC = makeCircle();
    const pointD = makeCircle();

    const lineGR = makeLine();
    const lineFR = makeLine();
    const lineFI = makeLine();
    const lineEI = makeLine();
    const lineFH = makeLine();
    const lineGE = makeLine();
    const linePC = makeLine();
    const linePD = makeLine();
    const lineDQ = makeLine();
    const lineAQ = makeLine();
    const lineQI = makeLine();
    const lineAC = makeLine();
    const lineBD = makeLine();
    const lineBR = makeLine();
    const lineAI = makeLine();
    const lineCD = makeLine();
    const lineAB = makeLine();
    const lineBC = makeLine();
    const lineAD = makeLine();

    const labelO = makeLabel("O");

    labelO.set({
      left: center.x + 5,
      top: center.y - 10,
      fontSize: 20,
    });

    const labelG = makeLabel("G");
    const labelF = makeLabel("F");
    const labelE = makeLabel("E");
    const labelH = makeLabel("H");
    const labelT = makeLabel("T");
    const labelR = makeLabel("R");
    const labelI = makeLabel("I");
    const labelP = makeLabel("P");
    const labelQ = makeLabel("Q");
    const labelA = makeLabel("A");
    const labelB = makeLabel("B");
    const labelC = makeLabel("C");
    const labelD = makeLabel("D");

    const circleRestrict = (p: fabric.Point): fabric.Point => {
      let rad = Math.atan(-findSlope([center.x, center.y], [p.x, p.y]));
      if (p.x < center.x) {
        rad -= Math.PI;
      }
      const coord = polarToCartesian(RADIUS, rad, center, false);
      p.setFromPoint(coord);
      return p;
    };

    const moveVertices = () => {
      const pts = [
        new fabric.Point(pointG.left as number, pointG.top as number), // pG
        new fabric.Point(pointF.left as number, pointF.top as number), // pF
        new fabric.Point(pointE.left as number, pointE.top as number), // pE
        new fabric.Point(pointH.left as number, pointH.top as number), // pH
      ];

      const vertices = [
        circleRestrict(pts[0]),
        circleRestrict(pts[1]),
        circleRestrict(pts[2]),
        circleRestrict(pts[3]),
      ];

      polygonGFHE.set({
        points: vertices,
      });

      const pR = lineLineIntersection(
        [vertices[0].x, vertices[0].y],
        [vertices[3].x, vertices[3].y],
        [vertices[1].x, vertices[1].y],
        [vertices[2].x, vertices[2].y]
      );

      pointR.set({
        left: pR![0],
        top: pR![1],
        originX: "center",
        originY: "center",
        radius: 1,
        stroke: "green",
      });

      const pI = lineLineIntersection(
        [vertices[0].x, vertices[0].y],
        [vertices[1].x, vertices[1].y],
        [vertices[2].x, vertices[2].y],
        [vertices[3].x, vertices[3].y]
      );

      pointI.set({
        left: pI![0],
        top: pI![1],
        originX: "center",
        originY: "center",
        radius: 1,
        stroke: "green",
      });

      const pT = lineLineIntersection(
        [vertices[0].x, vertices[0].y],
        [vertices[2].x, vertices[2].y],
        [vertices[1].x, vertices[1].y],
        [vertices[3].x, vertices[3].y]
      );

      pointT.set({
        left: pT![0],
        top: pT![1],
        originX: "center",
        originY: "center",
        radius: 1,
        stroke: "green",
      });

      triangleTRI.set({
        points: [
          new fabric.Point(pT![0], pT![1]),
          new fabric.Point(pR![0], pR![1]),
          new fabric.Point(pI![0], pI![1]),
        ],
        strokeWidth: 1,
        stroke: "transparent",
        fill: "#ffb26cd9",
      });

      lineGR.set({
        x1: vertices[0].x,
        x2: pR![0],
        y1: vertices[0].y,
        y2: pR![1],
        stroke: "red",
      });

      lineFR.set({
        x1: vertices[1].x,
        x2: pR![0],
        y1: vertices[1].y,
        y2: pR![1],
        stroke: "red",
      });

      lineFI.set({
        x1: vertices[1].x,
        x2: pI![0],
        y1: vertices[1].y,
        y2: pI![1],
        stroke: "red",
      });

      lineEI.set({
        x1: vertices[2].x,
        x2: pI![0],
        y1: vertices[2].y,
        y2: pI![1],
        stroke: "red",
      });

      lineGE.set({
        x1: vertices[0].x,
        x2: vertices[2].x,
        y1: vertices[0].y,
        y2: vertices[2].y,
        stroke: "red",
      });

      lineFH.set({
        x1: vertices[1].x,
        x2: vertices[3].x,
        y1: vertices[1].y,
        y2: vertices[3].y,
        stroke: "red",
      });

      labelG.set({
        left: vertices[0].x - 20,
        top: vertices[0].y - 20,
        fontSize: 20,
      });

      labelF.set({
        left: vertices[1].x,
        top: vertices[1].y - 25,
        fontSize: 20,
      });

      labelE.set({
        left: vertices[2].x + 3,
        top: vertices[2].y + 5,
        fontSize: 20,
      });

      labelH.set({
        left: vertices[3].x - 20,
        top: vertices[3].y - 5,
        fontSize: 20,
      });

      labelT.set({
        left: pT![0] - 25,
        top: pT![1] - 5,
        fontSize: 20,
        fill: "#e91e63",
      });

      labelR.set({
        left: pR![0] - 15,
        top: pR![1] - 25,
        fontSize: 20,
        fill: "#e91e63",
      });

      labelI.set({
        left: pI![0] + 10,
        top: pI![1] - 10,
        fontSize: 20,
        fill: "#e91e63",
      });

      circleG.set({
        left: vertices[0].x,
        top: vertices[0].y,
      });

      circleF.set({
        left: vertices[1].x,
        top: vertices[1].y,
      });

      circleE.set({
        left: vertices[2].x,
        top: vertices[2].y,
      });

      circleH.set({
        left: vertices[3].x,
        top: vertices[3].y,
      });

      const eqOG = solveLinearEquation(center, vertices[0]);
      const eqOF = solveLinearEquation(center, vertices[1]);
      const eqOE = solveLinearEquation(center, vertices[2]);
      const eqOH = solveLinearEquation(center, vertices[3]);

      const perpendicularToOGG = solvePerpendicularLineEquation(eqOG.m, vertices[0]);
      const perpendicularToOFF = solvePerpendicularLineEquation(eqOF.m, vertices[1]);
      const perpendicularToOEE = solvePerpendicularLineEquation(eqOE.m, vertices[2]);
      const perpendicularToOHH = solvePerpendicularLineEquation(eqOH.m, vertices[3]);

      const pP = calculateLineIntersectInLinearEquation(
        perpendicularToOGG.m,
        perpendicularToOGG.b,
        perpendicularToOEE.m,
        perpendicularToOEE.b
      );

      pointP.set({
        left: pP.x,
        top: pP.y,
        originX: "center",
        originY: "center",
        fill: "purple",
        radius: 2,
      });

      const pQ = calculateLineIntersectInLinearEquation(
        perpendicularToOFF.m,
        perpendicularToOFF.b,
        perpendicularToOHH.m,
        perpendicularToOHH.b
      );

      pointQ.set({
        left: pQ.x,
        top: pQ.y,
        originX: "center",
        originY: "center",
        fill: "purple",
        radius: 2,
      });

      const pC = calculateLineIntersectInLinearEquation(
        perpendicularToOGG.m,
        perpendicularToOGG.b,
        perpendicularToOHH.m,
        perpendicularToOHH.b
      );

      pointC.set({
        left: pC.x,
        top: pC.y,
        originX: "center",
        originY: "center",
        fill: "purple",
        radius: 2,
      });

      linePC.set({
        x1: pP.x,
        x2: pC.x,
        y1: pP.y,
        y2: pC.y,
        stroke: "blue",
      });

      const pD = calculateLineIntersectInLinearEquation(
        perpendicularToOEE.m,
        perpendicularToOEE.b,
        perpendicularToOHH.m,
        perpendicularToOHH.b
      );

      pointD.set({
        left: pD.x,
        top: pD.y,
        originX: "center",
        originY: "center",
        fill: "purple",
        radius: 2,
      });

      linePD.set({
        x1: pP.x,
        x2: pD.x,
        y1: pP.y,
        y2: pD.y,
        stroke: "blue",
      });

      lineDQ.set({
        x1: pQ.x,
        x2: pD.x,
        y1: pQ.y,
        y2: pD.y,
        stroke: "blue",
      });

      lineCD.set({
        x1: pC.x,
        x2: pD.x,
        y1: pC.y,
        y2: pD.y,
        stroke: "blue",
      });

      const pA = calculateLineIntersectInLinearEquation(
        perpendicularToOFF.m,
        perpendicularToOFF.b,
        perpendicularToOEE.m,
        perpendicularToOEE.b
      );

      pointA.set({
        left: pA.x,
        top: pA.y,
        originX: "center",
        originY: "center",
        fill: "purple",
        radius: 2,
      });

      lineAQ.set({
        x1: pA.x,
        x2: pQ.x,
        y1: pA.y,
        y2: pQ.y,
        stroke: "blue",
      });

      const pB = calculateLineIntersectInLinearEquation(
        perpendicularToOGG.m,
        perpendicularToOGG.b,
        perpendicularToOFF.m,
        perpendicularToOFF.b
      );

      pointB.set({
        left: pB.x,
        top: pB.y,
        originX: "center",
        originY: "center",
        fill: "purple",
        radius: 2,
      });

      lineAB.set({
        x1: pA.x,
        x2: pB.x,
        y1: pA.y,
        y2: pB.y,
        stroke: "blue",
      });

      lineBC.set({
        x1: pC.x,
        x2: pB.x,
        y1: pC.y,
        y2: pB.y,
        stroke: "blue",
      });

      lineAD.set({
        x1: pA.x,
        x2: pD.x,
        y1: pA.y,
        y2: pD.y,
        stroke: "blue",
      });

      labelP.set({
        left: pP.x + 5,
        top: pP.y - 20,
        fontSize: 20,
      });

      labelQ.set({
        left: pQ.x - 15,
        top: pQ.y - 25,
        fontSize: 20,
      });

      labelA.set({
        left: pA.x + 5,
        top: pA.y,
        fontSize: 20,
      });

      labelB.set({
        left: pB.x - 25,
        top: pB.y - 10,
        fontSize: 20,
      });

      labelC.set({
        left: pC.x - 20,
        top: pC.y - 5,
        fontSize: 20,
      });

      labelD.set({
        left: pD.x - 5,
        top: pD.y + 5,
        fontSize: 20,
      });

      lineQI.set({
        x1: pI![0],
        x2: pQ.x,
        y1: pI![1],
        y2: pQ.y,
        strokeDashArray: [5, 5],
      });

      lineAC.set({
        x1: pA.x,
        x2: pC.x,
        y1: pA.y,
        y2: pC.y,
        stroke: "green",
        strokeWidth: 1,
      });

      lineBD.set({
        x1: pB.x,
        x2: pD.x,
        y1: pB.y,
        y2: pD.y,
        stroke: "green",
        strokeWidth: 1,
      });

      lineBR.set({
        x1: pR![0],
        x2: pB.x,
        y1: pR![1],
        y2: pB.y,
        strokeDashArray: [5, 5],
      });

      lineAI.set({
        x1: pI![0],
        x2: pA.x,
        y1: pI![1],
        y2: pA.y,
        strokeDashArray: [5, 5],
      });

      pointG.set({
        left: vertices[0].x,
        top: vertices[0].y,
      });

      pointF.set({
        left: vertices[1].x,
        top: vertices[1].y,
      });

      pointE.set({
        left: vertices[2].x,
        top: vertices[2].y,
      });

      pointH.set({
        left: vertices[3].x,
        top: vertices[3].y,
      });
    };

    moveVertices();
    canvas.on("object:moving", moveVertices);

    canvas.add(triangleTRI);
    canvas.add(circumCircle, polygonGFHE);
    canvas.add(pointR, pointI, pointT);
    canvas.add(lineGR, lineFR, lineFI, lineEI);
    canvas.add(lineFH, lineGE);
    canvas.add(circleG, circleF, circleE, circleH);
    canvas.add(labelG, labelF, labelE, labelH, labelT, labelR, labelI);
    canvas.add(pointO, labelO);
    canvas.add(pointP, pointQ, pointA, pointB, pointC, pointD);
    canvas.add(linePC, linePD, lineDQ, lineAQ, lineCD, lineAB, lineBC, lineAD);
    canvas.add(labelP, labelQ, labelA, labelB, labelC, labelD);
    canvas.add(lineQI, lineAC, lineBD, lineBR, lineAI);
    canvas.add(pointG, pointF, pointE, pointH);
  },
});
</script>
