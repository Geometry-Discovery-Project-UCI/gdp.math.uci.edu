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
import {
  makeCircle,
  makeLabel,
  makeLine,
  makeMovablePolygon,
  makeSelectCircle
} from "@/utils/canvas";
import {
  calculateDistanceBetweenTwoPoints,
  calculateThreeAngles, drawRightAngleSign,
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
        // Extension lines
        const lineBAHc = makeLine();
        const lineCAHb = makeLine();
        const lineABHc = makeLine();
        const lineCBHa = makeLine();
        const lineBCHa = makeLine();
        const lineACHb = makeLine();
        const lineBHbH = makeLine();
        const lineHaAH = makeLine();
        const lineAHaH = makeLine();
        const lineCHcH = makeLine();
        const lineHbBH = makeLine();
        const lineHcCH = makeLine();

        const squarHaline1 = makeLine();
        const squarHaline2 = makeLine();
        const squarHbline1 = makeLine();
        const squarHbline2 = makeLine();
        const squarHcline1 = makeLine();
        const squarHcline2 = makeLine();

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
        const circleA = makeSelectCircle();
        const circleB = makeSelectCircle();
        const circleC = makeSelectCircle();
        const triangle = makeMovablePolygon(
          [
            new fabric.Point(200, 100),
            new fabric.Point(100, 400),
            new fabric.Point(375, 400),
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
            circleA.set({left:coords[0].x, top: coords[0].y});
            circleB.set({left:coords[1].x, top: coords[1].y});
            circleC.set({left:coords[2].x, top: coords[2].y});

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
              fontSize:15,
            });
            // make line AHa using two points
            lineAHa.set({
              x1: points[0].x,
              y1: points[0].y,
              x2: pedalPointHa.x,
              y2: pedalPointHa.y,
              stroke: "green",
            });
            squarHaline1.set({
              x1: pedalPointHa.x,
              y1: pedalPointHa.y - 10,
              x2: pedalPointHa.x + 10,
              y2: pedalPointHa.y - 10,
              stroke: "green",
            });
            squarHaline2.set({
              x1: pedalPointHa.x + 10,
              y1: pedalPointHa.y - 10,
              x2: pedalPointHa.x + 10,
              y2: pedalPointHa.y,
              stroke: "green",
            });
            drawRightAngleSign(coords[0], pedalPointHa, coords[2], squarHaline1, squarHaline2, 8,"red");

            // Perpendicular line from B to AC
            const pedalPointHb = getPedalPoint(points[1], points[0], points[2]);
            HBLabel.set({
              left: pedalPointHb.x + 5,
              top: pedalPointHb.y - 15,
              fontSize:15,
            });
            lineBHb.set({
              x1: points[1].x,
              y1: points[1].y,
              x2: pedalPointHb.x,
              y2: pedalPointHb.y,
              stroke: "green",
            });
            drawRightAngleSign(coords[1], pedalPointHb, coords[0], squarHbline1, squarHbline2, 8,"red");

            // Perpendicular line from C to AB
            const pedalPointHc = getPedalPoint(points[2], points[0], points[1]);
            HCLabel.set({
              left: pedalPointHc.x - 25,
              top: pedalPointHc.y - 10,
              fontSize:15,
            });
            lineCHc.set({
              x1: points[2].x,
              y1: points[2].y,
              x2: pedalPointHc.x,
              y2: pedalPointHc.y,
              stroke: "green",
            });
            drawRightAngleSign(coords[2], pedalPointHc, coords[1], squarHcline1, squarHcline2, 8,"red");

            lineBAHc.set({stroke: "transparent",});
            lineCAHb.set({stroke: "transparent",});
            lineABHc.set({stroke: "transparent",});
            lineCBHa.set({stroke: "transparent",});
            lineBCHa.set({stroke: "transparent",});
            lineACHb.set({stroke: "transparent",});
            lineBHbH.set({stroke: "transparent",});
            lineHaAH.set({stroke: "transparent",});
            lineAHaH.set({stroke: "transparent",});
            lineCHcH.set({stroke: "transparent",});
            lineHbBH.set({stroke: "transparent",});
            lineHcCH.set({stroke: "transparent",});

            // Make extension line.
            const rightAngle = Math.PI / 2;
            if (angles.x > rightAngle) {  // when A is obtuse angle
              lineBAHc.set({
                x1: points[0].x,
                y1: points[0].y,
                x2: pedalPointHc.x,
                y2: pedalPointHc.y,
                stroke: "black",
                strokeDashArray: [5, 5],
              });
              lineCAHb.set({
                x1: points[0].x,
                y1: points[0].y,
                x2: pedalPointHb.x,
                y2: pedalPointHb.y,
                stroke: "black",
                strokeDashArray: [5, 5],
              });
              lineBHbH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: pedalPointHb.x,
                y2: pedalPointHb.y,
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
              lineHaAH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: points[0].x,
                y2: points[0].y,
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
                stroke: "black",
                strokeDashArray: [5, 5],
              });
              lineCBHa.set({
                x1: points[1].x,
                y1: points[1].y,
                x2: pedalPointHa.x,
                y2: pedalPointHa.y,
                stroke: "black",
                strokeDashArray: [5, 5],
              });
              lineAHaH.set({
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
                stroke: "black",
                strokeDashArray: [5, 5],
              });
              lineBCHa.set({
                x1: points[2].x,
                y1: points[2].y,
                x2: pedalPointHa.x,
                y2: pedalPointHa.y,
                stroke: "black",
                strokeDashArray: [5, 5],
              });
              lineAHaH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: pedalPointHa.x,
                y2: pedalPointHa.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineBHbH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: pedalPointHb.x,
                y2: pedalPointHb.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineHcCH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: points[2].x,
                y2: points[2].y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
            }

            // Perpendicular line from Hb to BC
            const pedalPointQa = getPedalPoint(pedalPointHb, points[1], points[2]);
            QALabel.set({
              left: pedalPointQa.x - 5,
              top: pedalPointQa.y + 5,
              fontSize:15,
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
              left: pedalPointPa.x - 10,
              top: pedalPointPa.y + 5,
              fontSize:15,
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
              left: pedalPointPb.x + 5,
              top: pedalPointPb.y - 10,
              fontSize:15,
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
              left: pedalPointQb.x + 5,
              top: pedalPointQb.y - 15,
              fontSize:15,
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
              left: pedalPointQc.x - 25,
              top: pedalPointQc.y - 10,
              fontSize:15,
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
              left: pedalPointPc.x - 20,
              top: pedalPointPc.y - 15,
              fontSize:15,
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
        canvas.add(lineBHbH);
        canvas.add(lineHaAH);
        canvas.add(lineAHaH);
        canvas.add(lineCHcH);
        canvas.add(lineHbBH);
        canvas.add(lineHcCH);
        canvas.add(squarHaline1, squarHaline2);
        canvas.add(squarHbline1, squarHbline2);
        canvas.add(squarHcline1, squarHcline2);
        canvas.add(taylorCircle);
        canvas.add(circleA, circleB,circleC);
      }
    },
);
</script>
