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
import {
  calculateLineIntersectInPoints,
  findDistance, getPedalPoint,
} from "@/utils/geometry";
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
        const equation1 = makeLabel("FG      EH");
        const equation2 = makeLabel("EF      GH");
        const dividerSign1 = makeLabel("----  *  ----  =  ");
        const dividerSign2 = makeLabel("------  *  ------  =  ");
        const disEHText = makeLabel("0");
        const disFGText = makeLabel("0");
        const disEFText = makeLabel("0");
        const disGHText = makeLabel("0");
        const disResult = makeLabel("0");
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
        const circleA = makeCircle(4,pointA, "red", 2);
        const circleB = makeCircle(4,pointB, "red", 2);
        const circleC = makeCircle(4,pointC, "red", 2);
        const circleD = makeCircle(4,pointD, "red", 2);
        const circleP = makeCircle(4,pointP, "transparent", 2);
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
        const L2LeftPoint = makeMovablePoint(new fabric.Point(50, 200));
        const L2RightPoint = makeMovablePoint(new fabric.Point(450, 300));
        L2LeftPoint.set({originX: "center", originY: "center", radius: 5, fill: "transparent"});
        L2RightPoint.set({originX: "center", originY: "center", radius: 5,fill: "transparent"});
        l2.set({
          x1: L2LeftPoint.left as number, y1: L2LeftPoint.top as number,
          x2: L2RightPoint.left, y2: L2RightPoint.top,
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
          radius: 4,
          left:pointE!.x,
          top: pointE!.y,
          fill: "blue",
          strokeWidth: 2
        });
        circleF.set({
          originX: "center", originY: "center",
          radius: 4,
          left:pointF!.x,
          top: pointF!.y,
          fill: "blue",
          strokeWidth: 2
        });
        circleG.set({
          originX: "center", originY: "center",
          radius: 4,
          left:pointG!.x,
          top: pointG!.y,
          fill: "blue",
          strokeWidth: 2
        });
        circleH.set({
          originX: "center", originY: "center",
          radius: 4,
          left:pointH!.x,
          top: pointH!.y,
          fill: "blue",
          strokeWidth: 2
        });
        labelE.set({left: pointE!.x - 10, top: pointE!.y + 10});
        labelF.set({left: pointF!.x - 10, top: pointF!.y + 10});
        labelG.set({left: pointG!.x - 10, top: pointG!.y + 10});
        labelH.set({left: pointH!.x - 10, top: pointH!.y + 10});

        pointE = calculateLineIntersectInPoints(l2, PA, false);
        pointF = calculateLineIntersectInPoints(l2, PB, false);
        pointG = calculateLineIntersectInPoints(l2, PC, false);
        pointH = calculateLineIntersectInPoints(l2, PD, false);

        equation1.set({left:80, top: 430});
        equation2.set({left:80, top: 465});
        dividerSign1.set({left:80, top: 445});
        // Calculate distance of inter points.
        // TODO: HANDLE NULL CASE
        const disEH = findDistance([pointE!.x, pointE!.y], [pointH!.x, pointH!.y]);
        const disFG = findDistance([pointF!.x, pointF!.y], [pointG!.x, pointG!.y]);
        const disEF = findDistance([pointE!.x, pointE!.y], [pointF!.x, pointF!.y]);
        const disGH = findDistance([pointG!.x, pointG!.y], [pointH!.x, pointH!.y]);
        const result = (disEH / disGH)  * (disFG / disEF);

        // Display distance and result to canvas
        disEHText.set({
          text: disEH.toFixed(2) + "",
          left: 300,
          top: 430,
          fontSize: 20,
          stroke: "black",
        });
        disFGText.set({
          text: disFG.toFixed(2) + "",
          left: 220,
          top: 430,
          fontSize: 20,
          stroke: "black",
        });
        disEFText.set({
          text: disEF.toFixed(2) + "",
          left: 220,
          top: 465,
          fontSize: 20,
          stroke: "black",
        });
        disGHText.set({
          text: disGH.toFixed(2) + "",
          left: 300,
          top: 465,
          fontSize: 20,
          stroke: "black",
        });
        disResult.set({
          text: result.toFixed(2)+ "",
          left: 390,
          top: 445,
          fontSize: 20,
          stroke: "black",
        });
        dividerSign2.set({left:220, top: 445});

        // Moving point manipulate.
        const onMovePoint = (e: IEvent): void => {
          const p = e.target as Circle;
          const point = new fabric.Point(p.left as number, p.top as number);
          let point2: fabric.Point;
          if (point.x < pointP.x) { // moving left point
            point2 = new fabric.Point(L2RightPoint.left!, L2RightPoint.top!);
          } else {  // moving right point
            point2 = new fabric.Point(L2LeftPoint.left!, L2LeftPoint.top!);
            labelL2.set({left: point.x, top: point.y});
          }
          l2.set({
            x1:point.x , y1: point.y,
            x2: point2.x, y2: point2.y,
          });

          // Set x boundary for moving point
          // const pedalPoint = getPedalPoint(pointP,point, point2);
          // const distancePtoL2 = findDistance([pointP.x,pointP.y],[pedalPoint.x,pedalPoint.y]);
          // let boundaryX = 0, boundaryY = 0;
          // if (distancePtoL2 === 0) {
          //   boundaryX = p.left!;
          //   boundaryY = p.top!;
          // }
          // if (distancePtoL2 < 0) {
          //   p.set({
          //     left: boundaryX,
          //     top: boundaryY
          //   });
          // }

          // left point needs to have a x boundary
          // right moving point needs to have an x boundary

          pointE = calculateLineIntersectInPoints(l2, PA, false);
          pointF = calculateLineIntersectInPoints(l2, PB, false);
          pointG = calculateLineIntersectInPoints(l2, PC, false);
          pointH = calculateLineIntersectInPoints(l2, PD, false);

          // Calculate distance of inter points.
          // TODO: HANDLE NULL CASE
          const disEH = findDistance([pointE!.x, pointE!.y], [pointH!.x, pointH!.y]);
          const disFG = findDistance([pointF!.x, pointF!.y], [pointG!.x, pointG!.y]);
          const disEF = findDistance([pointE!.x, pointE!.y], [pointF!.x, pointF!.y]);
          const disGH = findDistance([pointG!.x, pointG!.y], [pointH!.x, pointH!.y]);
          const result = (disEH /disGH)  * (disFG / disEF);

          // Set distance to display text
          disEHText.set({text: disEH.toFixed(2) + "",});
          disFGText.set({text: disFG.toFixed(2) + "",});
          disEFText.set({text: disEF.toFixed(2) + "",});
          disGHText.set({text: disGH.toFixed(2) + "",});
          disResult.set({text: result.toFixed(2)+ "",});

          circleE.set({left:pointE!.x, top: pointE!.y,});
          circleF.set({left:pointF!.x, top: pointF!.y,});
          circleG.set({left:pointG!.x, top: pointG!.y,});
          circleH.set({left:pointH!.x, top: pointH!.y,});
          labelE.set({left: pointE!.x - 10, top: pointE!.y + 10});
          labelF.set({left: pointF!.x - 10, top: pointF!.y + 10});
          labelG.set({left: pointG!.x - 10, top: pointG!.y + 10});
          labelH.set({left: pointH!.x - 10, top: pointH!.y + 10});
        };

        canvas.on("object:moving", onMovePoint);
        canvas.add(equation1,equation2, dividerSign1, dividerSign2);
        canvas.add(l1, PA, PB, PC, PD, l2);
        canvas.add(circleA, circleB, circleC, circleD, circleP, circleE, circleF, circleG, circleH);
        canvas.add(labelA, labelB, labelC, labelD, labelP,labelL1, labelL2, labelE, labelF, labelG, labelH);
        canvas.add(L2LeftPoint, L2RightPoint);
        canvas.add(disEHText, disFGText, disEFText, disGHText, disResult);
      }
    },
);
</script>
