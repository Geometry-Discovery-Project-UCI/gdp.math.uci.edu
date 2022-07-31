<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>
  </ATypographyParagraph>
  <svg id="tri-app_erdos-mordell" width="500" height="500" style="border: 2px solid black; background-color: floralwhite">
    <polygon id="tri_erdos-mordell" stroke="black" fill="transparent"></polygon>
    <text id="letterA_erdos-mordell" font-size="25px">A</text>
    <text id="letterB_erdos-mordell" font-size="25px">B</text>
    <text id="letterC_erdos-mordell" font-size="25px">C</text>
    <text id="letterE_erdos-mordell" font-size="25px">E</text>
    <text id="letterF_erdos-mordell" font-size="25px">F</text>
    <text id="letterD_erdos-mordell" font-size="25px">D</text>
    <text id="letterP_erdos-mordell" font-size="25px">P</text>
    <line id="line1_erdos-mordell" stroke="orange"></line>
    <line id="line2_erdos-mordell" stroke="orange"></line>
    <line id="line3_erdos-mordell" stroke="orange"></line>
    <line id="line4_erdos-mordell" stroke="orange"></line>
    <line id="line5_erdos-mordell" stroke="orange"></line>
    <line id="line6_erdos-mordell" stroke="orange"></line>
    <text font-size="20px" x="190" y="30">PA + PB + PC ≥ 2(PD + PE + PF)</text>
    <text font-size="20px" id="PA_erdos-mordell" x="190" y="50"></text>
    <text font-size="20px" id="PB_erdos-mordell" x="240" y="50"></text>
    <text font-size="20px" id="PC_erdos-mordell" x="290" y="50"></text>
    <text font-size="20px" id="PD_erdos-mordell" x="355" y="50"></text>
    <text font-size="20px" id="PE_erdos-mordell" x="400" y="50"></text>
    <text font-size="20px" id="PF_erdos-mordell" x="435" y="50"></text>
    <text font-size="20px" id="LHS_erdos-mordell" x="290" y="80"></text>
    <text font-size="20px" id="RHS_erdos-mordell" x="340" y="80"></text>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import {
distToLine,
  drawLine,
  findDistance,
  isInside,
  lineLineIntersection,
  makeString, pointAlongLine, projectPoint2Line,
} from "@/utils/geometry";
import { Vector } from "../../utils/vector";
const topic = indexTopicMap.get(4) as Topic;
export default defineComponent(
  {
    setup() {
      return { topic };
    },
    mounted() {
      const svg = document.querySelector("#tri-app_erdos-mordell");
      const pi = 3.14;

      const radius = 200;
      const xx = 250;
      const yy = 250;

      let pC = [xx + Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
      let pB = [xx - Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
      let pA = [xx - Math.cos(pi / 3) * radius, yy - Math.sin(pi / 3) * radius];
      let points = [pA, pB, pC];
      let pP = [349, 305];
      const tri = document.querySelector("#tri_erdos-mordell") as Element;
      const letterB = document.querySelector("#letterB_erdos-mordell") as Element;
      const letterA = document.querySelector("#letterA_erdos-mordell") as Element;
      const letterP = document.querySelector("#letterP_erdos-mordell") as Element;
      const letterC = document.querySelector("#letterC_erdos-mordell") as Element;
      const letterE = document.querySelector("#letterE_erdos-mordell") as Element;
      const letterD = document.querySelector("#letterD_erdos-mordell") as Element;
      const letterF = document.querySelector("#letterF_erdos-mordell") as Element;
      const PA = document.querySelector("#PA_erdos-mordell") as Element;
      const PB = document.querySelector("#PB_erdos-mordell") as Element;
      const PC = document.querySelector("#PC_erdos-mordell") as Element;
      const PD = document.querySelector("#PD_erdos-mordell") as Element;
      const PE = document.querySelector("#PE_erdos-mordell") as Element;
      const PF = document.querySelector("#PF_erdos-mordell") as Element;
      const LHS = document.querySelector("#LHS_erdos-mordell") as Element;
      const RHS = document.querySelector("#RHS_erdos-mordell") as Element;
      const line1 = document.querySelector("#line1_erdos-mordell") as Element;
      const line2 = document.querySelector("#line2_erdos-mordell") as Element;
      const line3 = document.querySelector("#line3_erdos-mordell") as Element;
      const line4 = document.querySelector("#line4_erdos-mordell") as Element;
      const line5 = document.querySelector("#line5_erdos-mordell") as Element;
      const line6 = document.querySelector("#line6_erdos-mordell") as Element;
      letterA?.setAttribute("x", pA[0] + "");
      letterA?.setAttribute("y", pA[1] - 10 + "");
      letterB?.setAttribute("x", pB[0] - 20 + "");
      letterB?.setAttribute("y", pB[1] + 5 + "");
      letterC?.setAttribute("x", pC[0] - 5 + "");
      letterC?.setAttribute("y", pC[1] - 5 + "");
      tri?.setAttributeNS(
        null,
        "points",
        makeString([points[0], points[1], points[2]])
      );
      let dpbc = distToLine(pP, pB, pC);
      let dpac = distToLine(pP, pA, pC);
      let dpab = distToLine(pP, pA, pB);
      let dpa = findDistance(pP, pA);
      let dpb = findDistance(pP, pB);
      let dpc = findDistance(pP, pC);
      const erdos_mordell = (p: DOMPoint) => {
        if (isInside(pA[0], pA[1], pB[0], pB[1], pC[0], pC[1], p.x, p.y)) {
          pP = [p.x, p.y];
          /* dot.setAttributeNS(null, "cx", pP[0]);
          dot.setAttributeNS(null, "cy", pP[1]);*/
          letterP?.setAttribute("x", pP[0] + "");
          letterP?.setAttribute("y", pP[1] - 10 + "");
        } else {
          return;
        }
        tri?.setAttributeNS(
          null,
          "points",
          makeString([points[0], points[1], points[2]])
        );
        letterA?.setAttribute("x", pA[0] + "");
        letterA?.setAttribute("y", pA[1] - 10 + "");
        letterB?.setAttribute("x", pB[0] - 20 + "");
        letterB?.setAttribute("y", pB[1] + 5 + "");
        letterC?.setAttribute("x", pC[0] - 5 + "");
        letterC?.setAttribute("y", pC[1] - 5 + "");
        const pbc = projectPoint2Line(pP, pB, pC) as number[];
        drawLine(pbc, pP, line1);
        const pac = projectPoint2Line(pP, pA, pC) as number[];
        drawLine(pac, pP, line2);
        const pab = projectPoint2Line(pP, pA, pB) as number[];
        drawLine(pab, pP, line3);
        drawLine(pP, pA, line4);
        drawLine(pP, pB, line5);
        drawLine(pP, pC, line6);
        letterE.setAttribute("x", pbc[0] + "");
        letterE.setAttribute("y", pbc[1] + 20 + "");
        letterD.setAttribute("x", pac[0] + "");
        letterD.setAttribute("y", pac[1] + "");
        letterF.setAttribute("x", pab[0] - 20 + "");
        letterF.setAttribute("y", pab[1] + "");
        dpbc = Math.round(findDistance(pbc, pP) / 10);
        dpac = Math.round(findDistance(pac, pP) / 10);
        dpab = Math.round(findDistance(pab, pP) / 10);
        dpa = Math.round(findDistance(pP, pA) / 10);
        dpb = Math.round(findDistance(pP, pB) / 10);
        dpc = Math.round(findDistance(pP, pC) / 10);
        PA.innerHTML = dpa + " + ";
        PB.innerHTML = dpb + " + ";
        PC.innerHTML = dpc + " ≥ 2(";
        PD.innerHTML = dpac + " + ";
        PE.innerHTML = dpbc + " + ";
        PF.innerHTML = dpab + ")";
        LHS.innerHTML = dpa + dpb + dpc + " ≥ ";
        RHS.innerHTML = 2 * (dpac + dpbc + dpab) + "";
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
      erdos_mordell(pPoint);
      let mouseDown = 0;
      document.body.onmousedown = function () {
        mouseOnP = false;
        mouseOnA = false;
        mouseOnB = false;
        mouseOnC = false;
        ++mouseDown;
      };
      document.body.onmouseup = function () {
        --mouseDown;
      };
      const svgElement = svg as SVGGraphicsElement;
      svgElement.addEventListener("mousemove", (event) => {
        let p = new DOMPoint(event.clientX, event.clientY);
        p = p.matrixTransform(svgElement.getScreenCTM()?.inverse());
        if (Math.abs(p.x - pP[0]) + Math.abs(p.y - pP[1]) < 10) {
          mouseOnP = true;
        } else if (Math.abs(p.x - pA[0]) + Math.abs(p.y - pA[1]) < 10) {
          mouseOnA = true;
        } else if (Math.abs(p.x - pC[0]) + Math.abs(p.y - pC[1]) < 10) {
          mouseOnC = true;
        } else if (Math.abs(p.x - pB[0]) + Math.abs(p.y - pB[1]) < 10) {
          mouseOnB = true;
        }
        if (mouseDown) {
          if (mouseOnP) {
            erdos_mordell(p);
          } else if (mouseOnA) {
            pA = [p.x, p.y];
            points = [pA, pB, pC];
            erdos_mordell(new DOMPoint(pP[0], pP[1]));
          } else if (mouseOnB) {
            pB = [p.x, p.y];
            points = [pA, pB, pC];
            erdos_mordell(new DOMPoint(pP[0], pP[1]));
          } else if (mouseOnC) {
            pC = [p.x, p.y];
            points = [pA, pB, pC];
            erdos_mordell(new DOMPoint(pP[0], pP[1]));
          }
        }
      });
    }
  },
);
</script>
