<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>
    The description of Gergonne and Nagel Points
  </ATypographyParagraph>
  <div id="Gergonne-and-Nagel-Points-wapper">
    <ATypographyTitle :level="4">Gergonne and Nagel Points</ATypographyTitle>
    <ATypographyParagraph class="topics-description">
      <p>
        In the following picture, <span v-katex>D, E, F</span> are the tangent points of the incircle
        to the sides <span v-katex>BC, CA,</span> and <span v-katex>AB,</span> respectively.
        <span v-katex>AD, BE,</span> and <span v-katex>CF</span> are concurrent at the
        Gergonne point <span v-katex>G</span>.
      </p>
      <p>
        Similarly, let <span v-katex>J, K, L</span> be the tangent points of the excircles to the
        sides <span v-katex>BC, CA, AB</span>. Then <span v-katex>AJ, BK</span>, and <span v-katex>CL</span> are concurrent at
        the Nagel point <span v-katex>N</span>.
      </p>
      <p>
        Click, hold, and move points <span v-katex>A, B,</span> and <span v-katex>C</span>, we shall see
        the positions of <span v-katex>G</span> and <span v-katex>N</span> will also change accordingly.
      </p>
    </ATypographyParagraph>
    <canvas id="Gergonne-and-Nagel-Points-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import {
  makeLine,
  makeLabel,
  makeCircle,
  makeMovablePolygon, makeSelectCircle
} from "@/utils/canvas";
import {
  calculateThreeAngles,
  trilinearToCartesian,
  calculateDistanceFromPointToLine,
  solveLinearEquation,
  calculateIncenter,
  calculateLineIntersectInLinearEquation
} from "@/utils/geometry";
const topic = indexTopicMap.get(8) as Topic;
export default defineComponent(
  {
    setup() {
      return { topic };
    },
    mounted() {
      const canvas = new fabric.Canvas("Gergonne-and-Nagel-Points-canvas", {
        selection: false,
      });
      const lineAD = makeLine();
      const lineBE = makeLine();
      const lineCF = makeLine();
      const lineAJ = makeLine();
      const lineBK = makeLine();
      const lineCL = makeLine();
      const lineAG = makeLine();
      const lineBG = makeLine();
      const lineCG = makeLine();
      const lineAN = makeLine();
      const lineBN = makeLine();
      const lineCN = makeLine();
      const inscribedCircle = makeCircle();
      const aLabel = makeLabel("A");
      const bLabel = makeLabel("B");
      const cLabel = makeLabel("C");
      const dLabel = makeLabel("D");
      const eLabel = makeLabel("E");
      const fLabel = makeLabel("F");
      const lLabel = makeLabel("L");
      const jLabel = makeLabel("J");
      const kLabel = makeLabel("K");
      const gLabel = makeLabel("G");
      const nLabel = makeLabel("N");
      const iLabel = makeLabel("I");
      const gNode = makeCircle();
      const nNode = makeCircle();
      const iNode = makeCircle();
      const circleA = makeSelectCircle();
      const circleB = makeSelectCircle();
      const circleC = makeSelectCircle();

      const triangle = makeMovablePolygon(
        [
          new fabric.Point(175, 75),
          new fabric.Point(100, 400),
          new fabric.Point(400, 400),
        ],
        function (coords: fabric.Point[]) {
          const points = triangle.points as fabric.Point[];
          aLabel.set({
            left: coords[0].x,
            top: coords[0].y - 30,
          });
          bLabel.set({
            left: coords[1].x - 20,
            top: coords[1].y + 5,
          });
          cLabel.set({
            left: coords[2].x + 10,
            top: coords[2].y,
          });
          circleA.set({
            left: coords[0].x,
            top: coords[0].y
          });
          circleB.set({
            left: coords[1].x,
            top: coords[1].y
          });
          circleC.set({
            left: coords[2].x,
            top: coords[2].y
          });
          const angles = calculateThreeAngles(coords[0], coords[1], coords[2]);
          const pointG = trilinearToCartesian(
            coords[0],
            coords[1],
            coords[2],
            Math.pow((1 / Math.cos(angles.x / 2)), 2),
            Math.pow((1 / Math.cos(angles.y / 2)), 2),
            Math.pow((1 / Math.cos(angles.z / 2)), 2)
          );
          const pointN = trilinearToCartesian(
            coords[0],
            coords[1],
            coords[2],
            Math.pow((1 / Math.sin(angles.x / 2)), 2),
            Math.pow((1 / Math.sin(angles.y / 2)), 2),
            Math.pow((1 / Math.sin(angles.z / 2)), 2)
          );
          const pointI = calculateIncenter(coords[0], coords[1], coords[2]);

          const lineAB = solveLinearEquation(points[0], points[1]);
          const lineBC = solveLinearEquation(points[1], points[2]);
          const lineAC = solveLinearEquation(points[0], points[2]);
          const lineAG = solveLinearEquation(points[0], new fabric.Point(pointG.x, pointG.y));
          const lineBG = solveLinearEquation(points[1], new fabric.Point(pointG.x, pointG.y));
          const lineCG = solveLinearEquation(points[2], new fabric.Point(pointG.x, pointG.y));
          const lineAN = solveLinearEquation(points[0], new fabric.Point(pointN.x, pointN.y));
          const lineBN = solveLinearEquation(points[1], new fabric.Point(pointN.x, pointN.y));
          const lineCN = solveLinearEquation(points[2], new fabric.Point(pointN.x, pointN.y));
          const pointD = calculateLineIntersectInLinearEquation(
            lineAG.m,
            lineAG.b,
            lineBC.m,
            lineBC.b
          );
          const pointE = calculateLineIntersectInLinearEquation(
            lineBG.m,
            lineBG.b,
            lineAC.m,
            lineAC.b
          );
          const pointF = calculateLineIntersectInLinearEquation(
            lineCG.m,
            lineCG.b,
            lineAB.m,
            lineAB.b
          );
          const pointJ = calculateLineIntersectInLinearEquation(
            lineAN.m,
            lineAN.b,
            lineBC.m,
            lineBC.b
          );
          const pointK = calculateLineIntersectInLinearEquation(
            lineBN.m,
            lineBN.b,
            lineAC.m,
            lineAC.b
          );
          const pointL = calculateLineIntersectInLinearEquation(
            lineCN.m,
            lineCN.b,
            lineAB.m,
            lineAB.b
          );
          dLabel.set({
            left: pointD.x - 5,
            top: pointD.y + 10,
          });
          eLabel.set({
            left: pointE.x + 10,
            top: pointE.y - 20,
          });
          fLabel.set({
            left: pointF.x - 23,
            top: pointF.y - 15,
          });
          jLabel.set({
            left: pointJ.x - 5,
            top: pointJ.y + 10,
          });
          kLabel.set({
            left: pointK.x + 10,
            top: pointK.y - 20,
          });
          lLabel.set({
            left: pointL.x - 23,
            top: pointL.y - 15,
          });
          gLabel.set({
            left: pointG.x + 5,
            top: pointG.y + 5,
          });
          nLabel.set({
            left: pointN.x + 10,
            top: pointN.y - 13,
          });
          iLabel.set({
            left: pointI.x + 8,
            top: pointI.y - 3,
          });
          lineAD.set({
            x1: points[0].x,
            y1: points[0].y,
            x2: pointD.x,
            y2: pointD.y,
            stroke: "blue",
          });
          lineBE.set({
            x1: points[1].x,
            y1: points[1].y,
            x2: pointE.x,
            y2: pointE.y,
            stroke: "blue",
          });
          lineCF.set({
            x1: points[2].x,
            y1: points[2].y,
            x2: pointF.x,
            y2: pointF.y,
            stroke: "blue",
          });
          lineAJ.set({
            x1: points[0].x,
            y1: points[0].y,
            x2: pointJ.x,
            y2: pointJ.y,
            stroke: "green",
          });
          lineBK.set({
            x1: points[1].x,
            y1: points[1].y,
            x2: pointK.x,
            y2: pointK.y,
            stroke: "green",
          });
          lineCL.set({
            x1: points[2].x,
            y1: points[2].y,
            x2: pointL.x,
            y2: pointL.y,
            stroke: "green",
          });
          nNode.set({
            left: pointN.x - 0.75 * 3,
            top: pointN.y - 0.75 * 3,
            radius: 2,
            fill: "green",
          });
          gNode.set({
            left: pointG.x - 0.75 * 3,
            top: pointG.y - 0.75 * 3,
            radius: 2,
            fill: "blue",
          });
          iNode.set({
            left: pointI.x - 0.75 * 3,
            top: pointI.y - 0.75 * 3,
            radius: 2,
            fill: "Red",
          });
          const inCenter = calculateIncenter(coords[0], coords[1], coords[2]);
          const radius = calculateDistanceFromPointToLine(inCenter, makeLine(coords[1], coords[2]));
          const centerOfCircle = inscribedCircle.translateToCenterPoint(inCenter, "right", "bottom");
          inscribedCircle.set({
            radius,
            left: centerOfCircle.x,
            top: centerOfCircle.y,
            stroke: "red",
            strokeWidth: 2,
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
      canvas.add(lLabel);
      canvas.add(jLabel);
      canvas.add(kLabel);
      canvas.add(gLabel);
      canvas.add(nLabel);
      canvas.add(lineAD);
      canvas.add(lineBE);
      canvas.add(lineCF);
      canvas.add(lineAJ);
      canvas.add(lineBK);
      canvas.add(lineCL);
      canvas.add(lineAG);
      canvas.add(lineBG);
      canvas.add(lineCG);
      canvas.add(lineAN);
      canvas.add(lineBN);
      canvas.add(lineCN);
      canvas.add(nNode);
      canvas.add(gNode);
      canvas.add(iNode);
      canvas.add(iLabel);
      canvas.add(inscribedCircle);
      canvas.add(circleA, circleB, circleC);
    }
  },
);
</script>
