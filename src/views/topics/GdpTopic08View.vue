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
  trilinearToCartesian,
  calculateDistanceFromPointToLine,
  solveLinearEquation,
  calculateIncenter,
  calculateLineIntersectInLinearEquation
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
      const lineAI = makeLine();
      const lineBJ = makeLine();
      const lineCK = makeLine();
      const lineAL = makeLine();
      const lineBL = makeLine();
      const lineCL = makeLine();
      const lineAM = makeLine();
      const lineBM = makeLine();
      const lineCM = makeLine();

      const inscribedCircle = makeCircle();

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

      const lNode = makeCircle();
      const mNode = makeCircle();

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
            top: coords[0].y - 20,
          });

          bLabel.set({
            left: coords[1].x - 10,
            top: coords[1].y,
          });
          cLabel.set({
            left: coords[2].x + 10,
            top: coords[2].y,
          });

          const angles = calculateThreeAngles(coords[0], coords[1], coords[2]);
          const pointL = trilinearToCartesian(
            coords[0],
            coords[1],
            coords[2],
            Math.pow((1 / Math.cos(angles.x / 2)), 2),
            Math.pow((1 / Math.cos(angles.y / 2)), 2),
            Math.pow((1 / Math.cos(angles.z / 2)), 2)
          )

          const pointM = trilinearToCartesian(
            coords[0],
            coords[1],
            coords[2],
            Math.pow((1 / Math.sin(angles.x / 2)), 2),
            Math.pow((1 / Math.sin(angles.y / 2)), 2),
            Math.pow((1 / Math.sin(angles.z / 2)), 2)
          )

          const lineAB = solveLinearEquation(points[0], points[1]);
          const lineBC = solveLinearEquation(points[1], points[2]);
          const lineAC = solveLinearEquation(points[0], points[2]);
          const lineAL = solveLinearEquation(points[0], {
            x: pointL.x,
            y: pointL.y,
          });
          const lineBL = solveLinearEquation(points[1], {
            x: pointL.x,
            y: pointL.y,
          });
          const lineCL = solveLinearEquation(points[2], {
            x: pointL.x,
            y: pointL.y,
          });
          const lineAM = solveLinearEquation(points[0], {
            x: pointM.x,
            y: pointM.y,
          });
          const lineBM = solveLinearEquation(points[1], {
            x: pointM.x,
            y: pointM.y,
          });
          const lineCM = solveLinearEquation(points[2], {
            x: pointM.x,
            y: pointM.y,
          });

          const pointD = calculateLineIntersectInLinearEquation(
            lineAL.m,
            lineAL.b,
            lineBC.m,
            lineBC.b
          );

          const pointE = calculateLineIntersectInLinearEquation(
            lineBL.m,
            lineBL.b,
            lineAC.m,
            lineAC.b
          );

          const pointF = calculateLineIntersectInLinearEquation(
            lineCL.m,
            lineCL.b,
            lineAB.m,
            lineAB.b
          );

          const pointI = calculateLineIntersectInLinearEquation(
            lineAM.m,
            lineAM.b,
            lineBC.m,
            lineBC.b
          );

          const pointJ = calculateLineIntersectInLinearEquation(
            lineBM.m,
            lineBM.b,
            lineAC.m,
            lineAC.b
          );

          const pointK = calculateLineIntersectInLinearEquation(
            lineCM.m,
            lineCM.b,
            lineAB.m,
            lineAB.b
          );

          dLabel.set({
            left: pointD.x - 5,
            top: pointD.y + 10,
          });

          eLabel.set({
            left: pointE.x + 10,
            top: pointE.y - 10,
          });

          fLabel.set({
            left: pointF.x - 23,
            top: pointF.y - 15,
          });

          iLabel.set({
            left: pointI.x - 5,
            top: pointI.y + 10,
          });

          jLabel.set({
            left: pointJ.x + 10,
            top: pointJ.y - 10,
          });

          kLabel.set({
            left: pointK.x - 23,
            top: pointK.y - 15,
          });

          lLabel.set({
            left: pointL.x + 5,
            top: pointL.y + 5,
          });

          mLabel.set({
            left: pointM.x + 5,
            top: pointM.y + 5,
          });

          lineAD.set({
            x1: points[0].x,
            y1: points[0].y,
            x2: pointD.x,
            y2: pointD.y,
            stroke: "black",
          });

          lineBE.set({
            x1: points[1].x,
            y1: points[1].y,
            x2: pointE.x,
            y2: pointE.y,
            stroke: "black",
          });

          lineCF.set({
            x1: points[2].x,
            y1: points[2].y,
            x2: pointF.x,
            y2: pointF.y,
            stroke: "black",
          });

          lineAI.set({
            x1: points[0].x,
            y1: points[0].y,
            x2: pointI.x,
            y2: pointI.y,
            stroke: "black",
          });

          lineBJ.set({
            x1: points[1].x,
            y1: points[1].y,
            x2: pointJ.x,
            y2: pointJ.y,
            stroke: "black",
          });

          lineCK.set({
            x1: points[2].x,
            y1: points[2].y,
            x2: pointK.x,
            y2: pointK.y,
            stroke: "black",
          });

          mNode.set({
            left: pointM.x - 0.75 * 3,
            top: pointM.y - 0.75 * 3,
            radius: 2,
            fill: "blacks",
          });
          lNode.set({
            left: pointL.x - 0.75 * 3,
            top: pointL.y - 0.75 * 3,
            radius: 2,
            fill: "blacks",
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
      canvas.add(iLabel);
      canvas.add(jLabel);
      canvas.add(kLabel);
      canvas.add(lLabel);
      canvas.add(mLabel);

      canvas.add(lineAD);
      canvas.add(lineBE);
      canvas.add(lineCF);
      canvas.add(lineAI);
      canvas.add(lineBJ);
      canvas.add(lineCK);
      canvas.add(lineAL);
      canvas.add(lineBL);
      canvas.add(lineCL);
      canvas.add(lineAM);
      canvas.add(lineBM);
      canvas.add(lineCM);

      canvas.add(mNode);
      canvas.add(lNode);


      canvas.add(inscribedCircle);
    }
  },
);
</script>