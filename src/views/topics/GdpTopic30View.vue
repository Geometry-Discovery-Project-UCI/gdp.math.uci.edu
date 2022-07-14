<template>
    <TopicMeta :topic="topic" />
  <ATypographyParagraph>

  </ATypographyParagraph>
  <div id="Gergonne-and-Nagel-Points-wapper">
    <ATypographyTitle :level="4">Animated Taylor Circles</ATypographyTitle>
    <canvas id="Gergonne-and-Nagel-Points-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { indexTopicMap } from '@/data';
import { Topic } from '@/types';
import {fabric} from "fabric";
import {makeLabel, makeLine, makeMovablePolygon} from "@/utils/canvas";
import {
  calculateLineIntersectInLinearEquation,
  calculateThreeAngles,
  solveLinearEquation,
  trilinearToCartesian
} from "@/utils/geometry";

const topic = indexTopicMap.get(30) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
      mounted() {
        const canvas = new fabric.Canvas("Gergonne-and-Nagel-Points-canvas", {
          selection: false,
        });
        const lineAB = makeLine();
        const lineBC = makeLine();
        const lineAC = makeLine();
        const lineAH = makeLine();
        const lineBH = makeLine();
        const lineCH = makeLine();
        const lineAHa = makeLine();
        const lineBHb = makeLine();
        const lineCHc = makeLine();


        const aLabel = makeLabel("A");
        const bLabel = makeLabel("B");
        const cLabel = makeLabel("C");
        const HLabel = makeLabel("H");
        const HALabel = makeLabel("Ha");
        const HBLabel = makeLabel("Hb");
        const HCLabel = makeLabel("Hc");

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

            // Calulate three angle of the triangle
            const angles = calculateThreeAngles(coords[0], coords[1], coords[2]);

            // Orthocenter          --     sec A: sec B: sec C
            const pointH = trilinearToCartesian(
              coords[0],
              coords[1],
              coords[2],
              1 / Math.cos(angles.x),
              1 / Math.cos(angles.y),
              1 / Math.cos(angles.z)
            )
            HLabel.set({
              left: pointH.x,
              top: pointH.y
            })

            // Three lines of the triangle
            const lineAB = solveLinearEquation(points[0], points[1]);
            const lineBC = solveLinearEquation(points[1], points[2]);
            const lineAC = solveLinearEquation(points[0], points[2]);

            // Calculate line AH, will get m and b
            const lineAH = solveLinearEquation(points[0], {
              x: pointH.x,
              y: pointH.y,
            });

            // Calculate pointHa
            const pointHa = calculateLineIntersectInLinearEquation(
              lineAH.m,
              lineAH.b,
              lineBC.m,
              lineBC.b
            );
            // set pointHa position
            HALabel.set({
              left: pointHa.x - 5,
              top: pointHa.y + 20,
            });

            // make line AHa using two points
            lineAHa.set({
              x1: points[0].x,
              y1: points[0].y,
              x2: pointHa.x,
              y2: pointHa.y,
              stroke: "blue",
            });



            // BH
            const lineBH = solveLinearEquation(points[1], {
              x: pointH.x,
              y: pointH.y,
            });
            // Calculate pointHa
            const pointHb = calculateLineIntersectInLinearEquation(
              lineBH.m,
              lineBH.b,
              lineAC.m,
              lineAC.b
            );

            HBLabel.set({
              left: pointHb.x + 10,
              top: pointHb.y - 20,
            });

            lineBHb.set({
              x1: points[1].x,
              y1: points[1].y,
              x2: pointHb.x,
              y2: pointHb.y,
              stroke: "blue",
            });



            // CH
            const lineCH = solveLinearEquation(points[2], {
              x: pointH.x,
              y: pointH.y,
            });
            // Calculate pointHa
            const pointHc = calculateLineIntersectInLinearEquation(
              lineCH.m,
              lineCH.b,
              lineAB.m,
              lineAB.b
            );

            HCLabel.set({
              left: pointHc.x - 35,
              top: pointHc.y - 20,
            });

            lineCHc.set({
              x1: points[2].x,
              y1: points[2].y,
              x2: pointHc.x,
              y2: pointHc.y,
              stroke: "blue",
            });
          }
          );
        canvas.add(triangle);
        canvas.add(aLabel);
        canvas.add(bLabel);
        canvas.add(cLabel);
        canvas.add(HLabel);
        canvas.add(HALabel);
        canvas.add(HBLabel);
        canvas.add(HCLabel);

        canvas.add(lineAB);
        canvas.add(lineBC);
        canvas.add(lineAC);
        canvas.add(lineAH);
        canvas.add(lineAHa);
        canvas.add(lineBH);
        canvas.add(lineBHb);
        canvas.add(lineCH);
        canvas.add(lineCHc);
      }
    },
);
</script>
