<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph> </ATypographyParagraph>

  <div id="napoleon-wrapper">
    <ATypographyTitle :level="4">Animated Napoleon's Theorem</ATypographyTitle>
    <ATypographyParagraph class="topics-description">
      <p>
        Napoleon's theorem states that if equilateral triangles are constructed on the sides of any
        triangle, the lines connecting the centers of those equilateral triangles themselves form an
        equilateral triangle.
      </p>
      <p>
        On each side of triangle <span v-katex>\triangle ABC</span>, one can construct three
        equilateral triangles: <span v-katex>\triangle BCP, \triangle CAQ</span> and
        <span v-katex>\triangle ABR</span>. Let <span v-katex>X, Y, Z </span> be the centers of
        these triangles, respectively. Then triangle <span v-katex>\triangle XYZ</span> is an
        equilateral triangle.
      </p>
      <p>
        Click, hold and move any of points <span v-katex>A, B, C</span>, one can observe that
        <span v-katex>\triangle XYZ</span> is equilateral.
      </p>
    </ATypographyParagraph>
    <canvas id="napoleon-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { makeLabel, makeLine, makeCircle, makeMovablePolygon } from "@/utils/canvas";
import {
  calculateDistanceBetweenTwoPoints,
  calculateThreeAngles,
  trilinearToCartesian,
} from "@/utils/geometry";

