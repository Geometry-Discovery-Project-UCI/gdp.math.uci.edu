<template>
    <TopicMeta :topic="topic" />
    <ATypographyParagraph> </ATypographyParagraph>
    <div id="topic27">
        <ATypographyTitle :level="4">Animated Brahmagupta's Theorem</ATypographyTitle>
        <canvas id="napoleon-canvas" width="500" height="500" />
    </div>
</template>

<script lang="ts">
import { defineComponent, onActivated } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { makeLabel, makeLine, makeCircle, makeMovablePolygon } from "@/utils/canvas";
import {
  calculateDistanceBetweenTwoPoints,
  projectPoint2Line,
  lineLineIntersection,
  getCircumcircleCenter
} from "@/utils/geometry";

const topic = indexTopicMap.get(27) as Topic;

function createPolygon(vertices?: fabric.Point[]): fabric.Polygon {
  return new fabric.Polygon(vertices || [], {
    fill: "transparent",
    stroke: "black",
    strokeWidth: 1.5,
    objectCaching: false,
    transparentCorners: false,
    cornerColor: "transparent",
    hasBorders: false,
    hasControls: false,
    hoverCursor: "normal",
    lockMovementX: true,
    lockMovementY: true,
  });
}

export default defineComponent({
    setup() {
        return { topic };
    }, mounted() {
        const canvas = new fabric.Canvas("napoleon-canvas", {
        selection: false,
        backgroundColor: "floralwhite",
        });

        const aNode = makeCircle();
        const bNode = makeCircle();
        const cNode = makeCircle();
        const rNode = makeCircle();
        const pNode = makeCircle();
        const qNode = makeCircle();

        const circle = makeCircle();

        const triangleXYZ = createPolygon();

        const lineAR = makeLine();
        const lineBR = makeLine();
        const lineAQ = makeLine();
        const lineCQ = makeLine();
        const lineBP = makeLine();
        const lineCP = makeLine();

        const aLabel = makeLabel("A");
        const bLabel = makeLabel("B");
        const cLabel = makeLabel("C");
        const dLabel = makeLabel("D");
        const rLabel = makeLabel("R");
        const pLabel = makeLabel("P");
        const qLabel = makeLabel("Q");
        const xLabel = makeLabel("Z");
        const yLabel = makeLabel("Y");
        const zLabel = makeLabel("X");
        const pA = new fabric.Point(300, 150);
        const pB = new fabric.Point(150, 270);
        const pC = new fabric.Point(350, 350);
        const pD = new fabric.Point(350, 270);
        let O = getCircumcircleCenter(pA, pB, pC);
        const triangle = makeMovablePolygon(
        [pA, pB, pC, pD],
        function (coords: fabric.Point[]) {
            O = getCircumcircleCenter(coords[0], coords[1], coords[2]);
            console.log(O);
            aLabel.set({
                left: coords[0].x - 5,
                top: coords[0].y - 35,
            });
            bLabel.set({
            left: coords[1].x - 22,
            top: coords[1].y - 7,
            });
            cLabel.set({
            left: coords[2].x + 5,
            top: coords[2].y - 3,
            });
            dLabel.set({
                left: coords[3].x + 10,
                top: coords[3].y - 15
            });
            circle.set({
                originX: "center",
                originY: "center",
                left: O[0],
                top: O[1],
                radius: O[2],
                stroke: "blue",
                strokeWidth: 1,
            });
        }
        );

        canvas.add(aLabel, bLabel, cLabel, dLabel);
        canvas.add(xLabel, yLabel, zLabel);
        canvas.add(rLabel, qLabel, pLabel);
        canvas.add(triangle);
        canvas.add(aNode, bNode, cNode);
        canvas.add(rNode, qNode, pNode);
        canvas.add(lineAR, lineBR);
        canvas.add(lineAQ, lineCQ);
        canvas.add(lineBP, lineCP);
        canvas.add(circle);
        canvas.add(triangleXYZ);
    }
},);
</script>
