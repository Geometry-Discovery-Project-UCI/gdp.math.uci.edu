<template>
    <TopicMeta :topic="topic" />
    <ATypographyParagraph> </ATypographyParagraph>
    <div id="topic27">
        <ATypographyTitle :level="4">Animated Brahmagupta's Theorem</ATypographyTitle>
        <svg id="napolean-canvas" width="500" height="500"
        style="border: 2px solid black; background-color: floralwhite; user-select: none">
        <polygon id="tri_n" stroke="black" stroke-width="2.5px" fill="transparent"></polygon>
        <circle id="circleA_n" r="3px" cx="100" cy="100" padding="20px"></circle>
        <circle id="circleB_n" r="3px" padding="20px"></circle>
        <circle id="circleC_n" r="3px" padding="20px"></circle>
        <circle id="circleP_n" r="3px" padding="20px"></circle>
        <circle id="circleS1_n" r="3px" padding="20px"></circle>
        <circle id="circleS2_n" r="3px" padding="20px"></circle>
        <circle id="circle_n" r="3px" padding="20px" stroke="blue" fill="transparent" stroke-width="2.5px"></circle>
        <text id="lA_n" font-size="20px">A</text>
      <text id="lB_n" style="font-family:'Computer Modern'" font-size="20px">B</text>
      <text id="lC_n" font-size="20px">C</text>
      <text id="lS1_n" font-size="20px">S1</text>
      <text id="lS2_n" font-size="20px">S2</text>
      <text id="lP_n" font-size="20px">P</text>
      <line id="S2C_n" stroke="black" stroke-width="1.5px"/>
      <line id="S1B_n" stroke="black" stroke-width="1.5px"/>
      <line id="linep" stroke="red" stroke-width="1.5px" stroke-dasharray="10,10"></line>
        </svg>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { makeLabel, makeLine, makeCircle, makeMovablePolygon } from "@/utils/canvas";
