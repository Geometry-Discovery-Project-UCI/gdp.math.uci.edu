<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>
    The Nine-Point Circle of any triangle is defined by these nine concyclic points: the 3 midpoints
    of each side of the triangle; the 3 feet of each altitude; the 3 midpoints of the line segments
    between the orthocenter and each vertex of the triangle.
  </ATypographyParagraph>
  <div id="morley-wrapper">
    <ATypographyTitle :level="4">Animated Nine-Point Circle</ATypographyTitle>
    <canvas id="nine-point-circle-canvas" width="500" height="500" />
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
  calculateMidpoint,
  calculateOrthocenter,
  calculateDistanceBetweenTwoPoints,
} from "@/utils/geometry";
const topic = indexTopicMap.get(13) as Topic;
export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("nine-point-circle-canvas", {
      selection: false,
    });
    const heightOnAB = makeLine();
    const heightOnBC = makeLine();
    const heightOnAC = makeLine();
    const lineAJ = makeLine();
    const lineAK = makeLine();
    const lineBI = makeLine();
    const lineBK = makeLine();
    const lineCI = makeLine();
    const lineCJ = makeLine();
    const ninePointCircle = makeCircle();
    const aLabel = makeLabel("A");
    const bLabel = makeLabel("B");
    const cLabel = makeLabel("C");
    const dLabel = makeLabel("D");
    const eLabel = makeLabel("E");
    const fLabel = makeLabel("F");
    const iLabel = makeLabel("I");
    const jLabel = makeLabel("J");
    const kLabel = makeLabel("K");
    const lLabel = makeLabel("L");
    const mLabel = makeLabel("M");
    const nLabel = makeLabel("N");
    const oLabel = makeLabel("O");
    const dNode = makeCircle();
    const eNode = makeCircle();
    const fNode = makeCircle();
    const iNode = makeCircle();
    const jNode = makeCircle();
    const kNode = makeCircle();
    const lNode = makeCircle();
    const mNode = makeCircle();
    const nNode = makeCircle();
    const oNode = makeCircle();
    // create triangle
    const triangle = makeMovablePolygon(
      [
        new fabric.Point(175, 75),
        new fabric.Point(100, 400),
        new fabric.Point(400, 400),
      ],
      // set label for triangle's vertices
      function (coords: fabric.Point[]) {
        aLabel.set({
          left: coords[0].x - 10,
          top: coords[0].y - 35,
        });
        bLabel.set({
          left: coords[1].x - 25,
          top: coords[1].y + 5,
        });
        cLabel.set({
          left: coords[2].x + 10,
          top: coords[2].y,
        });
        // calculate the coordinates for the feet of the triangle's vertices
        const pedalPointOnBC = getPedalPoint(coords[0], coords[1], coords[2]);
        const pedalPointOnAC = getPedalPoint(coords[1], coords[0], coords[2]);
        const pedalPointOnAB = getPedalPoint(coords[2], coords[0], coords[1]);

        // set line coordinates for three altitudes
        if (pedalPointOnAB.y < coords[0].y) {
          lineAJ.set({
            x1: coords[0].x,
            y1: coords[0].y,
            x2: pedalPointOnAC.x,
            y2: pedalPointOnAC.y,
            strokeDashArray: [5, 5],
            stroke: "red",
          });
          lineAK.set({
            x1: coords[0].x,
            y1: coords[0].y,
            x2: pedalPointOnAB.x,
            y2: pedalPointOnAB.y,
            strokeDashArray: [5, 5],
            stroke: "red",
          });
        }
        if (pedalPointOnBC.x < coords[1].x) {
          lineBI.set({
            x1: coords[1].x,
            y1: coords[1].y,
            x2: pedalPointOnBC.x,
            y2: pedalPointOnBC.y,
            strokeDashArray: [5, 5],
            stroke: "red",
          });
          lineBK.set({
            x1: coords[1].x,
            y1: coords[1].y,
            x2: pedalPointOnAB.x,
            y2: pedalPointOnAB.y,
            strokeDashArray: [5, 5],
            stroke: "red",
          });
        }
        if (pedalPointOnAC.x > coords[2].x) {
          lineCI.set({
            x1: coords[2].x,
            y1: coords[2].y,
            x2: pedalPointOnBC.x,
            y2: pedalPointOnBC.y,
            strokeDashArray: [5, 5],
            stroke: "red",
          });
          lineCJ.set({
            x1: coords[2].x,
            y1: coords[2].y,
            x2: pedalPointOnAC.x,
            y2: pedalPointOnAC.y,
            strokeDashArray: [5, 5],
            stroke: "red",
          });
        }
        heightOnBC.set({
          x1: coords[0].x,
          y1: coords[0].y,
          x2: pedalPointOnBC.x,
          y2: pedalPointOnBC.y,
          stroke: "red",
        });
        heightOnAC.set({
          x1: coords[1].x,
          y1: coords[1].y,
          x2: pedalPointOnAC.x,
          y2: pedalPointOnAC.y,
          stroke: "red",
        });
        heightOnAB.set({
          x1: coords[2].x,
          y1: coords[2].y,
          x2: pedalPointOnAB.x,
          y2: pedalPointOnAB.y,
          stroke: "red",
        });
        // calculate three centers of the triangle
        const circumcenter = calculateCircumcenter(coords[0], coords[1], coords[2]);
        const orthocenter = calculateOrthocenter(coords[0], coords[1], coords[2]);
        const center = calculateMidpoint(circumcenter, orthocenter);
        // calculate midpoints of three sides of triangle
        const midPointAB = calculateMidpoint(coords[0], coords[1]);
        const midPointBC = calculateMidpoint(coords[1], coords[2]);
        const midPointAC = calculateMidpoint(coords[0], coords[2]);
        // calculate midpoints of the segment from the orthocenter to the vertex
        const midPointOA = calculateMidpoint(coords[0], orthocenter);
        const midPointOB = calculateMidpoint(coords[1], orthocenter);
        const midPointOC = calculateMidpoint(coords[2], orthocenter);
        // calculate radius of nine-point circle
        const radius = calculateDistanceBetweenTwoPoints(center, midPointBC);
        // set values for nine-point circle
        ninePointCircle.set({
          originX: "center",
          originY: "center",
          left: center.x,
          top: center.y,
          radius,
          stroke: "green",
          strokeWidth: 2,
        });
        dLabel.set({
          left: midPointBC.x - 3,
          top: midPointBC.y + 5,
          fontSize: 18,
        });
        eLabel.set({
          left: midPointAC.x + 10,
          top: midPointAC.y - 15,
          fontSize: 18,
        });
        fLabel.set({
          left: midPointAB.x - 23,
          top: midPointAB.y - 15,
          fontSize: 18,
        });
        iLabel.set({
          left: pedalPointOnBC.x - 5,
          top: pedalPointOnBC.y + 5,
          fontSize: 18,
        });
        jLabel.set({
          left: pedalPointOnAC.x + 10,
          top: pedalPointOnAC.y - 15,
          fontSize: 18,
        });
        kLabel.set({
          left: pedalPointOnAB.x - 23,
          top: pedalPointOnAB.y - 15,
          fontSize: 18,
        });
        lLabel.set({
          left: midPointOA.x + 5,
          top: midPointOA.y + 5,
          fontSize: 18,
        });
        mLabel.set({
          left: midPointOB.x - 7,
          top: midPointOB.y + 7,
          fontSize: 18,
        });
        nLabel.set({
          left: midPointOC.x - 10,
          top: midPointOC.y - 25,
          fontSize: 18,
        });
        oLabel.set({
          left: orthocenter.x + 3,
          top: orthocenter.y + 5,
          fontSize: 18,
        });
        dNode.set({
          left: midPointBC.x - 0.75 * 3,
          top: midPointBC.y - 0.75 * 3,
          radius: 2,
          fill: "blacks",
        });
        eNode.set({
          left: midPointAC.x - 0.75 * 3,
          top: midPointAC.y - 0.75 * 3,
          radius: 2,
          fill: "blacks",
        });
        fNode.set({
          left: midPointAB.x - 0.75 * 3,
          top: midPointAB.y - 0.75 * 3,
          radius: 2,
          fill: "blacks",
        });
        iNode.set({
          left: pedalPointOnBC.x - 0.75 * 3,
          top: pedalPointOnBC.y - 0.75 * 3,
          radius: 2,
          fill: "blacks",
        });
        jNode.set({
          left: pedalPointOnAC.x - 0.75 * 3,
          top: pedalPointOnAC.y - 0.75 * 3,
          radius: 2,
          fill: "blacks",
        });
        kNode.set({
          left: pedalPointOnAB.x - 0.75 * 3,
          top: pedalPointOnAB.y - 0.75 * 3,
          radius: 2,
          fill: "blacks",
        });
        lNode.set({
          left: midPointOA.x - 0.75 * 3,
          top: midPointOA.y - 0.75 * 3,
          radius: 2,
          fill: "blacks",
        });
        mNode.set({
          left: midPointOB.x - 0.75 * 3,
          top: midPointOB.y - 0.75 * 3,
          radius: 2,
          fill: "blacks",
        });
        nNode.set({
          left: midPointOC.x - 0.75 * 3,
          top: midPointOC.y - 0.75 * 3,
          radius: 2,
          fill: "blacks",
        });
        oNode.set({
          left: orthocenter.x - 0.75 * 3,
          top: orthocenter.y - 0.75 * 3,
          radius: 2,
          fill: "red",
          stroke: "red",
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
    canvas.add(jLabel);
    canvas.add(kLabel);
    canvas.add(lLabel);
    canvas.add(mLabel);
    canvas.add(nLabel);
    canvas.add(oLabel);
    canvas.add(heightOnAB);
    canvas.add(heightOnBC);
    canvas.add(heightOnAC);
    canvas.add(ninePointCircle);
    canvas.add(dNode);
    canvas.add(eNode);
    canvas.add(fNode);
    canvas.add(iNode);
    canvas.add(jNode);
    canvas.add(kNode);
    canvas.add(lNode);
    canvas.add(mNode);
    canvas.add(nNode);
    canvas.add(oNode);
    canvas.add(lineAJ);
    canvas.add(lineAK);
    canvas.add(lineBI);
    canvas.add(lineBK);
    canvas.add(lineCI);
    canvas.add(lineCJ);
  },
});
</script>
