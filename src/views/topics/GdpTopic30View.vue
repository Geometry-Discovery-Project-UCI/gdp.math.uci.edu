<template>
    <TopicMeta :topic="topic" />
  <ATypographyParagraph>
<!--    TODO: Topic description here-->
  </ATypographyParagraph>
  <div id="Taylor-Circle-wapper">
    <ATypographyTitle :level="4">Animated Taylor Circles</ATypographyTitle>
    <canvas id="Taylor-Circle-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import {fabric} from "fabric";
import {makeCircle, makeLabel, makeLine, makeMovablePolygon} from "@/utils/canvas";
import {
  calculateDistanceBetweenTwoPoints,
  calculateThreeAngles,
  getPedalPoint,
  trilinearToCartesian
} from "@/utils/geometry";
const topic = indexTopicMap.get(30) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
      mounted() {
        const canvas = new fabric.Canvas("Taylor-Circle-canvas", {
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
        const lineBAHc = makeLine();
        const lineCAHb = makeLine();
        const lineABHc = makeLine();
        const lineCBHa = makeLine();
        const lineBCHa = makeLine();
        const lineACHb = makeLine();

        const lineAHAh = makeLine();
        const lineCHcH = makeLine();
        const lineHbBH = makeLine();

        const aLabel = makeLabel("A");
        const bLabel = makeLabel("B");
        const cLabel = makeLabel("C");
        const HLabel = makeLabel("H");
        const HALabel = makeLabel("Ha");
        const HBLabel = makeLabel("Hb");
        const HCLabel = makeLabel("Hc");
        const QALabel = makeLabel("Qa");
        const PALabel = makeLabel("Pa");
        const QBLabel = makeLabel("Qb");
        const PBLabel = makeLabel("Pb");
        const QCLabel = makeLabel("Qc");
        const PCLabel = makeLabel("Pc");

        const taylorCircle = makeCircle();
        const triangle = makeMovablePolygon(
          [
            new fabric.Point(255, 100),
            new fabric.Point(100, 400),
            new fabric.Point(100, 400),
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
              left: coords[2].x + 5,
              top: coords[2].y,
            });

            // Calculate three angle of the triangle ABC
            const angles = calculateThreeAngles(coords[0], coords[1], coords[2]);
            // OrthoCenter          --     sec A: sec B: sec C
            const pointH = trilinearToCartesian(
              coords[0],
              coords[1],
              coords[2],
              1 / Math.cos(angles.x),
              1 / Math.cos(angles.y),
              1 / Math.cos(angles.z)
            );
            HLabel.set({
              left: pointH.x,
              top: pointH.y
            });

            // Perpendicular line from A to BC
            const pedalPointHa = getPedalPoint(points[0], points[1], points[2]);
            // set pointHa position
            HALabel.set({
              left: pedalPointHa.x - 10,
              top: pedalPointHa.y + 5,
            });
            // make line AHa using two points
            lineAHa.set({
              x1: points[0].x,
              y1: points[0].y,
              x2: pedalPointHa.x,
              y2: pedalPointHa.y,
              stroke: "black",
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
              stroke: "black",
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
              stroke: "black",
            });

            // Perpendicular line from Hb to BC
            const pedalPointQa = getPedalPoint(pedalPointHb, points[1], points[2]);
            QALabel.set({
              left: pedalPointQa.x - 5,
              top: pedalPointQa.y + 5,
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
              left: pedalPointPa.x - 20,
              top: pedalPointPa.y + 5,
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
              stroke: "red",
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
              stroke: "red",
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
              stroke: "red",
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
              stroke: "red",
            });

            // Calculate three angles of triangle PaPbPc
            const angles2 = calculateThreeAngles(pedalPointPa, pedalPointPb, pedalPointPc);
            // Taylor Circle center .
            const taylorCircleCenter = trilinearToCartesian(
              pedalPointPa,
              pedalPointPb,
              pedalPointPc,
              Math.cos(angles2.x),
              Math.cos(angles2.y),
              Math.cos(angles2.z));
            // Taylor Circle radius
            const taylorCircleRadius = calculateDistanceBetweenTwoPoints(taylorCircleCenter, pedalPointPa);

            // Set Taylor Circle properties.
            taylorCircle.set({
              originX: "center",
              originY: "center",
              radius: taylorCircleRadius,
              left: taylorCircleCenter.x,
              top: taylorCircleCenter.y,
              stroke: "blue",
              strokeWidth: 1.5,
           });

            // Make extension line.
            const rightAngle = Math.PI / 2;
            if (angles.x > rightAngle) {  // when A is obtuse angle
              lineBAHc.set({
                x1: points[0].x,
                y1: points[0].y,
                x2: pedalPointHc.x,
                y2: pedalPointHc.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineCAHb.set({
                x1: points[0].x,
                y1: points[0].y,
                x2: pedalPointHb.x,
                y2: pedalPointHb.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
            }
            if (angles.y > rightAngle) { // when B is obtuse angle
              lineABHc.set({
                x1: points[1].x,
                y1: points[1].y,
                x2: pedalPointHc.x,
                y2: pedalPointHc.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineCBHa.set({
                x1: points[1].x,
                y1: points[1].y,
                x2: pedalPointHa.x,
                y2: pedalPointHa.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineAHAh.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: pedalPointHa.x,
                y2: pedalPointHa.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineCHcH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: pedalPointHc.x,
                y2: pedalPointHc.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineHbBH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: points[1].x,
                y2: points[1].y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
            }
            if (angles.z > rightAngle){ // when C is obtuse angle
              lineACHb.set({
                x1: points[2].x,
                y1: points[2].y,
                x2: pedalPointHb.x,
                y2: pedalPointHb.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineBCHa.set({
                x1: points[2].x,
                y1: points[2].y,
                x2: pedalPointHa.x,
                y2: pedalPointHa.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
            }
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
        canvas.add(QCLabel);
        canvas.add(PCLabel);
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
        canvas.add(lineABHc);
        canvas.add(lineCBHa);
        canvas.add(lineBAHc);
        canvas.add(lineCAHb);
        canvas.add(lineBCHa);
        canvas.add(lineACHb);

        canvas.add(lineAHAh);
        canvas.add(lineCHcH);
        canvas.add(lineHbBH);

        canvas.add(taylorCircle);
      }
    },
);
</script>
