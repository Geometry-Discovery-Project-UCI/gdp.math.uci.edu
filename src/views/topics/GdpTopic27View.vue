<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph> </ATypographyParagraph>
  <div id="topic27">
    <ATypographyTitle :level="4">Animated Brahmagupta's Theorem</ATypographyTitle>
    <canvas id="napoleon-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Coord, Topic } from "@/types";
import { fabric } from "fabric";
import { makeLabel, makeLine, makeCircle } from "@/utils/canvas";
import {
  lineLineIntersection,
  polarToCartesian,
  circleLineIntersection,
  solveLinearEquation,
  findSlope,
} from "@/utils/geometry";
import { Intersection } from "fabric/fabric-impl";

const topic = indexTopicMap.get(27) as Topic;

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
  });
}

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("napoleon-canvas", {
      selection: false,
    });

    function coordToPoint(cd: Coord): fabric.Point {
      return new fabric.Point(cd.x, cd.y);
    }

    const radius = 150;
    const center = new fabric.Point(250, 250);

    const points = [
      coordToPoint(polarToCartesian(radius, 200, center)),
      coordToPoint(polarToCartesian(radius, 70, center)),
      coordToPoint(polarToCartesian(radius, 340, center)),
      coordToPoint(polarToCartesian(radius, 290, center)),
    ];

    const polygon = createPolygon(points);
    const circle = makeCircle(radius, center);
    circle.set({
      originX: "center",
      originY: "center",
      stroke: "blue",
    });

    const labelA = makeLabel("A");
    const labelB = makeLabel("B");
    const labelC = makeLabel("C");
    const labelD = makeLabel("D");
    const labelE = makeLabel("E");
    const labelF = makeLabel("F");
    const labelG = makeLabel("G");
    labelE.set({ stroke: "red", fill: "red" });
    labelF.set({ stroke: "red", fill: "red" });
    labelG.set({ stroke: "red", fill: "red" });

    const staticLineAC = makeLine(points[0], points[2]);
    const staticLineBD = makeLine(points[1], points[3]);

    const lineAC = makeLine(points[0], points[2]);
    const lineBD = makeLine(points[1], points[3]);
    const lineGF = makeLine();

    lineAC.set({ evented: true, padding: 20, stroke: "transparent" });
    lineBD.set({ evented: true, padding: 20, stroke: "transparent" });
    lineGF.set({ stroke: "red", strokeWidth: 1 });

    const pointE = makeCircle();
    const pointF = makeCircle();
    const pointG = makeCircle();
    pointE.set({ originX: "center", originY: "center", fill: "red", radius: 3 });
    pointF.set({ originX: "center", originY: "center", fill: "red", radius: 3 });
    pointG.set({ originX: "center", originY: "center", fill: "red", radius: 3 });

    const angleE = new fabric.Rect();
    const angleF = new fabric.Rect();

    const circleRestrict = (p: fabric.Point): fabric.Point => {
      let rad = Math.atan(-findSlope([center.x, center.y], [p.x, p.y]));
      if (p.x < center.x) {
        rad -= Math.PI;
      }
      const coord = polarToCartesian(radius, rad, center, false);
      p.setFromPoint(coord);
      return p;
    };

    const moveVertices = () => {
      lineAC.set({ evented: true, left: center.x });
      lineBD.set({ evented: true, top: center.y });

      const lineACeq = solveLinearEquation(
        new fabric.Point(center.x - 200, lineAC.top!),
        new fabric.Point(center.x + 200, lineAC.top!)
      );
      const intersectionsAC = circleLineIntersection(
        radius,
        center.x,
        center.y,
        lineACeq.m,
        lineACeq.b
      );

      if (intersectionsAC.length === 0) {
        lineAC.set({
          x1: staticLineAC.x1,
          y1: staticLineAC.y1,
          x2: staticLineAC.x2,
          y2: staticLineAC.y2,
        });
        return;
      }

      const y2 =
        lineBD.top! - Math.sqrt(Math.pow(radius, 2) - Math.pow(lineBD.left! - center.x, 2));
      const y1 = Math.abs(lineBD.top! - y2) + lineBD.top!;

      const p = [
        circleRestrict(new fabric.Point(intersectionsAC[0][0], intersectionsAC[0][1])),
        circleRestrict(new fabric.Point(lineBD.left!, y2)),
        circleRestrict(new fabric.Point(intersectionsAC[1][0], intersectionsAC[1][1])),
        circleRestrict(new fabric.Point(lineBD.left!, y1)),
      ];

      const pA = new fabric.Point(p[2].x, p[2].y);
      const pC = new fabric.Point(p[0].x, p[0].y);
      const pB = new fabric.Point(p[1].x, p[1].y);
      const pD = new fabric.Point(p[3].x, p[3].y);

      const intersection = fabric.Intersection.intersectLineLine(pA, pC, pB, pD);

      if (intersection.status !== "Intersection") {
        lineAC.set({
          x1: staticLineAC.x1,
          y1: staticLineAC.y1,
          x2: staticLineAC.x2,
          y2: staticLineAC.y2,
        });
        lineBD.set({
          x1: staticLineBD.x1,
          y1: staticLineBD.y1,
          x2: staticLineBD.x2,
          y2: staticLineBD.y2,
        });
        return;
      }

      polygon.set({ points: p });

      lineAC.set({ x1: pA.x, y1: pA.y, x2: pC.x, y2: pC.y });
      lineBD.set({ x1: pB.x, y1: pB.y, x2: pD.x, y2: pD.y });

      staticLineAC.set({ x1: pA.x, y1: pA.y, x2: pC.x, y2: pC.y });
      staticLineBD.set({ x1: pB.x, y1: pB.y, x2: pD.x, y2: pD.y });

      const linesIntersection = lineLineIntersection(
        [pA.x, pA.y],
        [pC.x, pC.y],
        [pB.x, pB.y],
        [pD.x, pD.y]
      ) as number[];

      const pE = new fabric.Point(linesIntersection[0], linesIntersection[1]);
      pointE.set({ left: pE.x, top: pE.y });

      const pG = new fabric.Point(
        Math.abs(p[3].x - p[2].x) / 2 + p[2].x,
        Math.abs(p[2].y - p[3].y) / 2 + p[2].y
      );
      pointG.set({ left: pG.x, top: pG.y });

      const pF = (
        fabric.Intersection.intersectLineLine(pE, pG.lerp(pE, 100), pB, pC) as Intersection
      ).points![0];

      pointF.set({ left: pF.x, top: pF.y });

      lineGF.set({ x1: pG.x, y1: pG.y, x2: pF.x, y2: pF.y });
      let angleEVal = -180;
      let angleFVal = 90;

      if (pE.x - 15 <= pA.x && pE.y - 15 <= pB.y) {
        angleEVal = 360;
      } else if (pE.x - 15 <= pA.x) {
        angleEVal = 270;
      } else if (pE.y - 15 <= pB.y) {
        angleEVal = 90;
      }

      if (pF.y - 15 <= pB.y) {
        angleFVal = 0;
      }

      angleE.set({
        left: pE.x as number,
        top: pE.y as number,
        width: 10,
        height: 10,
        fill: "",
        stroke: "black",
        strokeWidth: 0.5,
        angle: angleEVal,
      });

      angleF.set({
        left: pF.x as number,
        top: pF.y as number,
        width: 10,
        height: 10,
        fill: "",
        stroke: "black",
        strokeWidth: 0.5,
        angle:
          (Math.acos(
            (pA.distanceFrom(pC) * pA.distanceFrom(pC) +
              pB.distanceFrom(pC) * pB.distanceFrom(pC) -
              pB.distanceFrom(pA) * pB.distanceFrom(pA)) /
              (2 * pB.distanceFrom(pC) * pA.distanceFrom(pC))
          ) *
            180) /
            Math.PI +
          angleFVal,
      });

      labelA.set({
        left: p[2].x - 20,
        top: p[2].y - 10,
      });

      labelB.set({
        left: p[1].x - 5,
        top: p[1].y - 28,
      });

      labelC.set({
        left: p[0].x + 5,
        top: p[0].y - 12,
      });

      labelD.set({
        left: p[3].x,
        top: p[3].y,
      });

      labelE.set({ left: linesIntersection[0] + 5, top: linesIntersection[1] + 5 });
      labelG.set({ left: pG.x - 15, top: pG.y + 2 });
      labelF.set({ left: pF.x + 8, top: pF.y - 15 });
    };

    moveVertices();
    canvas.on("object:moving", moveVertices);

    canvas.add(circle);
    canvas.add(angleE, angleF);
    canvas.add(polygon);
    canvas.add(staticLineAC, staticLineBD);
    canvas.add(lineAC, lineBD, lineGF);
    canvas.add(labelA, labelB, labelC, labelD, labelE, labelF, labelG);
    canvas.add(pointE, pointF, pointG);
  },
});
</script>
