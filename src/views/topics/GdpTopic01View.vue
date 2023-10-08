<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>

  </ATypographyParagraph>

  <div id="morley-wrapper">
    <ATypographyTitle :level="4">Animated Morley's Miracle</ATypographyTitle>
    <ATypographyParagraph class="topics-description">
    <p>The Morley’s Theorem states that in any triangle, the three points of intersection of the adjacent angle trisectors
    form an equilateral triangle. The theorem was discovered by Frank Morley in 1899.</p>

  <p>
    In the following <span v-katex>\triangle ABC</span>,  <span v-katex>AB', AC'; BC',BA'</span>; and <span v-katex>CA', CB'</span>
    are the angle trisectors of the corresponding angles <span v-katex>\angle A, \angle B</span>, and
    <span v-katex>\angle C</span>, respectively. Click, hold, and move  points <span v-katex>A, B,</span>
    and <span v-katex>C</span>, we shall see that <span v-katex>\triangle A'B'C'</span> is always an equilateral
    triangle.</p>
  </ATypographyParagraph>
    <canvas id="morley-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { makeLine, makeLabel, makeMovablePolygon } from "@/utils/canvas";
import { calculateThreeAngles, trilinearToCartesian } from "@/utils/geometry";

const topic = indexTopicMap.get(1) as Topic;

export default defineComponent(
  {
    setup() {
      return { topic };
    },
    mounted() {
      const canvas = new fabric.Canvas("morley-canvas", {
        selection: false,
      });
      function makeSelectCircle(radius = 3, center: fabric.Point = new fabric.Point(0, 0), fill = "black", padding = 20, strokeWidth = 1) {
        return new fabric.Circle({
          originX: "center",
          originY: "center",
          left: center.x,
          top: center.y,
          hasControls: false,
          hasBorders: false,
          evented: false,
          radius,
          fill,
          padding,
          strokeWidth,
        });
      }
      const ABprime = makeLine(undefined, undefined, undefined, "purple");
      const ACprime = makeLine(undefined, undefined, undefined, "purple");
      const BCprime = makeLine(undefined, undefined, undefined, "purple");
      const BAprime = makeLine(undefined, undefined, undefined, "purple");
      const CAprime = makeLine(undefined, undefined, undefined, "purple");
      const CBprime = makeLine(undefined, undefined, undefined, "purple");
      const AprimeBprime = makeLine(undefined, undefined, undefined, "red");
      const BprimeCprime = makeLine(undefined, undefined, undefined, "red");
      const CprimeAprime = makeLine(undefined, undefined, undefined, "red");

      // vertexes
      const aLabel = makeLabel("A");
      const bLabel = makeLabel("B");
      const cLabel = makeLabel("C");
      const aprimeLabel = makeLabel("A'", 18);
      const bprimeLabel = makeLabel("B'", 18);
      const cprimeLabel = makeLabel("C'", 18);
      const circleA = makeSelectCircle();
      const circleB = makeSelectCircle();
      const circleC = makeSelectCircle();

      const triangle = makeMovablePolygon([new fabric.Point(187, 75), new fabric.Point(75, 375), new fabric.Point(375, 375)],
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
          circleA.set({ left: coords[0].x, top: coords[0].y });
          circleB.set({ left: coords[1].x, top: coords[1].y });
          circleC.set({ left: coords[2].x, top: coords[2].y });

          const angles = calculateThreeAngles(coords[0], coords[1], coords[2]);

          const aprime = trilinearToCartesian(
            coords[0],
            coords[1],
            coords[2],
            1,
            2 * Math.cos(angles.z / 3),
            2 * Math.cos(angles.y / 3)
          );
          const bprime = trilinearToCartesian(
            coords[0],
            coords[1],
            coords[2],
            2 * Math.cos(angles.z / 3),
            1,
            2 * Math.cos(angles.x / 3)
          );
          const cprime = trilinearToCartesian(
            coords[0],
            coords[1],
            coords[2],
            2 * Math.cos(angles.y / 3),
            2 * Math.cos(angles.x / 3),
            1
          );

          aprimeLabel.set({
            left: aprime.x - 8,
            top: aprime.y,
          });

          bprimeLabel.set({
            left: bprime.x + 5,
            top: bprime.y - 15,
          });

          cprimeLabel.set({
            left: cprime.x - 17,
            top: cprime.y - 17,
          });

          BAprime.set(
            {
              x1: coords[1].x,
              y1: coords[1].y,
              x2: aprime.x,
              y2: aprime.y,
              stroke: "red"
            }
          );

          BCprime.set({
            x1: coords[1].x,
            y1: coords[1].y,
            x2: cprime.x,
            y2: cprime.y,
          });

          ABprime.set({
            x1: coords[0].x,
            y1: coords[0].y,
            x2: bprime.x,
            y2: bprime.y,
          });

          ACprime.set({
            x1: coords[0].x,
            y1: coords[0].y,
            x2: cprime.x,
            y2: cprime.y,
          });

          CAprime.set({
            x1: coords[2].x,
            y1: coords[2].y,
            x2: aprime.x,
            y2: aprime.y,
          });

          CBprime.set({
            x1: coords[2].x,
            y1: coords[2].y,
            x2: bprime.x,
            y2: bprime.y,
          });

          BprimeCprime.set({
            x1: bprime.x,
            y1: bprime.y,
            x2: cprime.x,
            y2: cprime.y,
          });

          CprimeAprime.set({
            x1: cprime.x,
            y1: cprime.y,
            x2: aprime.x,
            y2: aprime.y,
          });

          AprimeBprime.set({
            x1: aprime.x,
            y1: aprime.y,
            x2: bprime.x,
            y2: bprime.y,
          });
        }
      );
      canvas.add(triangle);

      canvas.add(aLabel);
      canvas.add(bLabel);
      canvas.add(cLabel);

      canvas.add(BAprime);
      canvas.add(BCprime);
      canvas.add(CAprime);
      canvas.add(CBprime);
      canvas.add(ABprime);
      canvas.add(ACprime);
      canvas.add(CprimeAprime);
      canvas.add(BprimeCprime);
      canvas.add(AprimeBprime);

      canvas.add(aprimeLabel);
      canvas.add(bprimeLabel);
      canvas.add(cprimeLabel);

      canvas.add(circleA);
      canvas.add(circleB);
      canvas.add(circleC);
    }
  },
);
</script>
