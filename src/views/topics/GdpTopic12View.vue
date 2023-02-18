<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>

  </ATypographyParagraph>
  <div id="euler-line-wrapper">
    <ATypographyTitle :level="4">Animated Euler Line</ATypographyTitle>
    <canvas id="euler-line-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { calculateThreeAngles, circleLineIntersection, getPedalPoint, solveLinearEquation, trilinearToCartesian } from "@/utils/geometry";

const topic = indexTopicMap.get(12) as Topic;

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("euler-line-canvas", {
      selection: false,
    });

    function createCircle(x?: number, y?: number, radius?: number, fill?: string): fabric.Circle {
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

    function createPolygon(vertices?: fabric.Point[]): fabric.Polygon {
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

    function createLabel(text: string, fontSize?: number, color?: string) {
      return new fabric.Text(text, {
        hasControls: false,
        hasBorders: false,
        evented: false,
        fontSize: fontSize || 24,
        fill: color || "black"
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

    const vertexA = createCircle(178, 113, 3).set({ evented: true, fill:"black", padding: 20});
    const vertexB = createCircle(55, 330, 3).set({ evented: true, fill:"black", padding: 20 });
    const vertexC = createCircle(355, 331, 3).set({ evented:true, fill:"black", padding: 20 });

    const triangle = createPolygon();
    const midPointTriangle = createPolygon();

    const oNode = createCircle(0, 0, 2, "purple");
    const hNode = createCircle(0, 0, 2, "blue");
    const gNode = createCircle(0, 0, 2, "green");
    const nNode = createCircle(0, 0, 2, "red");

    const heightOnAB = createLine([], "blue");
    const heightOnBC = createLine([], "blue");
    const heightOnAC = createLine([], "blue");

    const medianAP = createLine([], "green");
    const medianBQ = createLine([], "green");
    const medianCR = createLine([], "green");

    const perpendicularBisectorOnAB = createLine([], "purple");
    const perpendicularBisectorOnBC = createLine([], "purple");
    const perpendicularBisectorOnAC = createLine([], "purple");

    const auxiliaryLineAB = createLine([], "blue");
    const auxiliaryLineBC = createLine([], "blue");
    const auxiliaryLineAC = createLine([], "blue");

    const extendedLineAH = createLine([], "blue");
    const extendedLineBH = createLine([], "blue");
    const extendedLineCH = createLine([], "blue");

    const aLabel = createLabel("A");
    const bLabel = createLabel("B");
    const cLabel = createLabel("C");
    const pLabel = createLabel("P", 18);
    const qLabel = createLabel("Q", 18);
    const rLabel = createLabel("R", 18);
    const oLabel = createLabel("O", 18, "purple");
    const hLabel = createLabel("H", 18, "blue");
    const gLabel = createLabel("G", 18, "green");
    const nLabel = createLabel("N", 18, "red");

    const circumCircle = createCircle();
    const eulerLine = createLine([], "orange", 3);

    const boundaryCircle = createCircle(250, 250, 220);

    function moveVertices() {
      const vertices = [
        new fabric.Point(vertexA.left as number, vertexA.top as number),
        new fabric.Point(vertexB.left as number, vertexB.top as number),
        new fabric.Point(vertexC.left as number, vertexC.top as number),
      ];

      triangle.set({
        points: vertices,
      });
      aLabel.set({
        left: vertices[0].x - 10,
        top: vertices[0].y - 35,
      });
      bLabel.set({
        left: vertices[1].x - 25,
        top: vertices[1].y - 5,
      });
      cLabel.set({
        left: vertices[2].x + 10,
        top: vertices[2].y - 5,
      });

      const midPointAB = vertices[0].midPointFrom(vertices[1]);
      const midPointBC = vertices[1].midPointFrom(vertices[2]);
      const midPointAC = vertices[0].midPointFrom(vertices[2]);
      midPointTriangle.set({
        points: [
          new fabric.Point(midPointAB.x, midPointAB.y),
          new fabric.Point(midPointBC.x, midPointBC.y),
          new fabric.Point(midPointAC.x, midPointAC.y),
        ],
        strokeWidth: 1,
      });
      rLabel.set({
        left: midPointAB.x - 25,
        top: midPointAB.y - 15,
      });
      pLabel.set({
        left: midPointBC.x - 5,
        top: midPointBC.y + 5,
      });
      qLabel.set({
        left: midPointAC.x + 10,
        top: midPointAC.y - 15,
      });

      const angles = calculateThreeAngles(vertices[0], vertices[1], vertices[2]);
      const circumcenter = trilinearToCartesian(vertices[0], vertices[1], vertices[2], Math.cos(angles.x), Math.cos(angles.y), Math.cos(angles.z));
      const orthocenter = trilinearToCartesian(vertices[0], vertices[1], vertices[2], 1 / Math.cos(angles.x), 1 / Math.cos(angles.y), 1 / Math.cos(angles.z));
      const centroid = trilinearToCartesian(vertices[0], vertices[1], vertices[2], 1 / Math.sin(angles.x), 1 / Math.sin(angles.y), 1 / Math.sin(angles.z));
      const ninePointCenter = trilinearToCartesian(vertices[0], vertices[1], vertices[2], Math.cos(angles.y - angles.z), Math.cos(angles.z - angles.x), Math.cos(angles.x - angles.y));

      oNode.set({
        left: circumcenter.x,
        top: circumcenter.y,
      });
      hNode.set({
        left: orthocenter.x,
        top: orthocenter.y,
      });
      gNode.set({
        left: centroid.x,
        top: centroid.y,
      });
      nNode.set({
        left: ninePointCenter.x,
        top: ninePointCenter.y,
      });
      oLabel.set({
        left: circumcenter.x,
        top: circumcenter.y,
      });
      gLabel.set({
        left: centroid.x,
        top: centroid.y,
      });
      hLabel.set({
        left: orthocenter.x,
        top: orthocenter.y,
      });
      nLabel.set({
        left: ninePointCenter.x,
        top: ninePointCenter.y,
      });

      perpendicularBisectorOnAB.set({
        x1: circumcenter.x,
        y1: circumcenter.y,
        x2: midPointAB.x,
        y2: midPointAB.y,
      });
      perpendicularBisectorOnBC.set({
        x1: circumcenter.x,
        y1: circumcenter.y,
        x2: midPointBC.x,
        y2: midPointBC.y,
      });
      perpendicularBisectorOnAC.set({
        x1: circumcenter.x,
        y1: circumcenter.y,
        x2: midPointAC.x,
        y2: midPointAC.y,
      });

      medianAP.set({
        x1: vertices[0].x,
        y1: vertices[0].y,
        x2: midPointBC.x,
        y2: midPointBC.y,
      });
      medianBQ.set({
        x1: vertices[1].x,
        y1: vertices[1].y,
        x2: midPointAC.x,
        y2: midPointAC.y,
      });
      medianCR.set({
        x1: vertices[2].x,
        y1: vertices[2].y,
        x2: midPointAB.x,
        y2: midPointAB.y,
      });

      const pedalPointOnAB = getPedalPoint(vertices[2], vertices[0], vertices[1]);
      const pedalPointOnBC = getPedalPoint(vertices[0], vertices[1], vertices[2]);
      const pedalPointOnAC = getPedalPoint(vertices[1], vertices[0], vertices[2]);
      heightOnAB.set({
        x1: vertices[2].x,
        y1: vertices[2].y,
        x2: pedalPointOnAB.x,
        y2: pedalPointOnAB.y,
      });
      heightOnBC.set({
        x1: vertices[0].x,
        y1: vertices[0].y,
        x2: pedalPointOnBC.x,
        y2: pedalPointOnBC.y,
      });
      heightOnAC.set({
        x1: vertices[1].x,
        y1: vertices[1].y,
        x2: pedalPointOnAC.x,
        y2: pedalPointOnAC.y,
      });

      extendedLineAH.set({
        x1: vertices[0].x,
        y1: vertices[0].y,
        x2: orthocenter.x,
        y2: orthocenter.y,
      });
      extendedLineBH.set({
        x1: vertices[1].x,
        y1: vertices[1].y,
        x2: orthocenter.x,
        y2: orthocenter.y,
      });
      extendedLineCH.set({
        x1: vertices[2].x,
        y1: vertices[2].y,
        x2: orthocenter.x,
        y2: orthocenter.y,
      });

      auxiliaryLineAB.set({
        x1: vertices[0].x,
        y1: vertices[0].y,
        x2: pedalPointOnAB.x,
        y2: pedalPointOnAB.y,
        strokeDashArray: [5, 5],
      });
      auxiliaryLineAC.set({
        x1: vertices[2].x,
        y1: vertices[2].y,
        x2: pedalPointOnAC.x,
        y2: pedalPointOnAC.y,
        strokeDashArray: [5, 5],
      });
      auxiliaryLineBC.set({
        x1: vertices[1].x,
        y1: vertices[1].y,
        x2: pedalPointOnBC.x,
        y2: pedalPointOnBC.y,
        strokeDashArray: [5, 5],
      });

      const circumCircleRadius = vertices[0].distanceFrom(circumcenter);
      circumCircle.set({
        left: circumcenter.x,
        top: circumcenter.y,
        radius: circumCircleRadius,
        strokeDashArray: [5, 5],
        stroke: "purple",
      });

      const eulerLineLinearEquation = solveLinearEquation(orthocenter, circumcenter);
      const intersections = circleLineIntersection(220, 250, 250, eulerLineLinearEquation.m, eulerLineLinearEquation.b);
      eulerLine.set({
        x1: intersections[0][0],
        y1: intersections[0][1],
        x2: intersections[1][0],
        y2: intersections[1][1],
      });
    }

    moveVertices();

    canvas.on("object:moving", moveVertices);

    canvas.add(auxiliaryLineAB);
    canvas.add(auxiliaryLineBC);
    canvas.add(auxiliaryLineAC);
    canvas.add(triangle);
    canvas.add(vertexA);
    canvas.add(vertexB);
    canvas.add(vertexC);
    canvas.add(midPointTriangle);
    canvas.add(perpendicularBisectorOnAB);
    canvas.add(perpendicularBisectorOnBC);
    canvas.add(perpendicularBisectorOnAC);
    canvas.add(medianAP);
    canvas.add(medianBQ);
    canvas.add(medianCR);
    canvas.add(heightOnAB);
    canvas.add(heightOnBC);
    canvas.add(heightOnAC);
    canvas.add(extendedLineAH);
    canvas.add(extendedLineBH);
    canvas.add(extendedLineCH);
    canvas.add(circumCircle);
    canvas.add(aLabel);
    canvas.add(bLabel);
    canvas.add(cLabel);
    canvas.add(pLabel);
    canvas.add(qLabel);
    canvas.add(rLabel);
    canvas.add(boundaryCircle);
    canvas.add(eulerLine);
    canvas.add(oNode);
    canvas.add(hNode);
    canvas.add(gNode);
    canvas.add(nNode);
    canvas.add(oLabel);
    canvas.add(hLabel);
    canvas.add(gLabel);
    canvas.add(nLabel);
  }
});
</script>
