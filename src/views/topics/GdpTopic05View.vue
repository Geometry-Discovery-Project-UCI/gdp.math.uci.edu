<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph> The description of Simson Line </ATypographyParagraph>
  <div id="Simson-Line-wapper">
    <ATypographyTitle :level="4">Simson Line</ATypographyTitle>
    <canvas id="Simson-Line-canvas" width="500" height="500" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { IEvent } from "fabric/fabric-impl";
import { fabric } from "fabric";
import { makeLine, makeLabel, makeCircle, makeMovablePoint } from "@/utils/canvas";
import {
  getPedalPoint,
  calculateDistanceBetweenTwoPoints,
  calculateSlope,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from "@/utils/geometry";
const topic = indexTopicMap.get(5) as Topic;
type Circle = fabric.Circle & {
  // eslint-disable-next-line
  [key: string]: any;
  intersects?: Circle[];
  upLine?: fabric.Line[];
  downLine?: fabric.Line[];
  crossLines?: fabric.Line[];
  leftBound?: Circle;
  rightBound?: Circle;
};
export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("Simson-Line-canvas", {
      selection: false,
    });
    const pi = 3.14;
    const aLabel = makeLabel("A");
    const bLabel = makeLabel("B");
    const cLabel = makeLabel("C");
    const pLabel = makeLabel("P");
    const xLabel = makeLabel("X");
    const yLabel = makeLabel("Y");
    const zLabel = makeLabel("Z");
    const lineAB = makeLine();
    const lineAC = makeLine();
    const lineBC = makeLine();
    const linePX = makeLine();
    const linePY = makeLine();
    const linePZ = makeLine();
    const lineAZ = makeLine();
    const lineBZ = makeLine();
    const lineBX = makeLine();
    const lineCX = makeLine();
    const lineAY = makeLine();
    const lineCY = makeLine();
    const lineSimson = makeLine();
    const angleX = new fabric.Rect();
    const angleY = new fabric.Rect();
    const angleZ = new fabric.Rect();
    const radiusCircle = 200;
    const xx = 250;
    const yy = 250;
    const circumCircle = makeCircle();
    const pointP = makeMovablePoint(new fabric.Point(250, 50));
    circumCircle.set({
      left: 50,
      top: 50,
      radius: radiusCircle,
      stroke: "black",
    });
    const pC = [xx + Math.cos(pi / 6) * radiusCircle, yy + Math.sin(pi / 6) * radiusCircle];
    const pB = [xx - Math.cos(pi / 6) * radiusCircle, yy + Math.sin(pi / 6) * radiusCircle];
    const pA = [xx - Math.cos(pi / 3) * radiusCircle, yy - Math.sin(pi / 3) * radiusCircle];
    const pointA = new fabric.Point(pA[0], pA[1]);
    const pointB = new fabric.Point(pB[0], pB[1]);
    const pointC = new fabric.Point(pC[0], pC[1]);
    aLabel.set({
      left: pA[0] - 25,
      top: pA[1] - 20,
      fill: "green",
    });
    bLabel.set({
      left: pB[0] - 20,
      top: pB[1] - 5,
      fill: "green",
    });
    cLabel.set({
      left: pC[0],
      top: pC[1],
      fill: "green",
    });
    lineAB.set({
      x1: pA[0],
      y1: pA[1],
      x2: pB[0],
      y2: pB[1],
      stroke: "black",
    });
    lineAC.set({
      x1: pA[0],
      y1: pA[1],
      x2: pC[0],
      y2: pC[1],
      stroke: "black",
    });
    lineBC.set({
      x1: pC[0],
      y1: pC[1],
      x2: pB[0],
      y2: pB[1],
      stroke: "black",
    });
    const disAB = calculateDistanceBetweenTwoPoints(pointA, pointB);
    const disBC = calculateDistanceBetweenTwoPoints(pointB, pointC);
    const disAC = calculateDistanceBetweenTwoPoints(pointA, pointC);

    const onPointMove = (e: IEvent): void => {
      const p = e.target! as Circle;
      const cosx =
        ((p.left as number) - xx) /
        Math.sqrt(
          ((p.left as number) - xx) * ((p.left as number) - xx) +
            ((p.top as number) - yy) * ((p.top as number) - yy)
        );
      const sinx =
        ((p.top as number) - yy) /
        Math.sqrt(
          ((p.left as number) - xx) * ((p.left as number) - xx) +
            ((p.top as number) - yy) * ((p.top as number) - yy)
        );
      if ((p.left as number) >= 250) {
        p.set({
          left: xx + radiusCircle * cosx,
          top: yy + radiusCircle * sinx,
        });
      }
      if ((p.left as number) < 250) {
        p.set({
          left: xx + radiusCircle * cosx,
          top: yy + radiusCircle * sinx,
        });
      }
      const pointp = new fabric.Point(p.left as number, p.top as number);
      const pointY = getPedalPoint(pointp, pointA, pointC);
      const pointX = getPedalPoint(pointp, pointC, pointB);
      const pointZ = getPedalPoint(pointp, pointA, pointB);
      linePY.set({
        x1: pointp.x,
        y1: pointp.y,
        x2: pointY.x,
        y2: pointY.y,
        strokeWidth: 2.5,
        stroke: "blue",
      });
      linePX.set({
        x1: pointp.x,
        y1: pointp.y,
        x2: pointX.x,
        y2: pointX.y,
        strokeWidth: 2.5,
        stroke: "purple",
      });
      linePZ.set({
        x1: pointp.x,
        y1: pointp.y,
        x2: pointZ.x,
        y2: pointZ.y,
        strokeWidth: 2.5,
        stroke: "green",
      });
      lineAZ.set({
        x1: pointA.x,
        y1: pointA.y,
        x2: pointZ.x,
        y2: pointZ.y,
        strokeDashArray: [5, 5],
        stroke: "gray",
      });
      lineBZ.set({
        x1: pointB.x,
        y1: pointB.y,
        x2: pointZ.x,
        y2: pointZ.y,
        strokeDashArray: [5, 5],
        stroke: "gray",
      });
      lineBX.set({
        x1: pointB.x,
        y1: pointB.y,
        x2: pointX.x,
        y2: pointX.y,
        strokeDashArray: [5, 5],
        stroke: "gray",
      });
      lineCX.set({
        x1: pointC.x,
        y1: pointC.y,
        x2: pointX.x,
        y2: pointX.y,
        strokeDashArray: [5, 5],
        stroke: "gray",
      });
      lineAY.set({
        x1: pointA.x,
        y1: pointA.y,
        x2: pointY.x,
        y2: pointY.y,
        strokeDashArray: [5, 5],
        stroke: "gray",
      });
      lineCY.set({
        x1: pointC.x,
        y1: pointC.y,
        x2: pointY.x,
        y2: pointY.y,
        strokeDashArray: [5, 5],
        stroke: "gray",
      });
      pLabel.set({
        left: pointp.x + 10,
        top: pointp.y + 5,
        fill: "green",
      });
      xLabel.set({
        left: pointX.x - 25,
        top: pointX.y,
        fill: "green",
      });
      yLabel.set({
        left: pointY.x - 25,
        top: pointY.y - 10,
        fill: "green",
      });
      zLabel.set({
        left: pointZ.x - 25,
        top: pointZ.y - 10,
        fill: "green",
      });

      if (pointp.y <= pointB.y && pointp.x < pointC.x) {
        angleX.set({
          left: pointX.x as number,
          top: pointX.y as number,
          width: 10,
          height: 10,
          fill: "",
          stroke: "gray",
          strokeDashArray: [2.5, 2.5],
          angle: -90,
        });
      }
      if (pointp.y > pointB.y) {
        angleX.set({
          left: pointX.x as number,
          top: pointX.y as number,
          width: 10,
          height: 10,
          fill: "",
          stroke: "gray",
          strokeDashArray: [2.5, 2.5],
          angle: 90,
        });
      }
      if (pointp.x > pointC.x) {
        angleX.set({
          left: pointX.x as number,
          top: pointX.y as number,
          width: 10,
          height: 10,
          fill: "",
          stroke: "gray",
          strokeDashArray: [2.5, 2.5],
          angle: 180,
        });
      }
      if (pointY.x < pointA.x) {
        angleY.set({
          left: pointY.x as number,
          top: pointY.y as number,
          width: 10,
          height: 10,
          fill: "",
          stroke: "gray",
          strokeDashArray: [2.5, 2.5],
          angle:
            (Math.acos((disBC * disBC + disAC * disAC - disAB * disAB) / (2 * disAC * disBC)) *
              180) /
            Math.PI,
        });
      }
      if (pointY.x > pointC.x) {
        angleY.set({
          left: pointY.x as number,
          top: pointY.y as number,
          width: 10,
          height: 10,
          fill: "",
          stroke: "gray",
          strokeDashArray: [2.5, 2.5],
          angle:
            (Math.acos((disBC * disBC + disAC * disAC - disAB * disAB) / (2 * disAC * disBC)) *
              180) /
              Math.PI +
            90,
        });
      }
      if (pointp.y < pointC.y && pointp.x > pointA.x) {
        angleY.set({
          left: pointY.x as number,
          top: pointY.y as number,
          width: 10,
          height: 10,
          fill: "",
          stroke: "gray",
          strokeDashArray: [2.5, 2.5],
          angle:
            (Math.acos((disBC * disBC + disAC * disAC - disAB * disAB) / (2 * disAC * disBC)) *
              180) /
              Math.PI +
            270,
        });
      }
      if (pointp.y > pointA.y && pointp.x < pointC.x && pointZ.x < pointA.x) {
        angleY.set({
          left: pointY.x as number,
          top: pointY.y as number,
          width: 10,
          height: 10,
          fill: "",
          stroke: "gray",
          strokeDashArray: [2.5, 2.5],
          angle:
            (Math.acos((disBC * disBC + disAC * disAC - disAB * disAB) / (2 * disAC * disBC)) *
              180) /
              Math.PI +
            90,
        });
      }
      if (pointZ.y < pointA.y) {
        angleZ.set({
          left: pointZ.x as number,
          top: pointZ.y as number,
          width: 10,
          height: 10,
          fill: "",
          stroke: "gray",
          strokeDashArray: [2.5, 2.5],
          angle:
            (Math.acos((disBC * disBC + disAB * disAB - disAC * disAC) / (2 * disAB * disBC)) *
              180) /
              Math.PI +
            300,
        });
      }
      if (pointZ.y >= pointB.y) {
        angleZ.set({
          left: pointZ.x as number,
          top: pointZ.y as number,
          width: 10,
          height: 10,
          fill: "",
          stroke: "gray",
          strokeDashArray: [2.5, 2.5],
          angle:
            (Math.acos((disBC * disBC + disAB * disAB - disAC * disAC) / (2 * disAB * disBC)) *
              180) /
              Math.PI +
            210,
        });
      }
      if (pointZ.y >= pointA.y && pointZ.y < pointB.y && pointp.x > pointA.x) {
        angleZ.set({
          left: pointZ.x as number,
          top: pointZ.y as number,
          width: 10,
          height: 10,
          fill: "",
          stroke: "gray",
          strokeDashArray: [2.5, 2.5],
          angle:
            (Math.acos((disBC * disBC + disAB * disAB - disAC * disAC) / (2 * disAB * disBC)) *
              180) /
              Math.PI +
            210,
        });
      }
      if (pointZ.y >= pointA.y && pointZ.y < pointB.y && pointp.x <= pointA.x) {
        angleZ.set({
          left: pointZ.x as number,
          top: pointZ.y as number,
          width: 10,
          height: 10,
          fill: "",
          stroke: "gray",
          strokeDashArray: [2.5, 2.5],
          angle:
            -(
              (Math.acos((disBC * disBC + disAB * disAB - disAC * disAC) / (2 * disAB * disBC)) *
                180) /
              Math.PI
            ) - 180,
        });
      }
      const slope = calculateSlope(pointX, pointZ);
      if (!isFinite(slope)) {
        lineSimson.set({
          x1: pointZ.x,
          y1: 0,
          x2: pointZ.x,
          y2: CANVAS_HEIGHT,
          strokeWidth: 2.5,
          stroke: "red",
        });
        // (2) When length between 2 points = 0, set slope = 0
      } else if (isNaN(slope)) {
        lineSimson.set({
          x1: 0,
          y1: pointZ.y,
          x2: CANVAS_WIDTH,
          y2: pointZ.y,
          strokeWidth: 2.5,
          stroke: "red",
        });
        // (3) Else, draw the line using linear equations with slope and midpoint1
      } else {
        lineSimson.set({
          x1: 0,
          y1: -slope * pointZ.x + pointZ.y - 0.75,
          x2: CANVAS_WIDTH,
          y2: slope * (CANVAS_WIDTH - pointZ.x) + pointZ.y - 0.75,
          strokeWidth: 2.5,
          stroke: "red",
        });
      }
    };

    canvas.on("object:moving", onPointMove);

    const pointM = pointP.left as number;
    const pointN = pointP.top as number;
    pointP.set({
      originX: "center",
      originY: "center",
      radius: 3,
      fill: "black",
    });
    const pointp = new fabric.Point(pointM, pointN);
    const pointY = getPedalPoint(pointp, pointA, pointC);
    const pointX = getPedalPoint(pointp, pointC, pointB);
    const pointZ = getPedalPoint(pointp, pointA, pointB);
    pLabel.set({
      left: (pointP.left as number) + 10,
      top: (pointP.top as number) + 5,
      fill: "green",
    });
    xLabel.set({
      left: pointX.x - 25,
      top: pointX.y,
      fill: "green",
    });
    yLabel.set({
      left: pointY.x - 25,
      top: pointY.y - 10,
      fill: "green",
    });
    zLabel.set({
      left: pointZ.x - 25,
      top: pointZ.y - 10,
      fill: "green",
    });
    linePY.set({
      originY: "center",
      originX: "center",
      x1: pointp.x,
      y1: pointp.y,
      x2: pointY.x,
      y2: pointY.y,
      strokeWidth: 2.5,
      stroke: "blue",
    });
    linePX.set({
      originY: "center",
      originX: "center",
      x1: pointp.x,
      y1: pointp.y,
      x2: pointX.x,
      y2: pointX.y,
      strokeWidth: 2.5,
      stroke: "purple",
    });
    linePZ.set({
      originY: "center",
      originX: "center",
      x1: pointp.x,
      y1: pointp.y,
      x2: pointZ.x,
      y2: pointZ.y,
      strokeWidth: 2.5,
      stroke: "green",
    });
    lineAZ.set({
      x1: pointA.x,
      y1: pointA.y,
      x2: pointZ.x,
      y2: pointZ.y,
      strokeDashArray: [5, 5],
      stroke: "gray",
    });
    lineBZ.set({
      x1: pointB.x,
      y1: pointB.y,
      x2: pointZ.x,
      y2: pointZ.y,
      strokeDashArray: [5, 5],
      stroke: "gray",
    });
    lineBX.set({
      x1: pointB.x,
      y1: pointB.y,
      x2: pointX.x,
      y2: pointX.y,
      strokeDashArray: [5, 5],
      stroke: "gray",
    });
    lineCX.set({
      x1: pointC.x,
      y1: pointC.y,
      x2: pointX.x,
      y2: pointX.y,
      strokeDashArray: [5, 5],
      stroke: "gray",
    });
    lineAY.set({
      x1: pointA.x,
      y1: pointA.y,
      x2: pointY.x,
      y2: pointY.y,
      strokeDashArray: [5, 5],
      stroke: "gray",
    });
    lineCY.set({
      x1: pointC.x,
      y1: pointC.y,
      x2: pointY.x,
      y2: pointY.y,
      strokeDashArray: [5, 5],
      stroke: "gray",
    });
    const slope = calculateSlope(pointX, pointZ);
    if (!isFinite(slope)) {
      lineSimson.set({
        x1: pointZ.x,
        y1: 0,
        x2: pointZ.x,
        y2: CANVAS_HEIGHT,
        strokeWidth: 2.5,
        stroke: "red",
      });
      // (2) When length between 2 points = 0, set slope = 0
    } else if (isNaN(slope)) {
      lineSimson.set({
        x1: 0,
        y1: pointZ.y,
        x2: CANVAS_WIDTH,
        y2: pointZ.y,
        strokeWidth: 2.5,
        stroke: "red",
      });
      // (3) Else, draw the line using linear equations with slope and midpoint1
    } else {
      lineSimson.set({
        x1: 0,
        y1: -slope * pointZ.x + pointZ.y - 0.75,
        x2: CANVAS_WIDTH,
        y2: slope * (CANVAS_WIDTH - pointZ.x) + pointZ.y - 0.75,
        strokeWidth: 2.5,
        stroke: "red",
      });
    }
    angleX.set({
      left: pointX.x as number,
      top: pointX.y as number,
      width: 10,
      height: 10,
      fill: "",
      stroke: "gray",
      strokeDashArray: [2.5, 2.5],
      angle: -90,
    });
    angleY.set({
      left: pointY.x as number,
      top: pointY.y as number,
      width: 10,
      height: 10,
      fill: "",
      stroke: "gray",
      strokeDashArray: [2.5, 2.5],
      angle:
        (Math.acos((disBC * disBC + disAC * disAC - disAB * disAB) / (2 * disAC * disBC)) * 180) /
          Math.PI +
        270,
    });
    angleZ.set({
      left: pointZ.x as number,
      top: pointZ.y as number,
      width: 10,
      height: 10,
      fill: "",
      stroke: "gray",
      strokeDashArray: [2.5, 2.5],
      angle:
        (Math.acos((disBC * disBC + disAB * disAB - disAC * disAC) / (2 * disAB * disBC)) * 180) /
          Math.PI +
        300,
    });
    canvas.add(aLabel, bLabel, cLabel, pLabel, xLabel, yLabel, zLabel);
    canvas.add(
      lineAB,
      lineAC,
      lineBC,
      linePX,
      linePY,
      linePZ,
      lineAZ,
      lineBZ,
      lineAY,
      lineCY,
      lineBX,
      lineCX,
      lineSimson
    );
    canvas.add(circumCircle);
    canvas.add(angleX, angleY, angleZ);
    canvas.add(pointP);
  },
});
</script>
