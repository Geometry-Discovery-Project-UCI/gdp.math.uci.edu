<template>
    <TopicMeta :topic="topic" />
    <ATypographyParagraph>
        The description of Quadrilateral Area Formulas
    </ATypographyParagraph>
    <div id="Quadrilateral-Area-Formulas-wapper">
        <ATypographyTitle :level="4"> Quadrilateral Area Formulas</ATypographyTitle>
        <canvas id="Quadrilateral-Area-Formulas-canvas" width="500" height="500" />

    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import {
    makeLine,
    makeLabel,
    makeCircle,
    makeMovablePolygon,
} from "@/utils/canvas";
import {
    calculateMidpoint,
    getPedalPoint,
    calculateDistanceBetweenTwoPoints,
    calculateSlope,
    calculateLineIntersectInPoints,
    CANVAS_HEIGHT, CANVAS_WIDTH
} from "@/utils/geometry";
const topic = indexTopicMap.get(31) as Topic;
export default defineComponent(
    {
        setup() {
            return { topic };
        },
        mounted() {
            const canvas = new fabric.Canvas("Quadrilateral-Area-Formulas-canvas", {
                selection: false,
            });
            const aLabel = makeLabel("A");
            const bLabel = makeLabel("B");
            const cLabel = makeLabel("C");
            const dLabel = makeLabel("D");
            const eLabel = makeLabel("E");
            const fLabel = makeLabel("F");
            const mLabel = makeLabel("M");
            const pLabel = makeLabel("P");
            const nLabel = makeLabel("N");
            const lineAC = makeLine();
            const lineBD = makeLine();
            const lineAE = makeLine();
            const lineCF = makeLine();
            const lineCN = makeLine();
            const lineEP = makeLine();
            const lineCP = makeLine();
            const lineBE = makeLine();
            const lineDE = makeLine();
            const lineBF = makeLine();
            const lineDF = makeLine();
            const mNode = makeCircle();
            const fNode = makeCircle();
            const eNode = makeCircle();
            const pNode = makeCircle();
            const parallelCP = makeLine();
            const valueSquareBCD = makeLabel("0");
            const valueSquareABD = makeLabel("0");
            const valueSquareABCD = makeLabel("0");
            const angleE = new fabric.Rect();
            const angleF = new fabric.Rect();
            const angleP = new fabric.Rect();
            const quadrilateral = makeMovablePolygon([new fabric.Point(140, 90), new fabric.Point(70, 300), new fabric.Point(340, 420), new fabric.Point(400, 300)],
                function (coords: fabric.Point[]) {
                    // Change quadrilateral color
                    quadrilateral.set({
                        stroke: "black",
                    });
                    const leftOffset = 0.75;
                    const topOffset = 0.75;
                    // Update the label coordinates
                    // for the four points of the quadrilateral
                    aLabel.set({
                        left: coords[0].x - 5,
                        top: coords[0].y - 30,
                        fill: "green",
                    });
                    bLabel.set({
                        left: coords[1].x - 25,
                        top: coords[1].y - 15,
                        fill: "green",
                    });
                    cLabel.set({
                        left: coords[2].x,
                        top: coords[2].y,
                        fill: "green",
                    });
                    dLabel.set({
                        left: coords[3].x + 10,
                        top: coords[3].y - 15,
                        fill: "green",

                    });
                    const pedalPointAOnBD = getPedalPoint(coords[0], coords[1], coords[3]);
                    const pedalPointCOnBD = getPedalPoint(coords[2], coords[1], coords[3]);
                    const distAE =
                        calculateDistanceBetweenTwoPoints(coords[0], pedalPointAOnBD) / 100;
                    const distBD =
                        calculateDistanceBetweenTwoPoints(coords[1], coords[3]) / 100;
                    const distCF =
                        calculateDistanceBetweenTwoPoints(coords[2], pedalPointCOnBD) / 100;
                    const SquareABD = distBD * distAE / 2;
                    const SquareBCD = distBD * distCF / 2;
                    const SquareABCD = SquareABD + SquareBCD;
                    valueSquareBCD.set({ text: SquareBCD.toFixed(3) + " ", left: 320, top: 45 });
                    valueSquareABD.set({ text: SquareABD.toFixed(3) + " ", left: 235, top: 45 });
                    valueSquareABCD.set({ text: SquareABCD.toFixed(3) + " ", left: 405, top: 45 });
                    fLabel.set({
                        left: pedalPointCOnBD.x + 5,
                        top: pedalPointCOnBD.y + 5,
                        fill: "red",
                    });
                    eLabel.set({
                        left: pedalPointAOnBD.x + 5,
                        top: pedalPointAOnBD.y + 5,
                        fill: "red",
                    });
                    lineAC.set({
                        x1: coords[0].x,
                        y1: coords[0].y,
                        x2: coords[2].x,
                        y2: coords[2].y,
                        stroke: "gray",
                    });
                    lineBD.set({
                        x1: coords[1].x,
                        y1: coords[1].y,
                        x2: coords[3].x,
                        y2: coords[3].y,
                        stroke: "gray",
                    });
                    lineAE.set({
                        x1: coords[0].x,
                        y1: coords[0].y,
                        x2: pedalPointAOnBD?.x,
                        y2: pedalPointAOnBD?.y,
                        strokeDashArray: [5, 5],
                        stroke: "gray",
                    });
                    lineCF.set({
                        x1: coords[2].x,
                        y1: coords[2].y,
                        x2: pedalPointCOnBD.x,
                        y2: pedalPointCOnBD.y,
                        strokeDashArray: [5, 5],
                        stroke: "gray",
                    });
                    const pointM = calculateMidpoint(coords[1], coords[3]);
                    mLabel.set({
                        left: pointM?.x + 5,
                        top: pointM?.y + 5,
                        fontSize: 18,
                    });
                    mNode.set({
                        left: pointM?.x - leftOffset * 2,
                        top: pointM?.y - topOffset * 2,
                        radius: 2,
                        fill: "black",
                        stroke: "black",
                    });
                    fNode.set({
                        left: pedalPointCOnBD.x - 0.75 * 3,
                        top: pedalPointCOnBD.y - 0.75 * 3,
                        radius: 2,
                        fill: "red",
                    });
                    eNode.set({
                        left: pedalPointAOnBD.x - 0.75 * 3,
                        top: pedalPointAOnBD.y - 0.75 * 3,
                        radius: 2,
                        fill: "red",
                    });
                    const slope = calculateSlope(coords[1], coords[3]);
                    if (!isFinite(slope)) {
                        lineCN.set({
                            x1: coords[2].x,
                            y1: 0,
                            x2: coords[2].x,
                            y2: CANVAS_HEIGHT,
                            stroke: "red",
                        });
                        // (2) When length between 2 points = 0, set slope = 0
                    } else if (isNaN(slope)) {
                        lineCN.set({
                            x1: 0,
                            y1: coords[2].y,
                            x2: CANVAS_WIDTH,
                            y2: coords[2].y,
                            stroke: "red",
                        });
                        // (3) Else, draw the line using linear equations with slope and midpoint1
                    } else {
                        lineCN.set({
                            x1: 0,
                            y1: -slope * coords[2].x + coords[2].y - topOffset,
                            x2: CANVAS_WIDTH,
                            y2: slope * (CANVAS_WIDTH - coords[2].x) + coords[2].y - topOffset,
                            stroke: "red",
                        });
                    }
                    const pointP = calculateLineIntersectInPoints(lineAE, lineCN, true) as fabric.Point;
                    pLabel.set({
                        left: pointP.x - 27,
                        top: pointP.y,
                        fill: "blue",
                    });
                    lineEP.set({
                        x1: pedalPointAOnBD.x,
                        y1: pedalPointAOnBD.y,
                        x2: pointP?.x,
                        y2: pointP?.y,
                        strokeDashArray: [5, 5],
                        stroke: "gray",
                    });
                    lineCP.set({
                        x1: coords[2].x,
                        y1: coords[2].y,
                        x2: pointP?.x,
                        y2: pointP?.y,
                        strokeDashArray: [5, 5],
                        stroke: "gray",
                    });
                    lineBE.set({
                        x1: coords[1].x,
                        y1: coords[1].y,
                        x2: pedalPointAOnBD.x,
                        y2: pedalPointAOnBD.y,
                        strokeDashArray: [5, 5],
                        stroke: "gray",
                    });
                    lineDE.set({
                        x1: coords[3].x,
                        y1: coords[3].y,
                        x2: pedalPointAOnBD.x,
                        y2: pedalPointAOnBD.y,
                        strokeDashArray: [5, 5],
                        stroke: "gray"
                    });
                    lineBF.set({
                        x1: coords[1].x,
                        y1: coords[1].y,
                        x2: pedalPointCOnBD.x,
                        y2: pedalPointCOnBD.y,
                        strokeDashArray: [5, 5],
                        stroke: "gray",
                    });
                    lineDF.set({
                        x1: coords[3].x,
                        y1: coords[3].y,
                        x2: pedalPointCOnBD.x,
                        y2: pedalPointCOnBD.y,
                        strokeDashArray: [5, 5],
                        stroke: "gray",
                    });
                    pNode.set({
                        left: pointP.x - 0.75 * 3,
                        top: pointP.y - 0.75 * 3,
                        radius: 2,
                        fill: "blue",
                    });
                    const pointN = new fabric.Point(500, coords[1].y);
                    nLabel.set({
                        left: pointN.x + 5,
                        top: pointN.y + 5,
                        fill: "red",
                    });
                    const disBD = calculateDistanceBetweenTwoPoints(coords[1], coords[3]);
                    const disBN = calculateDistanceBetweenTwoPoints(coords[1], pointN);
                    const disDN = calculateDistanceBetweenTwoPoints(pointN, coords[3]);
                    if (coords[1].y >= coords[3].y && pointP.x < coords[2].x) {
                        angleE.set({
                            left: pedalPointAOnBD.x as number,
                            top: pedalPointAOnBD.y as number,
                            width: 10, height: 10, fill: "", stroke: "gray", strokeDashArray: [2.5, 2.5],
                            angle: 0 - (Math.acos((disBD * disBD + disBN * disBN - disDN * disDN) / (2 * disBD * disBN)) * 180 / Math.PI) - 90
                        });
                        angleF.set({
                            left: pedalPointCOnBD.x as number,
                            top: pedalPointCOnBD.y as number,
                            width: 10, height: 10, fill: "", stroke: "gray", strokeDashArray: [2.5, 2.5],
                            angle: 0 - (Math.acos((disBD * disBD + disBN * disBN - disDN * disDN) / (2 * disBD * disBN)) * 180 / Math.PI) + 90
                        });
                        angleP.set({
                            left: pointP.x as number,
                            top: pointP.y as number,
                            width: 10, height: 10, fill: "", stroke: "gray", strokeDashArray: [2.5, 2.5],
                            angle: 0 - (Math.acos((disBD * disBD + disBN * disBN - disDN * disDN) / (2 * disBD * disBN)) * 180 / Math.PI) - 90
                        });

                    }
                    if (coords[1].y < coords[3].y && pointP.x > coords[2].x) {
                        angleE.set({
                            left: pedalPointAOnBD.x as number,
                            top: pedalPointAOnBD.y as number,
                            width: 10, height: 10, fill: "", stroke: "gray", strokeDashArray: [2.5, 2.5],
                            angle: Math.acos((disBD * disBD + disBN * disBN - disDN * disDN) / (2 * disBD * disBN)) * 180 / Math.PI - 90
                        });
                        angleF.set({
                            left: pedalPointCOnBD.x as number,
                            top: pedalPointCOnBD.y as number,
                            width: 10, height: 10, fill: "", stroke: "gray", strokeDashArray: [2.5, 2.5],
                            angle: Math.acos((disBD * disBD + disBN * disBN - disDN * disDN) / (2 * disBD * disBN)) * 180 / Math.PI + 90
                        });
                        angleP.set({
                            left: pointP.x as number,
                            top: pointP.y as number,
                            width: 10, height: 10, fill: "", stroke: "gray", strokeDashArray: [2.5, 2.5],
                            angle: Math.acos((disBD * disBD + disBN * disBN - disDN * disDN) / (2 * disBD * disBN)) * 180 / Math.PI - 90
                        });
                    }
                    if (coords[1].y < coords[3].y && coords[2].x > pointP.x) {
                        angleE.set({
                            left: pedalPointAOnBD.x as number,
                            top: pedalPointAOnBD.y as number,
                            width: 10, height: 10, fill: "", stroke: "gray", strokeDashArray: [2.5, 2.5],
                            angle: Math.acos((disBD * disBD + disBN * disBN - disDN * disDN) / (2 * disBD * disBN)) * 180 / Math.PI - 90
                        });
                        angleF.set({
                            left: pedalPointCOnBD.x as number,
                            top: pedalPointCOnBD.y as number,
                            width: 10, height: 10, fill: "", stroke: "gray", strokeDashArray: [2.5, 2.5],
                            angle: Math.acos((disBD * disBD + disBN * disBN - disDN * disDN) / (2 * disBD * disBN)) * 180 / Math.PI + 90
                        });
                        angleP.set({
                            left: pointP.x as number,
                            top: pointP.y as number,
                            width: 10, height: 10, fill: "", stroke: "gray", strokeDashArray: [2.5, 2.5],
                            angle: Math.acos((disBD * disBD + disBN * disBN - disDN * disDN) / (2 * disBD * disBN)) * 180 / Math.PI - 90
                        });
                    }
                    if (coords[1].y >= coords[3].y && pointP.x > coords[2].x) {
                        angleE.set({
                            left: pedalPointAOnBD.x as number,
                            top: pedalPointAOnBD.y as number,
                            width: 10, height: 10, fill: "", stroke: "gray", strokeDashArray: [2.5, 2.5],
                            angle: 0 - (Math.acos((disBD * disBD + disBN * disBN - disDN * disDN) / (2 * disBD * disBN)) * 180 / Math.PI) - 90
                        });
                        angleF.set({
                            left: pedalPointCOnBD.x as number,
                            top: pedalPointCOnBD.y as number,
                            width: 10, height: 10, fill: "", stroke: "gray", strokeDashArray: [2.5, 2.5],
                            angle: 0 - (Math.acos((disBD * disBD + disBN * disBN - disDN * disDN) / (2 * disBD * disBN)) * 180 / Math.PI) + 90
                        });
                        angleP.set({
                            left: pointP.x as number,
                            top: pointP.y as number,
                            width: 10, height: 10, fill: "", stroke: "gray", strokeDashArray: [2.5, 2.5],
                            angle: 0 - (Math.acos((disBD * disBD + disBN * disBN - disDN * disDN) / (2 * disBD * disBN)) * 180 / Math.PI) + 180
                        });
                    }
                }
            );
            canvas.add(aLabel);
            canvas.add(bLabel);
            canvas.add(cLabel);
            canvas.add(dLabel);
            canvas.add(eLabel);
            canvas.add(fLabel);
            canvas.add(mLabel);
            canvas.add(nLabel);
            canvas.add(pLabel);
            canvas.add(lineAC);
            canvas.add(lineBD);
            canvas.add(lineAE);
            canvas.add(lineCF);
            canvas.add(lineCP);
            canvas.add(lineEP);
            canvas.add(lineBE);
            canvas.add(lineDE);
            canvas.add(lineBF);
            canvas.add(lineDF);
            canvas.add(mNode);
            canvas.add(fNode);
            canvas.add(eNode);
            canvas.add(pNode);
            canvas.add(angleE);
            canvas.add(angleF);
            canvas.add(angleP);
            canvas.add(parallelCP);
            canvas.add(quadrilateral);
            canvas.add(valueSquareBCD);
            canvas.add(valueSquareABD);
            canvas.add(valueSquareABCD);
            const signCoords = [60, 170];
            signCoords.forEach(() => {
                canvas.add(

                    new fabric.Text("S△ABD + S△BCD = S▱ABCD", {
                        left: 230,
                        top: 22,
                        strokeWidth: 0.3,
                        stroke: "black",
                        fill: "black",
                        fontSize: 20,
                        evented: false,
                    })
                );
                canvas.add(
                    new fabric.Text("+", {
                        left: 299,
                        top: 45,
                        strokeWidth: 0.3,
                        stroke: "black",
                        fill: "black",
                        fontSize: 20,
                        evented: false,
                    })
                );
                canvas.add(
                    new fabric.Text("=", {
                        left: 385,
                        top: 45,
                        strokeWidth: 0.3,
                        stroke: "black",
                        fill: "black",
                        fontSize: 20,
                        evented: false,
                    })
                );
            });
        }
    },
);
</script>
