<template>
<TopicMeta :topic="topic" />
  <ATypographyParagraph>
    
  </ATypographyParagraph>
  <div id="vivani-theorum-wrapper">
    <ATypographyTitle :level="4">Animated Vivani's Theorum</ATypographyTitle>
    <canvas id="vivani-theorem-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { indexTopicMap } from '@/data';
import { Topic } from '@/types';
import {fabric} from 'fabric';
import {makeLabel, makeLine, makeMovablePoint } from '@/utils/canvas';
import {calculateDistanceBetweenTwoPoints, calculateLineIntersectInLinearEquation, solveLinearEquation } from '@/utils/geometry';

const topic = indexTopicMap.get(34) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
        mounted() {
        const canvas = new fabric.Canvas("vivani-theorem-canvas", {
            selection: false,
            backgroundColor: "floralwhite",
        }); 

        // create all lines/labels
        var angleD = new fabric.Rect({width: 10, height: 10, fill: '', stroke: 'black'});
        var angleF = new fabric.Rect({width: 10, height: 10, fill: '', stroke: 'black', angle: -60});
        var angleE = new fabric.Rect({width: 10, height: 10, fill: '', stroke: 'black', angle: 60});

        const linePD = makeLine();
        const linePF = makeLine();
        const linePE = makeLine();
        const lineHeight = makeLine();
        
        const sumPD = makeLine();
        const sumPF = makeLine();
        const sumPE = makeLine();

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

        // create triangle
        const triangle = new fabric.Polygon(
            [
            { x: 200, y: 150 },
            { x: 25, y: 450 },
            { x: 375, y: 450 },
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
        const pointP = makeMovablePoint({
            x: 180,
            y: 310,
        });

        pointP.set({
            originX: "center",
            originY: "center",
            radius: 5,
            fill: "black",
        });        

        // Function to draw lines PF, PD, and PE depending on location of point P
        function movePointP() {
            const points = triangle.points as Array<fabric.Point>;

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
            const lineProjectPF = solveLinearEquation({x:projectPF.x1, y:projectPF.y1}, {x:projectPF.x2,y:projectPF.y2});
            const pointF = calculateLineIntersectInLinearEquation(lineAB.m, lineAB.b, lineProjectPF.m, lineProjectPF.b);
            const lineProjectPE = solveLinearEquation({x:projectPE.x1, y:projectPE.y1}, {x:projectPE.x2,y:projectPE.y2});
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
            })

            linePD.set({
                x1: pointP.left,
                y1: pointP.top,
                x2: pointP.left,
                y2: 450,
                stroke: "red",
            });

            // store length of each line for side display
            const pdDist = calculateDistanceBetweenTwoPoints({x:pointP.left, y:pointP.top}, {x:pointP.left, y:450});
            const peDist = calculateDistanceBetweenTwoPoints({x:pointP.left, y:pointP.top}, {x:pointE.x, y:pointE.y});
            const pfDist = calculateDistanceBetweenTwoPoints({x:pointP.left, y:pointP.top}, {x:pointF.x, y:pointF.y});

            // draw values of individual side lengths
            const sumDist = pdDist + peDist + pfDist;
            valuePD.set({text: (pdDist/sumDist).toFixed(3).toString() + " +", left:110, top:90});
            valuePE.set({text: (peDist/sumDist).toFixed(3).toString() + " +", left:190, top:90});
            valuePF.set({text: (pfDist/sumDist).toFixed(3).toString() + " = 1", left:270, top:90});

            // Draw side lines based off length of PE/PD/PF
            sumPD.set({
                x1: points[0].x,
                y1: 150,
                x2: points[0].x,
                y2: 150 + pdDist,
                stroke: "red",
                strokeWidth: 2,
            });

            sumPE.set({
                x1: points[0].x,
                y1: 150 + pdDist,
                x2: points[0].x,
                y2: 150 + pdDist + peDist,
                stroke: "green",
                strokeWidth: 2,
            });            

            sumPF.set({
                x1: points[0].x,
                y1: 150 + pdDist + peDist,
                x2: points[0].x,
                y2: 150 + pdDist + peDist + pfDist,
                stroke: "blue",
                strokeWidth: 2,
            });  

            lineHeight.set({
                x1: 425,
                y1: 150,
                x2: 425,
                y2: 450,
                stroke: "black",
                strokeWidth: 2,
            });

            // set coordinates for the labels
            aLabel.set({left: points[0].x - 5, top: points[0].y - 30, fontSize: 20});
            bLabel.set({left: points[1].x - 10, top: points[1].y + 10, fontSize: 20});
            cLabel.set({left: points[2].x + 10, top: points[2].y + 10, fontSize: 20});

            dLabel.set({left: pointP.left as number, top: 450, fontSize: 18});
            eLabel.set({left: pointE.x - 20, top: pointE.y - 15, fontSize: 18});
            fLabel.set({left: pointF.x - 20,top: pointF.y - 15,fontSize: 18});

            hLabel.set({left: 430,top: 300,fontSize: 18});
            pLabel.set({left: pointP.left as number - 25,top: pointP.top as number - 10,fontSize: 18});
            
            // Align squares to their respective points
            angleD.set({left: pointP.left as number - 10,top: 440});
            angleF.set({left: pointF.x, top: pointF.y});
            angleE.set({left: pointE.x, top: pointE.y});
        }

        equation.set({left:135, top:50, fontSize:30});

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
        canvas.add(lineHeight);

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
