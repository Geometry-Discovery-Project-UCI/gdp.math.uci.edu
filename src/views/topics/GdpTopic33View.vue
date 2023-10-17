<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph> </ATypographyParagraph>
  <div id="isodynamic-point-wrapper">
    <ATypographyTitle :level="4">Animated Isodynamic Point</ATypographyTitle>
    <canvas id="isodynamic-point-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { trilinearToCartesian, calculateThreeAngles } from "@/utils/geometry";
import { makeLine } from "@/utils/canvas";

const topic = indexTopicMap.get(33) as Topic;

interface Coord {
  x: number;
  y: number;
}
function createCircle(x?: number, y?: number, radius?: number, fill?: string): fabric.Circle {
  return new fabric.Circle({
    originX: "center",
    originY: "center",
    left: x || 0,
    top: y || 0,
    hasControls: false,
    hasBorders: false,
    evented: false,
    radius: radius || 3,
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

function coordToPoint(cd: Coord): fabric.Point {
  return new fabric.Point(cd.x, cd.y);
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

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("isodynamic-point-canvas", {
      selection: false,
      backgroundColor: "floralwhite",
    });

    const vertexA = createCircle(161, 59).set({ fill: "black", padding: 10, evented: true });
    const vertexB = createCircle(233, 243).set({ fill: "black", padding: 10, evented: true });
    const vertexC = createCircle(453, 243).set({ fill: "black", padding: 10, evented: true });

    const pointS1 = createCircle().set({ fill: "red", padding: 10 });
    const pointS2 = createCircle().set({ fill: "red", padding: 10 });

    const lineAS1 = makeLine();
    const lineBS1 = makeLine();
    const lineCS1 = makeLine();

    const lineAS2 = makeLine();
    const lineBS2 = makeLine();
    const lineCS2 = makeLine();

    const triangle = createPolygon();

    const aLabel = createLabel("A");
    const bLabel = createLabel("B");
    const cLabel = createLabel("C");
    const sLabel = createLabel("S");
    const s1Label = createLabel("S'");

    function moveVertices() {
      const vertices = [
        new fabric.Point(vertexA.left as number, vertexA.top as number),
        new fabric.Point(vertexB.left as number, vertexB.top as number),
        new fabric.Point(vertexC.left as number, vertexC.top as number),
      ];

      triangle.set({
        points: vertices,
      });

      // calculate the angles of the triangle
      const angles = calculateThreeAngles(vertices[0], vertices[1], vertices[2]);
      const isodynamicPoint1: fabric.Point = coordToPoint(
        trilinearToCartesian(
          vertices[0],
          vertices[1],
          vertices[2],
          Math.sin(angles.x + Math.PI / 3),
          Math.sin(angles.y + Math.PI / 3),
          Math.sin(angles.z + Math.PI / 3)
        )
      );

      const isodynamicPoint2: fabric.Point = coordToPoint(
        trilinearToCartesian(
          vertices[0],
          vertices[1],
          vertices[2],
          Math.sin(angles.x - Math.PI / 3),
          Math.sin(angles.y - Math.PI / 3),
          Math.sin(angles.z - Math.PI / 3)
        )
      );

      pointS1.set({
        left: isodynamicPoint1.x,
        top: isodynamicPoint1.y,
      });

      pointS2.set({
        left: isodynamicPoint2.x,
        top: isodynamicPoint2.y,
      });

      aLabel.set({
        left: vertices[0].x - 10,
        top: vertices[0].y - 25,
      });

      bLabel.set({
        left: vertices[1].x,
        top: vertices[1].y,
      });

      cLabel.set({
        left: vertices[2].x,
        top: vertices[2].y,
      });

      sLabel.set({
        left: pointS1.left,
        top: pointS1.top,
      });

      s1Label.set({
        left: pointS2.left,
        top: pointS2.top,
      });

      lineAS1.set({
        x1: vertices[0].x,
        y1: vertices[0].y,
        x2: isodynamicPoint1.x,
        y2: isodynamicPoint1.y,
        stroke: "green",
        strokeDashArray: [5, 5],
      });
      lineAS2.set({
        x1: vertices[0].x,
        y1: vertices[0].y,
        x2: isodynamicPoint2.x,
        y2: isodynamicPoint2.y,
        stroke: "green",
        strokeDashArray: [5, 5],
      });

      lineBS1.set({
        x1: vertices[1].x,
        y1: vertices[1].y,
        x2: isodynamicPoint1.x,
        y2: isodynamicPoint1.y,
        stroke: "green",
        strokeDashArray: [5, 5],
      });
      lineBS2.set({
        x1: vertices[1].x,
        y1: vertices[1].y,
        x2: isodynamicPoint2.x,
        y2: isodynamicPoint2.y,
        stroke: "green",
        strokeDashArray: [5, 5],
      });

      lineCS1.set({
        x1: vertices[2].x,
        y1: vertices[2].y,
        x2: isodynamicPoint1.x,
        y2: isodynamicPoint1.y,
        stroke: "green",
        strokeDashArray: [5, 5],
      });
      lineCS2.set({
        x1: vertices[2].x,
        y1: vertices[2].y,
        x2: isodynamicPoint2.x,
        y2: isodynamicPoint2.y,
        stroke: "green",
        strokeDashArray: [5, 5],
      });

      console.log(vertexA);
      console.log(vertexB);
      console.log(vertexC);
    }
    moveVertices();
    canvas.on("object:moving", moveVertices);
    canvas.add(triangle);
    canvas.add(lineAS1, lineBS1, lineCS1, lineAS2, lineBS2, lineCS2);
    canvas.add(vertexA, vertexB, vertexC);
    canvas.add(pointS1, pointS2);
    canvas.add(aLabel, bLabel, cLabel, s1Label, sLabel);
  },
});
</script>
