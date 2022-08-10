<template>
    <TopicMeta :topic="topic" />
    <ATypographyParagraph>
    </ATypographyParagraph>
    <div id="cross-ratio-wrapper">
      <ATypographyTitle :level="4">Animated Projective Harmonic Conjugate</ATypographyTitle>
      <canvas id="cross-ratio-canvas" width="500" height="500" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import {fabric} from "fabric";
import {makeCircle, makeLabel, makeLine, makeMovablePoint} from "@/utils/canvas";
import {calculateLineIntersectInPoints} from "@/utils/geometry";
import {IEvent, Circle} from "fabric/fabric-impl";

const topic = indexTopicMap.get(36) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
      mounted() {
        const canvas = new fabric.Canvas("cross-ratio-canvas", {
          selection: false,
          backgroundColor: "floralwhite",
        });
        const labelA = makeLabel("A");
        const labelB = makeLabel("B");
        const labelC = makeLabel("C");
        const labelD = makeLabel("D");
        const labelP = makeLabel("P");
        const labelL1 = makeLabel("L1");
        const equation = makeLabel("EH x FG/EG/FH = 1");
        const PA = makeLine();
        const PB = makeLine();
        const PC = makeLine();
        const PD = makeLine();
        // Fixed points: P, A, B, C, D. l1
        const pointA = new fabric.Point(100, 350);
        const pointB = new fabric.Point(200, 350);
        const pointC = new fabric.Point(250, 350);
        const pointD = new fabric.Point(400, 350);
        const pointP = new fabric.Point(250, 100);
        const circleA = makeCircle(3,pointA, "red", 2);
        const circleB = makeCircle(3,pointB, "red", 2);
        const circleC = makeCircle(3,pointC, "red", 2);
        const circleD = makeCircle(3,pointD, "red", 2);
        const circleP = makeCircle(3,pointP, "transparent", 2);
        circleA.set({originX: "center", originY: "center"});
        circleB.set({originX: "center", originY: "center"});
        circleC.set({originX: "center", originY: "center"});
        circleD.set({originX: "center", originY: "center"});
        circleP.set({originX: "center", originY: "center"});
        labelA.set({left: pointA.x - 10, top: pointA.y + 10});
        labelB.set({left: pointB.x - 10, top: pointB.y + 10});
        labelC.set({left: pointC.x - 10, top: pointC.y + 10});
        labelD.set({left: pointD.x - 10, top: pointD.y + 10});
        labelP.set({left: pointP.x - 10, top: pointP.y - 30});
        // Fixed lines: l1, PA, PB, PC, PD.
        const l1 = makeLine(new fabric.Point(50, 350), new fabric.Point(450, 350), 2);
        labelL1.set({left: 470, top: 340});
        PA.set({x1: pointP.x, y1: pointP.y, x2: pointA.x, y2: pointA.y});
        PB.set({x1: pointP.x, y1: pointP.y, x2: pointB.x, y2: pointB.y});
        PC.set({x1: pointP.x, y1: pointP.y, x2: pointC.x, y2: pointC.y});
        PD.set({x1: pointP.x, y1: pointP.y, x2: pointD.x, y2: pointD.y});

        // Set initiate attributes for line2.
        const labelL2 = makeLabel("L2");
        const l2 = makeLine();
        const movingLeftPoint = makeMovablePoint(new fabric.Point(50, 200));
        const movingRightPoint = makeMovablePoint(new fabric.Point(450, 300));
        movingLeftPoint.set({originX: "center", originY: "center", radius: 3});
        movingRightPoint.set({originX: "center", originY: "center", radius: 3});
        l2.set({
          x1: movingLeftPoint.left as number, y1: movingLeftPoint.top as number,
          x2: movingRightPoint.left, y2: movingRightPoint.top,
          strokeWidth: 2
        });
        labelL2.set({left:  440, top: 300});

        // Set initiate coordinates for moving points E, F, G,H.
        const labelE = makeLabel("E");
        const labelF = makeLabel("F");
        const labelG = makeLabel("G");
        const labelH = makeLabel("H");
        const circleE = makeCircle();
        const circleF = makeCircle();
        const circleG = makeCircle();
        const circleH = makeCircle();
        let pointE = calculateLineIntersectInPoints(l2, PA, false);
        let pointF = calculateLineIntersectInPoints(l2, PB, false);
        let pointG = calculateLineIntersectInPoints(l2, PC, false);
        let pointH = calculateLineIntersectInPoints(l2, PD, false);
        circleE.set({
          originX: "center", originY: "center",
          radius: 3,
          left:pointE!.x,
          top: pointE!.y,
          fill: "blue",
          strokeWidth: 2
        });
        circleF.set({
          originX: "center", originY: "center",
          radius: 3,
          left:pointF!.x,
          top: pointF!.y,
          fill: "blue",
          strokeWidth: 2
        });
        circleG.set({
          originX: "center", originY: "center",
          radius: 3,
          left:pointG!.x,
          top: pointG!.y,
          fill: "blue",
          strokeWidth: 2
        });
        circleH.set({
          originX: "center", originY: "center",
          radius: 3,
          left:pointH!.x,
          top: pointH!.y,
          fill: "blue",
          strokeWidth: 2
        });
        labelE.set({left: pointE!.x - 10, top: pointE!.y + 10});
        labelF.set({left: pointF!.x - 10, top: pointF!.y + 10});
        labelG.set({left: pointG!.x - 10, top: pointG!.y + 10});
        labelH.set({left: pointH!.x - 10, top: pointH!.y + 10});

        // Moving point manipulate.
        const onMovePoint = (e: IEvent): void => {
          const p = e.target as Circle;
          const point = new fabric.Point(p.left as number, p.top as number);
          if (point.x > pointP.x) {
            l2.set({
              x1: movingLeftPoint.left as number, y1: movingLeftPoint.top as number,
              x2: point.x, y2: point.y});
          } else {
            l2.set({
              x1:point.x , y1: point.y,
              x2: movingRightPoint.left, y2: movingRightPoint.top,
            });
          }

          pointE = calculateLineIntersectInPoints(l2, PA, false);
          pointF = calculateLineIntersectInPoints(l2, PB, false);
          pointG = calculateLineIntersectInPoints(l2, PC, false);
          pointH = calculateLineIntersectInPoints(l2, PD, false);

          circleE.set({left:pointE!.x, top: pointE!.y,});
          circleF.set({left:pointF!.x, top: pointF!.y,});
          circleG.set({left:pointG!.x, top: pointG!.y,});
          circleH.set({left:pointH!.x, top: pointH!.y,});
          labelE.set({left: pointE!.x - 10, top: pointE!.y + 10});
          labelF.set({left: pointF!.x - 10, top: pointF!.y + 10});
          labelG.set({left: pointG!.x - 10, top: pointG!.y + 10});
          labelH.set({left: pointH!.x - 10, top: pointH!.y + 10});
        };
        equation.set({left:150, top: 420});

        canvas.on("object:moving", onMovePoint);
        canvas.add(equation);
        canvas.add(l1, PA, PB, PC, PD, l2);
        canvas.add(circleA, circleB, circleC, circleD, circleP, circleE, circleF, circleG, circleH);
        canvas.add(labelA, labelB, labelC, labelD, labelP,labelL1, labelL2, labelE, labelF, labelG, labelH);
        canvas.add(movingLeftPoint, movingRightPoint);
      }
    },
);
</script>
