<template>
  <TopicMeta :topic="topic" />

  <ATypographyParagraph> </ATypographyParagraph>
  <div id="lemonine-circle-wrapper">
    <ATypographyTitle :level="4">Animated The First Lemonine Circles</ATypographyTitle>
    <canvas id="lemonine-circle-canvas" width="500" height="500" />
  </div>

  <ATypographyParagraph> </ATypographyParagraph>
  <div id="lemonine-circle-wrapper2">
    <ATypographyTitle :level="4">Animated The Second Lemonine Circles</ATypographyTitle>
    <canvas id="lemonine-circle-canvas2" width="500" height="500" />
  </div>

  <ATypographyParagraph> </ATypographyParagraph>
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
import { makeLine } from "@/utils/canvas";

const topic = indexTopicMap.get(17) as Topic;

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
    fontSize: fontSize || 22,
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

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    // first lemonine circle
    (() => {
      const canvas = new fabric.Canvas("lemonine-circle-canvas", {
        selection: false,
        backgroundColor: "floralwhite",
      });

      const vertexA = createCircle(175, 75, 10).set({ evented: true });
      const vertexB = createCircle(75, 400, 10).set({ evented: true });
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

      const lineP2Q3 = createLine([], "red", 1);
      const lineP3Q1 = createLine([], "red", 1);
      const lineP1Q2 = createLine([], "red", 1);

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

        parallelToBC.set({
          x1: 0,
          y1: -slopeBC * symmedianPoint.x + symmedianPoint.y,
          x2: canvas.getWidth(),
          y2: slopeBC * (canvas.getWidth() - symmedianPoint.x) + symmedianPoint.y,
        });
        parallelToCA.set({
          x1: 0,
          y1: -slopeCA * symmedianPoint.x + symmedianPoint.y,
          x2: canvas.getWidth(),
          y2: slopeCA * (canvas.getWidth() - symmedianPoint.x) + symmedianPoint.y,
        });
        parallelToAB.set({
          x1: 0,
          y1: -slopeAB * symmedianPoint.x + symmedianPoint.y,
          x2: canvas.getWidth(),
          y2: slopeAB * (canvas.getWidth() - symmedianPoint.x) + symmedianPoint.y,
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
            top: p1.y,
          });
          fNode.set({
            left: p2.x,
            top: p2.y,
          });
          fLabel.set({
            left: p2.x + 5,
            top: p2.y - 20,
          });
          hNode.set({
            left: p3.x,
            top: p3.y,
          });
          hLabel.set({
            left: p3.x - 20,
            top: p3.y - 30,
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
            left: q1.x - 5,
            top: q1.y,
          });
          gNode.set({
            left: q2.x,
            top: q2.y,
          });
          gLabel.set({
            left: q2.x - 5,
            top: q2.y - 30,
          });
          iNode.set({
            left: q3.x,
            top: q3.y,
          });
          iLabel.set({
            left: q3.x - 15,
            top: q3.y - 20,
          });

          const verticesP = [
            new fabric.Point(dNode.left as number, dNode.top as number),
            new fabric.Point(fNode.left as number, fNode.top as number),
            new fabric.Point(hNode.left as number, hNode.top as number),
          ];

          const lemonieCircleCenter = calculateCircumcenter(
            verticesP[0],
            verticesP[1],
            verticesP[2]
          );
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
            stroke: "green",
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
    })();

    // second lemonine circle
    (() => {
      const canvas = new fabric.Canvas("lemonine-circle-canvas2", {
        selection: false,
        backgroundColor: "floralwhite",
      });

      const vertexA = createCircle(175, 75, 10).set({ evented: true });
      const vertexB = createCircle(75, 400, 10).set({ evented: true });
      const vertexC = createCircle(400, 400, 10).set({ evented: true });

      const triangle = createPolygon();

      const dNode = createCircle(0, 0, 2, "black");
      const eNode = createCircle(0, 0, 2, "black");
      const fNode = createCircle(0, 0, 2, "black");
      const gNode = createCircle(0, 0, 2, "black");
      const hNode = createCircle(0, 0, 2, "black");
      const iNode = createCircle(0, 0, 2, "black");

      // Symmdian point
      const kNode = createCircle(0, 0, 2, "red");

      const lineP1Q2 = createLine([], "red", 1);
      const lineP2Q3 = createLine([], "red", 1);
      const lineP3Q1 = createLine([], "red", 1);

      const lineCQ1 = makeLine();
      const lineAP2 = makeLine();
      const lineBP1 = makeLine();
      const lineAQ3 = makeLine();
      const lineAQ2 = makeLine();
      const lineBP3 = makeLine();

      const aLabel = createLabel("A");
      const bLabel = createLabel("B");
      const cLabel = createLabel("C");
      const dLabel = createLabel("D");
      const eLabel = createLabel("E");
      const fLabel = createLabel("F");
      const gLabel = createLabel("G");
      const hLabel = createLabel("H");
      const iLabel = createLabel("I");
      const kLable = createLabel("K");

      // lemonie circle
      const lemonieCircle = createCircle();

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

        // calculate the center of the lemonie circle
        const symmedianPoint = trilinearToCartesian(
          vertices[0],
          vertices[1],
          vertices[2],
          Math.sin(angles.x),
          Math.sin(angles.y),
          Math.sin(angles.z)
        );

        /*
         * caculate the radius of the lemonie circle
         */
        // set the sides of the triangle a, b, c
        const sideAB = vertices[0].distanceFrom(vertices[1]);
        const sideBC = vertices[1].distanceFrom(vertices[2]);
        const sideCA = vertices[2].distanceFrom(vertices[0]);
        // let p be the semi-perimeter
        const p = (sideAB + sideBC + sideCA) / 2;
        // let s be the area of the triangle
        const s = Math.sqrt(p * (p - sideAB) * (p - sideBC) * (p - sideCA));
        // let r be the radius of the lemonie circle
        const r =
          (2 * Math.sqrt(2) * Math.pow(s, 3 / 2)) /
          ((Math.pow(sideAB, 2) + Math.pow(sideBC, 2) + Math.pow(sideCA, 2)) *
            Math.sqrt(Math.sin(angles.x) * Math.sin(angles.y) * Math.sin(angles.z)));

        lemonieCircle.set({
          originX: "center",
          originY: "center",
          left: symmedianPoint.x,
          top: symmedianPoint.y,
          radius: r,
          stroke: "green",
          strokeWidth: 2,
        });

        // triangle AQ3P2 ~ ABC
        const sideAQ3 = ((2 * r) / sideBC) * sideCA;
        const lambda1 = sideAQ3 / sideAB;
        const q3 = new fabric.Point(
          lambda1 * vertices[1].x + (1 - lambda1) * vertices[0].x,
          lambda1 * vertices[1].y + (1 - lambda1) * vertices[0].y
        );
        iNode.set({
          left: q3.x,
          top: q3.y,
        });
        iLabel.set({
          left: q3.x - 20,
          top: q3.y - 20,
        });

        const sideAP2 = ((2 * r) / sideBC) * sideAB;
        const lambda2 = sideAP2 / sideCA;
        const p2 = new fabric.Point(
          lambda2 * vertices[2].x + (1 - lambda2) * vertices[0].x,
          lambda2 * vertices[2].y + (1 - lambda2) * vertices[0].y
        );
        fNode.set({
          left: p2.x,
          top: p2.y,
        });
        fLabel.set({
          left: p2.x + 5,
          top: p2.y - 20,
        });

        // triangle BP3Q1 ~ BAC
        const sideBQ1 = ((2 * r) / sideCA) * sideAB;
        const lambda3 = sideBQ1 / sideBC;
        const q1 = new fabric.Point(
          lambda3 * vertices[2].x + (1 - lambda3) * vertices[1].x,
          lambda3 * vertices[2].y + (1 - lambda3) * vertices[1].y
        );
        eNode.set({
          left: q1.x,
          top: q1.y,
        });
        eLabel.set({
          left: q1.x - 5,
          top: q1.y + 5,
        });

        const sideBP3 = ((2 * r) / sideCA) * sideBC;
        const lambda4 = sideBP3 / sideAB;
        const p3 = new fabric.Point(
          lambda4 * vertices[0].x + (1 - lambda4) * vertices[1].x,
          lambda4 * vertices[0].y + (1 - lambda4) * vertices[1].y
        );
        hNode.set({
          left: p3.x,
          top: p3.y,
        });
        hLabel.set({
          left: p3.x - 25,
          top: p3.y - 20,
        });

        // triangle CQ2P1 ~ CBA
        const sideCQ2 = ((2 * r) / sideAB) * sideBC;
        const lambda5 = sideCQ2 / sideCA;
        const q2 = new fabric.Point(
          lambda5 * vertices[0].x + (1 - lambda5) * vertices[2].x,
          lambda5 * vertices[0].y + (1 - lambda5) * vertices[2].y
        );
        gNode.set({
          left: q2.x,
          top: q2.y,
        });
        gLabel.set({
          left: q2.x + 5,
          top: q2.y - 20,
        });

        const sideCP1 = ((2 * r) / sideAB) * sideCA;
        const lambda6 = sideCP1 / sideBC;
        const p1 = new fabric.Point(
          lambda6 * vertices[1].x + (1 - lambda6) * vertices[2].x,
          lambda6 * vertices[1].y + (1 - lambda6) * vertices[2].y
        );
        dNode.set({
          left: p1.x,
          top: p1.y,
        });
        dLabel.set({
          left: p1.x - 5,
          top: p1.y + 5,
        });

        kNode.set({
          left: symmedianPoint.x,
          top: symmedianPoint.y,
        });
        kLable.set({
          left: symmedianPoint.x - 10,
          top: symmedianPoint.y - 35,
        });

        lineP1Q2.set({
          x1: p1.x,
          y1: p1.y,
          x2: q2.x,
          y2: q2.y,
        });

        lineP2Q3.set({
          x1: p2.x,
          y1: p2.y,
          x2: q3.x,
          y2: q3.y,
        });

        lineP3Q1.set({
          x1: p3.x,
          y1: p3.y,
          x2: q1.x,
          y2: q1.y,
        });

        lineCQ1.set({ stroke: "transparent" });
        lineAP2.set({ stroke: "transparent" });
        lineBP1.set({ stroke: "transparent" });
        lineAQ3.set({ stroke: "transparent" });
        lineAQ2.set({ stroke: "transparent" });
        lineBP3.set({ stroke: "transparent" });
        // draw the extenstion line
        const rightAngle = Math.PI / 2;
        if (angles.z > rightAngle) {
          lineCQ1.set({
            x1: vertices[2].x,
            y1: vertices[2].y,
            x2: q1.x,
            y2: q1.y,
            stroke: "green",
            strokeDashArray: [5, 5],
          });
          lineAP2.set({
            x1: vertices[0].x,
            y1: vertices[0].y,
            x2: p2.x,
            y2: p2.y,
            stroke: "green",
            strokeDashArray: [5, 5],
          });
        }
        if (angles.y > rightAngle) {
          lineBP1.set({
            x1: vertices[1].x,
            y1: vertices[1].y,
            x2: p1.x,
            y2: p1.y,
            stroke: "green",
            strokeDashArray: [5, 5],
          });
          lineAQ3.set({
            x1: vertices[0].x,
            y1: vertices[0].y,
            x2: q3.x,
            y2: q3.y,
            stroke: "green",
            strokeDashArray: [5, 5],
          });
        }
        if (angles.x > rightAngle) {
          lineAQ2.set({
            x1: vertices[0].x,
            y1: vertices[0].y,
            x2: q2.x,
            y2: q2.y,
            stroke: "green",
            strokeDashArray: [5, 5],
          });
          lineBP3.set({
            x1: vertices[1].x,
            y1: vertices[1].y,
            x2: p3.x,
            y2: p3.y,
            stroke: "green",
            strokeDashArray: [5, 5],
          });
        }
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
      canvas.add(kLable);
      canvas.add(lineP1Q2);
      canvas.add(lineP2Q3);
      canvas.add(lineP3Q1);
      canvas.add(lineCQ1);
      canvas.add(lineAP2);
      canvas.add(lineBP1);
      canvas.add(lineAQ3);
      canvas.add(lineAQ2);
      canvas.add(lineBP3);
    })();
  },
});
</script>
