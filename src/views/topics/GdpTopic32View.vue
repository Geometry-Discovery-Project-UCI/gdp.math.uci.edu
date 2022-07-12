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

        const circleA = createCircle(120, 150, 60);
        const circleB = createCircle(270, 170, 40);
        const circleC = createCircle(220, 300, 30);

        const labelA = createLabel("A");
        const labelB = createLabel("B");
        const labelC = createLabel("C");

        function changeCircles() {
            const radiusA = circleA.radius as number;
            const radiusB = circleB.radius as number;
            const radiusC = circleC.radius as number;

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
    }
});
</script>
