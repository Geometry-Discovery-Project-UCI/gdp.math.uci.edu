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
                cornerSize: 10,
                hasBorders: false,
                evented: true,
                radius: radius || 1,
                fill: fill || "transparent",
                strokeWidth: 1.5,
                stroke: "black",
                strokeUniform: true,
                lockScalingFlip: true,
                lockUniScaling: true,
                borderOpacityWhenMoving: 0,
                centeredScaling: true,
            }).setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
                mtr: false,
            });
        }

        function createLine(points?: number[], color?: string, strokeWidth?: number) {
            return new fabric.Line(points || [], {
                originX: "center",
                originY: "center",
                hasControls: false,
                hasBorders: false,
                evented: false,
                stroke: color || "black",
                strokeWidth: strokeWidth || 1,
            });
        }

        function createLabel(text: string, fontSize?: number, color?: string) {
            return new fabric.Text(text, {
                hasControls: false,
                hasBorders: false,
                evented: false,
                fontSize: fontSize || 18,
                fill: color || "black",
            });
        }

        const centerA = createCircle();
        const centerB = createCircle();
        const centerC = createCircle();

        const circleA = createCircle(150, 170, 70);
        const circleB = createCircle(300, 220, 35);
        const circleC = createCircle(220, 300, 20);

        const tangentLineAB1 = createLine([], "green");
        const tangentLineAB2 = createLine([], "green");
        const tangentLineBC1 = createLine([], "blue");
        const tangentLineBC2 = createLine([], "blue");
        const tangentLineAC1 = createLine([], "red");
        const tangentLineAC2 = createLine([], "red");

        const nodeP = createCircle();
        const nodeQ = createCircle();
        const nodeR = createCircle();

        const colinearLine = createLine();

        const labelA = createLabel("A");
        const labelB = createLabel("B");
        const labelC = createLabel("C");
        const labelP = createLabel("P");
        const labelQ = createLabel("Q");
        const labelR = createLabel("R");

        function calculateTangentLineIntersection(pt1: fabric.Point, r1: number, pt2: fabric.Point, r2: number) {
            const x = (r1 * pt2.x - r2 * pt1.x) / (r1 - r2);
            const y = (r1 * pt2.y - r2 * pt1.y) / (r1 - r2);
            return new fabric.Point(x, y);
        }

        function calculateTangentPointsOnCircle(c: fabric.Point, pt: fabric.Point, r: number) {
            const d = c.distanceFrom(pt);
            const th = Math.acos(r / d);
            const directionAngle = Math.atan2(pt.y - c.y, pt.x - c.x);
            const directionAngleT1C = th + directionAngle;
            const directionAngleT2C = th - directionAngle;
            return [
                new fabric.Point(c.x + r * Math.cos(directionAngleT1C), c.y + r * Math.sin(directionAngleT1C)),
                new fabric.Point(c.x + r * Math.cos(directionAngleT2C), c.y - r * Math.sin(directionAngleT2C))
            ];
        }

        function scaleCircle() {
            const radiusA = circleA.getRadiusX() as number;
            const radiusB = circleB.getRadiusX() as number;
            const radiusC = circleC.getRadiusX() as number;

            if (canvas.getActiveObject() === circleA) {
                circleA.minScaleLimit = radiusB * 1.5 / radiusA;
            }
            if (canvas.getActiveObject() === circleB) {
                if (radiusB > radiusA / 1.5) {
                    circleB.scale(radiusA / 1.5 / (circleB.radius as number));
                }
                circleB.minScaleLimit = radiusC * 1.5 / radiusB;
            }
            if (canvas.getActiveObject() === circleC) {
                if (radiusC > radiusB / 1.5) {
                    circleC.scale(radiusB / 1.5 / (circleC.radius as number));
                }
            }
            changeCircles();
        }

        function changeCircles() {
            const centers = [
                new fabric.Point(circleA.left as number, circleA.top as number),
                new fabric.Point(circleB.left as number, circleB.top as number),
                new fabric.Point(circleC.left as number, circleC.top as number),
            ];

            centerA.set({
                left: centers[0].x,
                top: centers[0].y,
                hasControls: false,
                evented: false,
            });
            centerB.set({
                left: centers[1].x,
                top: centers[1].y,
                hasControls: false,
                evented: false,
            });
            centerC.set({
                left: centers[2].x,
                top: centers[2].y,
                hasControls: false,
                evented: false,
            });

            const radiusA = circleA.getRadiusX() as number;
            const radiusB = circleB.getRadiusX() as number;
            const radiusC = circleC.getRadiusX() as number;

            labelA.set({
                left: circleA.left as number - 18,
                top: circleA.top as number - 10,
            });
            labelB.set({
                left: circleB.left as number - 18,
                top: circleB.top as number - 10,
            });
            labelC.set({
                left: circleC.left as number - 18,
                top: circleC.top as number - 10,
            });

            const intersectionAB = calculateTangentLineIntersection(centers[0], radiusA, centers[1], radiusB);
            const intersectionBC = calculateTangentLineIntersection(centers[1], radiusB, centers[2], radiusC);
            const intersectionAC = calculateTangentLineIntersection(centers[0], radiusA, centers[2], radiusC);

            nodeP.set({
                left: intersectionAB.x,
                top: intersectionAB.y,
                hasControls: false,
                evented: false,
                radius: 2,
                fill: "black",
            });
            nodeQ.set({
                left: intersectionBC.x,
                top: intersectionBC.y,
                hasControls: false,
                evented: false,
                radius: 2,
                fill: "black",
            });
            nodeR.set({
                left: intersectionAC.x,
                top: intersectionAC.y,
                hasControls: false,
                evented: false,
                radius: 2,
                fill: "black",
            });
            labelP.set({
                left: (nodeP.left as number),
                top: (nodeP.top as number) + 10,
            });
            labelQ.set({
                left: (nodeQ.left as number),
                top: (nodeQ.top as number) + 10,
            });
            labelR.set({
                left: (nodeR.left as number),
                top: (nodeR.top as number) + 10,
            });

            colinearLine.set({
                x1: intersectionAB.lerp(intersectionBC, 1.1).x,
                y1: intersectionAB.lerp(intersectionBC, 1.1).y,
                x2: intersectionAB.lerp(intersectionBC, -0.1).x,
                y2: intersectionAB.lerp(intersectionBC, -0.1).y,
                strokeDashArray: [5, 5],
            });

            const tangentPointsAB = calculateTangentPointsOnCircle(centers[0], intersectionAB, radiusA);
            const tangentPointsBC = calculateTangentPointsOnCircle(centers[1], intersectionBC, radiusB);
            const tangentPointsAC = calculateTangentPointsOnCircle(centers[0], intersectionAC, radiusA);

            tangentLineAB1.set({
                x1: tangentPointsAB[0].lerp(intersectionAB, 1.1).x,
                y1: tangentPointsAB[0].lerp(intersectionAB, 1.1).y,
                x2: tangentPointsAB[0].lerp(intersectionAB, -0.1).x,
                y2: tangentPointsAB[0].lerp(intersectionAB, -0.1).y,
            });
            tangentLineAB2.set({
                x1: tangentPointsAB[1].lerp(intersectionAB, 1.1).x,
                y1: tangentPointsAB[1].lerp(intersectionAB, 1.1).y,
                x2: tangentPointsAB[1].lerp(intersectionAB, -0.1).x,
                y2: tangentPointsAB[1].lerp(intersectionAB, -0.1).y,
            });
            tangentLineBC1.set({
                x1: tangentPointsBC[0].lerp(intersectionBC, 1.1).x,
                y1: tangentPointsBC[0].lerp(intersectionBC, 1.1).y,
                x2: tangentPointsBC[0].lerp(intersectionBC, -0.1).x,
                y2: tangentPointsBC[0].lerp(intersectionBC, -0.1).y,
            });
            tangentLineBC2.set({
                x1: tangentPointsBC[1].lerp(intersectionBC, 1.1).x,
                y1: tangentPointsBC[1].lerp(intersectionBC, 1.1).y,
                x2: tangentPointsBC[1].lerp(intersectionBC, -0.1).x,
                y2: tangentPointsBC[1].lerp(intersectionBC, -0.1).y,
            });
            tangentLineAC1.set({
                x1: tangentPointsAC[0].lerp(intersectionAC, 1.1).x,
                y1: tangentPointsAC[0].lerp(intersectionAC, 1.1).y,
                x2: tangentPointsAC[0].lerp(intersectionAC, -0.1).x,
                y2: tangentPointsAC[0].lerp(intersectionAC, -0.1).y,
            });
            tangentLineAC2.set({
                x1: tangentPointsAC[1].lerp(intersectionAC, 1.1).x,
                y1: tangentPointsAC[1].lerp(intersectionAC, 1.1).y,
                x2: tangentPointsAC[1].lerp(intersectionAC, -0.1).x,
                y2: tangentPointsAC[1].lerp(intersectionAC, -0.1).y,
            });
        }

        changeCircles();

        canvas.on("object:moving", changeCircles);
        canvas.on("object:scaling", scaleCircle);

        canvas.add(circleA);
        canvas.add(circleB);
        canvas.add(circleC);
        canvas.add(centerA);
        canvas.add(centerB);
        canvas.add(centerC);
        canvas.add(labelA);
        canvas.add(labelB);
        canvas.add(labelC);
        canvas.add(tangentLineAB1);
        canvas.add(tangentLineAB2);
        canvas.add(tangentLineBC1);
        canvas.add(tangentLineBC2);
        canvas.add(tangentLineAC1);
        canvas.add(tangentLineAC2);
        canvas.add(nodeP);
        canvas.add(nodeQ);
        canvas.add(nodeR);
        canvas.add(labelP);
        canvas.add(labelQ);
        canvas.add(labelR);
        canvas.add(colinearLine);
    }
});
</script>
