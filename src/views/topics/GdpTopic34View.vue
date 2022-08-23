<template>
<TopicMeta :topic="topic" />
  <ATypographyParagraph>
  </ATypographyParagraph>
  <div id="vivani-theorum-wrapper">
    <ATypographyTitle :level="4">Animated Vivani"s Theorum</ATypographyTitle>
    <canvas id="vivani-theorem-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import {fabric} from "fabric";
import {makeLabel, makeLine, makeMovablePoint } from "@/utils/canvas";
import {calculateDistanceBetweenTwoPoints, calculateLineIntersectInLinearEquation, solveLinearEquation } from "@/utils/geometry";

const topic = indexTopicMap.get(34) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
        mounted() {
        const canvas = new fabric.Canvas("vivani-theorem-canvas", {
            selection: false,
            backgroundColor: "floralwhite"});

        // create all lines/labels
        const angleD = new fabric.Rect({width: 10, height: 10, fill: "", stroke: "black"});
        const angleF = new fabric.Rect({width: 10, height: 10, fill: "", stroke: "black", angle: -60});
        const angleE = new fabric.Rect({width: 10, height: 10, fill: "", stroke: "black", angle: 60});

        const linePD = makeLine();
        const linePF = makeLine();
        const linePE = makeLine();
        const sumPD = makeLine();
        const sumPF = makeLine();
        const sumPE = makeLine();

        const bcDot = new fabric.Line([0, 0, 0, 0], {stroke: "black",width: 1,strokeDashArray: [5]});
        const baDot = new fabric.Line([0, 0, 0, 0], {stroke: "black",width: 1,strokeDashArray: [5]});
        const acDot = new fabric.Line([0, 0, 0, 0], {stroke: "black",width: 1,strokeDashArray: [5]});

        const projectPF = makeLine();
        const projectPE = makeLine();

        const aLabel = makeLabel("A");
        const bLabel = makeLabel("B");
        const cLabel = makeLabel("C");
        const pLabel = makeLabel("P");
        const hLabel = makeLabel("H");

        const fLabel = makeLabel("F");
        const eLabel = makeLabel("E");
        const dLabel = makeLabel("D");

        const valuePD = makeLabel("0");
        const valuePF = makeLabel("0");
        const valuePE = makeLabel("0");

        const equation = makeLabel("PD + PE + PF = H");

        const triangleBottom = 425;
        // create triangle
        const triangle = new fabric.Polygon(
            [
            { x: 225, y: 150 },
            { x: 68, y: 425 },
            { x: 383, y: 425 },
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

        // set coordinates and options for point P inside the triangle
        const pointP = makeMovablePoint(new fabric.Point(180, 310));

        pointP.set({
            originX: "center",
            originY: "center",
            radius: 5,
            fill: "black",
        });

        // Function to draw lines PF, PD, and PE depending on location of point P
        function movePointP() {
            const points = triangle.points as fabric.Point[];
            const lineAB = solveLinearEquation(points[0], points[1]);
            const lineAC = solveLinearEquation(points[0], points[2]);

            // draw lines from point P extending out to sides AB and AC
            projectPE.set({
                x1: pointP.left,
                y1: pointP.top,
                x2: pointP.left as number + 342,
                y2: pointP.top as number - 200,
                stroke: "black",
            });

            projectPF.set({
                x1: pointP.left,
                y1: pointP.top,
                x2: pointP.left as number - 342,
                y2: pointP.top as number - 200,
                stroke: "black",
            });

            // calculate location of points E/F from point of intersection between long lines PF/AB and PE/AC
            const lineProjectPF = solveLinearEquation(new fabric.Point(projectPF.x1!, projectPF.y1!), new fabric.Point(projectPF.x2! ,projectPF.y2!));
            const pointF = calculateLineIntersectInLinearEquation(lineAB.m, lineAB.b, lineProjectPF.m, lineProjectPF.b);
            const lineProjectPE = solveLinearEquation(new fabric.Point(projectPE.x1!, projectPE.y1!), new fabric.Point(projectPE.x2!, projectPE.y2!));
            const pointE = calculateLineIntersectInLinearEquation(lineAC.m, lineAC.b, lineProjectPE.m, lineProjectPE.b);

            // draw lines PF/PE/PD
            linePF.set({
                x1: pointP.left,
                y1: pointP.top,
                x2: pointF.x,
                y2: pointF.y,
                stroke: "blue",
            });

            linePE.set({
                x1: pointP.left,
                y1: pointP.top,
                x2: pointE.x,
                y2: pointE.y,
                stroke: "green",
            });

            linePD.set({
                x1: pointP.left,
                y1: pointP.top,
                x2: pointP.left,
                y2: triangleBottom,
                stroke: "red",
            });

            // store length of each line for side display
            const pdDist = calculateDistanceBetweenTwoPoints(new fabric.Point(pointP.left!, pointP.top!), new fabric.Point(pointP.left!, triangleBottom));
            const peDist = calculateDistanceBetweenTwoPoints(new fabric.Point(pointP.left!, pointP.top!), new fabric.Point(pointE.x, pointE.y!));
            const pfDist = calculateDistanceBetweenTwoPoints(new fabric.Point(pointP.left!, pointP.top!), new fabric.Point(pointF.x, pointF.y!));

            // Draw side lines based off length of PE/PD/PF and position of P

            let pdSign = "";
            let peSign = "+";
            let pfSign = "+";

            if (pointP.top as number > triangleBottom) {
                pdSign = "-";
            }
            if (pointP.left as number > pointE.x) {
                peSign = "-";
            }
            if (pointP.left as number < pointF.x) {
                pfSign = " - ";
            }

            if (pointP.top as number > triangleBottom && pointP.left as number > pointE.x) {
                sumPD.set({
                    x1: 475, y1: 150 + pfDist - peDist, x2: 475, y2: 150 + pfDist - peDist - pdDist,
                    stroke: "red",
                    strokeWidth: 2,
                });

                sumPE.set({
                    x1: 475, y1: 150 + pfDist, x2: 475, y2: 150 + pfDist - peDist,
                    stroke: "green",
                    strokeWidth: 2,
                });

                sumPF.set({
                    x1: 450, y1: 150, x2: 450, y2: 150 + pfDist,
                    stroke: "blue",
                    strokeWidth: 2,
                });
            } else if (pointP.top as number > triangleBottom && pointP.left as number < pointF.x) {
               sumPD.set({
                    x1: 475, y1: 150 + peDist - pfDist, x2: 475, y2: 150 + peDist - pfDist - pdDist,
                    stroke: "red",
                    strokeWidth: 2,
                });

                sumPE.set({
                    x1: 450, y1: 150, x2: 450, y2: 150 + peDist,
                    stroke: "green",
                    strokeWidth: 2,
                });

                sumPF.set({
                    x1: 475, y1: 150 + peDist, x2: 475, y2: 150 + peDist - pfDist,
                    stroke: "blue",
                    strokeWidth: 2,
                });
            } else if (pointP.left as number > pointE.x && pointP.left as number < pointF.x) {
               sumPD.set({
                    x1: 450, y1: 150, x2: 450, y2: 150 + pdDist,
                    stroke: "red",
                    strokeWidth: 2,
                });

                sumPE.set({
                    x1: 475, y1: 150 + pdDist, x2: 475, y2: 150 + pdDist - peDist,
                    stroke: "green",
                    strokeWidth: 2,
                });

                sumPF.set({
                    x1: 475, y1: 150 + pdDist - peDist, x2: 475, y2: 150 + pdDist - pfDist - peDist,
                    stroke: "blue",
                    strokeWidth: 2,
                });
            } else if (pointP.top as number > triangleBottom) {
                sumPD.set({
                    x1: 475, y1: 150 + peDist + pfDist, x2: 475, y2: 150 + peDist + pfDist - pdDist,
                    stroke: "red",
                    strokeWidth: 2,
                });

                sumPE.set({
                    x1: 450, y1: 150, x2: 450, y2: 150 + peDist,
                    stroke: "green",
                    strokeWidth: 2,
                });

                sumPF.set({
                    x1: 450, y1: 150 + peDist, x2: 450, y2: 150 + peDist + pfDist,
                    stroke: "blue",
                    strokeWidth: 2,
                });
            } else if (pointP.left as number > pointE.x) {
                sumPD.set({x1: 450, y1: 150, x2: 450, y2: 150 + pdDist,
                    stroke: "red",
                    strokeWidth: 2,
                });

                sumPE.set({
                    x1: 475, y1: 150 + pdDist + pfDist - peDist, x2: 475, y2: 150 + pdDist + pfDist,
                    stroke: "green",
                    strokeWidth: 2,
                });

                sumPF.set({
                    x1: 450, y1: 150 + pdDist, x2: 450, y2: 150 + pdDist + pfDist,
                    stroke: "blue",
                    strokeWidth: 2,
                });
            } else if (pointP.left as number < pointF.x) {
                sumPD.set({
                    x1: 450, y1: 150, x2: 450, y2: 150 + pdDist,
                    stroke: "red",
                    strokeWidth: 2,
                });

                sumPE.set({
                    x1: 450, y1: 150 + pdDist, x2: 450, y2: 150 + pdDist + peDist,
                    stroke: "green",
                    strokeWidth: 2,
                });

                sumPF.set({
                    x1: 475, y1: 150 + pdDist + peDist - pfDist, x2: 475, y2: 150 + pdDist + peDist,
                    stroke: "blue",
                    strokeWidth: 2,
                });
            } else {
                sumPD.set({
                    x1: 450, y1: 150, x2: 450, y2: 150 + pdDist,
                    stroke: "red",
                    strokeWidth: 2,
                });

                sumPE.set({
                    x1: 450, y1: 150 + pdDist, x2: 450, y2: 150 + pdDist + peDist,
                    stroke: "green",
                    strokeWidth: 2,
                });

                sumPF.set({
                    x1: 450, y1: 150 + pdDist + peDist, x2: 450, y2: 150 + pdDist + peDist + pfDist,
                    stroke: "blue",
                    strokeWidth: 2,
                });
            }

            // draw extended dotted lines across BC
            if (pointP.left as number < points[1].x) {
                bcDot.set({x1: dLabel.left as number, y1: dLabel.top as number-1, x2: points[1].x, y2: points[2].y});
            } else if (pointP.left as number > points[2].x) {
                bcDot.set({x1: dLabel.left as number, y1: dLabel.top as number-1, x2: points[2].x, y2: points[2].y});
            } else {
                bcDot.set({x1: 0, y1: 0, x2: 0, y2: 0});
            }

            // draw extended dotted lines across BA
            if (pointF.y > points[1].y) {
                baDot.set({x1: pointF.x, y1: pointF.y, x2: points[1].x, y2: points[2].y});
            } else if (pointF.y < points[0].y) {
                baDot.set({x1: pointF.x, y1: pointF.y, x2: points[0].x, y2: points[0].y});
            } else {
                baDot.set({x1: 0, y1: 0, x2: 0, y2: 0});
            }

            // draw extended dotted lines across CA
            if (pointE.y > points[2].y) {
                acDot.set({x1: pointE.x, y1: pointE.y, x2: points[2].x, y2: points[2].y});
            } else if (pointE.y < points[0].y) {
                acDot.set({x1: pointE.x, y1: pointE.y, x2: points[0].x, y2: points[0].y});
            } else {
                acDot.set({x1: 0, y1: 0, x2: 0, y2: 0});
            }

            // draw values of individual side lengths
            const normalizeFactor = 266;
            //(eval(stringDist)/normalizeFactor).toFixed(2)
            // var stringDist = (pdSign + pdDist.toString() + peSign + peDist.toString() + pfSign + pfDist.toString())
            valuePD.set({text: pdSign + (pdDist/normalizeFactor).toFixed(3).toString() + " " + peSign + "  ", left:110, top:60});
            valuePE.set({text: (peDist/normalizeFactor).toFixed(3).toString() + " " + pfSign, left:190, top:60});
            valuePF.set({text: (pfDist/normalizeFactor).toFixed(3).toString() + "  =  1.00 ", left:270, top:60});

            // set coordinates for the labels
            aLabel.set({left: points[0].x - 5, top: points[0].y - 30, fontSize: 20});
            bLabel.set({left: points[1].x - 10, top: points[1].y + 10, fontSize: 20});
            cLabel.set({left: points[2].x + 10, top: points[2].y + 10, fontSize: 20});

            dLabel.set({left: pointP.left as number, top: triangleBottom, fontSize: 18});
            eLabel.set({left: pointE.x - 20, top: pointE.y - 15, fontSize: 18});
            fLabel.set({left: pointF.x - 20,top: pointF.y - 15,fontSize: 18});

            hLabel.set({left: 465,top: 300,fontSize: 18});
            pLabel.set({left: pointP.left as number - 25,top: pointP.top as number - 10,fontSize: 18});
            // Align squares to their respective points
            angleD.set({left: pointP.left as number - 10,top: 415});
            angleF.set({left: pointF.x as number - 6, top: pointF.y as number + 10});
            angleE.set({left: pointE.x, top: pointE.y});
        }

        equation.set({left:135, top:25, fontSize:30});

        movePointP();

        canvas.on("object:moving", movePointP);

        // Draw all objects
        canvas.add(triangle);

        canvas.add(linePD);
        canvas.add(linePF);
        canvas.add(linePE);

        canvas.add(sumPD);
        canvas.add(sumPF);
        canvas.add(sumPE);

        canvas.add(acDot);
        canvas.add(bcDot);
        canvas.add(baDot);

        canvas.add(aLabel);
        canvas.add(bLabel);
        canvas.add(cLabel);

        canvas.add(dLabel);
        canvas.add(eLabel);
        canvas.add(fLabel);
        canvas.add(hLabel);
        canvas.add(equation);

        canvas.add(angleD);
        canvas.add(angleE);
        canvas.add(angleF);

        canvas.add(valuePD);
        canvas.add(valuePE);
        canvas.add(valuePF);

        canvas.add(pLabel);
        canvas.add(pointP);

        }
    },
);
</script>
