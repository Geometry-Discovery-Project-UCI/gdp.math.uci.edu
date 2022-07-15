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
import {calculateThreeAngles, getPedalPoint, trilinearToCartesian} from "@/utils/geometry";

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
        const lineAHa = makeLine();
        const lineBHb = makeLine();
        const lineCHc = makeLine();
        const lineHbQa = makeLine();
        const lineHcPa = makeLine();
        const lineHaPb = makeLine();
        const lineHcQb = makeLine();
        const lineHbPc = makeLine();
        const lineHaQc = makeLine();

        const aLabel = makeLabel("A");
        const bLabel = makeLabel("B");
        const cLabel = makeLabel("C");
        const HLabel = makeLabel("H");
        const HALabel = makeLabel("Ha");
        const HBLabel = makeLabel("Hb");
        const HCLabel = makeLabel("Hc");
        const QALabel = makeLabel("Qa");
        const PALabel = makeLabel("Pa")
        const QBLabel = makeLabel("Qb");
        const PBLabel = makeLabel("Pb")
        const QCLabel = makeLabel("Qc");
        const PCLabel = makeLabel("Pc")

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
              left: coords[2].x + 5,
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

            // Perpendicular line from A to BC
            const pedalPointHa = getPedalPoint(points[0], points[1], points[2]);
            // set pointHa position
            HALabel.set({
              left: pedalPointHa.x - 5,
              top: pedalPointHa.y + 10,
            });
            // make line AHa using two points
            lineAHa.set({
              x1: points[0].x,
              y1: points[0].y,
              x2: pedalPointHa.x,
              y2: pedalPointHa.y,
              stroke: "blue",
            });

            // Perpendicular line from B to AC
            const pedalPointHb = getPedalPoint(points[1], points[0], points[2]);
            HBLabel.set({
              left: pedalPointHb.x + 10,
              top: pedalPointHb.y - 20,
            });
            lineBHb.set({
              x1: points[1].x,
              y1: points[1].y,
              x2: pedalPointHb.x,
              y2: pedalPointHb.y,
              stroke: "blue",
            });

            // Perpendicular line from C to AB
            const pedalPointHc = getPedalPoint(points[2], points[0], points[1]);
            HCLabel.set({
              left: pedalPointHc.x - 35,
              top: pedalPointHc.y - 20,
            });
            lineCHc.set({
              x1: points[2].x,
              y1: points[2].y,
              x2: pedalPointHc.x,
              y2: pedalPointHc.y,
              stroke: "blue",
            });

            // Perpendicular line from Hb to BC
            const pedalPointQa = getPedalPoint(pedalPointHb, points[1], points[2]);
            QALabel.set({
              left: pedalPointQa.x - 5,
              top: pedalPointQa.y + 10,
            });
            lineHbQa.set({
              x1: pedalPointHb.x,
              y1: pedalPointHb.y,
              x2: pedalPointQa.x,
              y2: pedalPointQa.y,
              stroke: "red",
            });

            // Perpendicular line from Hc to BC
            const pedalPointPa = getPedalPoint(pedalPointHc, points[1], points[2]);
            PALabel.set({
              left: pedalPointPa.x - 5,
              top: pedalPointPa.y + 10,
            });
            lineHcPa.set({
              x1: pedalPointHc.x,
              y1: pedalPointHc.y,
              x2: pedalPointPa.x,
              y2: pedalPointPa.y,
              stroke: "red",
            });

            // Perpendicular line from Ha to AC
            const pedalPointPb = getPedalPoint(pedalPointHa, points[0], points[2]);
            PBLabel.set({
              left: pedalPointPb.x + 10,
              top: pedalPointPb.y - 20,
            });
            lineHaPb.set({
              x1: pedalPointHa.x,
              y1: pedalPointHa.y,
              x2: pedalPointPb.x,
              y2: pedalPointPb.y,
              stroke: "orange",
            });

            // Perpendicular line from Ha to AC
            const pedalPointQb = getPedalPoint(pedalPointHc, points[0], points[2]);
            QBLabel.set({
              left: pedalPointQb.x + 10,
              top: pedalPointQb.y - 20,
            });
            lineHcQb.set({
              x1: pedalPointHc.x,
              y1: pedalPointHc.y,
              x2: pedalPointQb.x,
              y2: pedalPointQb.y,
              stroke: "orange",
            });

            // Perpendicular line from Ha to AB
            const pedalPointQc = getPedalPoint(pedalPointHa, points[0], points[1]);
            QCLabel.set({
              left: pedalPointQc.x - 35,
              top: pedalPointQc.y - 20,
            });
            lineHaQc.set({
              x1: pedalPointHa.x,
              y1: pedalPointHa.y,
              x2: pedalPointQc.x,
              y2: pedalPointQc.y,
              stroke: "green",
            });

            // Perpendicular line from Hb to AB
            const pedalPointPc = getPedalPoint(pedalPointHb, points[0], points[1]);
            PCLabel.set({
              left: pedalPointPc.x - 35,
              top: pedalPointPc.y - 20,
            });
            lineHbPc.set({
              x1: pedalPointHb.x,
              y1: pedalPointHb.y,
              x2: pedalPointPc.x,
              y2: pedalPointPc.y,
              stroke: "green",
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
        canvas.add(QALabel);
        canvas.add(PALabel);
        canvas.add(PBLabel);
        canvas.add(QBLabel);
        canvas.add(QCLabel)
        canvas.add(PCLabel)

        canvas.add(lineAB);
        canvas.add(lineBC);
        canvas.add(lineAC);
        canvas.add(lineAHa);
        canvas.add(lineBHb);
        canvas.add(lineCHc);
        canvas.add(lineHbQa);
        canvas.add(lineHcPa);
        canvas.add(lineHaPb);
        canvas.add(lineHcQb);
        canvas.add(lineHaQc);
        canvas.add(lineHbPc);
      }
    },
);
</script>
