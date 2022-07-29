<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>
    The description of Gergonne and Nagel Points
  </ATypographyParagraph>
  <div id="Gergonne-and-Nagel-Points-wapper">
    <ATypographyTitle :level="4">Gergonne and Nagel Points</ATypographyTitle>
    <canvas id="Gergonne-and-Nagel-Points-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { indexTopicMap } from '@/data';
import { Topic } from '@/types';
import { fabric } from 'fabric';
import {
  makeLine,
  makeLabel,
  makeCircle,
  makeMovablePolygon
} from '@/utils/canvas';
import {
  calculateThreeAngles,
  calculateIncenter,
} from '@/utils/geometry';
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
      const lineAL = makeLine();
      const lineBJ = makeLine();
      const lineCK = makeLine();
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

      const triangle = makeMovablePolygon(
        [
          {
            x: 175,
            y: 75,
          },
          {
            x: 100,
            y: 400,
          },
          {
            x: 400,
            y: 400,
          },
        ],
        function (coords: Array<fabric.Point>) {
          const points = triangle.points as Array<fabric.Point>;
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
          const angles = calculateThreeAngles(coords[0], coords[1], coords[2]);
          const pointG = trilinearToCartesian(
            coords[0],
            coords[1],
            coords[2],
            Math.pow((1 / Math.cos(angles.x / 2)), 2),
            Math.pow((1 / Math.cos(angles.y / 2)), 2),
            Math.pow((1 / Math.cos(angles.z / 2)), 2)
          )
          const pointN = trilinearToCartesian(
            coords[0],
            coords[1],
            coords[2],
            Math.pow((1 / Math.sin(angles.x / 2)), 2),
            Math.pow((1 / Math.sin(angles.y / 2)), 2),
            Math.pow((1 / Math.sin(angles.z / 2)), 2)
          )
          const pointI = calculateIncenter(coords[0], coords[1], coords[2]);

          const lineAB = solveLinearEquation(points[0], points[1]);
          const lineBC = solveLinearEquation(points[1], points[2]);
          const lineAC = solveLinearEquation(points[0], points[2]);
          const lineAG = solveLinearEquation(points[0], {
            x: pointG.x,
            y: pointG.y,
          });
          const lineBG = solveLinearEquation(points[1], {
            x: pointG.x,
            y: pointG.y,
          });
          const lineCG = solveLinearEquation(points[2], {
            x: pointG.x,
            y: pointG.y,
          });
          const lineAN = solveLinearEquation(points[0], {
            x: pointN.x,
            y: pointN.y,
          });
          const lineBN = solveLinearEquation(points[1], {
            x: pointN.x,
            y: pointN.y,
          });
          const lineCN = solveLinearEquation(points[2], {
            x: pointN.x,
            y: pointN.y,
          });
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
          const pointL = calculateLineIntersectInLinearEquation(
            lineAN.m,
            lineAN.b,
            lineBC.m,
            lineBC.b
          );
          const pointJ = calculateLineIntersectInLinearEquation(
            lineBN.m,
            lineBN.b,
            lineAC.m,
            lineAC.b
          );
          const pointK = calculateLineIntersectInLinearEquation(
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
          lLabel.set({
            left: pointL.x - 5,
            top: pointL.y + 10,
          });
          jLabel.set({
            left: pointJ.x + 10,
            top: pointJ.y - 20,
          });
          kLabel.set({
            left: pointK.x - 23,
            top: pointK.y - 15,
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
          lineAL.set({
            x1: points[0].x,
            y1: points[0].y,
            x2: pointL.x,
            y2: pointL.y,
            stroke: "green",
          });
          lineBJ.set({
            x1: points[1].x,
            y1: points[1].y,
            x2: pointJ.x,
            y2: pointJ.y,
            stroke: "green",
          });
          lineCK.set({
            x1: points[2].x,
            y1: points[2].y,
            x2: pointK.x,
            y2: pointK.y,
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
          const radius = calculateDistanceFromPointToLine(
            inCenter,
            makeLine(coords[1], coords[2])
          );
          const centerOfCircle = inscribedCircle.translateToCenterPoint(
            // {
            //   x: incenter.x,
            //   y: incenter.y,
            // },
            inCenter as fabric.Point,
            "right",
            "bottom"
          );
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
      canvas.add(lineAL);
      canvas.add(lineBJ);
      canvas.add(lineCK);
      canvas.add(lineAG);
      canvas.add(lineBG);
      canvas.add(lineCG);
      canvas.add(lineAN);
      canvas.add(lineBN);
      canvas.add(lineCN);
      canvas.add(nNode);
      canvas.add(gNode);
      canvas.add(iNode)
      canvas.add(iLabel);
      canvas.add(inscribedCircle);
    }
  },
);
</script>
