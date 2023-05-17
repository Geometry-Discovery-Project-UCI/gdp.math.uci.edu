<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph> </ATypographyParagraph>

  <div id="Davis-wrapper">
    <ATypographyTitle :level="4">Davis' Theorem</ATypographyTitle>
    <input name="iconType" type="radio" id="btn-HIDE" /><span class="radio-btn-title">HIDE</span>
    <input name="iconType" type="radio" id="btn-GFDE" /><span class="radio-btn-title">GFDE</span>
    <input name="iconType" type="radio" id="btn-HIGF" /><span class="radio-btn-title">HIGF</span>
    <input name="iconType" type="radio" id="btn-HIDEGF" checked /><span class="radio-btn-title"
      >HIDEGF</span
    >
    <canvas id="Davis-canvas" width="500" height="500" />
  </div>
</template>

<style>
.radio-btn-title {
  font-weight: 800;
  margin-right: 20px;
  margin-left: 3px;
}
</style>
<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Coord, Topic } from "@/types";
import { fabric } from "fabric";
import { makeCircle, makeLabel } from "@/utils/canvas";
import { solveLinearEquation, circleLineIntersection } from "@/utils/geometry";

const topic = indexTopicMap.get(28) as Topic;

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("Davis-canvas", {
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
      });
    }

    function coordToPoint(cd: Coord): fabric.Point {
      return new fabric.Point(cd.x, cd.y);
    }

    const radius = 120;
    const center = { x: 270, y: 300 } as Coord;

    const points = [
      new fabric.Point(310, 120),
      new fabric.Point(50, 400),
      new fabric.Point(420, 400),
    ];
    const labelA = makeLabel("A");
    const labelB = makeLabel("B");
    const labelC = makeLabel("C");
    const labelD = makeLabel("D");
    const labelE = makeLabel("E");
    const labelF = makeLabel("F");
    const labelG = makeLabel("G");
    const labelH = makeLabel("H");
    const labelI = makeLabel("I");
    const triangle = createPolygon(points);
    const circumCircle = makeCircle(radius, coordToPoint(center));
    circumCircle.set({
      originX: "center",
      originY: "center",
      stroke: "orange",
    });

    const lineACeq = solveLinearEquation(points[0], points[2]);
    const lineACIntersections = circleLineIntersection(
      radius,
      center.x,
      center.y,
      lineACeq.m,
      lineACeq.b
    );

    const lineABeq = solveLinearEquation(points[0], points[1]);
    const lineABIntersections = circleLineIntersection(
      radius,
      center.x,
      center.y,
      lineABeq.m,
      lineABeq.b
    );

    const lineBCeq = solveLinearEquation(points[1], points[2]);
    const lineBCIntersections = circleLineIntersection(
      radius,
      center.x,
      center.y,
      lineBCeq.m,
      lineBCeq.b
    );

    const pointD = makeCircle(
      3,
      new fabric.Point(lineBCIntersections[1][0], lineBCIntersections[1][1]),
      "red"
    );
    const pointE = makeCircle(
      3,
      new fabric.Point(lineBCIntersections[0][0], lineBCIntersections[0][1]),
      "red"
    );

    const pointF = makeCircle(
      3,
      new fabric.Point(lineACIntersections[0][0], lineACIntersections[0][1]),
      "red"
    );

    const pointG = makeCircle(
      3,
      new fabric.Point(lineACIntersections[1][0], lineACIntersections[1][1]),
      "red"
    );

    const pointH = makeCircle(
      3,
      new fabric.Point(lineABIntersections[1][0], lineABIntersections[1][1]),
      "red"
    );

    const pointI = makeCircle(
      3,
      new fabric.Point(lineABIntersections[0][0], lineABIntersections[0][1]),
      "red"
    );

    pointG.set({ originX: "center", originY: "center" });
    pointF.set({ originX: "center", originY: "center" });
    pointH.set({ originX: "center", originY: "center" });
    pointI.set({ originX: "center", originY: "center" });
    pointD.set({ originX: "center", originY: "center" });
    pointE.set({ originX: "center", originY: "center" });

    labelA.set({ left: points[0].x - 5, top: points[0].y - 30 });
    labelB.set({ left: points[1].x - 25, top: points[1].y - 10 });
    labelC.set({ left: points[2].x + 10, top: points[2].y - 10 });
    labelD.set({ left: pointD.left! - 5, top: pointD.top! + 5 });
    labelE.set({ left: pointE.left! - 5, top: pointE.top! + 5 });
    labelF.set({ left: pointF.left! + 10, top: pointF.top! - 5 });
    labelG.set({ left: pointG.left! + 5, top: pointG.top! - 20 });
    labelH.set({ left: pointH.left! - 25, top: pointH.top! - 20 });
    labelI.set({ left: pointI.left! - 15, top: pointI.top! - 25 });

    let ele = document.getElementById("btn-HIDE") as HTMLInputElement;
    ele.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        circumCircle.set({ stroke: "purple" });
        pointG.set({ radius: 0.5 });
        pointF.set({ radius: 0.5 });
        pointH.set({ radius: 3 });
        pointI.set({ radius: 3 });
        pointD.set({ radius: 3 });
        pointE.set({ radius: 3 });
        labelG.set({ opacity: 0 });
        labelF.set({ opacity: 0 });
        labelH.set({ opacity: 1 });
        labelI.set({ opacity: 1 });
        labelD.set({ opacity: 1 });
        labelE.set({ opacity: 1 });
        canvas.renderAll();
      }
    };

    ele = document.getElementById("btn-GFDE") as HTMLInputElement;
    ele.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        circumCircle.set({ stroke: "blue" });
        pointG.set({ radius: 3 });
        pointF.set({ radius: 3 });
        pointH.set({ radius: 0.5 });
        pointI.set({ radius: 0.5 });
        pointD.set({ radius: 3 });
        pointE.set({ radius: 3 });
        labelG.set({ opacity: 1 });
        labelF.set({ opacity: 1 });
        labelH.set({ opacity: 0 });
        labelI.set({ opacity: 0 });
        labelD.set({ opacity: 1 });
        labelE.set({ opacity: 1 });
        canvas.renderAll();
      }
    };

    ele = document.getElementById("btn-HIGF") as HTMLInputElement;
    ele.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        circumCircle.set({ stroke: "green" });
        pointG.set({ radius: 3 });
        pointF.set({ radius: 3 });
        pointH.set({ radius: 3 });
        pointI.set({ radius: 3 });
        pointD.set({ radius: 0.5 });
        pointE.set({ radius: 0.5 });
        labelG.set({ opacity: 1 });
        labelF.set({ opacity: 1 });
        labelH.set({ opacity: 1 });
        labelI.set({ opacity: 1 });
        labelD.set({ opacity: 0 });
        labelE.set({ opacity: 0 });
        canvas.renderAll();
      }
    };

    ele = document.getElementById("btn-HIDEGF") as HTMLInputElement;
    ele.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        circumCircle.set({ stroke: "orange" });
        pointG.set({ radius: 3 });
        pointF.set({ radius: 3 });
        pointH.set({ radius: 3 });
        pointI.set({ radius: 3 });
        pointD.set({ radius: 3 });
        pointE.set({ radius: 3 });
        labelG.set({ opacity: 1 });
        labelF.set({ opacity: 1 });
        labelH.set({ opacity: 1 });
        labelI.set({ opacity: 1 });
        labelD.set({ opacity: 1 });
        labelE.set({ opacity: 1 });
        canvas.renderAll();
      }
    };

    canvas.add(triangle);
    canvas.add(circumCircle);
    canvas.add(labelA, labelB, labelC, labelD, labelE, labelF, labelG, labelH, labelI);
    canvas.add(pointG, pointF, pointH, pointI, pointD, pointE);
  },
});
</script>
