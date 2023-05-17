<template>
  <TopicMeta :topic="topic" />

  <a-tabs v-model:activeKey="activeKey" @change="handleTabChange" style="width: 500px">
    <a-tab-pane key="1" tab="Centroid">
      <div id="centroid-wrapper">
        <canvas id="centroid-canvas" width="500" height="500"></canvas></div
    ></a-tab-pane>
    <a-tab-pane key="2" tab="Incenter & Excenter">
      <div id="incenter-wrapper">
        <canvas id="incenter-canvas" width="500" height="500"></canvas></div
    ></a-tab-pane>
    <a-tab-pane key="3" tab="Circumcenter">
      <div id="circumcenter-wrapper">
        <canvas id="circumcenter-canvas1" width="500" height="500"></canvas>
        <ATypographyTitle :level="4"></ATypographyTitle>
        <canvas id="circumcenter-canvas2" width="500" height="500"></canvas>
      </div>
    </a-tab-pane>
    <a-tab-pane key="4" tab="Orthocenter">
      <div id="orthocenter-wrapper">
        <canvas id="orthocenter-canvas" width="500" height="500"></canvas></div
    ></a-tab-pane>
  </a-tabs>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted, nextTick } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import {
  makeCircle,
  makeLabel,
  makeLine,
  makeMovablePoint,
  makeMovablePolygon,
  makeSelectCircle,
} from "@/utils/canvas";
import {
  calculateCircumcenter,
  calculateDistanceFromPointToLine,
  calculateIncenter,
  calculateLineIntersectInPoints,
  calculateMidpoint,
  calculateOrthocenter,
  calculateThreeAngles,
  drawRightAngleSign,
  findMidpoint,
  getPedalPoint,
  calculateInterPointsWithBoundary,
  subNums,
} from "@/utils/geometry";
import { Circle, IEvent } from "fabric/fabric-impl";
const topic = indexTopicMap.get(3) as Topic;
export default defineComponent({
  setup() {
    const state = reactive({
      topic,
      activeKey: "1",
      centroidCanvas: false,
      incenterCanvas: false,
      circumcenter1Canvas: false,
      circumcenter2Canvas: false,
      orthocenterCanvas: false,
    });

    function handleTabChange(activeKey: string) {
      state.activeKey = activeKey;
      nextTick(() => {
        switch (activeKey) {
          case "1":
            renderCentroidCanvas();
            break;
          case "2":
            renderIncenterCanvas();
            break;
          case "3":
            renderCircumcenter1Canvas();
            renderCircumcenter2Canvas();
            break;
          case "4":
            renderOrthocenterCanvas();
            break;
          default:
            break;
        }
      });
    }

    function renderCentroidCanvas() {
      if (state.centroidCanvas) {
        return;
      }
      const canvas = new fabric.Canvas("centroid-canvas", {
        selection: false,
        backgroundColor: "floralwhite",
      });

      const median1 = makeLine();
      const median2 = makeLine();
      const median3 = makeLine();

      // vertexes
      const aLabel = makeLabel("A");
      const bLabel = makeLabel("B");
      const cLabel = makeLabel("C");

      // midpoints
      const dLabel = makeLabel("D");
      const eLabel = makeLabel("E");
      const fLabel = makeLabel("F");

      // centroid
      const gLabel = makeLabel("G");
      // controll circles
      const circleA = makeSelectCircle();
      const circleB = makeSelectCircle();
      const circleC = makeSelectCircle();

      const triangle = makeMovablePolygon(
        [new fabric.Point(125, 50), new fabric.Point(50, 450), new fabric.Point(450, 450)],
        function (coords: fabric.Point[]) {
          const mp1 = calculateMidpoint(coords[0], coords[1]);
          const mp2 = calculateMidpoint(coords[0], coords[2]);
          const mp3 = calculateMidpoint(coords[1], coords[2]);
          circleA.set({
            left: coords[0].x,
            top: coords[0].y,
          });
          circleB.set({
            left: coords[1].x,
            top: coords[1].y,
          });
          circleC.set({
            left: coords[2].x,
            top: coords[2].y,
          });

          median1.set({
            x1: coords[0].x,
            y1: coords[0].y,
            x2: mp3.x,
            y2: mp3.y,
          });
          median2.set({
            x1: coords[1].x,
            y1: coords[1].y,
            x2: mp2.x,
            y2: mp2.y,
          });
          median3.set({
            x1: coords[2].x,
            y1: coords[2].y,
            x2: mp1.x,
            y2: mp1.y,
          });

          aLabel.set({
            left: coords[0].x,
            top: coords[0].y - 30,
          });
          bLabel.set({
            left: coords[1].x - 15,
            top: coords[1].y,
          });
          cLabel.set({
            left: coords[2].x + 5,
            top: coords[2].y,
          });

          dLabel.set({
            left: mp1.x - 25,
            top: mp1.y - 15,
          });
          eLabel.set({
            left: mp2.x + 15,
            top: mp2.y - 15,
          });
          fLabel.set({
            left: mp3.x,
            top: mp3.y,
          });

          const intersect = calculateLineIntersectInPoints(median1, median2) as fabric.Point;

          gLabel.set({
            left: intersect.x + 5,
            top: intersect.y + 10,
          });
        }
      );

      canvas.add(triangle);
      canvas.add(median1);
      canvas.add(median2);
      canvas.add(median3);

      canvas.add(aLabel);
      canvas.add(bLabel);
      canvas.add(cLabel);

      canvas.add(dLabel);
      canvas.add(eLabel);
      canvas.add(fLabel);

      canvas.add(gLabel);

      canvas.add(circleA, circleB, circleC);
      state.centroidCanvas = true;
    }

    function renderIncenterCanvas() {
      if (state.incenterCanvas) {
        return;
      }
      const canvas = new fabric.Canvas("incenter-canvas", {
        selection: false,
        backgroundColor: "floralwhite",
      });

      const bisectionOnAB = makeLine();
      const bisectionOnAC = makeLine();
      const bisectionOnBC = makeLine();

      // vertexes
      const aLabel = makeLabel("A");
      const bLabel = makeLabel("B");
      const cLabel = makeLabel("C");

      const dLabel = makeLabel("D");
      const eLabel = makeLabel("E");
      const fLabel = makeLabel("F");

      const iLabel = makeLabel("I");

      const incircle = makeCircle();
      const circleA = makeSelectCircle();
      const circleB = makeSelectCircle();
      const circleC = makeSelectCircle();

      const triangle = makeMovablePolygon(
        [new fabric.Point(125, 50), new fabric.Point(50, 450), new fabric.Point(450, 450)],
        function (coords: fabric.Point[]) {
          aLabel.set({
            left: coords[0].x,
            top: coords[0].y - 30,
          });
          bLabel.set({
            left: coords[1].x - 15,
            top: coords[1].y,
          });
          cLabel.set({
            left: coords[2].x + 5,
            top: coords[2].y,
          });
          circleA.set({
            left: coords[0].x,
            top: coords[0].y,
          });
          circleB.set({
            left: coords[1].x,
            top: coords[1].y,
          });
          circleC.set({
            left: coords[2].x,
            top: coords[2].y,
          });

          const incenter = calculateIncenter(coords[0], coords[1], coords[2]);
          iLabel.set({
            left: incenter.x + 5,
            top: incenter.y + 5,
            stroke: "black",
          });
          const onBC = calculateLineIntersectInPoints(
            makeLine(coords[0], incenter),
            makeLine(coords[1], coords[2]),
            true
          ) as fabric.Point;
          const onAC = calculateLineIntersectInPoints(
            makeLine(coords[1], incenter),
            makeLine(coords[0], coords[2]),
            true
          ) as fabric.Point;
          const onAB = calculateLineIntersectInPoints(
            makeLine(coords[2], incenter),
            makeLine(coords[0], coords[1]),
            true
          ) as fabric.Point;

          dLabel.set({
            left: onAB.x - 25,
            top: onAB.y - 25,
          });
          eLabel.set({
            left: onAC.x + 10,
            top: onAC.y - 25,
          });
          fLabel.set({
            left: onBC?.x,
            top: onBC?.y,
          });

          bisectionOnAB.set({
            x1: coords[2].x,
            y1: coords[2].y,
            x2: onAB?.x,
            y2: onAB?.y,
          });
          bisectionOnAC.set({
            x1: coords[1].x,
            y1: coords[1].y,
            x2: onAC?.x,
            y2: onAC?.y,
          });
          bisectionOnBC.set({
            x1: coords[0].x,
            y1: coords[0].y,
            x2: onBC?.x,
            y2: onBC?.y,
          });

          const radius = calculateDistanceFromPointToLine(incenter, makeLine(coords[1], coords[2]));

          const centerOfCircle = incircle.translateToCenterPoint(
            incenter as fabric.Point,
            "right",
            "bottom"
          );
          incircle.set({
            radius,
            left: centerOfCircle.x,
            top: centerOfCircle.y,
            stroke: "blue",
          });
        }
      );

      canvas.add(triangle);
      canvas.add(aLabel);
      canvas.add(bLabel);
      canvas.add(cLabel);
      canvas.add(dLabel);
      canvas.add(eLabel);
      canvas.add(fLabel);
      canvas.add(iLabel);
      canvas.add(bisectionOnAB);
      canvas.add(bisectionOnAC);
      canvas.add(bisectionOnBC);
      canvas.add(incircle, circleA, circleB, circleC);
      state.incenterCanvas = true;
    }

    function renderCircumcenter1Canvas() {
      if (state.circumcenter1Canvas) {
        return;
      }
      const canvas = new fabric.Canvas("circumcenter-canvas1", {
        selection: false,
        backgroundColor: "floralwhite",
      });
      // vertexes
      const aLabel = makeLabel("A");
      const bLabel = makeLabel("B");
      const cLabel = makeLabel("C");
      const oLabel = makeLabel("O");
      const dLabel = makeLabel("D");
      const eLabel = makeLabel("E");
      const fLabel = makeLabel("F");
      const lineOD = makeLine();
      const lineOE = makeLine();
      const lineOF = makeLine();
      const lineAO = makeLine();
      const lineBO = makeLine();
      const lineCO = makeLine();
      const rightAngleDl1 = makeLine();
      const rightAngleDl2 = makeLine();
      const rightAngleEl1 = makeLine();
      const rightAngleEl2 = makeLine();
      const rightAngleFl1 = makeLine();
      const rightAngleFl2 = makeLine();

      const radius = 200,
        centerX = 250,
        centerY = 250,
        pi = Math.PI;
      const circumCircle = makeCircle(radius, new fabric.Point(centerX, centerY), "transparent", 1);
      const center = makeCircle(2, new fabric.Point(centerX, centerY), "black", 1);
      const moveableA = makeMovablePoint(new fabric.Point(250, 50));
      moveableA.set({ originX: "center", originY: "center", radius: 3, padding: 10 });
      const A = [moveableA.left as number, moveableA.top as number];
      const B = [centerX - radius * Math.cos(pi / 6), centerY + Math.sin(pi / 6) * radius];
      const C = [centerX + radius * Math.cos(pi / 6), centerY + Math.sin(pi / 6) * radius];
      const pointA = new fabric.Point(A[0], A[1]);
      const pointB = new fabric.Point(B[0], B[1]);
      const pointC = new fabric.Point(C[0], C[1]);
      const lineAB = makeLine(pointA, pointB);
      const lineBC = makeLine(pointB, pointC);
      const lineAC = makeLine(pointA, pointC);

      circumCircle.set({ originX: "center", originY: "center", stroke: "blue" });
      center.set({ originX: "center", originY: "center", stroke: "black" });
      aLabel.set({ left: (moveableA.left as number) - 10, top: (moveableA.top as number) - 30 });
      bLabel.set({ left: pointB.x - 15, top: pointB.y });
      cLabel.set({ left: pointC.x, top: pointC.y });
      oLabel.set({ left: center.left, top: center.top });

      const pointO = calculateCircumcenter(pointA, pointB, pointC);
      const pedalPointD = getPedalPoint(pointO, pointB, pointC);
      const pedalPointE = getPedalPoint(pointO, pointA, pointC);
      const pedalPointF = getPedalPoint(pointO, pointA, pointB);
      dLabel.set({ left: pedalPointD.x - 5, top: pedalPointD.y });
      eLabel.set({ left: pedalPointE.x + 5, top: pedalPointE.y - 10 });
      fLabel.set({ left: pedalPointF.x - 20, top: pedalPointF.y - 15 });
      drawRightAngleSign(pointO, pedalPointD, pointC, rightAngleDl1, rightAngleDl2, 8, "red");
      drawRightAngleSign(pointO, pedalPointE, pointC, rightAngleEl1, rightAngleEl2, 8, "red");
      drawRightAngleSign(pointO, pedalPointF, pointB, rightAngleFl1, rightAngleFl2, 8, "red");
      lineOD.set({
        x1: pointO.x,
        y1: pointO.y,
        x2: pedalPointD.x,
        y2: pedalPointD.y,
      });
      lineOE.set({
        x1: pointO.x,
        y1: pointO.y,
        x2: pedalPointE.x,
        y2: pedalPointE.y,
      });
      lineOF.set({
        x1: pointO.x,
        y1: pointO.y,
        x2: pedalPointF.x,
        y2: pedalPointF.y,
      });
      lineAO.set({
        x1: pointA.x,
        y1: pointA.y,
        x2: pointO.x,
        y2: pointO.y,
        stroke: "red",
        strokeDashArray: [5, 5],
      });
      lineBO.set({
        x1: pointB.x,
        y1: pointB.y,
        x2: pointO.x,
        y2: pointO.y,
        stroke: "red",
        strokeDashArray: [5, 5],
      });
      lineCO.set({
        x1: pointC.x,
        y1: pointC.y,
        x2: pointO.x,
        y2: pointO.y,
        stroke: "red",
        strokeDashArray: [5, 5],
      });

      const onMovePointA = (e: IEvent): void => {
        const a = e.target! as Circle;
        const cosx =
          ((a.left as number) - centerX) /
          Math.sqrt(
            ((a.left as number) - centerX) * ((a.left as number) - centerX) +
              ((a.top as number) - centerY) * ((a.top as number) - centerY)
          );
        const sinx =
          ((a.top as number) - centerY) /
          Math.sqrt(
            ((a.left as number) - centerX) * ((a.left as number) - centerX) +
              ((a.top as number) - centerY) * ((a.top as number) - centerY)
          );
        if ((a.left as number) >= 250) {
          a.set({
            left: centerX + radius * cosx,
            top: centerY + radius * sinx,
          });
        } else {
          a.set({
            left: centerX + radius * cosx,
            top: centerY + radius * sinx,
          });
        }
        aLabel.set({ left: a.left as number, top: (a.top as number) + 10 });
        lineAB.set({
          x1: moveableA.left,
          y1: moveableA.top,
          x2: pointB.x,
          y2: pointB.y,
          stroke: "black",
        });
        lineBC.set({
          x1: pointB.x,
          y1: pointB.y,
          x2: pointC.x,
          y2: pointC.y,
          stroke: "black",
        });
        lineAC.set({
          x1: moveableA.left,
          y1: moveableA.top,
          x2: pointC.x,
          y2: pointC.y,
          stroke: "black",
        });
        const movingA = new fabric.Point(a.left as number, a.top as number);
        const pointO = calculateCircumcenter(movingA, pointB, pointC);
        const pedalPointE = getPedalPoint(pointO, movingA, pointC);
        const pedalPointF = getPedalPoint(pointO, movingA, pointB);
        drawRightAngleSign(pointO, pedalPointE, pointC, rightAngleEl1, rightAngleEl2, 8, "red");
        drawRightAngleSign(pointO, pedalPointF, pointB, rightAngleFl1, rightAngleFl2, 8, "red");
        dLabel.set({ left: pedalPointD.x - 5, top: pedalPointD.y });
        eLabel.set({ left: pedalPointE.x + 5, top: pedalPointE.y - 10 });
        fLabel.set({ left: pedalPointF.x - 20, top: pedalPointF.y - 15 });
        lineOD.set({
          x1: pointO.x,
          y1: pointO.y,
          x2: pedalPointD.x,
          y2: pedalPointD.y,
        });
        lineOE.set({
          x1: pointO.x,
          y1: pointO.y,
          x2: pedalPointE.x,
          y2: pedalPointE.y,
        });
        lineOF.set({
          x1: pointO.x,
          y1: pointO.y,
          x2: pedalPointF.x,
          y2: pedalPointF.y,
        });
        lineAO.set({
          x1: movingA.x,
          y1: movingA.y,
          x2: pointO.x,
          y2: pointO.y,
          stroke: "red",
          strokeDashArray: [5, 5],
        });
      };

      canvas.on("object:moving", onMovePointA);
      canvas.add(moveableA);
      canvas.add(aLabel);
      canvas.add(bLabel);
      canvas.add(cLabel);
      canvas.add(oLabel);
      canvas.add(dLabel);
      canvas.add(eLabel);
      canvas.add(fLabel);
      canvas.add(lineOD);
      canvas.add(lineOE);
      canvas.add(lineOF);
      canvas.add(lineAO);
      canvas.add(lineBO);
      canvas.add(lineCO);
      canvas.add(lineAB);
      canvas.add(lineBC);
      canvas.add(lineAC);
      canvas.add(circumCircle);
      canvas.add(center);
      canvas.add(
        rightAngleDl1,
        rightAngleDl2,
        rightAngleEl1,
        rightAngleEl2,
        rightAngleFl1,
        rightAngleFl2
      );
      state.circumcenter1Canvas = true;
    }

    function renderCircumcenter2Canvas() {
      if (state.circumcenter2Canvas) {
        return;
      }
      const canvas2 = new fabric.Canvas("circumcenter-canvas2", {
        selection: false,
        backgroundColor: "floralwhite",
      });

      const aLabel = makeLabel("A");
      const bLabel = makeLabel("B");
      const cLabel = makeLabel("C");
      const dLabel = makeLabel("D");
      const eLabel = makeLabel("E");
      const fLabel = makeLabel("F");
      const l1Label = makeLabel(subNums("L1"));
      const l2Label = makeLabel(subNums("L2"));
      const lineAB = makeLine();
      const lineAC = makeLine();
      const lineBC = makeLine();
      const lineAD = makeLine();
      const lineBE = makeLine();
      const lineCF = makeLine();
      const bisecPerpenLineOnAC = makeLine();
      const bisecPerpenLineOnAB = makeLine();
      const angleDsignl1 = makeLine();
      const angleDsiggnl2 = makeLine();
      const angleEsignl1 = makeLine();
      const angleEsiggnl2 = makeLine();
      const angleFsignl1 = makeLine();
      const angleFsiggnl2 = makeLine();
      const interPoint = makeCircle(3, new fabric.Point(0, 0), "green", 2);
      const moveableA = makeMovablePoint(new fabric.Point(300, 100));
      const pointA = new fabric.Point(moveableA.left as number, moveableA.top as number);
      const pointB = new fabric.Point(100, 350);
      const pointC = new fabric.Point(400, 350);

      moveableA.set({
        originX: "center",
        originY: "center",
        fill: "black",
        radius: 3,
        padding: 10,
      });
      aLabel.set({ left: (moveableA.left as number) - 10, top: (moveableA.top as number) - 30 });
      bLabel.set({ left: pointB.x - 20, top: pointB.y + 5 });
      cLabel.set({ left: pointC.x, top: pointC.y + 5 });
      lineAB.set({ x1: pointA.x, y1: pointA.y, x2: pointB.x, y2: pointB.y });
      lineAC.set({ x1: pointA.x, y1: pointA.y, x2: pointC.x, y2: pointC.y });
      lineBC.set({ x1: pointB.x, y1: pointB.y, x2: pointC.x, y2: pointC.y });

      // midPointOnBC
      const pointD = findMidpoint([pointB.x, pointB.y], [pointC.x, pointC.y]);
      // midPointOnAC
      const midPointOnAC = findMidpoint([pointA.x, pointA.y], [pointC.x, pointC.y]);
      const pointE = new fabric.Point(midPointOnAC[0], midPointOnAC[1]);
      // midPointOnAB
      const midPointOnAB = findMidpoint([pointA.x, pointA.y], [pointB.x, pointB.y]);
      const pointF = new fabric.Point(midPointOnAB[0], midPointOnAB[1]);

      // Another point on bisector perpendicular line
      const pointM = new fabric.Point(
        (pointA.x + pointC.x - pointA.y + pointC.y) / 2,
        (pointA.y + pointC.y - pointC.x + pointA.x) / 2
      );
      const pointN = new fabric.Point(
        (pointA.x + pointB.x - pointA.y + pointB.y) / 2,
        (pointA.y + pointB.y - pointB.x + pointA.x) / 2
      );
      // Perpendicular bisector
      lineAD.set({ x1: 250, y1: 50, x2: 250, y2: 450, stroke: "blue" });
      dLabel.set({ left: pointD[0] + 5, top: pointD[1] });
      eLabel.set({ left: pointE.x + 15, top: pointE.y - 5 });
      fLabel.set({ left: pointF.x - 25, top: pointF.y - 10 });

      // Two full perpendicular bisector lines
      const fullLine1 = makeLine(); //BisecPerpenLineOnAB
      const fullLine2 = makeLine(); // BisecPerpenLineOnAC
      const interPoints1 = calculateInterPointsWithBoundary(pointF, pointN, 500, 500, 50);
      fullLine1.set({
        x1: interPoints1[0].x,
        y1: interPoints1[0].y,
        x2: interPoints1[1].x,
        y2: interPoints1[1].y,
        stroke: "green",
      });
      const interPoints2 = calculateInterPointsWithBoundary(pointE, pointM, 500, 500, 50);
      fullLine2.set({
        x1: interPoints2[0].x,
        y1: interPoints2[0].y,
        x2: interPoints2[1].x,
        y2: interPoints2[1].y,
        stroke: "green",
      });
      l1Label.set({
        left: interPoints1[0].x,
        top: interPoints1[0].y - 30,
        fill: "red",
        fontSize: 18,
      });
      l2Label.set({
        left: interPoints2[0].x,
        top: interPoints2[0].y - 30,
        fill: "red",
        fontSize: 18,
      });
      const interP = calculateLineIntersectInPoints(fullLine1, fullLine2);
      interPoint.set({
        originX: "center",
        originY: "center",
        left: interP?.x,
        top: interP?.y,
      });
      drawRightAngleSign(
        new fabric.Point(250, 250),
        new fabric.Point(250, 350),
        pointC,
        angleDsignl1,
        angleDsiggnl2,
        8,
        "red"
      );
      drawRightAngleSign(pointN, pointF, pointB, angleFsignl1, angleFsiggnl2, 8, "red");
      drawRightAngleSign(interPoints2[1], pointE, pointC, angleEsignl1, angleEsiggnl2, 8, "red");

      // Moving control.
      const onMovePoint = (e: IEvent): void => {
        const p = e.target! as Circle;
        const point = new fabric.Point(p.left!, p.top!);
        aLabel.set({ left: p.left! - 10, top: p.top! - 30 });
        lineAB.set({
          x1: point.x,
          y1: point.y,
          x2: pointB.x,
          y2: pointB.y,
          stroke: "black",
          strokeWidth: 1,
        });
        lineAC.set({
          x1: point.x,
          y1: point.y,
          x2: pointC.x,
          y2: pointC.y,
          stroke: "black",
          strokeWidth: 1,
        });

        // mid points
        const midPointOnAC = findMidpoint([point.x, point.y], [pointC.x, pointC.y]);
        const midPointOnAB = findMidpoint([point.x, point.y], [pointB.x, pointB.y]);
        const pointE = new fabric.Point(midPointOnAC[0], midPointOnAC[1]);
        const pointF = new fabric.Point(midPointOnAB[0], midPointOnAB[1]);

        // Another points on bisector perpendicular line
        const pointM = new fabric.Point(
          (point.x + pointC.x - point.y + pointC.y) / 2,
          (point.y + pointC.y - pointC.x + point.x) / 2
        );
        const pointN = new fabric.Point(
          (point.x + pointB.x - point.y + pointB.y) / 2,
          (point.y + pointB.y - pointB.x + point.x) / 2
        );

        const interPoints = calculateInterPointsWithBoundary(pointF, pointN, 500, 500, 50);
        fullLine1.set({
          x1: interPoints[0].x,
          y1: interPoints[0].y,
          x2: interPoints[1].x,
          y2: interPoints[1].y,
        });

        const interPoints2 = calculateInterPointsWithBoundary(pointE, pointM, 500, 500, 50);
        fullLine2.set({
          x1: interPoints2[0].x,
          y1: interPoints2[0].y,
          x2: interPoints2[1].x,
          y2: interPoints2[1].y,
        });

        const interP = calculateLineIntersectInPoints(fullLine1, fullLine2);
        interPoint.set({
          originX: "center",
          originY: "center",
          left: interP?.x,
          top: interP?.y,
        });
        drawRightAngleSign(pointN, pointF, pointB, angleFsignl1, angleFsiggnl2, 8, "red");
        drawRightAngleSign(interPoints2[1], pointE, pointC, angleEsignl1, angleEsiggnl2, 8, "red");

        dLabel.set({ left: pointD[0] + 5, top: pointD[1] });
        eLabel.set({ left: pointE.x + 5, top: pointE.y - 10 });
        fLabel.set({ left: pointF.x - 20, top: pointF.y - 15 });
        l1Label.set({
          left: interPoints[0].x,
          top: interPoints[0].y - 30,
          fill: "red",
          fontSize: 18,
        });
        l2Label.set({
          left: interPoints2[0].x,
          top: interPoints2[0].y - 30,
          fill: "red",
          fontSize: 18,
        });
      };

      canvas2.on("object:moving", onMovePoint);
      canvas2.add(aLabel, bLabel, cLabel, dLabel, eLabel, fLabel, l1Label, l2Label);
      canvas2.add(moveableA, interPoint);
      canvas2.add(
        lineAB,
        lineAC,
        lineBC,
        bisecPerpenLineOnAB,
        bisecPerpenLineOnAC,
        lineAD,
        lineBE,
        lineCF
      );
      canvas2.add(
        angleDsignl1,
        angleDsiggnl2,
        angleEsignl1,
        angleEsiggnl2,
        angleFsignl1,
        angleFsiggnl2
      );
      canvas2.add(fullLine1, fullLine2);
      state.circumcenter2Canvas = true;
    }

    function renderOrthocenterCanvas() {
      if (state.orthocenterCanvas) {
        return;
      }
      const canvas = new fabric.Canvas("orthocenter-canvas", {
        selection: false,
        backgroundColor: "floralwhite",
      });

      // vertexes
      const aLabel = makeLabel("A");
      const bLabel = makeLabel("B");
      const cLabel = makeLabel("C");
      const dLabel = makeLabel("D");
      const eLabel = makeLabel("E");
      const fLabel = makeLabel("F");
      const hLabel = makeLabel("H");
      const heightOnBC = makeLine();
      const heightOnAC = makeLine();
      const heightOnAB = makeLine();
      const hCenter = makeCircle();
      const circleA = makeSelectCircle();
      const circleB = makeSelectCircle();
      const circleC = makeSelectCircle();

      // Extension lines
      const lineBAHc = makeLine();
      const lineCAHb = makeLine();
      const lineABHc = makeLine();
      const lineCBHa = makeLine();
      const lineBCHa = makeLine();
      const lineACHb = makeLine();
      const lineBHbH = makeLine();
      const lineHaAH = makeLine();
      const lineAHaH = makeLine();
      const lineCHcH = makeLine();
      const lineHbBH = makeLine();
      const lineHcCH = makeLine();

      // Right angle sign lines
      const line1 = new fabric.Line([0, 0, 0, 0]);
      const line2 = new fabric.Line([0, 0, 0, 0]);
      const line3 = new fabric.Line([0, 0, 0, 0]);
      const line4 = new fabric.Line([0, 0, 0, 0]);
      const line5 = new fabric.Line([0, 0, 0, 0]);
      const line6 = new fabric.Line([0, 0, 0, 0]);

      const triangle = makeMovablePolygon(
        [new fabric.Point(225, 100), new fabric.Point(100, 400), new fabric.Point(400, 400)],
        function (coords: fabric.Point[]) {
          aLabel.set({
            left: coords[0].x,
            top: coords[0].y - 30,
          });
          bLabel.set({
            left: coords[1].x - 15,
            top: coords[1].y,
          });
          cLabel.set({
            left: coords[2].x + 5,
            top: coords[2].y,
          });
          circleA.set({
            left: coords[0].x,
            top: coords[0].y,
          });
          circleB.set({
            left: coords[1].x,
            top: coords[1].y,
          });
          circleC.set({
            left: coords[2].x,
            top: coords[2].y,
          });

          const pedalPointOnBC = getPedalPoint(coords[0], coords[1], coords[2]);
          heightOnBC.set({
            x1: coords[0].x,
            y1: coords[0].y,
            x2: pedalPointOnBC.x,
            y2: pedalPointOnBC.y,
            stroke: "green",
          });
          dLabel.set({
            left: pedalPointOnBC.x - 10,
            top: pedalPointOnBC.y,
          });

          const pedalPointOnAC = getPedalPoint(coords[1], coords[0], coords[2]);
          heightOnAC.set({
            x1: coords[1].x,
            y1: coords[1].y,
            x2: pedalPointOnAC.x,
            y2: pedalPointOnAC.y,
            stroke: "green",
          });
          eLabel.set({
            left: pedalPointOnAC.x + 5,
            top: pedalPointOnAC.y - 20,
          });

          const pedalPointOnAB = getPedalPoint(coords[2], coords[0], coords[1]);
          heightOnAB.set({
            x1: coords[2].x,
            y1: coords[2].y,
            x2: pedalPointOnAB.x,
            y2: pedalPointOnAB.y,
            stroke: "green",
          });
          fLabel.set({ left: pedalPointOnAB.x - 35, top: pedalPointOnAB.y - 15 });

          // Orthocenter point H
          const angles = calculateThreeAngles(coords[0], coords[1], coords[2]);
          const pointH = calculateOrthocenter(coords[0], coords[1], coords[2]);
          hCenter.set({
            originX: "center",
            originY: "center",
            left: pointH.x,
            top: pointH.y,
            radius: 1.5,
            stroke: "green",
            fill: "green",
          });

          // Draw right angle sings
          drawRightAngleSign(coords[0], pedalPointOnBC, coords[2], line1, line2, 8, "red");
          drawRightAngleSign(coords[1], pedalPointOnAC, coords[0], line3, line4, 8, "red");
          drawRightAngleSign(coords[2], pedalPointOnAB, coords[1], line5, line6, 8, "red");

          hLabel.set({ left: pointH.x, top: pointH.y });
          lineBAHc.set({ stroke: "transparent" });
          lineCAHb.set({ stroke: "transparent" });
          lineABHc.set({ stroke: "transparent" });
          lineCBHa.set({ stroke: "transparent" });
          lineBCHa.set({ stroke: "transparent" });
          lineACHb.set({ stroke: "transparent" });
          lineBHbH.set({ stroke: "transparent" });
          lineHaAH.set({ stroke: "transparent" });
          lineAHaH.set({ stroke: "transparent" });
          lineCHcH.set({ stroke: "transparent" });
          lineHbBH.set({ stroke: "transparent" });
          lineHcCH.set({ stroke: "transparent" });
          // Make extension line.
          const rightAngle = Math.PI / 2;
          if (angles.x > rightAngle) {
            // when A is obtuse angle
            lineBAHc.set({
              x1: coords[0].x,
              y1: coords[0].y,
              x2: pedalPointOnAB.x,
              y2: pedalPointOnAB.y,
              stroke: "black",
              strokeDashArray: [5, 5],
            });
            lineCAHb.set({
              x1: coords[0].x,
              y1: coords[0].y,
              x2: pedalPointOnAC.x,
              y2: pedalPointOnAC.y,
              stroke: "black",
              strokeDashArray: [5, 5],
            });
            lineBHbH.set({
              x1: pointH.x,
              y1: pointH.y,
              x2: pedalPointOnAC.x,
              y2: pedalPointOnAC.y,
              stroke: "green",
              strokeDashArray: [5, 5],
            });
            lineCHcH.set({
              x1: pointH.x,
              y1: pointH.y,
              x2: pedalPointOnAB.x,
              y2: pedalPointOnAB.y,
              stroke: "green",
              strokeDashArray: [5, 5],
            });
            lineHaAH.set({
              x1: pointH.x,
              y1: pointH.y,
              x2: coords[0].x,
              y2: coords[0].y,
              stroke: "green",
              strokeDashArray: [5, 5],
            });
          }
          if (angles.y > rightAngle) {
            // when B is obtuse angle
            lineABHc.set({
              x1: coords[1].x,
              y1: coords[1].y,
              x2: pedalPointOnAB.x,
              y2: pedalPointOnAB.y,
              stroke: "black",
              strokeDashArray: [5, 5],
            });
            lineCBHa.set({
              x1: coords[1].x,
              y1: coords[1].y,
              x2: pedalPointOnBC.x,
              y2: pedalPointOnBC.y,
              stroke: "black",
              strokeDashArray: [5, 5],
            });
            lineAHaH.set({
              x1: pointH.x,
              y1: pointH.y,
              x2: pedalPointOnBC.x,
              y2: pedalPointOnBC.y,
              stroke: "green",
              strokeDashArray: [5, 5],
            });
            lineCHcH.set({
              x1: pointH.x,
              y1: pointH.y,
              x2: pedalPointOnAB.x,
              y2: pedalPointOnAB.y,
              stroke: "green",
              strokeDashArray: [5, 5],
            });
            lineHbBH.set({
              x1: pointH.x,
              y1: pointH.y,
              x2: coords[1].x,
              y2: coords[1].y,
              stroke: "green",
              strokeDashArray: [5, 5],
            });
          }
          if (angles.z > rightAngle) {
            // when C is obtuse angle
            lineACHb.set({
              x1: coords[2].x,
              y1: coords[2].y,
              x2: pedalPointOnAC.x,
              y2: pedalPointOnAC.y,
              stroke: "black",
              strokeDashArray: [5, 5],
            });
            lineBCHa.set({
              x1: coords[2].x,
              y1: coords[2].y,
              x2: pedalPointOnBC.x,
              y2: pedalPointOnBC.y,
              stroke: "black",
              strokeDashArray: [5, 5],
            });
            lineAHaH.set({
              x1: pointH.x,
              y1: pointH.y,
              x2: pedalPointOnBC.x,
              y2: pedalPointOnBC.y,
              stroke: "green",
              strokeDashArray: [5, 5],
            });
            lineBHbH.set({
              x1: pointH.x,
              y1: pointH.y,
              x2: pedalPointOnAC.x,
              y2: pedalPointOnAC.y,
              stroke: "green",
              strokeDashArray: [5, 5],
            });
            lineHcCH.set({
              x1: pointH.x,
              y1: pointH.y,
              x2: coords[2].x,
              y2: coords[2].y,
              stroke: "green",
              strokeDashArray: [5, 5],
            });
          }
        }
      );

      canvas.add(triangle);
      canvas.add(aLabel);
      canvas.add(bLabel);
      canvas.add(cLabel);
      canvas.add(dLabel);
      canvas.add(eLabel);
      canvas.add(fLabel);
      canvas.add(hLabel);
      canvas.add(heightOnBC);
      canvas.add(heightOnAC);
      canvas.add(heightOnAB);
      canvas.add(lineABHc);
      canvas.add(lineCBHa);
      canvas.add(lineBAHc);
      canvas.add(lineCAHb);
      canvas.add(lineBCHa);
      canvas.add(lineACHb);
      canvas.add(lineBHbH);
      canvas.add(lineHaAH);
      canvas.add(lineAHaH);
      canvas.add(lineCHcH);
      canvas.add(lineHbBH);
      canvas.add(lineHcCH);
      canvas.add(hCenter, circleA, circleB, circleC);
      canvas.add(line1);
      canvas.add(line2);
      canvas.add(line3);
      canvas.add(line4);
      canvas.add(line5);
      canvas.add(line6);
      state.orthocenterCanvas = true;
    }

    onMounted(() => {
      handleTabChange(state.activeKey);
    });

    return {
      ...toRefs(state),
      handleTabChange,
    };
  },
});
</script>
