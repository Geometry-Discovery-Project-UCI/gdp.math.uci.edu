<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>
  </ATypographyParagraph>

  <div id="Ptolemy-wrapper">
    <ATypographyTitle :level="4">Animated Ptolemy Theorem's and Kelvin Transform</ATypographyTitle>
    <canvas id="Ptolemy-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import {fabric} from "fabric";
import {makeCircle, makeLabel, makeLine} from "@/utils/canvas";
import { calculateMidpoint } from "@/utils/geometry";
const topic = indexTopicMap.get(10) as Topic;

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("Ptolemy-canvas", {
      selection: false,
      backgroundColor: "floralwhite",
    });
    const labelA = makeLabel("A");
    const labelB = makeLabel("B");
    const labelC = makeLabel("C");
    const labelD = makeLabel("D");
    const labelK = makeLabel("K");
    const lineAB = makeLine();
    const lineBC = makeLine();
    const lineCD = makeLine();
    const lineAD = makeLine();
    const lineAC = makeLine();
    const lineBD = makeLine();
    const lineK  = makeLine();

    const pointA = new fabric.Point(200, 50);
    const pointB = new fabric.Point(50, 250);
    const pointC = new fabric.Point(220, 400);
    const pointD = new fabric.Point(385, 300);
    const pointK = new fabric.Point(215, 210);

    const circumCircle = makeCircle();

    lineAB.set({x1: pointA.x, y1: pointA.y, x2: pointB.x, y2: pointB.y});
    lineBC.set({x1: pointB.x, y1: pointB.y, x2: pointC.x, y2: pointC.y});
    lineCD.set({x1: pointC.x, y1: pointC.y, x2: pointD.x, y2: pointD.y});
    lineAD.set({x1: pointA.x, y1: pointA.y, x2: pointD.x, y2: pointD.y});
    lineAC.set({x1: pointA.x, y1: pointA.y, x2: pointC.x, y2: pointC.y});
    lineBD.set({x1: pointB.x, y1: pointB.y, x2: pointD.x, y2: pointD.y});

    labelA.set({left: pointA.x - 5, top: pointA.y - 30});
    labelB.set({left: pointB.x - 20, top: pointB.y - 10});
    labelC.set({left: pointC.x - 5, top: pointC.y + 5});
    labelD.set({left: pointD.x + 5, top: pointD.y - 10});
    labelK.set({left: pointK.x, top: pointK.y});

    circumCircle.set({
      left: 50,
      top: 50,
      radius: 175,
      stroke: "black"
    });

    const ACmidpoint = calculateMidpoint(pointA, pointC);
    lineK.set({x1: pointB.x, y1: pointB.y, x2: ACmidpoint.x, y2: ACmidpoint.y, stroke: "red"});

    canvas.add(labelA, labelB, labelC, labelD, labelK);
    canvas.add(lineAB, lineBC, lineCD, lineAD, lineAC, lineBD, lineK);
    canvas.add(circumCircle);
  }
});
</script>
