<template>
  <TopicMeta :topic="topic" />
    <ATypographyParagraph> </ATypographyParagraph>
    <div id="symmedian point-wrapper">
      <ATypographyTitle :level="4">Animated Symmedian Point</ATypographyTitle>
      <canvas id="symmedian-point-canvas" width="500" height="500" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import {
  lineLineIntersection,
  trilinearToCartesian,
  calculateThreeAngles,
  calculateLineIntersectInPoints,
  calculateMidpoint,
} from "@/utils/geometry";
const topic = indexTopicMap.get(16) as Topic;
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

function createLine(points?: number[], color?: string, strokeWidth?: number) {
  return new fabric.Line(points || [], {
    hasControls: false,
    hasBorders: false,
    evented: false,
    stroke: color || "black",
    strokeWidth: strokeWidth || 1,
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

export default defineComponent({
  setup() {
    return {topic};
  },
  mounted() {
    // Symmedian Point
    (() => {
      const canvas = new fabric.Canvas("symmedian-point-canvas", {
        selection: false,
        backgroundColor: "floralwhite",
      });

      const vertexA = createCircle(140, 150, 10).set({evented: true});
      const vertexB = createCircle(75, 400, 10).set({evented: true});
      const vertexC = createCircle(400, 400, 10).set({evented: true});

      const triangle = createPolygon();

      // Symmedian point
      const kNode = createCircle(0, 0, 2, "green");
      const gNode = createCircle(0, 0, 2, "blue");
      const ANode = createCircle(0, 0, 2, "black");
      const BNode = createCircle(0, 0, 2, "black");
      const CNode = createCircle(0, 0, 2, "black");

      const lineAB = createLine([], "black");
      const lineBC = createLine([], "black");
      const lineCA = createLine([], "black");
      const median1 = createLine();
      const median2 = createLine();
      const median3 = createLine();
      const symmedian1 = createLine();
      const symmedian2 = createLine();
      const symmedian3 = createLine();
      const aLabel = createLabel("A");
      const bLabel = createLabel("B");
      const cLabel = createLabel("C");
      const dLabel = createLabel("D");
      const eLabel = createLabel("E");
      const fLabel = createLabel("F");
      const d1Label = createLabel("D'");
      const e1Label = createLabel("E'");
      const f1Label = createLabel("F'");
      const kLabel = createLabel("K");
      const gLabel = createLabel("G");
      function moveVertices() {
        const vertices = [
          new fabric.Point(vertexA.left as number, vertexA.top as number),
          new fabric.Point(vertexB.left as number, vertexB.top as number),
          new fabric.Point(vertexC.left as number, vertexC.top as number),
        ];

        const mp1 = calculateMidpoint(vertices[0], vertices[1]);
        const mp2 = calculateMidpoint(vertices[0], vertices[2]);
        const mp3 = calculateMidpoint(vertices[1], vertices[2]);
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
        ANode.set({
          left: vertices[0].x ,
          top: vertices[0].y,
        });
        BNode.set({
          left: vertices[1].x,
          top: vertices[1].y,
        });
        CNode.set({
          left: vertices[2].x,
          top: vertices[2].y,
        });
        fLabel.set({
          left: mp1.x - 20,
          top: mp1.y - 20,
        });
        eLabel.set({
          left: mp2.x + 15,
          top: mp2.y - 15,
        });
        dLabel.set({
          left: mp3.x,
          top: mp3.y,
        });

        const angles = calculateThreeAngles(vertices[0], vertices[1], vertices[2]);
        const pA=[vertices[0].x,vertices[0].y];
        const pB=[vertices[1].x,vertices[1].y];
        const pC=[vertices[2].x,vertices[2].y];
        const symmedianPoint = trilinearToCartesian(
          vertices[0],
          vertices[1],
          vertices[2],
          Math.sin(angles.x),
          Math.sin(angles.y),
          Math.sin(angles.z)
        );
        const sym=[symmedianPoint.x,symmedianPoint.y];
        const d1=lineLineIntersection(pA,sym, pB,pC) as number[];
        d1Label.set({
          left:d1[0],
          top:d1[1],
        });
        const e1=lineLineIntersection(pB,sym, pA,pC) as number[];
        e1Label.set({
          left:e1[0]+5,
          top:e1[1]-20,
        });
        const f1=lineLineIntersection(pC,sym, pB,pA) as number[];
        f1Label.set({
          left:f1[0]-25,
          top:f1[1],
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

        median1.set({
          x1: vertices[0].x,
          y1: vertices[0].y,
          x2: mp3.x,
          y2: mp3.y,
          stroke: "blue",
        });
        median2.set({
          x1: vertices[1].x,
          y1: vertices[1].y,
          x2: mp2.x,
          y2: mp2.y,
          stroke: "blue",
        });
        median3.set({
          x1: vertices[2].x,
          y1: vertices[2].y,
          x2: mp1.x,
          y2: mp1.y,
          stroke: "blue",
        });
        symmedian1.set({
          x1:vertices[0].x,
          y1:vertices[0].y,
          x2:d1[0],
          y2:d1[1],
          stroke: "green",
        });
        symmedian2.set({
          x1:vertices[1].x,
          y1:vertices[1].y,
          x2:e1[0],
          y2:e1[1],
          stroke: "green",
        });
        symmedian3.set({
          x1:vertices[2].x,
          y1:vertices[2].y,
          x2:f1[0],
          y2:f1[1],
          stroke: "green",
        });
        kNode.set({
          left: symmedianPoint.x,
          top: symmedianPoint.y,
        });
        kLabel.set({
          left: symmedianPoint.x - 10,
          top: symmedianPoint.y - 35,
        });
        const intersect = calculateLineIntersectInPoints(median1, median2) as fabric.Point;
        gLabel.set({
          left: intersect.x + 5,
          top: intersect.y + 10,
        });
        gNode.set({
          left: intersect.x,
          top: intersect.y,
        });
      }
      moveVertices();
      canvas.on("object:moving", moveVertices);
      canvas.add(triangle);
      canvas.add(vertexA);
      canvas.add(vertexB);
      canvas.add(vertexC);
      canvas.add(aLabel);
      canvas.add(bLabel);
      canvas.add(cLabel);
      canvas.add(ANode);
      canvas.add(BNode);
      canvas.add(CNode);
      canvas.add(dLabel);
      canvas.add(eLabel);
      canvas.add(fLabel);
      canvas.add(gLabel);
      canvas.add(gNode);
      canvas.add(kNode);
      canvas.add(kLabel);
      canvas.add(median1);
      canvas.add(median2);
      canvas.add(median3);
      canvas.add(symmedian1);
      canvas.add(symmedian2);
      canvas.add(symmedian3);
      canvas.add(d1Label);
      canvas.add(e1Label);
      canvas.add(f1Label);
    })();
  },
});

</script>
