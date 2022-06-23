<template>
  <TopicMeta :topic="topic" />
  <div id="morley-wrapper">
    <ATypographyTitle :level="4">Animated Euler Line</ATypographyTitle>
    <canvas id="euler-line-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { makeCircle, makeLabel, makeLine, makeMovablePolygon } from "@/utils/canvas";
import { calculateCircumcenter, calculateDistanceBetweenTwoPoints, calculateMidpoint, calculateOrthocenter, calculateSlope, calculateThreeAngles, getPedalPoint, trilinearToCartesian } from "@/utils/geometry";

const topic = indexTopicMap.get(12) as Topic;

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("euler-line-canvas", {
      selection: false,
    });

    // create line objects
    const heightOnAB = makeLine();
    const heightOnBC = makeLine();
    const heightOnAC = makeLine();

    const linePQ = makeLine();
    const lineQR = makeLine();
    const linePR = makeLine();
    const lineAP = makeLine();
    const lineBQ = makeLine();
    const lineCR = makeLine();
    const lineOP = makeLine();
    const lineOQ = makeLine();
    const lineOR = makeLine();

    const auxiliaryLineAB = makeLine();
    const auxiliaryLineBC = makeLine();
    const auxiliaryLineAC = makeLine();

    const eulerLine = makeLine();

    // create nodes
    const hNode = makeCircle();
    const gNode = makeCircle();
    const oNode = makeCircle();
    const nNode = makeCircle();

    // create labels
    const aLabel = makeLabel("A");
    const bLabel = makeLabel("B");
    const cLabel = makeLabel("C");
    const pLabel = makeLabel("P");
    const qLabel = makeLabel("Q");
    const rLabel = makeLabel("R");
    const hLabel = makeLabel("H");
    const gLabel = makeLabel("G");
    const oLabel = makeLabel("O");
    const nLabel = makeLabel("N");

    // create circle
    const circumCircle = makeCircle();

    // create movable triangle
    const triangle = makeMovablePolygon(
      // set vertices
      [
        {
          x: 200,
          y: 50,
        },
        {
          x: 50,
          y: 300,
        },
        {
          x: 450,
          y: 300,
        },
      ],
      function (coords: Array<fabric.Point>) {
        // set labels for triangle vertices
        aLabel.set({
          left: coords[0].x - 10,
          top: coords[0].y - 35,
        });
        bLabel.set({
          left: coords[1].x - 25,
          top: coords[1].y + 5,
        });
        cLabel.set({
          left: coords[2].x + 10,
          top: coords[2].y + 5,
        });
        // calculate midpoints of three sides of triangle
        const midPointAB = calculateMidpoint(coords[0], coords[1]);
        const midPointBC = calculateMidpoint(coords[1], coords[2]);
        const midPointAC = calculateMidpoint(coords[0], coords[2]);
        // set labels for midpoints
        pLabel.set({
          left: midPointBC.x - 5,
          top: midPointBC.y + 5,
          fontSize: 18,
        });
        qLabel.set({
          left: midPointAC.x + 10,
          top: midPointAC.y - 15,
          fontSize: 18,
        });
        rLabel.set({
          left: midPointAB.x - 25,
          top: midPointAB.y - 15,
          fontSize: 18,
        });
        // set lines for three midpoints
        linePQ.set({
          x1: midPointBC.x,
          y1: midPointBC.y,
          x2: midPointAC.x,
          y2: midPointAC.y,
        });
        lineQR.set({
          x1: midPointAC.x,
          y1: midPointAC.y,
          x2: midPointAB.x,
          y2: midPointAB.y,
        });
        linePR.set({
          x1: midPointBC.x,
          y1: midPointBC.y,
          x2: midPointAB.x,
          y2: midPointAB.y,
        });

        // calculate four centers of the triangle
        const circumcenter = calculateCircumcenter(coords[0], coords[1], coords[2]);
        const orthocenter = calculateOrthocenter(coords[0], coords[1], coords[2]);
        const angles = calculateThreeAngles(coords[0], coords[1], coords[2])
        const centroid = trilinearToCartesian(coords[0], coords[1], coords[2], 1 / Math.sin(angles.x), 1 / Math.sin(angles.y), 1 / Math.sin(angles.z));
        const ninePointCenter = trilinearToCartesian(coords[0], coords[1], coords[2], Math.cos(angles.y - angles.z), Math.cos(angles.z - angles.x), Math.cos(angles.x - angles.y))

        // set nodes for four centers
        oNode.set({
          left: circumcenter.x - 0.75 * 3,
          top: circumcenter.y - 0.75 * 3,
          radius: 2,
          fill: "purple",
          stroke: "purple",
        });
        gNode.set({
          left: centroid.x - 0.75 * 3,
          top: centroid.y - 0.75 * 3,
          radius: 2,
          fill: "green"
        });
        hNode.set({
          left: orthocenter.x - 0.75 * 3,
          top: orthocenter.y - 0.75 * 3,
          radius: 2,
          fill: "blue"
        });
        nNode.set({
          left: ninePointCenter.x - 0.75 * 3,
          top: ninePointCenter.y - 0.75 * 3,
          radius: 2,
          fill: "red"
        });
        //set labels for four centers
        oLabel.set({
          left: circumcenter.x,
          top: circumcenter.y,
          fontSize: 18,
          fill: "purple"
        });
        gLabel.set({
          left: centroid.x,
          top: centroid.y,
          fontSize: 18,
          fill: "green"
        });
        hLabel.set({
          left: orthocenter.x,
          top: orthocenter.y,
          fontSize: 18,
          fill: "blue"
        });
        nLabel.set({
          left: ninePointCenter.x,
          top: ninePointCenter.y,
          fontSize: 18,
          fill: "red"
        });

        // set lines for circumcenter
        lineOP.set({
          x1: circumcenter.x,
          y1: circumcenter.y,
          x2: midPointBC.x,
          y2: midPointBC.y,
          stroke: "purple"
        });
        lineOQ.set({
          x1: circumcenter.x,
          y1: circumcenter.y,
          x2: midPointAC.x,
          y2: midPointAC.y,
          stroke: "purple"
        });
        lineOR.set({
          x1: circumcenter.x,
          y1: circumcenter.y,
          x2: midPointAB.x,
          y2: midPointAB.y,
          stroke: "purple"
        });

        // set lines for centroid
        lineAP.set({
          x1: coords[0].x,
          y1: coords[0].y,
          x2: midPointBC.x,
          y2: midPointBC.y,
          stroke: "green"
        });
        lineBQ.set({
          x1: coords[1].x,
          y1: coords[1].y,
          x2: midPointAC.x,
          y2: midPointAC.y,
          stroke: "green"
        });
        lineCR.set({
          x1: coords[2].x,
          y1: coords[2].y,
          x2: midPointAB.x,
          y2: midPointAB.y,
          stroke: "green"
        });

        // calculate the coordinates for the feet of the triangle's vertices
        const pedalPointOnAB = getPedalPoint(coords[2], coords[0], coords[1]);
        const pedalPointOnBC = getPedalPoint(coords[0], coords[1], coords[2]);
        const pedalPointOnAC = getPedalPoint(coords[1], coords[0], coords[2]);
        // set lines for orthocenter
        heightOnAB.set({
          x1: coords[2].x,
          y1: coords[2].y,
          x2: pedalPointOnAB.x,
          y2: pedalPointOnAB.y,
          stroke: "blue"
        });
        heightOnBC.set({
          x1: coords[0].x,
          y1: coords[0].y,
          x2: pedalPointOnBC.x,
          y2: pedalPointOnBC.y,
          stroke: "blue"
        });
        heightOnAC.set({
          x1: coords[1].x,
          y1: coords[1].y,
          x2: pedalPointOnAC.x,
          y2: pedalPointOnAC.y,
          stroke: "blue"
        });
        if (pedalPointOnAB.y < coords[0].y) {
          auxiliaryLineAB.set({
            x1: coords[0].x,
            y1: coords[0].y,
            x2: pedalPointOnAB.x,
            y2: pedalPointOnAB.y,
            strokeDashArray: [5, 5],
            stroke: "blue",
          });
          auxiliaryLineAC.set({
            x1: coords[0].x,
            y1: coords[0].y,
            x2: pedalPointOnAC.x,
            y2: pedalPointOnAC.y,
            strokeDashArray: [5, 5],
            stroke: "blue",
          });
        }
        if (pedalPointOnBC.x < coords[1].x) {
          auxiliaryLineBC.set({
            x1: coords[1].x,
            y1: coords[1].y,
            x2: pedalPointOnBC.x,
            y2: pedalPointOnBC.y,
            strokeDashArray: [5, 5],
            stroke: "blue",
          });
          auxiliaryLineAB.set({
            x1: coords[1].x,
            y1: coords[1].y,
            x2: pedalPointOnAB.x,
            y2: pedalPointOnAB.y,
            strokeDashArray: [5, 5],
            stroke: "blue",
          });
        }
        if (pedalPointOnAC.x > coords[2].x) {
          auxiliaryLineAC.set({
            x1: coords[2].x,
            y1: coords[2].y,
            x2: pedalPointOnAC.x,
            y2: pedalPointOnAC.y,
            strokeDashArray: [5, 5],
            stroke: "blue",
          });
          auxiliaryLineBC.set({
            x1: coords[2].x,
            y1: coords[2].y,
            x2: pedalPointOnBC.x,
            y2: pedalPointOnBC.y,
            strokeDashArray: [5, 5],
            stroke: "blue",
          });
        }

        // set circle for circumcenter
        const circumCircleRadius = calculateDistanceBetweenTwoPoints(coords[0], circumcenter);
        circumCircle.set({
          originX: "center",
          originY: "center",
          left: circumcenter.x,
          top: circumcenter.y,
          radius: circumCircleRadius,
          strokeDashArray: [5, 5],
          stroke: "purple",
        })

        // set euler line
        const eulerLineSlope = calculateSlope(orthocenter, circumcenter);
        if (isNaN(eulerLineSlope)) {
          eulerLine.set({
            x1: 0,
            y1: orthocenter.y,
            x2: canvas.getWidth(),
            y2: orthocenter.y,
            stroke: "orange",
            strokeWidth: 3,
          })
        } else if (!isFinite(eulerLineSlope)) {
          eulerLine.set({
            x1: orthocenter.x,
            y1: 0,
            x2: orthocenter.x,
            y2: canvas.getHeight(),
            stroke: "orange",
            strokeWidth: 3,
          })
        } else {
          eulerLine.set({
            x1: 0,
            y1: -eulerLineSlope * orthocenter.x + orthocenter.y,
            x2: canvas.getWidth(),
            y2: eulerLineSlope * (canvas.getWidth() - orthocenter.x) + orthocenter.y,
            stroke: "orange",
            strokeWidth: 3,
          })
        }
      }
    );

    canvas.add(triangle);
    canvas.add(aLabel);
    canvas.add(bLabel);
    canvas.add(cLabel);
    canvas.add(pLabel);
    canvas.add(qLabel);
    canvas.add(rLabel);
    canvas.add(linePQ);
    canvas.add(lineQR);
    canvas.add(linePR);
    canvas.add(oNode);
    canvas.add(gNode);
    canvas.add(hNode);
    canvas.add(nNode);
    canvas.add(oLabel);
    canvas.add(gLabel);
    canvas.add(hLabel);
    canvas.add(nLabel);
    canvas.add(lineOP);
    canvas.add(lineOQ);
    canvas.add(lineOR);
    canvas.add(lineAP);
    canvas.add(lineBQ);
    canvas.add(lineCR);
    canvas.add(heightOnAB);
    canvas.add(heightOnBC);
    canvas.add(heightOnAC);
    canvas.add(auxiliaryLineAB);
    canvas.add(auxiliaryLineBC);
    canvas.add(auxiliaryLineAC);
    canvas.add(circumCircle)
    canvas.add(eulerLine);
  }
});
</script>
