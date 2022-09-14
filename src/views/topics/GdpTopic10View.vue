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
import {makeLabel, makeLine} from "@/utils/canvas";
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
    const lineAB = makeLine();
    const lineBC = makeLine();
    const lineCD = makeLine();
    const lineAD = makeLine();
    const lineAC = makeLine();
    const lineBD = makeLine();

    const pointA = new fabric.Point(200, 75);
    const pointB = new fabric.Point(75, 250);
    const pointC = new fabric.Point(220, 350);
    const pointD = new fabric.Point(400, 300);

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

    canvas.add(labelA, labelB, labelC, labelD);
    canvas.add(lineAB, lineBC, lineCD, lineAD, lineAC, lineBD);
  }
});
</script>
