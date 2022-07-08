<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>

  </ATypographyParagraph>
  <div id="ceva-theorem-wrapper">
    <ATypographyTitle :level="4">Animated Simson Line</ATypographyTitle>
<!--    <canvas id="ceva-theorem-canvas" width="500" height="500" />-->
    <svg id="tri-app" width="500" height="500" style="border: 2px solid black; background-color: floralwhite;">
      <circle id="ptoCircle_simsonline" r="200" cx="250" cy="250" fill="transparent" stroke="black" />
      <polygon id="tri_simsonline" fill="transparent" stroke="black" />

      <rect id="rightAngleA_simsonline" stroke="purple" fill="transparent"></rect>
      <rect id="rightAngleB_simsonline" stroke="purple" fill="transparent" width="8" height="8"></rect>
      <rect id="rightAngleC_simsonline" stroke="purple" fill="transparent" width="8" height="8"></rect>

      <line id="line0_simsonline" stroke="purple" />
      <line id="line1_simsonline" stroke="blue" />
      <line id="line2_simsonline" stroke="#6495ED" />
      <line id="line3_simsonline" stroke="lime" />
      <line id="line4_simsonline" stroke="lime" />
      <line id="line5_simsonline" stroke="#6495ED" />
      <line id="lineExtend_simsonline" stroke="black" />
      <line id="lineExtend2_simsonline" stroke="black" />
      <text id="letterA_simsonline">A</text>
      <text id="letterB_simsonline">B</text>
      <text id="letterC_simsonline">C</text>
      <text id="letterP_simsonline">P</text>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { indexTopicMap } from '@/data';
