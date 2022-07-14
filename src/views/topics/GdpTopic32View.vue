<template>
    <TopicMeta :topic="topic" />
    <ATypographyParagraph>

    </ATypographyParagraph>
    <div id="monge-theorem-wrapper">
        <ATypographyTitle :level="4">Animated Monge Theorem</ATypographyTitle>
        <canvas id="monge-theorem-canvas" width="500" height="500" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";

const topic = indexTopicMap.get(32) as Topic;

export default defineComponent({
    setup() {
        return { topic };
    },
    mounted() {
        const canvas = new fabric.Canvas("monge-theorem-canvas", {
            selection: false,
        });

        function createCircle(x?: number, y?: number, radius?: number, fill?: string): fabric.Circle {
            return new fabric.Circle({
                originX: "center",
                originY: "center",
                left: x || 0,
                top: y || 0,
                hasControls: true,
                hasBorders: false,
                evented: true,
                radius: radius || 1,
                fill: fill || "transparent",
                strokeWidth: 1.5,
                stroke: "black",
                lockScalingFlip: true,
            }).setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
                mtr: false,
            });
        }

        function createLabel(text: string, fontSize?: number, color?: string) {
            return new fabric.Text(text, {
                hasControls: false,
                hasBorders: false,
                evented: false,
                fontSize: fontSize || 24,
                fill: color || "black"
            });
        }

        const circleA = createCircle(150, 170, 70);
        const circleB = createCircle(300, 220, 35);
        const circleC = createCircle(220, 300, 20);

        const nodeAB = createCircle();
        const nodeBC = createCircle();
        const nodeAC = createCircle();

        const labelA = createLabel("A");
        const labelB = createLabel("B");
        const labelC = createLabel("C");

        function calculateTangentLineIntersection(p1: fabric.Point, r1: number, p2: fabric.Point, r2: number) {
            const x = (r1 * p2.x - r2 * p1.x) / (r1 - r2);
            const y = (r1 * p2.y - r2 * p1.y) / (r1 - r2);
            return new fabric.Point(x, y);
        }

        function changeCircles() {
            const centers = [
                new fabric.Point(circleA.left as number, circleA.top as number),
                new fabric.Point(circleB.left as number, circleB.top as number),
                new fabric.Point(circleC.left as number, circleC.top as number),
            ]
            const radiusA = circleA.radius as number;
            const radiusB = circleB.radius as number;
            const radiusC = circleC.radius as number;

            const intersectionAB = calculateTangentLineIntersection(centers[0], radiusA, centers[1], radiusB);
            const intersectionBC = calculateTangentLineIntersection(centers[1], radiusB, centers[2], radiusC);
            const intersectionAC = calculateTangentLineIntersection(centers[0], radiusA, centers[2], radiusC);
            console.log(intersectionAB)
            console.log(intersectionBC)
            console.log(intersectionAC)

            nodeAB.set({
                left: intersectionAB.x,
                top: intersectionAB.y,
                hasControls: false,
                evented: false,
                radius: 2,
                fill: "black",
            });
            nodeBC.set({
                left: intersectionBC.x,
                top: intersectionBC.y,
                hasControls: false,
                evented: false,
                radius: 2,
                fill: "black",
            });
            nodeAC.set({
                left: intersectionAC.x,
                top: intersectionAC.y,
                hasControls: false,
                evented: false,
                radius: 2,
                fill: "black",
            });

            labelA.set({
                left: circleA.left as number - radiusA - 25,
                top: circleA.top as number - 25,
            });
            labelB.set({
                left: circleB.left as number - radiusB - 25,
                top: circleB.top as number - 25,
            });
            labelC.set({
                left: circleC.left as number - radiusC - 25,
                top: circleC.top as number - 25,
            });
        }

        changeCircles();

        canvas.on("object:moving", changeCircles);

        canvas.add(circleA);
        canvas.add(circleB);
        canvas.add(circleC);
        canvas.add(labelA);
        canvas.add(labelB);
        canvas.add(labelC);
        canvas.add(nodeAB);
        canvas.add(nodeBC);
        canvas.add(nodeAC);
    }
});
</script>
