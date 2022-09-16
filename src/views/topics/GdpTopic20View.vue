<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>
    Miquel Point
  </ATypographyParagraph>
  <div id="morley-wrapper">
    <ATypographyTitle :level="4">Miquel Point</ATypographyTitle>
    <canvas id="Miquel-Point-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { makeLine, makeLabel, makeCircle, makeMovablePolygon } from "@/utils/canvas";
import {
  getPedalPoint,
  calculateCircumcenter,
  calculateDistanceBetweenTwoPoints,
  calculateLineIntersectInPoints,
} from "@/utils/geometry";
const topic = indexTopicMap.get(20) as Topic;
export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("Miquel-Point-canvas", {
      selection: false,
    });
    const aLabel = makeLabel("A");
    const bLabel = makeLabel("B");
    const cLabel = makeLabel("C");
    const dLabel = makeLabel("D");
    const eLabel = makeLabel("E");
    const fLabel = makeLabel("F");
    const mLabel = makeLabel("M");
    const lineAE = makeLine();
    const lineDE = makeLine();
    const lineCF = makeLine();
    const lineDF = makeLine();
    const lineAE2 = makeLine();
    const lineDE2 = makeLine();
    const lineCF2 = makeLine();
    const lineDF2 = makeLine();
    const circleADE = makeCircle();
    const circleABF = makeCircle();
    const circleCDF = makeCircle();
    const circleBCE = makeCircle();
    const mNode = makeCircle();
    const aNode = makeCircle();
    const bNode = makeCircle();
    const cNode = makeCircle();
    const dNode = makeCircle();
    const leftOffset = 0.75;
    const Quadrilateral = makeMovablePolygon(
      [
        new fabric.Point(190, 130),
        new fabric.Point(320, 60),
        new fabric.Point(390, 140),
        new fabric.Point(280, 160),
      ],
      function (coords: fabric.Point[]) {
        aLabel.set({
          left: coords[0].x - 10,
          top: coords[0].y - 35,
        });
        bLabel.set({
          left: coords[1].x + 5,
          top: coords[1].y - 30,
        });
        cLabel.set({
          left: coords[2].x + 10,
          top: coords[2].y - 20,
        });
        dLabel.set({
          left: coords[3].x - 5,
          top: coords[3].y - 35,
        });
        lineAE.set({
          x1: coords[0].x,
          y1: coords[0].y,
          x2: coords[1].x,
          y2: coords[1].y,
        });
        lineDE.set({
          x1: coords[3].x,
          y1: coords[3].y,
          x2: coords[2].x,
          y2: coords[2].y,
        });
        lineCF.set({
          x1: coords[2].x,
          y1: coords[2].y,
          x2: coords[1].x,
          y2: coords[1].y,
        });
        lineDF.set({
          x1: coords[0].x,
          y1: coords[0].y,
          x2: coords[3].x,
          y2: coords[3].y,
        });
        const pointE = calculateLineIntersectInPoints(lineAE, lineDE, true) as fabric.Point;
        const pointF = calculateLineIntersectInPoints(lineCF, lineDF, true) as fabric.Point;
        eLabel.set({
          left: pointE.x - 25,
          top: pointE.y - 10,
        });
        fLabel.set({
          left: pointF.x + 10,
          top: pointF.y - 5,
        });
        lineAE2.set({
          x1: coords[0].x,
          y1: coords[0].y,
          x2: pointE.x,
          y2: pointE.y,
          strokeWidth: 1.5,
        });
        lineDE2.set({
          x1: coords[3].x,
          y1: coords[3].y,
          x2: pointE.x,
          y2: pointE.y,
          strokeWidth: 1.5,
        });
        lineCF2.set({
          x1: coords[2].x,
          y1: coords[2].y,
          x2: pointF.x,
          y2: pointF.y,
          strokeWidth: 1.5,
        });
        lineDF2.set({
          x1: coords[3].x,
          y1: coords[3].y,
          x2: pointF.x,
          y2: pointF.y,
          strokeWidth: 1.5,
        });
        const circumcenterADE = calculateCircumcenter(coords[0], coords[3], pointE);
        const circumcenterCDF = calculateCircumcenter(coords[2], coords[3], pointF);
        const circumcenterBCE = calculateCircumcenter(coords[1], coords[2], pointE);
        const circumcenterABF = calculateCircumcenter(coords[0], coords[1], pointF);
        const radiusADE = calculateDistanceBetweenTwoPoints(circumcenterADE, coords[0]);
        const radiusCDF = calculateDistanceBetweenTwoPoints(circumcenterCDF, coords[2]);
        const radiusBCE = calculateDistanceBetweenTwoPoints(circumcenterBCE, coords[1]);
        const radiusABF = calculateDistanceBetweenTwoPoints(circumcenterABF, coords[1]);
        const pointO = getPedalPoint(coords[3], circumcenterADE, circumcenterCDF);
        mLabel.set({
          left: pointO.x * 2 - coords[3].x + 5,
          top: pointO.y * 2 - coords[3].y + 5,
          fill: "black",
        });
        mNode.set({
          left: pointO.x * 2 - coords[3].x - leftOffset * 4,
          top: pointO.y * 2 - coords[3].y - leftOffset * 4,
          radius: 3,
          fill: "red",
        });
        aNode.set({
          left: coords[0].x - leftOffset * 4,
          top: coords[0].y - leftOffset * 4,
          radius: 3,
          fill: "black",
        });
        bNode.set({
          left: coords[1].x - leftOffset * 4,
          top: coords[1].y - leftOffset * 4,
          radius: 3,
          fill: "black",
        });
        cNode.set({
          left: coords[2].x - leftOffset * 4,
          top: coords[2].y - leftOffset * 4,
          radius: 3,
          fill: "black",
        });
        dNode.set({
          left: coords[3].x - leftOffset * 4,
          top: coords[3].y - leftOffset * 4,
          radius: 3,
          fill: "black",
        });
        circleADE.set({
          originX: "center",
          originY: "center",
          left: circumcenterADE.x,
          top: circumcenterADE.y,
          radius: radiusADE,
          strokeWidth: 2,
          stroke: "green",
        });
        circleCDF.set({
          originX: "center",
          originY: "center",
          left: circumcenterCDF.x,
          top: circumcenterCDF.y,
          radius: radiusCDF,
          strokeWidth: 2,
          stroke: "green",
        });
        circleABF.set({
          originX: "center",
          originY: "center",
          left: circumcenterABF.x,
          top: circumcenterABF.y,
          radius: radiusABF,
          strokeWidth: 2,
          stroke: "green",
        });
        circleBCE.set({
          originX: "center",
          originY: "center",
          left: circumcenterBCE.x,
          top: circumcenterBCE.y,
          radius: radiusBCE,
          strokeWidth: 2,
          stroke: "green",
        });

      }
    );
    canvas.add(aLabel);
    canvas.add(bLabel);
    canvas.add(cLabel);
    canvas.add(dLabel);
    canvas.add(eLabel);
    canvas.add(fLabel);
    canvas.add(mLabel);
    canvas.add(mNode);
    canvas.add(Quadrilateral);
    canvas.add(lineAE2, lineCF2, lineDE2, lineDF2);
    canvas.add(circleADE, circleCDF, circleBCE, circleABF);
    canvas.add(mNode, aNode, bNode, cNode, dNode);
  },
});
</script>
