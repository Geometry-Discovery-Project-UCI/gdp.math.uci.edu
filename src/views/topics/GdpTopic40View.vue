<template>
    <TopicMeta :topic="topic" />

    <div id="Steiner-Lehmus-wrapper" style="padding-top: 40px;">
        <h2>Steiner-Lehmus' Triangle</h2>
        <canvas id="Steiner-Lehmus-canvas" width="500" height="500" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { makeLine, makeLabel, makeCircle } from "@/utils/canvas";
import { calculateMidpoint } from "@/utils/geometry";

const topic = indexTopicMap.get(40) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
        mounted() {
            const canvas = new fabric.Canvas("Steiner-Lehmus-canvas", {
                selection: false,
                backgroundColor: "floralwhite",
            });

            const circumCircle = makeCircle();
            circumCircle.set({
                left: 100,
                top: 200,
                radius: 125,
                stroke: "blue"
            });

            const labelA = makeLabel("A");
            const labelB = makeLabel("B");
            const labelC = makeLabel("C");
            const labelP = makeLabel("P");
            const labelS1 = makeLabel("S1");
            const labelS2 = makeLabel("S2");

            const pointA = new fabric.Point(300, 90);
            const pointB = new fabric.Point(105, 290);
            const pointC = new fabric.Point(345, 290);

            labelA.set({
                left: pointA.x - 5,
                top: pointA.y - 30
            });

            labelB.set({
                left: pointB.x - 25,
                top: pointB.y
            });

            labelC.set({
                left: pointC.x + 10,
                top: pointC.y
            });
            
            const lineAB = makeLine();
            const lineBC = makeLine();
            const lineAC = makeLine();
            const lineBS1 = makeLine();
            const lineCS2 = makeLine();
            const lineCP = makeLine();

            lineAB.set({x1: pointA.x, y1: pointA.y, x2: pointB.x, y2: pointB.y, strokeWidth: 2});
            lineBC.set({x1: pointB.x, y1: pointB.y, x2: pointC.x, y2: pointC.y, strokeWidth: 2});
            lineAC.set({x1: pointA.x, y1: pointA.y, x2: pointC.x, y2: pointC.y, strokeWidth: 2});

            const ABmidpoint = calculateMidpoint(pointA, pointB);
            const ACmidpoint = calculateMidpoint(pointA, pointC);

            const pointP = new fabric.Point(275, 210);
            const pointS1 = new fabric.Point(ACmidpoint.x, ACmidpoint.y);
            const pointS2 = new fabric.Point(ABmidpoint.x, ABmidpoint.y);

            lineBS1.set({x1: pointB.x, y1: pointB.y, x2: pointS1.x, y2: pointS1.y});
            lineCS2.set({x1: pointC.x, y1: pointC.y, x2: pointS2.x, y2: pointS2.y});
            lineCP.set({x1: pointC.x, y1: pointC.y, x2: pointP.x, y2: pointP.y, stroke: "red", strokeDashArray: [5, 5]});

            labelP.set({
               left: pointP.x,
               top: pointP.y - 30
            });
            
            labelS1.set({
                left: pointS1.x + 5,
                top: pointS2.y - 20
            });

            labelS2.set({
                left: pointS2.x - 30,
                top: pointS2.y - 25
            });

            canvas.add(labelA, labelB, labelC, labelP, labelS1, labelS2);
            canvas.add(lineAB, lineBC, lineAC, lineBS1, lineCS2, lineCP);
            canvas.add(circumCircle);
        },
    },
);

/*eslint no-trailing-spaces: ["error", { "skipBlankLines": true, "ignoreComments": true }]*/
// see more at https://eslint.org/docs/latest/rules/no-trailing-spaces
</script>
