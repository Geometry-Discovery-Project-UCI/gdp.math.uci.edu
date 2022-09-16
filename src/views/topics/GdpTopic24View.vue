<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>
    The description of Harmonic Quadrilateral
  </ATypographyParagraph>
  <div id="Harmonic-Quadrilateral-wapper">
    <ATypographyTitle :level="4">Harmonic Quadrilateral</ATypographyTitle>
    <canvas id="Harmonic-Quadrilateral-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { IEvent } from "fabric/fabric-impl";
import { fabric } from "fabric";
import {
  makeLine,
  makeLabel,
  makeCircle,
  makeMovablePoint
} from "@/utils/canvas";
import {
  getPedalPoint,
  calculateDistanceBetweenTwoPoints
} from "@/utils/geometry";
const topic = indexTopicMap.get(24) as Topic;
type Circle = fabric.Circle & {
  // eslint-disable-next-line
  [key: string]: any,
  intersects?: Circle[],
  upLine?: fabric.Line[],
  downLine?: fabric.Line[],
  crossLines?: fabric.Line[],
  leftBound?: Circle,
  rightBound?: Circle,
};
export default defineComponent(
  {
    setup() {
      return { topic };
    },
    mounted() {
      const canvas = new fabric.Canvas("Harmonic-Quadrilateral-canvas", {
        selection: false,
      });
      const aprimeLabel = makeLabel("A'");
      const bprimeLabel = makeLabel("B'");
      const cprimeLabel = makeLabel("C'");
      const dprimeLabel = makeLabel("D'");
      const lineAAPrime = makeLine();
      const lineBBPrime = makeLine();
      const lineCCPrime = makeLine();
      const lineDDPrime = makeLine();
      const lineAB = makeLine();
      const lineBC = makeLine();
      const lineCD = makeLine();
      const lineDA = makeLine();
      const linePA = makeLine();
      const linePB = makeLine();
      const linePC = makeLine();
      const linePD = makeLine();
      const aLabel = makeLabel("A");
      const bLabel = makeLabel("B");
      const cLabel = makeLabel("C");
      const dLabel = makeLabel("D");
      const pLabel = makeLabel("P");
      const circumCircle = makeCircle();
      const square = new fabric.Polygon(
        [
          { x: 250 - 300 / (Math.sqrt(2) * 2), y: 250 - 300 / (Math.sqrt(2) * 2) },
          { x: 250 - 300 / (Math.sqrt(2) * 2), y: 250 + 300 / (Math.sqrt(2) * 2) },
          { x: 250 + 300 / (Math.sqrt(2) * 2), y: 250 + 300 / (Math.sqrt(2) * 2) },
          { x: 250 + 300 / (Math.sqrt(2) * 2), y: 250 - 300 / (Math.sqrt(2) * 2) },
        ],
        {
          fill: "transparent",
          strokeWidth: 1.5,
          stroke: "gray",
          objectCaching: false,
          transparentCorners: false,
          cornerStyle: "circle",
          cornerColor: "transparent",
          cornerSize: 20,
          hasBorders: false,
          evented: false,
        }
      );
      const points = square.points as fabric.Point[];
      aprimeLabel.set({
        left: points[0].x - 25,
        top: points[0].y - 25,
        fill: "gray",
      });
      bprimeLabel.set({
        left: points[1].x - 25,
        top: points[1].y + 5,
        fill: "gray",
      });
      cprimeLabel.set({
        left: points[2].x + 5,
        top: points[2].y,
        fill: "gray",
      });
      dprimeLabel.set({
        left: points[3].x + 5,
        top: points[3].y - 25,
        fill: "gray",
      });
      const pointP = makeMovablePoint(new fabric.Point(180, 280));
      const pointS = new fabric.Point(250, 250);
      circumCircle.set({
        left: 100,
        top: 100,
        radius: 150,
        stroke: "black"
      });
      pLabel.set({
        left: pointP.left as number + 10,
        top: pointP.top as number + 5,
        fill: "green",
      });
      pointP.set({
        originX: "center",
        originY: "center",
        radius: 3,
        fill: "black",
      });
      const onPointMove = (e: IEvent): void => {
        const p = e.target! as Circle;
        pLabel.set({
          left: pointP.left as number + 10,
          top: pointP.top as number + 5,
          fill: "green",
        });
        const pointO = new fabric.Point(250, 250);
        const pointp = new fabric.Point(p.left as number, p.top as number);
        const dis = calculateDistanceBetweenTwoPoints(pointp, pointO);
        if (dis <= 150) {
          const pedalSPA = getPedalPoint(pointS, points[0], pointp);
          aLabel.set({
            left: pedalSPA.x * 2 - points[0].x,
            top: pedalSPA.y * 2 - points[0].y,
            fill: "blue",
          });
          const pedalSPB = getPedalPoint(pointS, points[1], pointp);
          bLabel.set({
            left: pedalSPB.x * 2 - points[1].x + 5,
            top: pedalSPB.y * 2 - points[1].y - 25,
            fill: "blue",
          });
          const pedalSPC = getPedalPoint(pointS, points[2], pointp);
          cLabel.set({
            left: pedalSPC.x * 2 - points[2].x - 25,
            top: pedalSPC.y * 2 - points[2].y - 10,
            fill: "blue",
          });
          const pedalSPD = getPedalPoint(pointS, points[3], pointp);
          dLabel.set({
            left: pedalSPD.x * 2 - points[3].x - 20,
            top: pedalSPD.y * 2 - points[3].y,
            fill: "blue",
          });
          lineAAPrime.set({
            x1: points[0].x,
            y1: points[0].y,
            x2: pedalSPA.x * 2 - points[0].x,
            y2: pedalSPA.y * 2 - points[0].y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          lineBBPrime.set({
            x1: points[1].x,
            y1: points[1].y,
            x2: pedalSPB.x * 2 - points[1].x,
            y2: pedalSPB.y * 2 - points[1].y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          lineCCPrime.set({
            x1: points[2].x,
            y1: points[2].y,
            x2: pedalSPC.x * 2 - points[2].x,
            y2: pedalSPC.y * 2 - points[2].y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          lineDDPrime.set({
            x1: points[3].x,
            y1: points[3].y,
            x2: pedalSPD.x * 2 - points[3].x,
            y2: pedalSPD.y * 2 - points[3].y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          lineAB.set({
            x1: pedalSPA.x * 2 - points[0].x,
            y1: pedalSPA.y * 2 - points[0].y,
            x2: pedalSPB.x * 2 - points[1].x,
            y2: pedalSPB.y * 2 - points[1].y,
            stroke: "blue",
          });
          lineBC.set({
            x1: pedalSPC.x * 2 - points[2].x,
            y1: pedalSPC.y * 2 - points[2].y,
            x2: pedalSPB.x * 2 - points[1].x,
            y2: pedalSPB.y * 2 - points[1].y,
            stroke: "blue",
          });
          lineCD.set({
            x1: pedalSPC.x * 2 - points[2].x,
            y1: pedalSPC.y * 2 - points[2].y,
            x2: pedalSPD.x * 2 - points[3].x,
            y2: pedalSPD.y * 2 - points[3].y,
            stroke: "blue",
          });
          lineDA.set({
            x1: pedalSPD.x * 2 - points[3].x,
            y1: pedalSPD.y * 2 - points[3].y,
            x2: pedalSPA.x * 2 - points[0].x,
            y2: pedalSPA.y * 2 - points[0].y,
            stroke: "blue",
          });
          linePA.set({
            x1: pedalSPA.x * 2 - points[0].x,
            y1: pedalSPA.y * 2 - points[0].y,
            x2: pointp.x,
            y2: pointp.y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          linePB.set({
            x1: pedalSPB.x * 2 - points[1].x,
            y1: pedalSPB.y * 2 - points[1].y,
            x2: pointp.x,
            y2: pointp.y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          linePC.set({
            x1: pedalSPC.x * 2 - points[2].x,
            y1: pedalSPC.y * 2 - points[2].y,
            x2: pointp.x,
            y2: pointp.y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          linePD.set({
            x1: pedalSPD.x * 2 - points[3].x,
            y1: pedalSPD.y * 2 - points[3].y,
            x2: pointp.x,
            y2: pointp.y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
        }
        if (dis > 150) {
          const pedalSPA = getPedalPoint(pointS, points[0], pointp);
          aLabel.set({
            left: pedalSPA.x * 2 - points[0].x,
            top: pedalSPA.y * 2 - points[0].y,
            fill: "red",
          });
          const pedalSPB = getPedalPoint(pointS, points[1], pointp);
          bLabel.set({
            left: pedalSPB.x * 2 - points[1].x + 5,
            top: pedalSPB.y * 2 - points[1].y - 25,
            fill: "red",
          });
          const pedalSPC = getPedalPoint(pointS, points[2], pointp);
          cLabel.set({
            left: pedalSPC.x * 2 - points[2].x - 25,
            top: pedalSPC.y * 2 - points[2].y - 10,
            fill: "red",
          });
          const pedalSPD = getPedalPoint(pointS, points[3], pointp);
          dLabel.set({
            left: pedalSPD.x * 2 - points[3].x - 20,
            top: pedalSPD.y * 2 - points[3].y,
            fill: "red",
          });
          lineAAPrime.set({
            x1: points[0].x,
            y1: points[0].y,
            x2: pedalSPA.x * 2 - points[0].x,
            y2: pedalSPA.y * 2 - points[0].y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          lineBBPrime.set({
            x1: points[1].x,
            y1: points[1].y,
            x2: pedalSPB.x * 2 - points[1].x,
            y2: pedalSPB.y * 2 - points[1].y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          lineCCPrime.set({
            x1: points[2].x,
            y1: points[2].y,
            x2: pedalSPC.x * 2 - points[2].x,
            y2: pedalSPC.y * 2 - points[2].y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          lineDDPrime.set({
            x1: points[3].x,
            y1: points[3].y,
            x2: pedalSPD.x * 2 - points[3].x,
            y2: pedalSPD.y * 2 - points[3].y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          lineAB.set({
            x1: pedalSPA.x * 2 - points[0].x,
            y1: pedalSPA.y * 2 - points[0].y,
            x2: pedalSPB.x * 2 - points[1].x,
            y2: pedalSPB.y * 2 - points[1].y,
            stroke: "red",
          });
          lineBC.set({
            x1: pedalSPC.x * 2 - points[2].x,
            y1: pedalSPC.y * 2 - points[2].y,
            x2: pedalSPB.x * 2 - points[1].x,
            y2: pedalSPB.y * 2 - points[1].y,
            stroke: "red",
          });
          lineCD.set({
            x1: pedalSPC.x * 2 - points[2].x,
            y1: pedalSPC.y * 2 - points[2].y,
            x2: pedalSPD.x * 2 - points[3].x,
            y2: pedalSPD.y * 2 - points[3].y,
            stroke: "red",
          });
          lineDA.set({
            x1: pedalSPD.x * 2 - points[3].x,
            y1: pedalSPD.y * 2 - points[3].y,
            x2: pedalSPA.x * 2 - points[0].x,
            y2: pedalSPA.y * 2 - points[0].y,
            stroke: "red",
          });
          linePA.set({
            x1: pedalSPA.x * 2 - points[0].x,
            y1: pedalSPA.y * 2 - points[0].y,
            x2: pointp.x,
            y2: pointp.y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          linePB.set({
            x1: pedalSPB.x * 2 - points[1].x,
            y1: pedalSPB.y * 2 - points[1].y,
            x2: pointp.x,
            y2: pointp.y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          linePC.set({
            x1: pedalSPC.x * 2 - points[2].x,
            y1: pedalSPC.y * 2 - points[2].y,
            x2: pointp.x,
            y2: pointp.y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
          linePD.set({
            x1: pedalSPD.x * 2 - points[3].x,
            y1: pedalSPD.y * 2 - points[3].y,
            x2: pointp.x,
            y2: pointp.y,
            strokeDashArray: [2.5, 2.5],
            stroke: "gray",
          });
        }

      };
      canvas.on("object:moving", onPointMove);
      const pointp = new fabric.Point(pointP.left as number, pointP.top as number);
      const pedalSPA = getPedalPoint(pointS, points[0], pointp);
      aLabel.set({
        left: pedalSPA.x * 2 - points[0].x,
        top: pedalSPA.y * 2 - points[0].y,
        fill: "blue",
      });
      const pedalSPB = getPedalPoint(pointS, points[1], pointp);
      bLabel.set({
        left: pedalSPB.x * 2 - points[1].x + 5,
        top: pedalSPB.y * 2 - points[1].y - 25,
        fill: "blue",
      });
      const pedalSPC = getPedalPoint(pointS, points[2], pointp);
      cLabel.set({
        left: pedalSPC.x * 2 - points[2].x - 25,
        top: pedalSPC.y * 2 - points[2].y - 10,
        fill: "blue",
      });
      const pedalSPD = getPedalPoint(pointS, points[3], pointp);
      dLabel.set({
        left: pedalSPD.x * 2 - points[3].x - 20,
        top: pedalSPD.y * 2 - points[3].y,
        fill: "blue",
      });
      lineAAPrime.set({
        x1: points[0].x,
        y1: points[0].y,
        x2: pedalSPA.x * 2 - points[0].x,
        y2: pedalSPA.y * 2 - points[0].y,
        strokeDashArray: [2.5, 2.5],
        stroke: "gray",
      });
      lineBBPrime.set({
        x1: points[1].x,
        y1: points[1].y,
        x2: pedalSPB.x * 2 - points[1].x,
        y2: pedalSPB.y * 2 - points[1].y,
        strokeDashArray: [2.5, 2.5],
        stroke: "gray",
      });
      lineCCPrime.set({
        x1: points[2].x,
        y1: points[2].y,
        x2: pedalSPC.x * 2 - points[2].x,
        y2: pedalSPC.y * 2 - points[2].y,
        strokeDashArray: [2.5, 2.5],
        stroke: "gray",
      });
      lineDDPrime.set({
        x1: points[3].x,
        y1: points[3].y,
        x2: pedalSPD.x * 2 - points[3].x,
        y2: pedalSPD.y * 2 - points[3].y,
        strokeDashArray: [2.5, 2.5],
        stroke: "gray",
      });
      lineAB.set({
        x1: pedalSPA.x * 2 - points[0].x,
        y1: pedalSPA.y * 2 - points[0].y,
        x2: pedalSPB.x * 2 - points[1].x,
        y2: pedalSPB.y * 2 - points[1].y,
        stroke: "blue",
      });
      lineBC.set({
        x1: pedalSPC.x * 2 - points[2].x,
        y1: pedalSPC.y * 2 - points[2].y,
        x2: pedalSPB.x * 2 - points[1].x,
        y2: pedalSPB.y * 2 - points[1].y,
        stroke: "blue",
      });
      lineCD.set({
        x1: pedalSPC.x * 2 - points[2].x,
        y1: pedalSPC.y * 2 - points[2].y,
        x2: pedalSPD.x * 2 - points[3].x,
        y2: pedalSPD.y * 2 - points[3].y,
        stroke: "blue",
      });
      lineDA.set({
        x1: pedalSPD.x * 2 - points[3].x,
        y1: pedalSPD.y * 2 - points[3].y,
        x2: pedalSPA.x * 2 - points[0].x,
        y2: pedalSPA.y * 2 - points[0].y,
        stroke: "blue",
      });
      linePA.set({
        x1: pedalSPA.x * 2 - points[0].x,
        y1: pedalSPA.y * 2 - points[0].y,
        x2: pointp.x,
        y2: pointp.y,
        stroke: "gray",
      });
      canvas.add(circumCircle);
      canvas.add(square);
      canvas.add(pLabel);
      canvas.add(pointP);
      canvas.add(aprimeLabel, bprimeLabel, cprimeLabel, dprimeLabel, aLabel, bLabel, cLabel, dLabel);
      canvas.add(lineAAPrime, lineBBPrime, lineCCPrime, lineDDPrime, lineAB, lineBC, lineCD, lineDA, linePA, linePB, linePC, linePD);
    },
  },
);
</script>
