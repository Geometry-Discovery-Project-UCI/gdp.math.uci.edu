<template>
    <TopicMeta :topic="topic" />
    <ATypographyParagraph>
    </ATypographyParagraph>
    <div id="cross-ratio-wrapper">
      <ATypographyTitle :level="4">Animated Cross Ratio</ATypographyTitle>
      <canvas id="cross-ratio-canvas" width="500" height="500" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import {fabric} from "fabric";
import {makeCircle, makeLabel, makeLine} from "@/utils/canvas";

const topic = indexTopicMap.get(36) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
      mounted() {
        const canvas = new fabric.Canvas("cross-ratio-canvas", {
          selection: false,
          backgroundColor: "floralwhite",
        });
        const labelA = makeLabel("A");
        const labelB = makeLabel("B");
        const labelC = makeLabel("C");
        const labelD = makeLabel("D");
        const labelE = makeLabel("E");
        const labelF = makeLabel("F");
        const labelG = makeLabel("G");
        const labelH = makeLabel("H");
        const labelP = makeLabel("P");
        const labelL1 = makeLabel("L1");
        const labelL2 = makeLabel("L2");

        const pointA = new fabric.Point(100, 400);
        const pointB = new fabric.Point(170, 400);
        const pointC = new fabric.Point(250, 400);
        const pointD = new fabric.Point(400, 400);
        const pointP = new fabric.Point(330, 100);
        const circleA = makeCircle(3,pointA, "red", 2);
        const circleB = makeCircle(3,pointB, "red", 2);
        const circleC = makeCircle(3,pointC, "red", 2);
        const circleD = makeCircle(3,pointD, "red", 2);
        const circleP = makeCircle(3,pointP, "transparent", 2);
        circleA.set({originX: "center", originY: "center"});
        circleB.set({originX: "center", originY: "center"});
        circleC.set({originX: "center", originY: "center"});
        circleD.set({originX: "center", originY: "center"});
        circleP.set({originX: "center", originY: "center"});

        const l1 = makeLine(new fabric.Point(50, 400), new fabric.Point(450, 400), 2);
        const PA = makeLine(pointP, pointA);
        const PB = makeLine(pointP, pointB);
        const PC = makeLine(pointP, pointC);
        const PD = makeLine(pointP, pointD);
        labelA.set({left: pointA.x - 10, top: pointA.y + 10});
        labelB.set({left: pointB.x - 10, top: pointB.y + 10});
        labelC.set({left: pointC.x - 10, top: pointC.y + 10});
        labelD.set({left: pointD.x - 10, top: pointD.y + 10});
        labelP.set({left: pointP.x - 10, top: pointP.y - 30});
        labelL1.set({left: 470, top: 390});
        canvas.add(l1, PA, PB, PC, PD);
        canvas.add(circleA, circleB, circleC, circleD, circleP);
        canvas.add(labelA, labelB, labelC, labelD, labelP,labelL1);
      }
    },
);
</script>
