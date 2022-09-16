<template>
    <TopicMeta :topic="topic" />
    <ATypographyParagraph>
        The description of Trilinear Coordinate System
    </ATypographyParagraph>
    <div id="Trilinear-Coordinate-System-wapper">
        <ATypographyTitle :level="4">Trilinear Coordinate System</ATypographyTitle>
        <canvas id="Trilinear-Coordinate-System-canvas" width="500" height="500" />

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
    makeMovablePoint
} from "@/utils/canvas";
import {
    calculateMidpoint,
    getPedalPoint,
    calculateDistanceBetweenTwoPoints,
    cartesianToTrilinear
} from "@/utils/geometry";
const topic = indexTopicMap.get(37) as Topic;
export default defineComponent(
    {
        setup() {
            return { topic };
        },
        mounted() {
            const canvas = new fabric.Canvas("Trilinear-Coordinate-System-canvas", {
                selection: false,
            });
            const aLabel = makeLabel("A");
            const bLabel = makeLabel("B");
            const cLabel = makeLabel("C");
            const dLabel = makeLabel("D");
            const eLabel = makeLabel("E");
            const fLabel = makeLabel("F");
            const xLabel = makeLabel("𝒛");
            const yLabel = makeLabel("𝒙");
            const zLabel = makeLabel("𝒚");

            const pLabel = makeLabel("P");
            const pNode = makeCircle();
            const linePD = makeLine();
            const linePE = makeLine();
            const linePF = makeLine();
            const lineAF = makeLine();
            const lineAE = makeLine();
            const lineBF = makeLine();
            const lineBD = makeLine();
            const lineCE = makeLine();
            const lineCD = makeLine();
            const angleX = new fabric.Rect();
            const angleY = new fabric.Rect();
            const angleZ = new fabric.Rect();
            const disPFtext = makeLabel("0");
            const disPDtext = makeLabel("0");
            const disPEtext = makeLabel("0");
            const triangle = new fabric.Polygon(
                [
                    { x: 310, y: 150 },
                    { x: 80, y: 400 },
                    { x: 380, y: 400 },
                ],
                {
                    fill: "transparent",
                    strokeWidth: 1.5,
                    stroke: "black",
                    objectCaching: false,
                    transparentCorners: false,
                    cornerStyle: "circle",
                    cornerColor: "transparent",
                    cornerSize: 20,
                    hasBorders: false,
                    evented: false,
                }
            );
            const pointP = makeMovablePoint(new fabric.Point(230, 320));
            pointP.set({
                originX: "center",
                originY: "center",
                radius: 5,
                fill: "black",
            });
            // set coordinates and options for point P inside the triangle

            function movePointP() {
                const points = triangle.points as fabric.Point[];
                const pointF = getPedalPoint(new fabric.Point(pointP.left!, pointP.top!), points[0], points[1]);
                const pointE = getPedalPoint(new fabric.Point(pointP.left!, pointP.top!), points[0], points[2]);
                const pointD = getPedalPoint(new fabric.Point(pointP.left!, pointP.top!), points[2], points[1]);
                const disAB = calculateDistanceBetweenTwoPoints(points[0], points[1]);
                const disAC = calculateDistanceBetweenTwoPoints(points[0], points[2]);
                const disBC = calculateDistanceBetweenTwoPoints(points[2], points[1]);
                const midPF = calculateMidpoint(pointF, new fabric.Point(pointP.left!, pointP.top!));
                const midPD = calculateMidpoint(pointD, new fabric.Point(pointP.left!, pointP.top!));
                const midPE = calculateMidpoint(pointE, new fabric.Point(pointP.left!, pointP.top!));
                aLabel.set({
                    left: points[0].x - 5,
                    top: points[0].y - 30,

                    fill: "black",
                });

                bLabel.set({
                    left: points[1].x - 10,
                    top: points[1].y + 10,

                    fill: "black",
                });

                cLabel.set({
                    left: points[2].x + 5,
                    top: points[2].y + 5,

                    fill: "black",
                });
                dLabel.set({
                    left: pointD.x -5,
                    top: pointD.y + 5,

                    fill: "green",
                });

                eLabel.set({
                    left: pointE.x + 10,
                    top: pointE.y - 10,

                    fill: "blue",
                });

                fLabel.set({
                    left: pointF.x - 25,
                    top: pointF.y - 15,

                    fill: "purple",
                });
                pLabel.set({
                    left: pointP.left as number - 25,
                    top: pointP.top as number - 10,

                });
                linePD.set({
                    x1: pointP.left as number,
                    y1: pointP.top as number,
                    x2: pointD.x,
                    y2: pointD.y,
                    stroke: "green",
                    strokeWidth: 2,
                });
                linePE.set({
                    x1: pointP.left as number,
                    y1: pointP.top as number,
                    x2: pointE.x,
                    y2: pointE.y,
                    stroke: "blue",
                    strokeWidth: 2,
                });
                linePF.set({
                    x1: pointP.left as number,
                    y1: pointP.top as number,
                    x2: pointF.x,
                    y2: pointF.y,
                    stroke: "purple",
                    strokeWidth: 2,
                });
                lineAF.set({
                    x1: points[0].x,
                    y1: points[0].y,
                    x2: pointF.x,
                    y2: pointF.y,
                    stroke: "gray",
                });
                lineAE.set({
                    x1: points[0].x,
                    y1: points[0].y,
                    x2: pointE.x,
                    y2: pointE.y,
                    stroke: "gray",
                });
                lineBD.set({
                    x1: points[1].x,
                    y1: points[1].y,
                    x2: pointD.x,
                    y2: pointD.y,
                    stroke: "gray",
                });
                lineBF.set({
                    x1: points[1].x,
                    y1: points[1].y,
                    x2: pointF.x,
                    y2: pointF.y,
                    stroke: "gray",
                });
                lineCE.set({
                    x1: points[2].x,
                    y1: points[2].y,
                    x2: pointE.x,
                    y2: pointE.y,
                    stroke: "gray",
                });
                lineCD.set({
                    x1: points[2].x,
                    y1: points[2].y,
                    x2: pointD.x,
                    y2: pointD.y,
                    stroke: "gray",
                });
                if (pointD.x < points[2].x && pointP.top as number < points[2].y) {
                    angleX.set({
                        left: pointD.x as number,
                        top: pointD.y as number,
                        width: 10, height: 10, fill: "", stroke: "gray",
                        angle: -90
                    });
                }
                if (pointD.x >= points[2].x && pointP.top as number < points[2].y) {
                    angleX.set({
                        left: pointD.x as number,
                        top: pointD.y as number,
                        width: 10, height: 10, fill: "", stroke: "gray",
                        angle: 180
                    });
                }
                if (pointD.x < points[2].x && pointP.top as number >= points[2].y) {
                    angleX.set({
                        left: pointD.x as number,
                        top: pointD.y as number,
                        width: 10, height: 10, fill: "", stroke: "gray",
                        angle: 0
                    });
                }
                if (pointD.x >= points[2].x && pointP.top as number >= points[2].y) {
                    angleX.set({
                        left: pointD.x as number,
                        top: pointD.y as number,
                        width: 10, height: 10, fill: "", stroke: "gray",
                        angle: 90
                    });
                }
                if (pointF.x > points[1].x && pointP.top as number > pointF.y) {
                    angleY.set({
                        left: pointF.x as number,
                        top: pointF.y as number,
                        width: 10, height: 10, fill: "", stroke: "gray",
                        angle: (Math.acos((disBC * disBC + disAB * disAB - disAC * disAC) / (2 * disBC * disAB)) * 180 / Math.PI) - 10
                    });
                }
                if (pointF.x <= points[1].x && pointP.top as number > pointF.y) {
                    angleY.set({
                        left: pointF.x as number,
                        top: pointF.y as number,
                        width: 10, height: 10, fill: "", stroke: "gray",
                        angle: -(Math.acos((disBC * disBC + disAB * disAB - disAC * disAC) / (2 * disBC * disAB)) * 180 / Math.PI)
                    });
                }
                if (pointF.x > points[1].x && pointP.top as number <= pointF.y) {
                    angleY.set({
                        left: pointF.x as number,
                        top: pointF.y as number,
                        width: 10, height: 10, fill: "", stroke: "gray",
                        angle: - (Math.acos((disBC * disBC + disAB * disAB - disAC * disAC) / (2 * disBC * disAB)) * 180 / Math.PI) - 184
                    });
                }
                if (pointF.x <= points[1].x && pointP.top as number <= pointF.y) {
                    angleY.set({
                        left: pointF.x as number,
                        top: pointF.y as number,
                        width: 10, height: 10, fill: "", stroke: "gray",
                        angle: -(Math.acos((disBC * disBC + disAB * disAB - disAC * disAC) / (2 * disBC * disAB)) * 180 / Math.PI) - 90
                    });
                }
                if (pointE.x > points[0].x && pointP.top as number > pointE.y) {
                    angleZ.set({
                        left: pointE.x as number,
                        top: pointE.y as number,
                        width: 10, height: 10, fill: "", stroke: "gray",
                        angle: -(Math.acos((disBC * disBC + disAC * disAC - disAB * disAB) / (2 * disBC * disAC)) * 180 / Math.PI) - 122
                    });
                }
                if (pointE.x <= points[0].x && pointP.top as number > pointE.y) {
                    angleZ .set({
                        left: pointE.x as number,
                        top: pointE.y as number,
                        width: 10, height: 10, fill: "", stroke: "gray",
                        angle: -(Math.acos((disBC * disBC + disAC * disAC - disAB * disAB) / (2 * disBC * disAC)) * 180 / Math.PI) - 215
                    });
                }
                if (pointE.x > points[0].x && pointP.top as number <= pointE.y) {
                    angleZ.set({
                        left: pointE.x as number,
                        top: pointE.y as number,
                        width: 10, height: 10, fill: "", stroke: "gray",
                        angle: -(Math.acos((disBC * disBC + disAC * disAC - disAB * disAB) / (2 * disBC * disAC)) * 180 / Math.PI) -30
                    });
                }
                if (pointE.x <= points[0].x && pointP.top as number <= pointE.y) {
                    angleZ.set({
                        left: pointE.x as number,
                        top: pointE.y as number,
                        width: 10, height: 10, fill: "", stroke: "gray",
                        angle: -(Math.acos((disBC * disBC + disAC * disAC - disAB * disAB) / (2 * disBC * disAC)) * 180 / Math.PI) + 60
                    });
                }
                xLabel.set({
                    left: midPF.x,
                    top: midPF.y - 30,
                });
                yLabel.set({
                    left: midPD.x + 10,
                    top: midPD.y - 20,
                });
                zLabel.set({
                    left: midPE.x - 10,
                    top: midPE.y - 30,
                });
                const angles = cartesianToTrilinear([310,150] ,[80,400],[380,400],[pointP.left as number,pointP.top as number]);
                const xyz = Math.sqrt(Math.pow(angles.x,2)+Math.pow(angles.y,2)+ Math.pow(angles.z,2));
                angles.x = 100*angles.x/xyz;
                angles.y = 100*angles.y/xyz;
                angles.z = 100*angles.z/xyz;
                disPFtext.set({ text: angles.x.toFixed(1) + " ", left: 280, top: 50 });
                disPDtext.set({ text: angles.y.toFixed(1) + " ", left: 355, top: 50 });
                disPEtext.set({ text: angles.z.toFixed(1) + " ", left: 430, top: 50 });
            }

            movePointP();
            canvas.on("object:moving", movePointP);
            canvas.add(aLabel);
            canvas.add(bLabel);
            canvas.add(cLabel);
            canvas.add(dLabel);
            canvas.add(eLabel);
            canvas.add(fLabel);
            canvas.add(xLabel);
            canvas.add(yLabel);
            canvas.add(zLabel);
            canvas.add(pLabel);
            canvas.add(pNode);
            canvas.add(pointP);
            canvas.add(linePD);
            canvas.add(linePE);
            canvas.add(linePF);
            canvas.add(lineAF);
            canvas.add(lineAE);
            canvas.add(lineBD);
            canvas.add(lineBF);
            canvas.add(lineCE);
            canvas.add(lineCD);
            canvas.add(triangle);
            canvas.add(disPDtext);
            canvas.add(disPEtext);
            canvas.add(disPFtext);
            canvas.add(angleX);
            canvas.add(angleY);
            canvas.add(angleZ);
            const signCoords = [60, 170];
            signCoords.forEach(() => {
                canvas.add(new fabric.Text("𝒙     ：    𝒚     ：    𝒛", {
                    left: 300,
                    top: 22,
                    strokeWidth: 0.3,
                    stroke: "black",
                    fill: "black",
                    fontSize: 20,
                    evented: false,
                })

                );
                canvas.add(
                    new fabric.Text(":", {
                        left: 341,
                        top: 50,
                        strokeWidth: 0.3,
                        stroke: "black",
                        fill: "black",
                        fontSize: 20,
                        evented: false,
                    })
                );
                canvas.add(
                    new fabric.Text(":", {
                        left: 416,
                        top: 50,
                        strokeWidth: 0.3,
                        stroke: "black",
                        fill: "black",
                        fontSize: 20,
                        evented: false,
                    })
                );
            });
        },
    },
);
</script>

