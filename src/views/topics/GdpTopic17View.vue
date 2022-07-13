<template>
  <TopicMeta :topic="topic" />
  <div id="morley-wrapper">
    <ATypographyTitle :level="4">Animated Lemonine Circles</ATypographyTitle>
    <canvas id="lemonine-circle-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import {
  calculateCircumcenter,
  trilinearToCartesian,
  calculateThreeAngles,
  calculateSlope,
  calculateLineIntersectInPoints,
  calculateDistanceBetweenTwoPoints,
} from "@/utils/geometry";

const topic = indexTopicMap.get(17) as Topic;

function calcSlope(pt1: fabric.Point, pt2: fabric.Point): number {
  const a1 = pt1.y - pt2.y;
  const a2 = pt1.x - pt2.x;
  let k;

  if (pt1.x === pt2.x) {
    return 0;
  } else if (Math.abs(a1) < Math.abs(a2)) {
    return (k = (pt1.y - pt2.y) / (pt1.x - pt2.x));
  } else {
    return (k = (pt1.x - pt2.x) / (pt1.y - pt2.y));
  }
}

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("lemonine-circle-canvas", {
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

    function createPolygon(vertices?: Array<fabric.Point>): fabric.Polygon {
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
        fill: color || "black",
      });
    }

    function createLine(points?: number[], color?: string, strokeWidth?: number) {
      return new fabric.Line(points || [], {
        hasControls: false,
        hasBorders: false,
        evented: false,
        stroke: color || "black",
        strokeWidth: strokeWidth || 1,
      });
    }

    const vertexA = createCircle(175, 75, 10).set({ evented: true });
    const vertexB = createCircle(75, 350, 10).set({ evented: true });
    const vertexC = createCircle(400, 400, 10).set({ evented: true });

    const triangle = createPolygon();

    const dNode = createCircle(0, 0, 2, "black");
    const eNode = createCircle(0, 0, 2, "blown-white");
    const fNode = createCircle(0, 0, 2, "pink");
    const gNode = createCircle(0, 0, 2, "green");
    const hNode = createCircle(0, 0, 2, "blue");
    const iNode = createCircle(0, 0, 2, "purple");

    // Symmedian point
    const kNode = createCircle(0, 0, 2, "red");

    // Create three lines parallering sides of Triangle
    const parallelToBC = createLine([]);
    const parallelToCA = createLine([]);
    const parallelToAB = createLine([]);

    const lineP2Q3 = createLine([], "black", 1.5);
    const lineP3Q1 = createLine([], "black", 1.5);
    const lineP1Q2 = createLine([], "black", 1.5);

    const lineAB = createLine([], "black");
    const lineBC = createLine([], "black");
    const lineCA = createLine([], "black");

    const lemonieCircle = createCircle();

    const aLabel = createLabel("A");
    const bLabel = createLabel("B");
    const cLabel = createLabel("C");
    const dLabel = createLabel("D");
    const eLabel = createLabel("E");
    const fLabel = createLabel("F");
    const gLabel = createLabel("G");
    const hLabel = createLabel("H");
    const iLabel = createLabel("I");
    const kLabel = createLabel("K");

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

      // calculate the angles of the triangle
      const angles = calculateThreeAngles(vertices[0], vertices[1], vertices[2]);
      const symmedianPoint = trilinearToCartesian(
        vertices[0],
        vertices[1],
        vertices[2],
        Math.sin(angles.x),
        Math.sin(angles.y),
        Math.sin(angles.z)
      );

      const slopeBC = calculateSlope(vertices[1], vertices[2]);
      const slopeCA = calculateSlope(vertices[2], vertices[0]);
      const slopeAB = calculateSlope(vertices[1], vertices[0]);
      console.log("slopeAB", slopeAB);
      console.log("slopeBC", slopeBC);
      console.log("slopeCA", slopeCA);

      parallelToBC.set({
        x1: canvas.getWidth(),
        y1: slopeBC * (canvas.getWidth() - symmedianPoint.x) + symmedianPoint.y,
        x2: (canvas.getWidth() - symmedianPoint.y) / slopeBC + symmedianPoint.x,
        y2: canvas.getWidth(),
      });

      parallelToCA.set({
        x1: canvas.getWidth(),
        y1: slopeCA * (canvas.getWidth() - symmedianPoint.x) + symmedianPoint.y,
        x2: (canvas.getWidth() - symmedianPoint.y) / slopeCA + symmedianPoint.x,
        y2: canvas.getWidth(),
      });

      parallelToAB.set({
        x1: canvas.getWidth(),
        y1: slopeAB * (canvas.getWidth() - symmedianPoint.x) + symmedianPoint.y,
        x2: (canvas.getWidth() - symmedianPoint.y) / slopeAB + symmedianPoint.x,
        y2: canvas.getWidth(),
      });

      lineAB.set({
        x1: vertices[0].x,
        y1: vertices[0].y,
        x2: vertices[1].x,
        y2: vertices[1].y,
      });
      lineBC.set({
        x1: vertices[1].x,
        y1: vertices[1].y,
        x2: vertices[2].x,
        y2: vertices[2].y,
      });
      lineCA.set({
        x1: vertices[2].x,
        y1: vertices[2].y,
        x2: vertices[0].x,
        y2: vertices[0].y,
      });

      const p1 = calculateLineIntersectInPoints(parallelToAB, lineBC);
      const p2 = calculateLineIntersectInPoints(parallelToBC, lineCA);
      const p3 = calculateLineIntersectInPoints(parallelToCA, lineAB);

      if (p1 && p2 && p3 !== null) {
        dNode.set({
          left: p1.x,
          top: p1.y,
        });
        dLabel.set({
          left: p1.x - 10,
          top: p1.y - 35,
        });
        fNode.set({
          left: p2.x,
          top: p2.y,
        });
        fLabel.set({
          left: p2.x - 10,
          top: p2.y - 35,
        });
        hNode.set({
          left: p3.x,
          top: p3.y,
        });
        hLabel.set({
          left: p3.x - 10,
          top: p3.y - 35,
        });
      }

      const q1 = calculateLineIntersectInPoints(parallelToCA, lineBC);
      const q2 = calculateLineIntersectInPoints(parallelToAB, lineCA);
      const q3 = calculateLineIntersectInPoints(parallelToBC, lineAB);

      if (q1 && q2 && q3 !== null) {
        eNode.set({
          left: q1.x,
          top: q1.y,
        });
        eLabel.set({
          left: q1.x - 10,
          top: q1.y - 35,
        });
        gNode.set({
          left: q2.x,
          top: q2.y,
        });
        gLabel.set({
          left: q2.x - 10,
          top: q2.y - 35,
        });
        iNode.set({
          left: q3.x,
          top: q3.y,
        });
        iLabel.set({
          left: q3.x - 10,
          top: q3.y - 35,
        });

        const verticesP = [
          new fabric.Point(dNode.left as number, dNode.top as number),
          new fabric.Point(fNode.left as number, fNode.top as number),
          new fabric.Point(hNode.left as number, hNode.top as number),
        ];

        const lemonieCircleCenter = calculateCircumcenter(verticesP[0], verticesP[1], verticesP[2]);
        const lemonieCircleRadius = calculateDistanceBetweenTwoPoints(
          verticesP[0],
          lemonieCircleCenter
        );

        lemonieCircle.set({
          originX: "center",
          originY: "center",
          left: lemonieCircleCenter.x,
          top: lemonieCircleCenter.y,
          radius: lemonieCircleRadius,
          stroke: "blue",
          strokeWidth: 2,
        });
      }

      lineP2Q3.set({
        x1: fNode.left,
        y1: fNode.top,
        x2: iNode.left,
        y2: iNode.top,
      });

      lineP3Q1.set({
        x1: hNode.left,
        y1: hNode.top,
        x2: eNode.left,
        y2: eNode.top,
      });

      lineP1Q2.set({
        x1: dNode.left,
        y1: dNode.top,
        x2: gNode.left,
        y2: gNode.top,
      });

      kNode.set({
        left: symmedianPoint.x,
        top: symmedianPoint.y,
      });

      kLabel.set({
        left: symmedianPoint.x - 10,
        top: symmedianPoint.y - 35,
      });
    }

    moveVertices();
    canvas.on("object:moving", moveVertices);
    canvas.add(triangle);
    canvas.add(lemonieCircle);
    canvas.add(vertexA);
    canvas.add(vertexB);
    canvas.add(vertexC);
    canvas.add(aLabel);
    canvas.add(bLabel);
    canvas.add(cLabel);
    canvas.add(dNode);
    canvas.add(eNode);
    canvas.add(fNode);
    canvas.add(gNode);
    canvas.add(hNode);
    canvas.add(iNode);
    canvas.add(kNode);
    canvas.add(dLabel);
    canvas.add(eLabel);
    canvas.add(fLabel);
    canvas.add(gLabel);
    canvas.add(hLabel);
    canvas.add(iLabel);
    canvas.add(kLabel);
    canvas.add(lineP1Q2);
    canvas.add(lineP2Q3);
    canvas.add(lineP3Q1);
  },
});
</script>
