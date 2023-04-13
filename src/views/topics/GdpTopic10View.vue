<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph> </ATypographyParagraph>

  <div id="Ptolemy-wrapper">
    <ATypographyTitle :level="4">Animated Ptolemy Theorem's and Kelvin Transform</ATypographyTitle>
    <canvas id="Ptolemy-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Coord, Topic } from "@/types";
import { fabric } from "fabric";
import { makeLabel, makeLine, makeCircle, makeMovablePoint } from "@/utils/canvas";
import { findSlope, polarToCartesian } from "@/utils/geometry";
const topic = indexTopicMap.get(10) as Topic;
export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("Ptolemy-canvas", {
      selection: false,
    });

    function coordToPoint(cd: Coord): fabric.Point {
      return new fabric.Point(cd.x, cd.y);
    }

    const RADIUS = 160;
    const center = { x: 250, y: 300 } as Coord;

    const pointA = makeMovablePoint(coordToPoint(polarToCartesian(RADIUS, 100, center)), 3).set({
      fill: "transparent",
      padding: 10,
    });
    const pointB = makeMovablePoint(coordToPoint(polarToCartesian(RADIUS, 200, center)), 3).set({
      fill: "transparent",
      padding: 10,
    });
    const pointC = makeMovablePoint(coordToPoint(polarToCartesian(RADIUS, 270, center)), 3).set({
      fill: "transparent",
      padding: 10,
    });
    const pointD = makeMovablePoint(coordToPoint(polarToCartesian(RADIUS, 335, center)), 3).set({
      fill: "transparent",
      padding: 10,
    });

    const circleA = makeCircle(3, new fabric.Point(pointA.left!, pointA.top!)).set({
      fill: "black",
      originX: "center",
      originY: "center",
    });

    const circleB = makeCircle(3, new fabric.Point(pointB.left!, pointB.top!)).set({
      fill: "black",
      originX: "center",
      originY: "center",
    });

    const circleC = makeCircle(3, new fabric.Point(pointC.left!, pointC.top!)).set({
      fill: "black",
      originX: "center",
      originY: "center",
    });

    const circleD = makeCircle(3, new fabric.Point(pointD.left!, pointD.top!)).set({
      fill: "black",
      originX: "center",
      originY: "center",
    });

    const circumCircle = makeCircle(RADIUS, coordToPoint(center));
    circumCircle.set({
      originX: "center",
      originY: "center",
      stroke: "black",
    });

    const labelA = makeLabel("A");
    const labelB = makeLabel("B");
    const labelC = makeLabel("C");
    const labelD = makeLabel("D");
    const lineAC = makeLine();
    const lineBD = makeLine();
    const lineAB = makeLine();
    const lineCD = makeLine();
    const lineAD = makeLine();
    const lineBC = makeLine();
    const labelAC = makeLabel("AC");
    const labelBD = makeLabel("BD");
    const labelAB = makeLabel("AB");
    const labelCD = makeLabel("CD");
    const labelAD = makeLabel("AD");
    const labelBC = makeLabel("BC");
    const valueAC = makeLabel("0");
    const valueBD = makeLabel("0");
    const valueAB = makeLabel("0");
    const valueCD = makeLabel("0");
    const valueAD = makeLabel("0");
    const valueBC = makeLabel("0");

    const circleRestrict = (p: fabric.Point): fabric.Point => {
      let rad = Math.atan(-findSlope([center.x, center.y], [p.x, p.y]));
      if (p.x < center.x) {
        rad -= Math.PI;
      }
      const coord = polarToCartesian(RADIUS, rad, center, false);
      p.setFromPoint(coord);
      return p;
    };

    const moveVertices = () => {
      const points = [
        new fabric.Point(pointA.left as number, pointA.top as number),
        new fabric.Point(pointB.left as number, pointB.top as number),
        new fabric.Point(pointC.left as number, pointC.top as number),
        new fabric.Point(pointD.left as number, pointD.top as number),
      ];

      const vertices = [
        circleRestrict(points[0]),
        circleRestrict(points[1]),
        circleRestrict(points[2]),
        circleRestrict(points[3]),
      ];

      const intersection = fabric.Intersection.intersectLineLine(
        vertices[0],
        vertices[2],
        vertices[1],
        vertices[3]
      );

      if (intersection.status !== "Intersection") {
        pointA.set({
          left: circleA.left,
          top: circleA.top,
        });

        pointB.set({
          left: circleB.left,
          top: circleB.top,
        });

        pointC.set({
          left: circleC.left,
          top: circleC.top,
        });

        pointD.set({
          left: circleD.left,
          top: circleD.top,
        });

        return;
      }

      pointA.set({
        left: vertices[0].x,
        top: vertices[0].y,
      });

      pointB.set({
        left: vertices[1].x,
        top: vertices[1].y,
      });

      pointC.set({
        left: vertices[2].x,
        top: vertices[2].y,
      });

      pointD.set({
        left: vertices[3].x,
        top: vertices[3].y,
      });

      lineAC.set({
        x1: vertices[0].x,
        y1: vertices[0].y,
        x2: vertices[2].x,
        y2: vertices[2].y,
        stroke: "#f49e36",
      });

      lineBD.set({
        x1: vertices[1].x,
        y1: vertices[1].y,
        x2: vertices[3].x,
        y2: vertices[3].y,
        stroke: "#1d6e8dd9",
      });

      lineAB.set({
        x1: vertices[0].x,
        y1: vertices[0].y,
        x2: vertices[1].x,
        y2: vertices[1].y,
        stroke: "#2416a2",
      });

      lineCD.set({
        x1: vertices[2].x,
        y1: vertices[2].y,
        x2: vertices[3].x,
        y2: vertices[3].y,
        stroke: "#7a5548",
      });

      lineAD.set({
        x1: vertices[0].x,
        y1: vertices[0].y,
        x2: vertices[3].x,
        y2: vertices[3].y,
        stroke: "#bf0e4a",
      });

      lineBC.set({
        x1: vertices[1].x,
        y1: vertices[1].y,
        x2: vertices[2].x,
        y2: vertices[2].y,
        stroke: "purple",
      });

      labelA.set({
        left: vertices[0].x - 5,
        top: vertices[0].y - 30,
      });

      labelB.set({
        left: vertices[1].x - 20,
        top: vertices[1].y - 10,
      });

      labelC.set({
        left: vertices[2].x - 5,
        top: vertices[2].y + 5,
      });

      labelD.set({
        left: vertices[3].x + 5,
        top: vertices[3].y - 10,
      });

      const ac = String((Math.round(vertices[0].distanceFrom(vertices[2])) / 100).toFixed(2));
      const bd = String((Math.round(vertices[1].distanceFrom(vertices[3])) / 100).toFixed(2));
      const ab = String((Math.round(vertices[0].distanceFrom(vertices[1])) / 100).toFixed(2));
      const cd = String((Math.round(vertices[2].distanceFrom(vertices[3])) / 100).toFixed(2));
      const ad = String((Math.round(vertices[0].distanceFrom(vertices[3])) / 100).toFixed(2));
      const bc = String((Math.round(vertices[1].distanceFrom(vertices[2])) / 100).toFixed(2));

      const values = [ac, bd, ab, cd, ad, bc];
      const valuesLb = [valueAC, valueBD, valueAB, valueCD, valueAD, valueBC];
      valuesLb.forEach((value, i) => {
        value.set({
          text: values[i],
          left: 95 + i * 55,
          top: 60,
          strokeWidth: 0.5,
          stroke: "black",
          fill: "black",
          fontSize: 20,
          fontStyle: "italic",
          evented: false,
        });
      });

      circleA.set({
        left: vertices[0].x,
        top: vertices[0].y,
      });

      circleB.set({
        left: vertices[1].x,
        top: vertices[1].y,
      });

      circleC.set({
        left: vertices[2].x,
        top: vertices[2].y,
      });

      circleD.set({
        left: vertices[3].x,
        top: vertices[3].y,
      });
    };

    moveVertices();
    canvas.on("object:moving", moveVertices);

    const eqLables = [labelAC, labelBD, labelAB, labelCD, labelAD, labelBC];
    const eqLablesColor = ["#f49e36", "#1d6e8dd9", "#2416a2", "#7a5548", "#bf0e4a", "purple"];
    eqLables.forEach((label, i) => {
      label.set({
        left: 100 + i * 55,
        top: 25,
        strokeWidth: 0.5,
        stroke: eqLablesColor[i],
        fill: eqLablesColor[i],
        fontSize: 20,
        fontStyle: "italic",
        evented: false,
      });
    });

    const operators = ["・", "=", "・", "+", "・"];
    const opPositions = [130, 189, 239, 301, 350];
    operators.forEach((op, i) => {
      canvas.add(
        new fabric.Text(op).set({
          left: opPositions[i],
          top: 28,
          strokeWidth: 0.5,
          stroke: "black",
          fill: "black",
          fontSize: 18,
          fontStyle: "italic",
          evented: false,
        })
      );
    });

    const valuesOpPositions = [130, 189, 239, 301, 350];
    operators.forEach((op, i) => {
      canvas.add(
        new fabric.Text(op).set({
          left: valuesOpPositions[i],
          top: 62,
          strokeWidth: 0.5,
          stroke: "black",
          fill: "black",
          fontSize: 18,
          fontStyle: "italic",
          evented: false,
        })
      );
    });

    canvas.add(circumCircle);
    canvas.add(labelA, labelB, labelC, labelD);
    canvas.add(pointA, pointB, pointC, pointD);
    canvas.add(lineAC, lineBD, lineAB, lineCD, lineAD, lineBC);
    canvas.add(labelAC, labelBD, labelAB, labelCD, labelAD, labelBC);
    canvas.add(valueAC, valueBD, valueAB, valueCD, valueAD, valueBC);
    canvas.add(circleA, circleB, circleC, circleD);
  },
});
</script>