import { Topic } from '@/types';
import {distToLine, drawFullLine, drawLine, findMidpoint, findSlope, pedalPoint, projectPoint2Line, radiansToDegress} from '@/utils/geoutils';
const topic = indexTopicMap.get(5) as Topic;
export default defineComponent(
  {
    setup() {
      return { topic };
    },
    mounted() {
      const svg = document.querySelector("#tri-app");
      const pi = 3.14;

      const radius = 200;
      const xx = 250;
      const yy = 250;
      const makeString = (arr: number[][]) => {
        return `${arr[0][0]},${arr[0][1]} ${arr[1][0]},${arr[1][1]} ${arr[2][0]},${arr[2][1]}`;
      };
      const pA = [xx + Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
      const pB = [xx - Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
      const pC = [xx - Math.cos(pi / 3) * radius, yy - Math.sin(pi / 3) * radius];
      const points = [pA, pB, pC];

      const mAB = (pA[1] - pA[1]) / (pB[0] - pA[0]);
      const mBC = (pB[1] - pC[1]) / (pB[0] - pC[0]);
      const mAC = (pA[1] - pC[1]) / (pA[0] - pC[0]);

      const tri = document.querySelector("#tri_simsonline");
      const line0 = document.querySelector("#line0_simsonline");
      const line1 = document.querySelector("#line1_simsonline");
      const line2 = document.querySelector("#line2_simsonline");
      const line3 = document.querySelector("#line3_simsonline");
      const lineE = document.querySelector("#lineExtend_simsonline");
      const lineE2 = document.querySelector("#lineExtend2_simsonline");
      const raA = document.querySelector("#rightAngleA_simsonline");
      const raB = document.querySelector("#rightAngleB_simsonline");
      const raC = document.getElementById("rightAngleC_simsonline");

      const letterA = document.querySelector("#letterA_simsonline");
      const letterB = document.querySelector("#letterB_simsonline");
      const letterC = document.querySelector("#letterC_simsonline");
      const letterP = document.querySelector("#letterP_simsonline");

      const moveMouse = (p: { x: number; y: number; }) => {
        const cosx =
          (p.x - xx) / Math.sqrt((p.x - xx) * (p.x - xx) + (p.y - yy) * (p.y - yy));
        const sinx =
          (p.y - yy) / Math.sqrt((p.x - xx) * (p.x - xx) + (p.y - yy) * (p.y - yy));

        p.x = xx + radius * cosx;
        p.y = yy + radius * sinx;

//  pay attention to these functions
        const mid0 = findMidpoint(points[0], [p.x, p.y]);
        const m0 = findSlope(points[0], [p.x, p.y]);
        const mid1 = findMidpoint(points[1], [p.x, p.y]);
        const m1 = findSlope(points[1], [p.x, p.y]);

        tri?.setAttributeNS(
          null,
          "points",
          makeString([points[0], points[1], points[2]])
        );
        const p1 = [p.x, pA[1]];
        // .log([p.x, p.y], pA, pB);
        const pAi = projectPoint2Line([p.x, p.y], pA, pC);

        const mAi = (pAi[1] - p1[1]) / (pAi[0] - p1[0]);

        drawLine(pAi, [p.x, p.y], line2);
        drawLine(p1, [p.x, p.y], line0);
        const pBi = projectPoint2Line([p.x, p.y], pB, pC);
        // drawLine(p1, pBi, line3);
        // drawLine(p1, pAi, line4);
        drawFullLine(p1, findSlope(p1, pAi), line3);

        drawLine(pBi, [p.x, p.y], line1);

        const theta = Math.atan(-1 / mBC);
        const dist = distToLine([p.x, p.y], pC, pA);
        const p2 = [p.x - dist * Math.cos(theta), p.y - dist * Math.sin(theta)];

        // drawFullLine(p2, findSlope(p1, p2), line3);
        raA?.setAttribute("width", "8");
        raA?.setAttribute("height", "8");


        if (p.y > p1[1]) {
          raA?.setAttribute("y", p1[1] + "");
        } else {
          raA?.setAttribute("y", p1[1] - 8 + "");
        }

        if (p.x > p1[0]) {
          raA?.setAttribute("x", p1[0] + "");
        } else {
          raA?.setAttribute("x", (p1[0] - 8) + "");
        }

        letterP?.setAttribute("x", p.x + "");
        letterP?.setAttribute("y", (p.y - 10) + "");
        letterP?.setAttribute("font-size", "1.5rem");

        const section = pedalPoint(pC, pB, pA, [p.x, p.y]);
        const tBC = Math.atan(mBC);
        const tAC = Math.atan(mAC);

        if (section == 2) {
          drawLine(pC, pBi, lineE);
          drawLine(pA, p1, lineE2);
          raB?.setAttribute("x", pBi[0]);
          raB?.setAttribute("y", pBi[1]);
          raB?.setAttribute(
            "transform",
            "rotate(" +
            String(radiansToDegress(tBC)) +
            " " +
            String(pBi[0]) +
            " " +
            String(pBi[1]) +
            ")"
          );
          // For Yi to check the setAttribute
          raC?.setAttribute("x", pAi[0]);
          raC?.setAttribute("y", (pAi[1] - 8) + "");
          raC?.setAttribute(
            "transform",
            "rotate(" +
            String(radiansToDegress(tAC)) +
            " " +
            String(pAi[0]) +
            " " +
            String(pAi[1]) +
            ")"
          );
        }

        if (section == 4) {
          drawLine(pB, pBi, lineE);
          drawLine(pA, p1, lineE2);
          raC?.setAttribute("x", pAi[0]);
          raC?.setAttribute("y", pAi[1]);
          raC?.setAttribute(
            "transform",
            "rotate(" +
            String(radiansToDegress(tAC)) +
            " " +
            String(pAi[0]) +
            " " +
            String(pAi[1]) +
            ")"
          );

          raB?.setAttribute("x", pBi[0]);
          raB?.setAttribute("y", pBi[1]);
          raB?.setAttribute(
            "transform",
            "rotate(" +
            String(radiansToDegress(tBC)) +
            " " +
            String(pBi[0]) +
            " " +
            String(pBi[1]) +
            ")"
          );
        }

        if (section == 6) {
          drawLine(pC, pAi, lineE);
          drawLine(pB, p1, lineE2);
          raC?.setAttribute("x", pAi[0]);
          raC?.setAttribute("y", pAi[1]);
          raC?.setAttribute(
            "transform",
            "rotate(" +
            String(radiansToDegress(tAC)) +
            " " +
            String(pAi[0]) +
            " " +
            String(pAi[1]) +
            ")"
          );

          raB?.setAttribute("x", (pBi[0] - 8) + "");
          raB?.setAttribute("y", (pBi[1] - 8) + "");
          raB?.setAttribute(
            "transform",
            "rotate(" +
            String(radiansToDegress(tBC)) +
            " " +
            String(pBi[0]) +
            " " +
            String(pBi[1]) +
            ")"
          );
        }
      };
      let p = new DOMPoint(
        xx - Math.cos((pi * 5) / 9) * radius,
        yy - Math.sin(pi / 9) * radius
      );
      moveMouse(p);
      const ptoAngles = [1.4, 3.4, 5, 6];

      tri?.setAttributeNS(null, "points", makeString(points));

      const svgEle = svg as SVGGraphicsElement
      svgEle?.addEventListener("mousemove", (event) => {
        p = new DOMPoint(event.clientX, event.clientY);
        p = p.matrixTransform(svgEle.getScreenCTM()?.inverse());
        moveMouse(p);
      });

      letterA?.setAttribute("x", (pA[0] + 4) + "");
      letterA?.setAttribute("y", (pA[1] + 9) + "");
      letterA?.setAttribute("font-size", "1.5rem");

      letterB?.setAttribute("x", (pB[0] - 20) + "");
      letterB?.setAttribute("y", (pB[1] + 10) + "");
      letterB?.setAttribute("font-size", "1.5rem");

      letterC?.setAttribute("x", (pC[0] - 12) + "");
      letterC?.setAttribute("y", (pC[1] - 6) + "");
      letterC?.setAttribute("font-size", "1.5rem");
    }
  },
);
</script>
