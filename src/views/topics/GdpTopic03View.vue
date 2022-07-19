<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>

  </ATypographyParagraph>
  <!--  <li>-->
  <div id="incenter-wrapper">
    <ATypographyTitle :level="4">Incenter Animated Illustration</ATypographyTitle>
    <canvas id="incenter-canvas" width="500" height="500"></canvas>
  </div>
  <!--  </li>-->
  <!--  <li>-->
  <ATypographyParagraph>

  </ATypographyParagraph>
  <div id="centroid-wrapper">
    <ATypographyTitle :level="4">Centroid Animated Illustration</ATypographyTitle>
    <canvas id="centroid-canvas" width="500" height="500"></canvas>
  </div>
  <!--  </li>-->
  <!--  <li>-->
  <ATypographyParagraph>

  </ATypographyParagraph>
  <div id="orthocenter-wrapper">
    <ATypographyTitle :level="4">Orthocenter Animated Illustration (Need fixes)</ATypographyTitle>
    <canvas id="orthocenter-canvas" width="500" height="500"></canvas>
  </div>
  <!--  </li>-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { makeCircle, makeLabel, makeLine, makeMovablePolygon } from "@/utils/canvas";
import {
  calculateDistanceFromPointToLine, calculateIncenter,
  calculateLineIntersectInLinearEquation, calculateLineIntersectInPoints, calculateMidpoint,
  solveLinearEquation, solvePerpendicularLineEquation
} from "@/utils/geometry";
const topic = indexTopicMap.get(3) as Topic;
export default defineComponent(
  {
    setup() {
      return { topic };
    },
    mounted() {
      // Incenter animation function
      (() => {
        const canvas = new fabric.Canvas("incenter-canvas", {
          selection: false,
          backgroundColor: "floralwhite",
        });

        const bisectionOnAB = makeLine();
        const bisectionOnAC = makeLine();
        const bisectionOnBC = makeLine();

        // vertexes
        const aLabel = makeLabel("A");
        const bLabel = makeLabel("B");
        const cLabel = makeLabel("C");

        const dLabel = makeLabel("D");
        const eLabel = makeLabel("E");
        const fLabel = makeLabel("F");

        const gLabel = makeLabel("G");

        const incircle = makeCircle();

        const triangle = makeMovablePolygon([new fabric.Point(125, 50), new fabric.Point(50, 450), new fabric.Point(450, 450)],
          function (coords: fabric.Point[]) {
            aLabel.set({
              left: coords[0].x,
              top: coords[0].y - 30,
            });
            bLabel.set({
              left: coords[1].x - 15,
              top: coords[1].y,
            });
            cLabel.set({
              left: coords[2].x + 5,
              top: coords[2].y,
            });

            const incenter = calculateIncenter(coords[0], coords[1], coords[2]);
            gLabel.set({
              left: incenter.x + 5,
              top: incenter.y + 5,
            });
            const onBC = calculateLineIntersectInPoints(
              makeLine(coords[0], incenter),
              makeLine(coords[1], coords[2]),
              true
            ) as fabric.Point;
            const onAC = calculateLineIntersectInPoints(
              makeLine(coords[1], incenter),
              makeLine(coords[0], coords[2]),
              true
            ) as fabric.Point;
            const onAB = calculateLineIntersectInPoints(
              makeLine(coords[2], incenter),
              makeLine(coords[0], coords[1]),
              true
            ) as fabric.Point;

            dLabel.set({
              left: onAB.x - 25,
              top: onAB.y - 25,
            });
            eLabel.set({
              left: onAC.x + 10,
              top: onAC.y - 25,
            });
            fLabel.set({
              left: onBC?.x,
              top: onBC?.y,
            });

            bisectionOnAB.set({
              x1: coords[2].x,
              y1: coords[2].y,
              x2: onAB?.x,
              y2: onAB?.y,
            });
            bisectionOnAC.set({
              x1: coords[1].x,
              y1: coords[1].y,
              x2: onAC?.x,
              y2: onAC?.y,
            });
            bisectionOnBC.set({
              x1: coords[0].x,
              y1: coords[0].y,
              x2: onBC?.x,
              y2: onBC?.y,
            });

            const radius = calculateDistanceFromPointToLine(
              incenter,
              makeLine(coords[1], coords[2])
            );

            const centerOfCircle = incircle.translateToCenterPoint(
              // {
              //   x: incenter.x,
              //   y: incenter.y,
              // },
              incenter as fabric.Point,
              "right",
              "bottom"
            );
            incircle.set({
              radius,
              left: centerOfCircle.x,
              top: centerOfCircle.y,
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
        canvas.add(gLabel);

        canvas.add(bisectionOnAB);
        canvas.add(bisectionOnAC);
        canvas.add(bisectionOnBC);

        canvas.add(incircle);
      })();

      // Centroid animation function
      (() => {
        const canvas = new fabric.Canvas("centroid-canvas", {
          selection: false,
          backgroundColor: "floralwhite",
        });

        const median1 = makeLine();
        const median2 = makeLine();
        const median3 = makeLine();

        // vertexes
        const aLabel = makeLabel("A");
        const bLabel = makeLabel("B");
        const cLabel = makeLabel("C");

        // midpoints
        const dLabel = makeLabel("D");
        const eLabel = makeLabel("E");
        const fLabel = makeLabel("F");

        // centroid
        const gLabel = makeLabel("G");

        const triangle = makeMovablePolygon(
          [new fabric.Point(125, 50), new fabric.Point(50, 450), new fabric.Point(450, 450)],
          function (coords: fabric.Point[]) {
            const mp1 = calculateMidpoint(coords[0], coords[1]);
            const mp2 = calculateMidpoint(coords[0], coords[2]);
            const mp3 = calculateMidpoint(coords[1], coords[2]);

            median1.set({
              x1: coords[0].x,
              y1: coords[0].y,
              x2: mp3.x,
              y2: mp3.y,
            });
            median2.set({
              x1: coords[1].x,
              y1: coords[1].y,
              x2: mp2.x,
              y2: mp2.y,
            });
            median3.set({
              x1: coords[2].x,
              y1: coords[2].y,
              x2: mp1.x,
              y2: mp1.y,
            });

            aLabel.set({
              left: coords[0].x,
              top: coords[0].y - 30,
            });
            bLabel.set({
              left: coords[1].x - 15,
              top: coords[1].y,
            });
            cLabel.set({
              left: coords[2].x + 5,
              top: coords[2].y,
            });

            dLabel.set({
              left: mp1.x - 25,
              top: mp1.y - 15,
            });
            eLabel.set({
              left: mp2.x + 15,
              top: mp2.y - 15,
            });
            fLabel.set({
              left: mp3.x,
              top: mp3.y,
            });

            const intersect = calculateLineIntersectInPoints(median1, median2) as fabric.Point;

            gLabel.set({
              left: intersect.x + 5,
              top: intersect.y + 10,
            });
          }
        );

        canvas.add(triangle);
        canvas.add(median1);
        canvas.add(median2);
        canvas.add(median3);

        canvas.add(aLabel);
        canvas.add(bLabel);
        canvas.add(cLabel);

        canvas.add(dLabel);
        canvas.add(eLabel);
        canvas.add(fLabel);

        canvas.add(gLabel);
      })();

      // Orthocenter animation
      (() => {
        const canvas = new fabric.Canvas("orthocenter-canvas", {
          selection: false,
          backgroundColor: "floralwhite",
        });

        // vertexes
        const aLabel = makeLabel("A");
        const bLabel = makeLabel("B");
        const cLabel = makeLabel("C");

        const heightOnBC = makeLine();
        const heightOnAC = makeLine();
        const heightOnAB = makeLine();

        function getPedalPoint(from: fabric.Point, toA: fabric.Point, toB: fabric.Point) {
          const targetLinEq = solveLinearEquation(toA, toB);
          const heightLinEq = solvePerpendicularLineEquation(targetLinEq.m, from);
          return calculateLineIntersectInLinearEquation(
            targetLinEq.m,
            targetLinEq.b,
            heightLinEq.m,
            heightLinEq.b
          );
        }

        const triangle = makeMovablePolygon([new fabric.Point(125, 50), new fabric.Point(50, 450), new fabric.Point(450, 450)],
          function (coords: fabric.Point[]) {
            aLabel.set({
              left: coords[0].x,
              top: coords[0].y - 30,
            });
            bLabel.set({
              left: coords[1].x - 15,
              top: coords[1].y,
            });
            cLabel.set({
              left: coords[2].x + 5,
              top: coords[2].y,
            });

            const pedalPointOnBC = getPedalPoint(coords[0], coords[1], coords[2]);
            heightOnBC.set({
              x1: coords[0].x,
              y1: coords[0].y,
              x2: pedalPointOnBC.x,
              y2: pedalPointOnBC.y,
            });

            const pedalPointOnAC = getPedalPoint(coords[1], coords[0], coords[2]);
            heightOnAC.set({
              x1: coords[1].x,
              y1: coords[1].y,
              x2: pedalPointOnAC.x,
              y2: pedalPointOnAC.y,
            });

            const pedalPointOnAB = getPedalPoint(coords[2], coords[0], coords[1]);
            heightOnAB.set({
              x1: coords[2].x,
              y1: coords[2].y,
              x2: pedalPointOnAB.x,
              y2: pedalPointOnAB.y,
            });
          }
        );

        canvas.add(triangle);

        canvas.add(aLabel);
        canvas.add(bLabel);
        canvas.add(cLabel);

        canvas.add(heightOnBC);
        canvas.add(heightOnAC);
        canvas.add(heightOnAB);
      })();
    },
  },
);
</script>