import {
  calculateDistanceBetweenTwoPoints, drawLine, pointAlongLine, circleLineIntersection,
  calculateThreeAngles, findDistance, lineLineIntersection, solveLinearEquation,
  getCircumcircleCenter, makeString, setp, setc, listToFPoint, listToCoord,
  trilinearToCartesian, isInside,
} from "@/utils/geometry";
import { Vector } from "@/utils/vector";
import { Circle } from "fabric/fabric-impl";
import { exportSpecifier } from "@babel/types";
const topic = indexTopicMap.get(40) as Topic;

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
    return { topic };
  },
  mounted() {
      const svg = document.querySelector("#napolean-canvas");
      const pi = 3.14;

      const radius = 150;
      const xx = 250;
      const yy = 200;

      let pC = [xx + Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
      let pB = [xx - Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
      let pA = [xx - Math.cos(pi / 3) * radius, yy - Math.sin(pi / 3) * radius];
      let points = [pA, pB, pC];
    //   let pP = [349, 305];

      const tri = document.querySelector("#tri_n") as Element;
      const letterB = document.querySelector("#lB_n") as Element;
      const circleB = document.getElementById("circleB_n") as Element;
      const letterA = document.querySelector("#lA_n") as Element;
      const circleA = document.getElementById("circleA_n") as Element;
      const letterP = document.querySelector("#lP_n") as Element;
      const circleP = document.getElementById("circleP_n") as Element;
      const letterC = document.querySelector("#lC_n") as Element;
      const circleC = document.getElementById("circleC_n") as Element;
      const letterS1 = document.querySelector("#lS1_n") as Element;
      const circleS1 = document.getElementById("circleS1_n") as Element;
      const letterS2 = document.querySelector("#lS2_n") as Element;
      const circleS2 = document.getElementById("circleS2_n") as Element;
      const circle = document.getElementById("circle_n") as Element;
      const S2C = document.getElementById("S2C_n") as Element;
      const S1B = document.getElementById("S1B_n") as Element;
      const linep = document.getElementById("linep") as Element;
      let pS1, pS2;

      setp(letterA, [pA[0] - 5, pA[1]]);
      setc(circleA, pA);
      setp(letterB, [pB[0] - 25, pB[1] + 20]);
      setc(circleB, pB);
      setp(letterC, [pC[0] + 5, pC[1] + 20]);
      setc(circleC, pC);
      pS1 = [(pA[0] + pB[0]) / 2, (pA[1] + pB[1]) / 2];
      setp(letterS1, pS1);
      setc(circleS1, pS1);
      pS2 = [(pA[0] + pC[0]) / 2, (pA[1] + pC[1]) / 2];
      setp(letterS2, pS2);
      setc(circleS2, pS2);
      tri?.setAttributeNS(
        null,
        "points",
        makeString([points[0], points[1], points[2]])
      );
      const erdos_mordell = () => {
        tri?.setAttributeNS(
          null,
          "points",
          makeString([points[0], points[1], points[2]])
        );
        setp(letterA, [pA[0] - 5, pA[1]]);
        setc(circleA, pA);
        setp(letterB, [pB[0] - 25, pB[1] + 20]);
        setc(circleB, pB);
        setp(letterC, [pC[0] + 5, pC[1] + 20]);
        setc(circleC, pC);
        pS1 = [(pA[0] + pB[0]) / 2, (pA[1] + pB[1]) / 2];
        setp(letterS1, [pS1[0] - 35, pS1[1] + 5]);
        setc(circleS1, pS1);
        pS2 = [(pA[0] + pC[0]) / 2, (pA[1] + pC[1]) / 2];
        setp(letterS2, pS2);
        setc(circleS2, pS2);
        let intersection, index;
        if (findDistance(pA, pB) > findDistance(pA, pC)) {
            const cc = getCircumcircleCenter(listToFPoint(pB), listToFPoint(pC), listToFPoint(pS1));
            setc(circle, cc);
            circle?.setAttribute("r", cc[2] + "");
            drawLine(pS2, pB, S1B);
            drawLine(pC, pS1, S2C);
            const mb = solveLinearEquation(listToCoord(pB), listToCoord(pS2));
            intersection = circleLineIntersection(cc[2], cc[0], cc[1], mb.m, mb.b);
            index = 0;
            if (intersection[index][1] === pS2[1]) {
                index++;
            }
            drawLine(intersection[index], pC, linep);
        } else {
            const cc = getCircumcircleCenter(listToFPoint(pB), listToFPoint(pC), listToFPoint(pS2));
            setc(circle, cc);
            circle?.setAttribute("r", cc[2] + "");
            drawLine(pS2, pB, S1B);
            drawLine(pC, pS1, S2C);
            const mb = solveLinearEquation(listToCoord(pC), listToCoord(pS1));
            intersection = circleLineIntersection(cc[2], cc[0], cc[1], mb.m, mb.b);
            index = 0;
            if (Math.round(intersection[index][1]) === Math.round(pC[1])) {
                index++;
            }
            console.log("HIYAAAA", intersection[index]);
            console.log("HDIDD", pC);
            drawLine(intersection[index], pB, linep);
        }
        setp(letterP, [intersection[index][0], intersection[index][1]]);
        setc(circleP, intersection[index]);

      };
      const pPoint = DOMPoint.fromPoint({
        x: 160,
        y: 260,
        z: 0,
        w: 0,
      });
      let mouseOnP = false;
      let mouseOnA = false;
      let mouseOnB = false;
      let mouseOnC = false;
      erdos_mordell();
      let mouseDown = 0;
      document.body.onmousedown = function () {
        mouseOnP = false;
        mouseOnA = false;
        mouseOnB = false;
        mouseOnC = false;
        mouseDown--;
      };
      document.body.onmouseup = function () {
        mouseDown++;
      };
      const svgElement = svg as SVGGraphicsElement;
      svgElement.addEventListener("mousemove", (event) => {
        let p = new DOMPoint(event.clientX, event.clientY);
        p = p.matrixTransform(svgElement.getScreenCTM()?.inverse());
        if (Math.abs(p.x - pA[0]) + Math.abs(p.y - pA[1]) < 10) {
          mouseOnA = true;
        } else if (Math.abs(p.x - pC[0]) + Math.abs(p.y - pC[1]) < 10) {
          mouseOnC = true;
        } else if (Math.abs(p.x - pB[0]) + Math.abs(p.y - pB[1]) < 10) {
          mouseOnB = true;
        }
        if (mouseDown) {
          if (mouseOnP) {
            erdos_mordell();
          } else if (mouseOnA) {
            pA = [p.x, p.y];
            points = [pA, pB, pC];
            erdos_mordell();
          } else if (mouseOnB) {
            pB = [p.x, p.y];
            points = [pA, pB, pC];
            erdos_mordell();
          } else if (mouseOnC) {
            pC = [p.x, p.y];
            points = [pA, pB, pC];
            erdos_mordell();
          }
        }
      });
    }
  },
);
</script>
