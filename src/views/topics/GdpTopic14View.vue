<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph> </ATypographyParagraph>
  <svg
    id="tri-app_fermat-point"
    width="500"
    height="500"
    style="border: 2px solid black; background-color: floralwhite;
    -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;"
  >
    <polygon id="tri_fermat-point" stroke="black" stroke-width="2.5px" fill="transparent"></polygon>
    <text id="letterA_fermat-point" font-size="25px">A</text>
    <text id="letterB_fermat-point" font-size="25px">B</text>
    <text id="letterC_fermat-point" font-size="25px">C</text>
    <text id="letterP_fermat-point" font-size="25px">P</text>
    <text id="letterX_fermat-point" font-size="25px"></text>
    <text id="letterY_fermat-point" font-size="25px"></text>
    <text id="letterQ_fermat-point" font-size="25px"></text>
    <text id="letterP_fermat-point" font-size="25px">P</text>
    <line id="line1_fermat-point" stroke="purple" stroke-width="1px"></line>
    <line id="line2_fermat-point" stroke="purple" stroke-width="1px"></line>
    <line id="line3_fermat-point" stroke="purple" stroke-width="1px"></line>
    <circle id="circle_fermat-point" r="2px" fill="purple"></circle>
  </svg>
  <p id="t1_fp">m1: 0</p>
  <input type="range" min="0" max="100" class="slider" id="m1_fp" />
  <p id="t2_fp">m2: 0</p>
  <input type="range" min="0" max="100" class="slider" id="m2_fp" />
  <p id="t3_fp">m3: 0</p>
  <input type="range" min="0" max="100" class="slider" id="m3_fp" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import {
  drawLine,
  findDistance,
  aboveBelow,
  setp,
  lerpp,
  makeString,
  findSlope,
  getPedalPoint,
  getEquationFromPoint,
} from "@/utils/geometry";
import { Vector } from "@/utils/vector";
const topic = indexTopicMap.get(14) as Topic;
export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const svg = document.querySelector("#tri-app_fermat-point");
    const pi = 3.14;

    const radius = 200;
    const xx = 250;
    const yy = 250;

    let pC = [xx + Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
    let pB = [xx - Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
    let pA = [xx - Math.cos(pi / 3) * radius, yy - Math.sin(pi / 3) * radius];
    let points = [pA, pB, pC];
    const tri = document.querySelector("#tri_fermat-point") as Element;
    const letterA = document.querySelector("#letterA_fermat-point") as Element;
    const letterB = document.querySelector("#letterB_fermat-point") as Element;
    const letterC = document.querySelector("#letterC_fermat-point") as Element;
    const letterQ = document.querySelector("#letterQ_fermat-point") as Element;
    const letterX = document.querySelector("#letterX_fermat-point") as Element;
    const letterY = document.querySelector("#letterY_fermat-point") as Element;
    const letterP = document.querySelector("#letterP_fermat-point") as Element;
    const line1 = document.querySelector("#line1_fermat-point") as Element;
    const line2 = document.querySelector("#line2_fermat-point") as Element;
    const line3 = document.querySelector("#line3_fermat-point") as Element;
    const m1 = document.querySelector("#m1_fp") as HTMLInputElement;
    const m2 = document.querySelector("#m2_fp") as HTMLInputElement;
    const m3 = document.querySelector("#m3_fp") as HTMLInputElement;
    const m1t = document.querySelector("#t1_fp") as HTMLInputElement;
    const m2t = document.querySelector("#t2_fp") as HTMLInputElement;
    const m3t = document.querySelector("#t3_fp") as HTMLInputElement;
    const cc = document.querySelector("#circle_fermat-point") as Element;
    letterA?.setAttribute("x", pA[0] + "");
    letterA?.setAttribute("y", pA[1] - 10 + "");
    letterB?.setAttribute("x", pB[0] - 20 + "");
    letterB?.setAttribute("y", pB[1] + 5 + "");
    letterC?.setAttribute("x", pC[0] - 5 + "");
    letterC?.setAttribute("y", pC[1] - 5 + "");
    tri?.setAttributeNS(null, "points", makeString([points[0], points[1], points[2]]));
    let m1v = parseInt(m1.value) / 100,
      m2v = parseInt(m2.value) / 100,
      m3v = parseInt(m3.value) / 100;
    m1t.innerHTML = "m1: " + m1v;

    const fermat_point = () => {
      tri?.setAttributeNS(null, "points", makeString([points[0], points[1], points[2]]));
      letterA?.setAttribute("x", pA[0] + "");
      letterA?.setAttribute("y", pA[1] - 10 + "");
      letterB?.setAttribute("x", pB[0] - 20 + "");
      letterB?.setAttribute("y", pB[1] + 25 + "");
      letterC?.setAttribute("x", pC[0] + "");
      letterC?.setAttribute("y", pC[1] + 25 + "");
      m1v = parseInt(m1.value) / 100;
      m2v = parseInt(m2.value) / 100;
      m3v = parseInt(m3.value) / 100;
      if (m1v >= m2v + m3v) {
        cc.setAttribute("cx", pA[0] + "");
        cc.setAttribute("cy", pA[1] + "");
        letterP?.setAttribute("x", pA[0] - 15 + "");
        letterP?.setAttribute("y", pA[1] - 8 + "");
        //setp(letterP, pA);
        drawLine(pA, pA, line1);
        drawLine(pA, pB, line2);
        drawLine(pA, pC, line3);
        return;
      } else if (m2v >= m3v + m1v) {
        cc.setAttribute("cx", pB[0] + "");
        cc.setAttribute("cy", pB[1] + "");
        letterP?.setAttribute("x", pB[0] - 20 + "");
        letterP?.setAttribute("y", pB[1] - 10 + "");
        //setp(letterP, pB);
        drawLine(pB, pA, line1);
        drawLine(pB, pB, line2);
        drawLine(pB, pC, line3);
        return;
      } else if (m3v >= m1v + m2v) {
        cc.setAttribute("cx", pC[0] + "");
        cc.setAttribute("cy", pC[1] + "");
        setp(letterP, pC);
        drawLine(pC, pA, line1);
        drawLine(pC, pB, line2);
        drawLine(pC, pC, line3);
        return;
      }
      const alpha = Math.acos((m1v * m1v - m2v * m2v - m3v * m3v) / 2 / m2v / m3v);
      const beta = Math.acos((m2v * m2v - m3v * m3v - m1v * m1v) / 2 / m3v / m1v);
      const gamma = Math.acos((m3v * m3v - m2v * m2v - m1v * m1v) / 2 / m1v / m2v);
      const vab = new Vector(pB[0] - pA[0], pB[1] - pA[1]);
      const vac = new Vector(pC[0] - pA[0], pC[1] - pA[1]);
      const thetaA = Vector.angleBetween(vac, vab);
      const vbc = new Vector(pC[0] - pB[0], pC[1] - pB[1]);
      const vba = new Vector(pA[0] - pB[0], pA[1] - pB[1]);
      const thetaB = Vector.angleBetween(vbc, vba);
      const vcb = new Vector(pB[0] - pC[0], pB[1] - pC[1]);
      const vca = new Vector(pA[0] - pC[0], pA[1] - pC[1]);
      const thetaC = Vector.angleBetween(vcb, vca);
      if (alpha <= thetaA) {
        cc.setAttribute("cx", pA[0] + "");
        cc.setAttribute("cy", pA[1] + "");
        letterP?.setAttribute("x", pA[0] - 15 + "");
        letterP?.setAttribute("y", pA[1] - 8 + "");
        //setp(letterP, pA);
        drawLine(pA, pA, line1);
        drawLine(pA, pB, line2);
        drawLine(pA, pC, line3);
        return;
      } else if (beta <= thetaB) {
        cc.setAttribute("cx", pB[0] + "");
        cc.setAttribute("cy", pB[1] + "");
        letterP?.setAttribute("x", pB[0] - 20 + "");
        letterP?.setAttribute("y", pB[1] - 10 + "");
        //setp(letterP, pB);
        drawLine(pB, pA, line1);
        drawLine(pB, pB, line2);
        drawLine(pB, pC, line3);
        return;
      } else if (gamma <= thetaC) {
        cc.setAttribute("cx", pC[0] + "");
        cc.setAttribute("cy", pC[1] + "");
        setp(letterP, pC);
        drawLine(pC, pA, line1);
        drawLine(pC, pB, line2);
        drawLine(pC, pC, line3);
        return;
      }
      const pD = [(pC[0] + pB[0]) / 2, (pC[1] + pB[1]) / 2];
      const mBC = findSlope(pB, pC);
      const thetaD = Math.atan(-1 / mBC);
      const aaa = -findDistance(pB, pC) / Math.tan(alpha) / 2;
      let pX = [-(Math.cos(thetaD) * aaa) + pD[0], -(Math.sin(thetaD) * aaa) + pD[1]];
      const pE = [(pA[0] + pC[0]) / 2, (pA[1] + pC[1]) / 2];
      const mAC = findSlope(pA, pC);
      const bbb = -findDistance(pA, pC) / Math.tan(beta) / 2;
      const thetaE = Math.atan(-1 / mAC);
      let pY = [-Math.cos(thetaE) * bbb + pE[0], -Math.sin(thetaE) * bbb + pE[1]];
      const a = getEquationFromPoint(pA, pC);
      if (aboveBelow(pY, a[0], a[1])) {
        pY = [Math.cos(thetaE) * bbb + pE[0], Math.sin(thetaE) * bbb + pE[1]];
      }
      const b = getEquationFromPoint(pB, pC);
      if (!aboveBelow(pX, b[0], b[1])) {
        pX = [Math.cos(thetaD) * aaa + pD[0], Math.sin(thetaD) * aaa + pD[1]];
      }
      const qqqqqq = getPedalPoint(
        new DOMPoint(pC[0], pC[1]),
        new DOMPoint(pX[0], pX[1]),
        new DOMPoint(pY[0], pY[1])
      );
      const pQ = [qqqqqq.x, qqqqqq.y];
      letterX.setAttribute("x", pX[0] + "");
      letterX.setAttribute("y", pX[1] + "");
      letterY.setAttribute("x", pY[0] + "");
      letterY.setAttribute("y", pY[1] + "");
      letterQ.setAttribute("x", qqqqqq.x + "");
      letterQ.setAttribute("y", qqqqqq.y + "");
      const pP = lerpp(pC, pQ, 2);
      cc.setAttribute("cx", pP[0] + "");
      cc.setAttribute("cy", pP[1] + "");
      setp(letterP, pP);
      drawLine(pP, pA, line1);
      drawLine(pP, pB, line2);
      drawLine(pP, pC, line3);
    };

    m1.oninput = function () {
      m1v = parseInt(m1.value) / 100;
      m1t.innerHTML = "m1: " + m1v;
      fermat_point();
    };
    m2t.innerHTML = "m2: " + m2v;
    m2.oninput = function () {
      m2v = parseInt(m2.value) / 100;
      m2t.innerHTML = "m2: " + m2v;
      fermat_point();
    };
    m3t.innerHTML = "m3: " + m3v;
    m3.oninput = function () {
      m3v = parseInt(m3.value) / 100;
      m3t.innerHTML = "m3: " + m3v;
      fermat_point();
    };
    let mouseOnA = false;
    let mouseOnB = false;
    let mouseOnC = false;
    fermat_point();
    let mouseDown = 0;
    document.body.onmousedown = function () {
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
        if (mouseOnA) {
          pA = [p.x, p.y];
          points = [pA, pB, pC];
          fermat_point();
        } else if (mouseOnB) {
          pB = [p.x, p.y];
          points = [pA, pB, pC];
          fermat_point();
        } else if (mouseOnC) {
          pC = [p.x, p.y];
          points = [pA, pB, pC];
          fermat_point();
        }
      }
    });
  },
});
</script>