const topic = indexTopicMap.get(9) as Topic;

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
      backgroundColor: "floralwhite",
    });

    const aNode = makeCircle();
    const bNode = makeCircle();
    const cNode = makeCircle();
    const rNode = makeCircle();
    const pNode = makeCircle();
    const qNode = makeCircle();

    const circumcircleABR = makeCircle();
    const circumcircleACQ = makeCircle();
    const circumcircleBCP = makeCircle();

    const triangleXYZ = createPolygon();

    const lineAR = makeLine();
    const lineBR = makeLine();
    const lineAQ = makeLine();
    const lineCQ = makeLine();
    const lineBP = makeLine();
    const lineCP = makeLine();

    const aLabel = makeLabel("A");
    const bLabel = makeLabel("B");
    const cLabel = makeLabel("C");
    const rLabel = makeLabel("R");
    const pLabel = makeLabel("P");
    const qLabel = makeLabel("Q");
    const xLabel = makeLabel("Z");
    const yLabel = makeLabel("Y");
    const zLabel = makeLabel("X");

    const triangle = makeMovablePolygon(
      [new fabric.Point(300, 150), new fabric.Point(150, 270), new fabric.Point(350, 270)],
      function (coords: fabric.Point[]) {
        aLabel.set({
          left: coords[0].x - 5,
          top: coords[0].y - 35,
        });
        bLabel.set({
          left: coords[1].x - 22,
          top: coords[1].y - 7,
        });
        cLabel.set({
          left: coords[2].x + 5,
          top: coords[2].y - 3,
        });

        // pointA rotate around Point B by 60 degree counterclockwise
        const pointR = new fabric.Point(
          (coords[0].x - coords[1].x) * Math.cos((Math.PI / 180.0) * -60) -
            (coords[0].y - coords[1].y) * Math.sin((Math.PI / 180.0) * -60) +
            coords[1].x,
          (coords[0].x - coords[1].x) * Math.sin((Math.PI / 180.0) * -60) +
            (coords[0].y - coords[1].y) * Math.cos((Math.PI / 180.0) * -60) +
            coords[1].y
        );

        // const disAR = calculateDistanceBetweenTwoPoints(coords[0], pointR);
        // console.log(disAR);
        // const disAB = calculateDistanceBetweenTwoPoints(coords[0], coords[1]);
        // console.log(disAB);
        // const disRB = calculateDistanceBetweenTwoPoints(pointR, coords[1]);
        // console.log(disRB);

        rNode.set({
          left: pointR.x,
          top: pointR.y,
          radius: 0.5,
        });

        const angleABR = calculateThreeAngles(coords[0], coords[1], pointR);
        const circumcenterABR = trilinearToCartesian(
          coords[0],
          coords[1],
          pointR,
          Math.cos(angleABR.x),
          Math.cos(angleABR.y),
          Math.cos(angleABR.z)
        );
        const circumradiusABR = calculateDistanceBetweenTwoPoints(pointR, circumcenterABR);

        circumcircleABR.set({
          originX: "center",
          originY: "center",
          left: circumcenterABR.x,
          top: circumcenterABR.y,
          radius: circumradiusABR,
          stroke: "blue",
          strokeWidth: 1,
        });

        lineAR.set({
          x1: coords[0].x,
          y1: coords[0].y,
          x2: pointR.x,
          y2: pointR.y,
          stroke: "black",
          strokeWidth: 1,
        });
        lineBR.set({
          x1: coords[1].x,
          y1: coords[1].y,
          x2: pointR.x,
          y2: pointR.y,
          stroke: "black",
          strokeWidth: 1,
        });

        rLabel.set({
          left: pointR.x - 20,
          top: pointR.y - 25,
        });

        const pointQ = new fabric.Point(
          (coords[0].x - coords[2].x) * Math.cos((Math.PI / 180.0) * +60) -
            (coords[0].y - coords[2].y) * Math.sin((Math.PI / 180.0) * +60) +
            coords[2].x,
          (coords[0].x - coords[2].x) * Math.sin((Math.PI / 180.0) * +60) +
            (coords[0].y - coords[2].y) * Math.cos((Math.PI / 180.0) * +60) +
            coords[2].y
        );

        qNode.set({
          left: pointQ.x,
          top: pointQ.y,
          radius: 0.5,
        });

        const angleACQ = calculateThreeAngles(coords[0], coords[2], pointQ);
        const circumcenterACQ = trilinearToCartesian(
          coords[0],
          coords[2],
          pointQ,
          Math.cos(angleACQ.x),
          Math.cos(angleACQ.y),
          Math.cos(angleACQ.z)
        );
        const circumradiusACQ = calculateDistanceBetweenTwoPoints(pointQ, circumcenterACQ);

        circumcircleACQ.set({
          originX: "center",
          originY: "center",
          left: circumcenterACQ.x,
          top: circumcenterACQ.y,
          radius: circumradiusACQ,
          stroke: "blue",
          strokeWidth: 1,
        });

        lineAQ.set({
          x1: coords[0].x,
          y1: coords[0].y,
          x2: pointQ.x,
          y2: pointQ.y,
          stroke: "black",
          strokeWidth: 1,
        });
        lineCQ.set({
          x1: coords[2].x,
          y1: coords[2].y,
          x2: pointQ.x,
          y2: pointQ.y,
          stroke: "black",
          strokeWidth: 1,
        });

        qLabel.set({
          left: pointQ.x + 5,
          top: pointQ.y - 15,
        });

        const pointP = new fabric.Point(
          (coords[1].x - coords[2].x) * Math.cos((Math.PI / 180.0) * -60) -
            (coords[1].y - coords[2].y) * Math.sin((Math.PI / 180.0) * -60) +
            coords[2].x,
          (coords[1].x - coords[2].x) * Math.sin((Math.PI / 180.0) * -60) +
            (coords[1].y - coords[2].y) * Math.cos((Math.PI / 180.0) * -60) +
            coords[2].y
        );

        pNode.set({
          left: pointP.x,
          top: pointP.y,
          radius: 0.5,
        });

        const angleBCP = calculateThreeAngles(coords[1], coords[2], pointP);
        const circumcenterBCP = trilinearToCartesian(
          coords[1],
          coords[2],
          pointP,
          Math.cos(angleBCP.x),
          Math.cos(angleBCP.y),
          Math.cos(angleBCP.z)
        );
        const circumradiusBCP = calculateDistanceBetweenTwoPoints(pointP, circumcenterBCP);

        circumcircleBCP.set({
          originX: "center",
          originY: "center",
          left: circumcenterBCP.x,
          top: circumcenterBCP.y,
          radius: circumradiusBCP,
          stroke: "blue",
          strokeWidth: 1,
        });

        lineBP.set({
          x1: coords[1].x,
          y1: coords[1].y,
          x2: pointP.x,
          y2: pointP.y,
          stroke: "black",
          strokeWidth: 1,
        });
        lineCP.set({
          x1: coords[2].x,
          y1: coords[2].y,
          x2: pointP.x,
          y2: pointP.y,
          stroke: "black",
          strokeWidth: 1,
        });

        pLabel.set({
          left: pointP.x - 8,
          top: pointP.y,
        });

        triangleXYZ.set({
          points: [
            new fabric.Point(circumcenterABR.x, circumcenterABR.y),
            new fabric.Point(circumcenterACQ.x, circumcenterACQ.y),
            new fabric.Point(circumcenterBCP.x, circumcenterBCP.y),
          ],
          fill: "transparent",
          stroke: "green",
          strokeWidth: 1,
        });

        aNode.set({
          originX: "center",
          originY: "center",
          left: coords[0].x,
          top: coords[0].y,
          radius: 3,
          fill: "black",
        });
        bNode.set({
          originX: "center",
          originY: "center",
          left: coords[1].x,
          top: coords[1].y,
          radius: 3,
          fill: "black",
        });
        cNode.set({
          originX: "center",
          originY: "center",
          left: coords[2].x,
          top: coords[2].y,
          radius: 3,
          fill: "black",
        });
        xLabel.set({
          left: circumcenterABR.x - 15,
          top: circumcenterABR.y - 20,
          fontSize: 18,
          fill: "green",
        });
        yLabel.set({
          left: circumcenterACQ.x,
          top: circumcenterACQ.y - 20,
          fontSize: 18,
          fill: "green",
        });
        zLabel.set({
          left: circumcenterBCP.x - 8,
          top: circumcenterBCP.y,
          fontSize: 18,
          fill: "green",
        });
      }
    );

    canvas.add(aLabel, bLabel, cLabel);
    canvas.add(xLabel, yLabel, zLabel);
    canvas.add(rLabel, qLabel, pLabel);
    canvas.add(triangle);
    canvas.add(aNode, bNode, cNode);
    canvas.add(rNode, qNode, pNode);
    canvas.add(lineAR, lineBR);
    canvas.add(lineAQ, lineCQ);
    canvas.add(lineBP, lineCP);
    canvas.add(circumcircleABR);
    canvas.add(circumcircleACQ);
    canvas.add(circumcircleBCP);
    canvas.add(triangleXYZ);
  },
});
</script>
