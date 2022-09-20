<template>
    <TopicMeta :topic="topic" />
    <ATypographyParagraph>

    </ATypographyParagraph>
    <div id="tucker-circle-wrapper">
        <ATypographyTitle :level="4">Animated Tucker Circle</ATypographyTitle>
        <canvas id="tucker-circle-canvas" width="500" height="500" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Coord, Topic } from "@/types";
import { fabric } from "fabric";
import { calculateCircumcenter, calculateLineIntersectInLinearEquation, getPedalPoint, solveLinearEquation } from "@/utils/geometry";

const topic = indexTopicMap.get(29) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
        mounted() {
            const canvas = new fabric.Canvas("tucker-circle-canvas", {
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
                new fabric.Point(200, 120),
                new fabric.Point(150, 320),
                new fabric.Point(350, 320),
            ];
            const triangle = createPolygon(vertices);

            const lineDE = createLine([], "red");
            const lineEF = createLine([], "blue");
            const lineFG = createLine([], "red");
            const lineGH = createLine([], "blue");
            const lineHI = createLine([], "red");
            const lineID = createLine([], "blue");

            const auxiliaryLineA1 = createLine();
            const auxiliaryLineA2 = createLine();
            const auxiliaryLineB1 = createLine();
            const auxiliaryLineB2 = createLine();
            const auxiliaryLineC1 = createLine();
            const auxiliaryLineC2 = createLine();

            const aLabel = createLabel("A", vertices[0].x - 10, vertices[0].y - 30);
            const bLabel = createLabel("B", vertices[1].x - 25, vertices[1].y - 10);
            const cLabel = createLabel("C", vertices[2].x + 10, vertices[2].y - 10);
            const dLabel = createLabel("D");
            const eLabel = createLabel("E");
            const fLabel = createLabel("F");
            const gLabel = createLabel("G");
            const hLabel = createLabel("H");
            const iLabel = createLabel("I");

            const circle = createCircle();

            canvas.add(triangle);
            canvas.add(aLabel);
            canvas.add(bLabel);
            canvas.add(cLabel);

            function findParallelLine(pt: Coord, m: number) {
                const b = pt.y - m * pt.x;
                return {
                    m,
                    b,
                };
            }

            const pedalPointOnAB = getPedalPoint(vertices[2], vertices[0], vertices[1]);
            const pedalPointOnBC = getPedalPoint(vertices[0], vertices[1], vertices[2]);
            const pedalPointOnAC = getPedalPoint(vertices[1], vertices[0], vertices[2]);

            const linearAB = solveLinearEquation(vertices[0], vertices[1]);
            const linearBC = solveLinearEquation(vertices[1], vertices[2]);
            const linearAC = solveLinearEquation(vertices[0], vertices[2]);
            const linearPQ = solveLinearEquation(pedalPointOnBC, pedalPointOnAC);
            const linearQR = solveLinearEquation(pedalPointOnAB, pedalPointOnAC);
            const linearPR = solveLinearEquation(pedalPointOnBC, pedalPointOnAB);

            let lock = false;
            canvas.defaultCursor = "pointer";
            canvas.on("mouse:down", function () {
                if (!lock) {
                    lock = true;
                } else {
                    lock = false;
                }
            });
            canvas.on("mouse:move", function (event) {
                if (!lock) {
                    const pointer = canvas.getPointer(event.e);
                    if (pointer?.x as number < 500 && pointer?.x as number > 0
                        && pointer?.y as number > vertices[0].y && pointer?.y as number < vertices[1].y) {
                        canvas.remove(lineDE, lineEF, lineFG, lineGH, lineHI, lineID);
                        canvas.remove(auxiliaryLineA1, auxiliaryLineA2, auxiliaryLineB1, auxiliaryLineB2, auxiliaryLineC1, auxiliaryLineC2);
                        canvas.remove(dLabel, eLabel, fLabel, gLabel, hLabel, iLabel);
                        canvas.remove(circle);

                        const pointD = new fabric.Point(pointer.x, vertices[1].y);
                        dLabel.set({
                            top: pointD.y + 5,
                            left: pointD.x - 5,
                            fontSize: 20,
                        });
                        canvas.add(dLabel);

                        const linearDE = findParallelLine(pointD as Coord, linearAB.m);
                        const pointE = calculateLineIntersectInLinearEquation(linearAC.m, linearAC.b, linearDE.m, linearDE.b);
                        eLabel.set({
                            top: pointE.y - 10,
                            left: pointE.x + 5,
                            fontSize: 20,
                        });
                        canvas.add(eLabel);
                        lineDE.set({
                            x1: pointD.x,
                            y1: pointD.y,
                            x2: pointE.x,
                            y2: pointE.y,
                        });
                        canvas.add(lineDE);

                        const linearEF = findParallelLine(pointE as Coord, linearQR.m);
                        const pointF = calculateLineIntersectInLinearEquation(linearAB.m, linearAB.b, linearEF.m, linearEF.b);
                        fLabel.set({
                            top: pointF.y - 15,
                            left: pointF.x - 15,
                            fontSize: 20,
                        });
                        canvas.add(fLabel);
                        lineEF.set({
                            x1: pointE.x,
                            y1: pointE.y,
                            x2: pointF.x,
                            y2: pointF.y,
                        });
                        canvas.add(lineEF);

                        const linearFG = findParallelLine(pointF as Coord, linearAC.m);
                        const pointG = calculateLineIntersectInLinearEquation(linearBC.m, linearBC.b, linearFG.m, linearFG.b);
                        gLabel.set({
                            top: pointG.y + 5,
                            left: pointG.x - 5,
                            fontSize: 20,
                        });
                        canvas.add(gLabel);
                        lineFG.set({
                            x1: pointF.x,
                            y1: pointF.y,
                            x2: pointG.x,
                            y2: pointG.y,
                        });
                        canvas.add(lineFG);

                        const linearGH = findParallelLine(pointG as Coord, linearPQ.m);
                        const pointH = calculateLineIntersectInLinearEquation(linearAC.m, linearAC.b, linearGH.m, linearGH.b);
                        hLabel.set({
                            top: pointH.y - 10,
                            left: pointH.x + 5,
                            fontSize: 20,
                        });
                        canvas.add(hLabel);
                        lineGH.set({
                            x1: pointG.x,
                            y1: pointG.y,
                            x2: pointH.x,
                            y2: pointH.y,
                        });
                        canvas.add(lineGH);

                        const linearHI = findParallelLine(pointH as Coord, linearBC.m);
                        const pointI = calculateLineIntersectInLinearEquation(linearAB.m, linearAB.b, linearHI.m, linearHI.b);
                        iLabel.set({
                            top: pointI.y - 15,
                            left: pointI.x - 15,
                            fontSize: 20,
                        });
                        canvas.add(iLabel);
                        lineHI.set({
                            x1: pointH.x,
                            y1: pointH.y,
                            x2: pointI.x,
                            y2: pointI.y,
                        });
                        canvas.add(lineHI);

                        const linearID = findParallelLine(pointD as Coord, linearPR.m);
                        const pointEnd = calculateLineIntersectInLinearEquation(linearBC.m, linearBC.b, linearID.m, linearID.b);
                        lineID.set({
                            x1: pointI.x,
                            y1: pointI.y,
                            x2: pointEnd.x,
                            y2: pointEnd.y,
                        });
                        canvas.add(lineID);

                        if (pointD.x > vertices[2].x) {
                            auxiliaryLineC1.set({
                                x1: vertices[2].x,
                                y1: vertices[2].y,
                                x2: pointD.x,
                                y2: pointD.y,
                                strokeDashArray: [5, 5],
                            });
                            canvas.add(auxiliaryLineC1);
                        }
                        if (pointD.x < vertices[1].x) {
                            auxiliaryLineB1.set({
                                x1: vertices[1].x,
                                y1: vertices[1].y,
                                x2: pointD.x,
                                y2: pointD.y,
                                strokeDashArray: [5, 5],
                            });
                            canvas.add(auxiliaryLineB1);
                        }
                        if (pointE.x > vertices[2].x) {
                            auxiliaryLineC2.set({
                                x1: vertices[2].x,
                                y1: vertices[2].y,
                                x2: pointE.x,
                                y2: pointE.y,
                                strokeDashArray: [5, 5],
                            });
                            canvas.add(auxiliaryLineC2);
                        }
                        if (pointE.x < vertices[0].x) {
                            auxiliaryLineA1.set({
                                x1: vertices[0].x,
                                y1: vertices[0].y,
                                x2: pointE.x,
                                y2: pointE.y,
                                strokeDashArray: [5, 5],
                            });
                            canvas.add(auxiliaryLineA1);
                        }
                        if (pointF.x > vertices[0].x) {
                            auxiliaryLineA2.set({
                                x1: vertices[0].x,
                                y1: vertices[0].y,
                                x2: pointF.x,
                                y2: pointF.y,
                                strokeDashArray: [5, 5],
                            });
                            canvas.add(auxiliaryLineA2);
                        }
                        if (pointF.x < vertices[1].x) {
                            auxiliaryLineB1.set({
                                x1: vertices[1].x,
                                y1: vertices[1].y,
                                x2: pointF.x,
                                y2: pointF.y,
                                strokeDashArray: [5, 5],
                            });
                            canvas.add(auxiliaryLineB1);
                        }
                        if (pointG.x > vertices[2].x) {
                            auxiliaryLineC1.set({
                                x1: vertices[2].x,
                                y1: vertices[2].y,
                                x2: pointG.x,
                                y2: pointG.y,
                                strokeDashArray: [5, 5],
                            });
                            canvas.add(auxiliaryLineC1);
                        }
                        if (pointG.x < vertices[1].x) {
                            auxiliaryLineB2.set({
                                x1: vertices[1].x,
                                y1: vertices[1].y,
                                x2: pointG.x,
                                y2: pointG.y,
                                strokeDashArray: [5, 5],
                            });
                            canvas.add(auxiliaryLineB2);
                        }
                        if (pointH.x > vertices[2].x) {
                            auxiliaryLineC2.set({
                                x1: vertices[2].x,
                                y1: vertices[2].y,
                                x2: pointH.x,
                                y2: pointH.y,
                                strokeDashArray: [5, 5],
                            });
                            canvas.add(auxiliaryLineC2);
                        }
                        if (pointH.x < vertices[0].x) {
                            auxiliaryLineA1.set({
                                x1: vertices[0].x,
                                y1: vertices[0].y,
                                x2: pointH.x,
                                y2: pointH.y,
                                strokeDashArray: [5, 5],
                            });
                            canvas.add(auxiliaryLineA1);
                        }
                        if (pointI.x > vertices[0].x) {
                            auxiliaryLineA2.set({
                                x1: vertices[0].x,
                                y1: vertices[0].y,
                                x2: pointI.x,
                                y2: pointI.y,
                                strokeDashArray: [5, 5],
                            });
                            canvas.add(auxiliaryLineA2);
                        }
                        if (pointI.x < vertices[1].x) {
                            auxiliaryLineB2.set({
                                x1: vertices[1].x,
                                y1: vertices[1].y,
                                x2: pointI.x,
                                y2: pointI.y,
                                strokeDashArray: [5, 5],
                            });
                            canvas.add(auxiliaryLineB2);
                        }

                        const circleCenter = calculateCircumcenter(pointG, pointH, pointI);
                        const circleRadius = circleCenter.distanceFrom(pointI);
                        circle.set({
                            top: circleCenter.y,
                            left: circleCenter.x,
                            radius: circleRadius,
                            stroke: "green",
                        });
                        canvas.add(circle);
                    }
                }
            });
        }
    },
);
</script>
