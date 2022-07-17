<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>

  </ATypographyParagraph>
  <div class="app">
    <ATypographyTitle :level="4">Animated Isogonal Conjugate</ATypographyTitle>
    <svg id="tri-app_isotomic" width="500" height="500" style="border: 2px solid black; background-color: floralwhite">
      <polygon id="tri_isotomic" stroke="black" fill="transparent" />
      <line id="lineA_isotomic" stroke="purple" />
      <line id="lineB_isotomic" stroke="purple" />
      <line id="lineC_isotomic" stroke="purple" />
      <line id="lineAp_isotomic" stroke="orange" />
      <line id="lineBp_isotomic" stroke="orange" />
      <line id="lineCp_isotomic" stroke="orange" />
      <text id="letterA_isotomic" font-size="25px">C</text>
      <text id="letterB_isotomic" font-size="25px">B</text>
      <text id="letterC_isotomic" font-size="25px">A</text>
      <text id="letterD_isotomic" font-size="25px" fill="purple">D</text>
      <text id="letterE_isotomic" font-size="25px" fill="purple">E</text>
      <text id="letterF_isotomic" font-size="25px" fill="purple">F</text>
      <text id="letterDp_isotomic" font-size="25px" fill="orange">D′</text>
      <text id="letterEp_isotomic" font-size="25px" fill="orange">E′</text>
      <text id="letterFp_isotomic" font-size="25px" fill="orange">F′</text>
      <text id="letterP_isotomic" font-size="25px" style="text-shadow:
            -1px -1px 0 #FFFFFF,
            0   -1px 0 #FFFFFF,
            1px -1px 0 #FFFFFF,
            1px  0   0 #FFFFFF,
            1px  1px 0 #FFFFFF,
            0    1px 0 #FFFFFF,
            -1px  1px 0 #FFFFFF,
            -1px  0   0 #FFFFFF;">P</text>
      <text id="letterPp_isotomic" font-size="25px" style="text-shadow:
            -1px -1px 0 #FFFFFF,
            0   -1px 0 #FFFFFF,
            1px -1px 0 #FFFFFF,
            1px  0   0 #FFFFFF,
            1px  1px 0 #FFFFFF,
            0    1px 0 #FFFFFF,
            -1px  1px 0 #FFFFFF,
            -1px  0   0 #FFFFFF;">P′</text>
    </svg>
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import {
  drawLine,
  findDistance,
  isInside,
  lineLineIntersection,
  makeString, pointAlongLine
} from "@/utils/geometry";
const topic = indexTopicMap.get(7) as Topic;
export default defineComponent(
  {
    setup() {
      return { topic };
    },
    mounted() {
      const svg = document.querySelector("#tri-app_isotomic");
      const pi = 3.14;

      const radius = 200;
      const xx = 250;
      const yy = 250;

      const pA = [xx + Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
      const pB = [xx - Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
      const pC = [xx - Math.cos(pi / 3) * radius, yy - Math.sin(pi / 3) * radius];
      const points = [pA, pB, pC];
      let pP = [349, 305];

      const tri = document.querySelector("#tri_isotomic") as Element;
      const line4 = document.querySelector("#lineA_isotomic") as Element;
      const line5 = document.querySelector("#lineB_isotomic") as Element;
      const line6 = document.querySelector("#lineC_isotomic") as Element;
      const line7 = document.querySelector("#lineAp_isotomic") as Element;
      const line8 = document.querySelector("#lineBp_isotomic") as Element;
      const line9 = document.querySelector("#lineCp_isotomic") as Element;
      const letterB = document.querySelector("#letterB_isotomic") as Element;
      const letterA = document.querySelector("#letterA_isotomic") as Element;
      const letterC = document.querySelector("#letterC_isotomic") as Element;
      const letterD = document.querySelector("#letterD_isotomic") as Element;
      const letterE = document.querySelector("#letterE_isotomic") as Element;
      const letterF = document.querySelector("#letterF_isotomic") as Element;
      const letterDp = document.querySelector("#letterDp_isotomic") as Element;
      const letterEp = document.querySelector("#letterEp_isotomic") as Element;
      const letterFp = document.querySelector("#letterFp_isotomic") as Element;
      const letterP = document.querySelector("#letterP_isotomic") as Element;
      const letterPp = document.querySelector("#letterPp_isotomic") as Element;

      letterA?.setAttribute("x", pA[0] + 5 + "");
      letterA?.setAttribute("y", pA[1] + "");
      letterB?.setAttribute("x", pB[0] - 20 + "");
      letterB?.setAttribute("y", pB[1] + 5 + "");
      letterC?.setAttribute("x", pC[0] - 5 + "");
      letterC?.setAttribute("y", pC[1] - 5 + "");

      const isotomicMouse = (p: DOMPoint) => {
        if (isInside(pA[0], pA[1], pB[0], pB[1], pC[0], pC[1], p.x, p.y)) {
          pP = [p.x, p.y];
          /* dot.setAttributeNS(null, "cx", pP[0]);
          dot.setAttributeNS(null, "cy", pP[1]);*/
          letterP?.setAttribute("x", pP[0] + "");
          letterP?.setAttribute("y", pP[1] - 10 + "");
        } else {
          return;
        }

        const cosx =
          (p.x - xx) / Math.sqrt((p.x - xx) * (p.x - xx) + (p.y - yy) * (p.y - yy));
        const sinx =
          (p.y - yy) / Math.sqrt((p.x - xx) * (p.x - xx) + (p.y - yy) * (p.y - yy));

        p.x = xx + radius * cosx;
        p.y = yy + radius * sinx;

        tri?.setAttributeNS(
          null,
          "points",
          makeString([points[0], points[1], points[2]])
        );

        const pCN = lineLineIntersection(pC, pP, pA, pB) as number[];
        drawLine(pC, pCN, line4);

        const pAN = lineLineIntersection(pA, pP, pC, pB) as number[];
        drawLine(pA, pAN, line5);

        const pBN = lineLineIntersection(pB, pP, pC, pA) as number[];
        drawLine(pB, pBN, line6);

        const dC = findDistance(pCN, pB);
        const pDC = pointAlongLine(pA, pB, dC);
        drawLine(pC, pDC, line7);

        const dA = findDistance(pAN, pB);
        const pDA = pointAlongLine(pC, pB, dA);
        drawLine(pA, pDA, line8);

        const dB = findDistance(pBN, pC);
        const pDB = pointAlongLine(pA, pC, dB);
        drawLine(pB, pDB, line9);

        /* eslint-disable @typescript-eslint/no-non-null-assertion */

        const pPN = lineLineIntersection(pC, pDC, pB, pDB);
        letterPp?.setAttribute("x", pPN![0] + "");
        letterPp?.setAttribute("y", (pPN![1] - 10) + "");

        letterF?.setAttribute("x", pCN![0] + "");
        letterF?.setAttribute("y", (pCN![1] + 20) + "");

        letterD?.setAttribute("x", (pAN![0] - 20) + "");
        letterD?.setAttribute("y", pAN![1] + "");

        letterE?.setAttribute("x", (pBN![0] + 20) + "");
        letterE?.setAttribute("y", pBN![1] + "");

        /* eslint-enable @typescript-eslint/no-non-null-assertion */

        letterFp?.setAttribute("x", pDC[0] + "");
        letterFp?.setAttribute("y", (pDC[1] + 20) + "");

        letterDp?.setAttribute("x", (pDA[0] - 20) + "");
        letterDp?.setAttribute("y", pDA[1] + "");

        letterEp?.setAttribute("x", (pDB[0] + 20) + "");
        letterEp?.setAttribute("y", pDB[1] + "");
      };

      const pPoint = DOMPoint.fromPoint({
        x: 160,
        y: 260,
        z: 0,
        w: 0,
      });
      isotomicMouse(pPoint);

      tri?.setAttributeNS(null, "points", makeString(points));
      // svg.("onclick", (event) => {
      //   constp;
      // });
      const svgElement = svg as SVGGraphicsElement;
      svgElement.addEventListener("mousemove", (event) => {
        let p = new DOMPoint(event.clientX, event.clientY);
        p = p.matrixTransform(svgElement.getScreenCTM()?.inverse());
        isotomicMouse(p);

        // if ()
      });
    }
  },
);
</script>
