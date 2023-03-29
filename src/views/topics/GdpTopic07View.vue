<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>

  </ATypographyParagraph>
  <div class="app">
    <ATypographyTitle :level="4">Animated Isotomic Conjugate Points</ATypographyTitle>
    <ATypographyParagraph class="topics-description">
   <p>In the following triangle <span v-katex>\triangle ABC</span>, <span v-katex>P</span> and <span v-katex>P'</span>
  are isotomic conjugate points. </p>

  <p>Click, hold, and move Point  <span v-katex>P </span>, one can see that when lines
    <span v-katex>AD, BE, CF </span> are concurrent, then the corresponding isotomic  lines  <span v-katex>AD', BE', CF'</span>
  must be concurrent at the isotomic conjugate point  <span v-katex>P'</span> of <span v-katex>P</span>.</p>
  </ATypographyParagraph>
    <svg id="tri-app_isotomic" width="500" height="500" style="border: 2px solid black; background-color: floralwhite; user-select: none">
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
      <text id="letterD_isotomic" font-size="25px" fill="purple">F</text>
      <text id="letterE_isotomic" font-size="25px" fill="purple">E</text>
      <text id="letterF_isotomic" font-size="25px" fill="purple">D</text>
      <text id="letterDp_isotomic" font-size="25px" fill="orange">F′</text>
      <text id="letterEp_isotomic" font-size="25px" fill="orange">E′</text>
      <text id="letterFp_isotomic" font-size="25px" fill="orange">D′</text>
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
      <circle id="circleP_isotomic_conjugateP" r="3px" padding="20px"></circle>       // added circle element (isotomic conjugate P) to template
      <circle id="circleP_isotomic_conjugatePprime" r="3px" padding="20px"></circle>  // added circle element (isotomic conjugate P') to template
    </svg>

        <ATypographyTitle :level="4">Animated Isogonal Conjugate Points</ATypographyTitle>
        <ATypographyParagraph class="topics-description">
   <p>In the following triangle <span v-katex>\triangle ABC</span>, <span v-katex>P</span> and <span v-katex>P'</span>
  are isogonal conjugate points. </p>

  <p>Click, hold, and move Point  <span v-katex>P </span>, one can see that when lines
    <span v-katex>AD, BE, CF </span> are concurrent, then the corresponding isogonal lines  <span v-katex>AD', BE', CF'</span>
  must be concurrent at the isogonal conjugate point  <span v-katex>P'</span> of <span v-katex>P</span>.</p>
  </ATypographyParagraph>
    <svg id="tri-app_isogonal" width="500" height="500" style="border: 2px solid black; background-color: floralwhite; user-select: none">
      <polygon id="tri_isogonal" stroke="black" fill="transparent" />
      <line id="lineA_isogonal" stroke="purple" />
      <line id="lineB_isogonal" stroke="purple" />
      <line id="lineC_isogonal" stroke="purple" />
      <line id="lineD_isogonal" stroke="orange" />
      <line id="lineE_isogonal" stroke="orange" />
      <line id="lineF_isogonal" stroke="orange" />
      <text id="letterA_isogonal" font-size="25px">C</text>
      <text id="letterB_isogonal" font-size="25px">B</text>
      <text id="letterC_isogonal" font-size="25px">A</text>
      <text id="letterD_isogonal" font-size="25px" fill="orange">D′</text>
      <text id="letterE_isogonal" font-size="25px" fill="orange">E′</text>
      <text id="letterF_isogonal" font-size="25px" fill="orange">F′</text>
      <text id="letterDp_isogonal" font-size="25px" fill="purple">D</text>
      <text id="letterEp_isogonal" font-size="25px" fill="purple">E</text>
      <text id="letterFp_isogonal" font-size="25px" fill="purple">F</text>
      <text id="letterP_isogonal" font-size="25px" style="text-shadow:
            -1px -1px 0 #FFFFFF,
            0   -1px 0 #FFFFFF,
            1px -1px 0 #FFFFFF,
            1px  0   0 #FFFFFF,
            1px  1px 0 #FFFFFF,
            0    1px 0 #FFFFFF,
            -1px  1px 0 #FFFFFF,
            -1px  0   0 #FFFFFF;">P</text>
      <text id="letterPp_isogonal" font-size="25px">P′</text>
      <circle id="circleP_isogonal_conjugateP" r="3px" padding="20px"></circle>       // added circle element (isogonal conjugate P) to template
      <circle id="circleP_isogonal_conjugatePprime" r="3px" padding="20px"></circle>  // added circle element (isogonal conjugate P') to template
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
  makeString, pointAlongLine,
} from "@/utils/geometry";
import { Vector } from "../../utils/vector";
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
      //
      const svg2 = document.querySelector("#tri-app_isogonal");
      const tri2 = document.querySelector("#tri_isogonal") as Element;
      const line1a = document.querySelector("#lineA_isogonal") as Element;
      const line2a = document.querySelector("#lineB_isogonal") as Element;
      const line3a = document.querySelector("#lineC_isogonal") as Element;
      const line4a = document.querySelector("#lineD_isogonal") as Element;
      const line5a = document.querySelector("#lineE_isogonal") as Element;
      const line6a = document.querySelector("#lineF_isogonal") as Element;
      const letterB2 = document.querySelector("#letterB_isogonal") as Element;
      const letterA2 = document.querySelector("#letterA_isogonal") as Element;
      const letterC2 = document.querySelector("#letterC_isogonal") as Element;
      const letterP2 = document.querySelector("#letterP_isogonal") as Element;
      const letterD2 = document.querySelector("#letterD_isogonal") as Element;
      const letterE2 = document.querySelector("#letterE_isogonal") as Element;
      const letterF2 = document.querySelector("#letterF_isogonal") as Element;
      const letterDp2 = document.querySelector("#letterDp_isogonal") as Element;
      const letterEp2 = document.querySelector("#letterEp_isogonal") as Element;
      const letterFp2 = document.querySelector("#letterFp_isogonal") as Element;
      const letterPp2 = document.querySelector("#letterPp_isogonal") as Element;
      letterA2?.setAttribute("x", pA[0] + 5 + "");
      letterA2?.setAttribute("y", pA[1] + "");
      letterB2?.setAttribute("x", pB[0] - 20 + "");
      letterB2?.setAttribute("y", pB[1] + 5 + "");
      letterC2?.setAttribute("x", pC[0] - 5 + "");
      letterC2?.setAttribute("y", pC[1] - 5 + "");

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

        // added filled circles to points P and P' for Isotomic Conjugate
        const circlePIsotomicConjugate = document.querySelector("#circleP_isotomic_conjugateP") as Element;  // added circleP as an element
        circlePIsotomicConjugate.setAttribute("cx", pP[0] + "");
        circlePIsotomicConjugate.setAttribute("cy", (pP[1]) + "");

        const circlePprimeIsotomicConjugate = document.querySelector("#circleP_isotomic_conjugatePprime") as Element;  // added circlePprime as an element
        circlePprimeIsotomicConjugate.setAttribute("cx", pPN![0] + "");
        circlePprimeIsotomicConjugate.setAttribute("cy", (pPN![1]) + "");

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

      // added filled circles to point P for Isogonal Conjugate
      const circlePIsogonalConjugate = document.querySelector("#circleP_isogonal_conjugateP") as Element;  // added circleP as an element

      const isogonalConjugate = (p: DOMPoint) => {
        if (isInside(pA[0], pA[1], pB[0], pB[1], pC[0], pC[1], p.x, p.y)) {
          pP = [p.x, p.y];
          /* dot.setAttributeNS(null, "cx", pP[0]);
          dot.setAttributeNS(null, "cy", pP[1]);*/
          letterP2?.setAttribute("x", pP[0] + "");
          letterP2?.setAttribute("y", pP[1] - 10 + "");

          // set attributes (x, y) for circle dot for point P (isogonal conjugate)
          circlePIsogonalConjugate.setAttribute("cx", pP[0] + "");
          circlePIsogonalConjugate.setAttribute("cy", pP[1] + "");
        } else {
          return;
        }

        const cosx =
          (p.x - xx) / Math.sqrt((p.x - xx) * (p.x - xx) + (p.y - yy) * (p.y - yy));
        const sinx =
          (p.y - yy) / Math.sqrt((p.x - xx) * (p.x - xx) + (p.y - yy) * (p.y - yy));

        p.x = xx + radius * cosx;
        p.y = yy + radius * sinx;

        tri2?.setAttributeNS(
          null,
          "points",
          makeString([points[0], points[1], points[2]])
        );
        const pPAB = lineLineIntersection(pC, pB, pA, pP) as number[];
        drawLine(pA, pPAB, line1a);

        const pPAC = lineLineIntersection(pA, pC, pB, pP) as number[];
        drawLine(pB, pPAC, line2a);

        const pPBC = lineLineIntersection(pB, pA, pC, pP) as number[];
        drawLine(pC, pPBC, line3a);
        letterEp2.setAttribute("x", pPAC[0] + "");
        letterEp2.setAttribute("y", pPAC[1] + "");
        letterFp2.setAttribute("x", pPAB[0] - 20 + "");
        letterFp2.setAttribute("y", pPAB[1] + "");
        letterDp2.setAttribute("x", pPBC[0] + "");
        letterDp2.setAttribute("y", pPBC[1] + 20 + "");

        const v1 = new Vector(pA[0] - pC[0], pA[1] - pC[1]);
        const v2 = new Vector(pP[0] - pC[0], pP[1] - pC[1]);
        const v3 = new Vector(pB[0] - pC[0], pB[1] - pC[1]);
        const thetaBP = Vector.angleBetween(v3, v2);
        const medC = Vector.rotate(v1, thetaBP);
        const medCl = lineLineIntersection([pC[0] + medC.x, pC[1] + medC.y], pC, pA, pB);
        if (medCl === null) return;
        drawLine(medCl, pC, line4a);

        const vab = new Vector(pA[0] - pB[0], pA[1] - pB[1]);
        const vcb = new Vector(pC[0] - pB[0], pC[1] - pB[1]);
        const vpb = new Vector(pP[0] - pB[0], pP[1] - pB[1]);
        const tAPB = Vector.angleBetween(vab, vpb);
        const medB = Vector.rotate(vcb, tAPB);
        const medBl = lineLineIntersection([pB[0] + medB.x, pB[1] + medB.y], pB, pA, pC);
        if (medBl === null) return;
        drawLine(medBl, pB, line5a);
        //
        const vba = new Vector(pB[0] - pA[0], pB[1] - pA[1]);
        const vca = new Vector(pC[0] - pA[0], pC[1] - pA[1]);
        const vpa = new Vector(pP[0] - pA[0], pP[1] - pA[1]);
        const tCP = Vector.angleBetween(vca, vpa);
        const medA = Vector.rotate(vba, tCP);
        const medAl = lineLineIntersection([pA[0] + medA.x, pA[1] + medA.y], pA, pB, pC);
        if (medAl === null) return;
        drawLine(medAl, pA, line6a);
        const pPrime = lineLineIntersection(medCl, pC, medBl, pB);
        if (pPrime === null) return;
        letterPp2.setAttribute("x", pPrime[0] + "");
        letterPp2.setAttribute("y", pPrime[1] - 20 + "");
        letterD2.setAttribute("x", medCl[0] + "");
        letterD2.setAttribute("y", medCl[1] + 20 + "");
        letterE2.setAttribute("x", medBl[0] + 5 + "");
        letterE2.setAttribute("y", medBl[1] + "");
        letterF2.setAttribute("x", medAl[0] - 20 + "");
        letterF2.setAttribute("y", medAl[1] + "");

        // added filled circles to points P and P' for Isogonal Conjugate
        const circlePprimeIsogonalConjugate = document.querySelector("#circleP_isogonal_conjugatePprime") as Element;  // added circlePprime as an element

        circlePprimeIsogonalConjugate.setAttribute("cx", pPrime[0] + "");
        circlePprimeIsogonalConjugate.setAttribute("cy", pPrime[1] + "");
      };
        const pPoint = DOMPoint.fromPoint({
            x: 160,
            y: 260,
            z: 0,
            w: 0,
        });
        isotomicMouse(pPoint);
        const pPoint2 = DOMPoint.fromPoint({
            x: 160,
            y: 300,
            z: 0,
            w: 0,
        });
        isogonalConjugate(pPoint2);

      tri?.setAttributeNS(null, "points", makeString(points));
      tri2?.setAttributeNS(null, "points", makeString(points));
      // svg.("onclick", (event) => {
      //   constp;
      // });
      let mouseDown = 0;
      document.body.onmousedown = function () {
        mouseDown++;
      };
      document.body.onmouseup = function () {
        mouseDown--;
      };
      const svgElement = svg as SVGGraphicsElement;
      svgElement.addEventListener("mousemove", (event) => {
        let p = new DOMPoint(event.clientX, event.clientY);
        p = p.matrixTransform(svgElement.getScreenCTM()?.inverse());
        if (mouseDown) {
          isotomicMouse(p);
        }
      });
      const svgElement2 = svg2 as SVGGraphicsElement;
      svgElement2.addEventListener("mousemove", (event) => {
        let p = new DOMPoint(event.clientX, event.clientY);
        p = p.matrixTransform(svgElement2.getScreenCTM()?.inverse());
        if (mouseDown) {
          isogonalConjugate(p);
        }
        // if ()
      });
    }
  },
);
</script>
