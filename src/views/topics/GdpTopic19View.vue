<template>
    <TopicMeta :topic="topic" />
    <ATypographyParagraph>

    </ATypographyParagraph>
    <div id="franago-triangle-wrapper">
        <ATypographyTitle :level="4">Animated Franago Triangle</ATypographyTitle>
        <canvas id="franago-triangle-canvas" width="500" height="500" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic, Coord } from "@/types";
import { fabric } from "fabric";
import { calculateLineIntersectInLinearEquation, getPedalPoint, solveLinearEquation } from "@/utils/geometry";

const topic = indexTopicMap.get(19) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
        mounted() {
            const canvas = new fabric.Canvas("franago-triangle-canvas", {
                selection: false,
            });

            function createPolygon(vertices?: fabric.Point[]) {
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

            function createCircle(x?: number, y?: number, radius?: number, fill?: string) {
                return new fabric.Circle({
                    originX: "center",
                    originY: "center",
                    left: x || 0,
                    top: y || 0,
                    hasControls: false,
                    hasBorders: false,
                    evented: false,
                    radius: radius || 1,
                    fill: fill || "transparent",
                });
            }

            function createLabel(text: string, x?: number, y?: number, fontSize?: number, color?: string) {
                return new fabric.Text(text, {
                    left: x,
                    top: y,
                    hasControls: false,
                    hasBorders: false,
                    evented: false,
                    fontSize: fontSize || 24,
                    fill: color || "black"
                });
            }

            const vertices = [
                new fabric.Point(300, 100),
                new fabric.Point(100, 400),
                new fabric.Point(400, 400),
            ];
            const triangle = createPolygon(vertices);

            const pedalPointOnAB = getPedalPoint(vertices[2], vertices[0], vertices[1]);
            const pedalPointOnBC = getPedalPoint(vertices[0], vertices[1], vertices[2]);
            const pedalPointOnAC = getPedalPoint(vertices[1], vertices[0], vertices[2]);

            const heightOnAB = createLine([vertices[2].x, vertices[2].y, pedalPointOnAB.x, pedalPointOnAB.y], "grey");
            const heightOnBC = createLine([vertices[0].x, vertices[0].y, pedalPointOnBC.x, pedalPointOnBC.y], "grey");
            const heightOnAC = createLine([vertices[1].x, vertices[1].y, pedalPointOnAC.x, pedalPointOnAC.y], "grey");

            const linearAB = solveLinearEquation(vertices[0], vertices[1]);
            const linearBC = solveLinearEquation(vertices[1], vertices[2]);
            const linearAC = solveLinearEquation(vertices[0], vertices[2]);
            const linearDF = solveLinearEquation(pedalPointOnBC, pedalPointOnAB);
            const linearEF = solveLinearEquation(pedalPointOnAB, pedalPointOnAC);
            const linearDE = solveLinearEquation(pedalPointOnBC, pedalPointOnAC);

            const p1Node = createCircle(0, 0, 2, "red");
            const p2Node = createCircle(0, 0, 2, "red");
            const p3Node = createCircle(0, 0, 2, "red");
            const p4Node = createCircle(0, 0, 2, "red");
            const p5Node = createCircle(0, 0, 2, "red");
            const p6Node = createCircle(0, 0, 2, "red");

            const lineP1P2 = createLine([], "red");
            const lineP2P3 = createLine([], "red");
            const lineP3P4 = createLine([], "red");
            const lineP4P5 = createLine([], "red");
            const lineP5P6 = createLine([], "red");
            const lineP6P1 = createLine([], "red");

            const aLabel = createLabel("A", 290, 70);
            const bLabel = createLabel("B", 75, 390);
            const cLabel = createLabel("C", 410, 390);
            const p1Label = createLabel("P1", 0, 0, 18, "red");
            const p2Label = createLabel("P2", 0, 0, 18, "red");
            const p3Label = createLabel("P3", 0, 0, 18, "red");
            const p4Label = createLabel("P4", 0, 0, 18, "red");
            const p5Label = createLabel("P5", 0, 0, 18, "red");
            const p6Label = createLabel("P6", 0, 0, 18, "red");

            const selectLine = createLine([vertices[2].x / 2, vertices[2].y, vertices[2].x, vertices[2].y], "blue");

            canvas.add(triangle);
            canvas.add(aLabel);
            canvas.add(bLabel);
            canvas.add(cLabel);
            canvas.add(heightOnAB);
            canvas.add(heightOnBC);
            canvas.add(heightOnAC);
            canvas.add(selectLine);

            function animate(line: fabric.Line, start: Coord, end: Coord) {
                line.set({ x1: start.x, y1: start.y, x2: start.x, y2: start.y });
                canvas.add(line);
                line.animate({
                    x2: end.x,
                    y2: end.y,
                }, {
                    onChange: canvas.renderAll.bind(canvas),
                    onComplete: () => {
                        line.setCoords();
                    },
                    duration: 2000,
                });
            }

            function findParallelLine(pt: Coord, m: number) {
                const b = pt.y - m * pt.x;
                return {
                    m,
                    b,
                };
            }

            function delay(ms: number) {
                return new Promise(f => window.setTimeout(f, ms));
            }

            canvas.on("mouse:move", function (event) {
                const pointer = canvas.getPointer(event.e);
                if (pointer?.x as number <= vertices[2].x && pointer?.x as number >= vertices[2].x / 2
                    && pointer?.y as number < vertices[1].y + 10 && pointer?.y as number > vertices[1].y - 10) {
                    triangle.set({ hoverCursor: "pointer" });
                } else {
                    triangle.set({ hoverCursor: "default" });
                }
            });

            canvas.on("mouse:down", async function (event) {
                const pointer = event.absolutePointer;
                if (pointer?.x as number <= vertices[2].x && pointer?.x as number >= vertices[2].x / 2
                    && pointer?.y as number < vertices[1].y + 10 && pointer?.y as number > vertices[1].y - 10) {
                    canvas.remove(lineP1P2, lineP2P3, lineP3P4, lineP4P5, lineP5P6, lineP6P1);
                    canvas.remove(p1Label, p2Label, p3Label, p4Label, p5Label, p6Label);
                    canvas.remove(p1Node, p2Node, p3Node, p4Node, p5Node, p6Node);

                    const pointP1 = new fabric.Point(pointer?.x as number, vertices[1].y);
                    p1Node.set({
                        left: pointP1.x,
                        top: pointP1.y,
                    });
                    canvas.add(p1Node);
                    p1Label.set({
                        left: (pointP1.x as number) - 10,
                        top: (pointP1.y as number) + 10,
                    });
                    canvas.add(p1Label);

                    const linearP1P2 = findParallelLine(pointP1 as Coord, linearDF.m);
                    const pointP2 = calculateLineIntersectInLinearEquation(linearAB.m, linearAB.b, linearP1P2.m, linearP1P2.b);
                    animate(lineP1P2, pointP1, pointP2);
                    p2Node.set({
                        left: pointP2.x,
                        top: pointP2.y,
                    });
                    await delay(2000);
                    canvas.add(p2Node);
                    p2Label.set({
                        left: pointP2.x - 30,
                        top: pointP2.y - 15,
                    });
                    canvas.add(p2Label);

                    const linearP2P3 = findParallelLine(pointP2 as Coord, linearEF.m);
                    const pointP3 = calculateLineIntersectInLinearEquation(linearAC.m, linearAC.b, linearP2P3.m, linearP2P3.b);
                    animate(lineP2P3, pointP2, pointP3);
                    p3Node.set({
                        left: pointP3.x,
                        top: pointP3.y,
                    });
                    await delay(2000);
                    canvas.add(p3Node);
                    p3Label.set({
                        left: pointP3.x + 10,
                        top: pointP3.y - 15,
                    });
                    canvas.add(p3Label);

                    const linearP3P4 = findParallelLine(pointP3 as Coord, linearDE.m);
                    const pointP4 = calculateLineIntersectInLinearEquation(linearBC.m, linearBC.b, linearP3P4.m, linearP3P4.b);
                    animate(lineP3P4, pointP3, pointP4);
                    p4Node.set({
                        left: pointP4.x,
                        top: pointP4.y,
                    });
                    await delay(2000);
                    canvas.add(p4Node);
                    p4Label.set({
                        left: pointP4.x - 10,
                        top: pointP4.y + 10,
                    });
                    canvas.add(p4Label);

                    const linearP4P5 = findParallelLine(pointP4 as Coord, linearDF.m);
                    const pointP5 = calculateLineIntersectInLinearEquation(linearAB.m, linearAB.b, linearP4P5.m, linearP4P5.b);
                    animate(lineP4P5, pointP4, pointP5);
                    p5Node.set({
                        left: pointP5.x,
                        top: pointP5.y,
                    });
                    await delay(2000);
                    canvas.add(p5Node);
                    p5Label.set({
                        left: pointP5.x - 30,
                        top: pointP5.y - 15,
                    });
                    canvas.add(p5Label);

                    const linearP5P6 = findParallelLine(pointP5 as Coord, linearEF.m);
                    const pointP6 = calculateLineIntersectInLinearEquation(linearAC.m, linearAC.b, linearP5P6.m, linearP5P6.b);
                    animate(lineP5P6, pointP5, pointP6);
                    p6Node.set({
                        left: pointP6.x,
                        top: pointP6.y,
                    });
                    await delay(2000);
                    canvas.add(p6Node);
                    p6Label.set({
                        left: pointP6.x + 10,
                        top: pointP6.y - 15,
                    });
                    canvas.add(p6Label);

                    const linearP6P1 = findParallelLine(pointP6 as Coord, linearDE.m);
                    const end = calculateLineIntersectInLinearEquation(linearBC.m, linearBC.b, linearP6P1.m, linearP6P1.b);
                    animate(lineP6P1, pointP6, end);
                }
            });
        }
    },
);
</script>
