<template>
    <TopicMeta :topic="topic" />
    <ATypographyParagraph>
    </ATypographyParagraph>
    <svg id="tri-app_35" width="500" height="500" style="border: 2px solid black; background-color: floralwhite">
        <polygon id="tri_35" stroke="black" stroke-width="2.5px" fill="transparent" />
        <polygon id="eabh_35" stroke="black" stroke-width="1.5px" fill="purple" fill-opacity="0.4" />
        <polygon id="dacg_35" stroke="black" stroke-width="1.5px" fill="orange" fill-opacity="0.4" />
        <polygon id="bqkp_35" stroke="black" stroke-width="1.5px" fill="purple" fill-opacity="0.4" />
        <polygon id="qcmp_35" stroke="black" stroke-width="1.5px" fill="orange" fill-opacity="0.4" />
        <line id="lineFE_35" font-size="20px" stroke="black" stroke-width="1.5px" />
        <line id="lineFD_35" font-size="20px" stroke="black" stroke-width="1.5px" />
        <line id="lineFA_35" font-size="20px" stroke="red" stroke-width="2px" />
        <line id="lineBK_35" font-size="20px" stroke="red" stroke-width="2px" />
        <line id="lineCM_35" font-size="20px" stroke="red" stroke-width="2px" />
        <line id="lineAQ_35" font-size="20px" stroke="black" stroke-dasharray="4" stroke-width="1.5px" />
        <line id="lineTC_35" font-size="20px" stroke="black" stroke-dasharray="4" stroke-width="1.5px" />
        <line id="lineLB_35" font-size="20px" stroke="black" stroke-dasharray="4" stroke-width="1.5px" /> <text
            id="letterA_35" font-size="20px">A</text>
        <text id="letterB_35" font-size="20px">B</text>
        <text id="letterC_35" font-size="20px">C</text>
        <text id="letterE_35" font-size="20px">E</text>
        <text id="letterF_35" font-size="20px">F</text>
        <text id="letterD_35" font-size="20px">D</text>
        <text id="letterT_35" font-size="20px">T</text>
        <text id="letterG_35" font-size="20px">G</text>
        <text id="letterM_35" font-size="20px">M</text>
        <text id="letterP_35" font-size="20px">P</text>
        <text id="letterQ_35" font-size="20px">Q</text>
        <text id="letterK_35" font-size="20px">K</text>
        <text id="letterH_35" font-size="20px">H</text>
        <text id="letterL_35" font-size="20px">L</text>
        <text id="p1arr_35" font-size="20px" x="290" y="30"></text>
        <text id="p2arr_35" font-size="20px" x="360" y="30"></text>
        <text id="p3arr_35" font-size="20px" x="430" y="30"></text>
    </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import {
    drawLine,
    isInside, areaa,
    lineLineIntersection, aboveBelow,
    makeString, fillDigits, setp, getEquationFromPoint
} from "@/utils/geometry";
const topic = indexTopicMap.get(35) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
        mounted() {
            const svg = document.querySelector("#tri-app_35") as SVGGraphicsElement;

            const pC = [400, 330];
            const pB = [100, 330];
            const pA = [300, 180];
            const points = [pA, pB, pC];
            const tri = document.querySelector("#tri_35") as Element;
            const eabh = document.querySelector("#eabh_35") as Element;
            const dacg = document.querySelector("#dacg_35") as Element;
            const bqkp = document.querySelector("#bqkp_35") as Element;
            const qcmp = document.querySelector("#qcmp_35") as Element;
            const letterA = document.querySelector("#letterA_35") as Element;
            const letterB = document.querySelector("#letterB_35") as Element;
            const letterC = document.querySelector("#letterC_35") as Element;
            const letterD = document.querySelector("#letterD_35") as Element;
            const letterE = document.querySelector("#letterE_35") as Element;
            const letterG = document.querySelector("#letterG_35") as Element;
            const letterH = document.querySelector("#letterH_35") as Element;
            const letterT = document.querySelector("#letterT_35") as Element;
            const letterL = document.querySelector("#letterL_35") as Element;
            const letterK = document.querySelector("#letterK_35") as Element;
            const letterQ = document.querySelector("#letterQ_35") as Element;
            const letterF = document.querySelector("#letterF_35") as Element;
            const letterP = document.querySelector("#letterP_35") as Element;
            const letterM = document.querySelector("#letterM_35") as Element;
            const FE = document.querySelector("#lineFE_35") as Element;
            const FD = document.querySelector("#lineFD_35") as Element;
            const AQ = document.querySelector("#lineAQ_35") as Element;
            const FA = document.querySelector("#lineFA_35") as Element;
            const TC = document.querySelector("#lineTC_35") as Element;
            const LB = document.querySelector("#lineLB_35") as Element;
            const BK = document.querySelector("#lineBK_35") as Element;
            const CM = document.querySelector("#lineCM_35") as Element;
            const p1arr = document.querySelector("#p1arr_35") as Element;
            const p2arr = document.querySelector("#p2arr_35") as Element;
            const p3arr = document.querySelector("#p3arr_35") as Element;
            letterA?.setAttribute("x", pA[0] + "");
            letterA?.setAttribute("y", pA[1] - 10 + "");
            letterB?.setAttribute("x", pB[0] - 20 + "");
            letterB?.setAttribute("y", pB[1] + 15 + "");
            letterC?.setAttribute("x", pC[0] - 5 + "");
            letterC?.setAttribute("y", pC[1] + 20 + "");
            tri?.setAttributeNS(
                null,
                "points",
                makeString([points[0], points[1], points[2]])
            );
            let pD = [350, 140], pE = [250, 130];
            setp(letterD, pD);
            setp(letterE, pE);
            let pG, pH, pF, pL, pT, pM, pP, pK, pQ;
            const pappus = () => {
                pG = [pD[0] - pA[0] + pC[0], pD[1] - pA[1] + pC[1]];
                pH = [pE[0] - pA[0] + pB[0], pE[1] - pA[1] + pB[1]];
                setp(letterG, pG);
                setp(letterH, [pH[0] - 20, pH[1] + 30]);
                eabh.setAttribute("points", makeString([pE, pA, pB, pH]));
                dacg.setAttribute("points", makeString([pD, pA, pC, pG]));
                pF = lineLineIntersection(pH, pE, pD, pG) as number[];
                setp(letterF, pF);
                drawLine(pF, pD, FD);
                drawLine(pF, pE, FE);
                drawLine(pA, pF, FA);
                console.log(pF, pA);
                const fafa = [pF[0] - pA[0], pF[1] - pA[1]];
                pL = lineLineIntersection([fafa[0] + pB[0], fafa[1] + pB[1]], pB, pE, pH) as number[];
                drawLine(pB, pL, LB);
                setp(letterL, pL);
                pT = lineLineIntersection([fafa[0] + pC[0], fafa[1] + pC[1]], pC, pD, pG) as number[];
                drawLine(pC, pT, TC);
                setp(letterT, pT);
                // console.log(fafa);
                pM = [pC[0] - fafa[0], pC[1] - fafa[1]];
                pK = [pB[0] - fafa[0], pB[1] - fafa[1]];
                setp(letterM, [pM[0], pM[1] + 30]);
                setp(letterK, [pK[0] - 20, pK[1] + 30]);
                pQ = lineLineIntersection(pF, pA, pB, pC) as number[];
                pP = lineLineIntersection(pK, pM, pF, pA) as number[];
                setp(letterQ, pQ);
                setp(letterP, [pP[0] - 10, pP[1] + 30]);
                bqkp.setAttribute("points", makeString([pB, pQ, pP, pK]));
                qcmp.setAttribute("points", makeString([pQ, pC, pM, pP]));
                drawLine(pA, pQ, AQ);
                drawLine(pB, pK, BK);
                drawLine(pC, pM, CM);
                const area1 = areaa([pH[0], pH[1], pE[0], pE[1], pA[0], pA[1], pB[0], pB[1]]) / 100;
                const area2 = areaa([pA[0], pA[1], pD[0], pD[1], pG[0], pG[1], pC[0], pC[1]]) / 100;
                const area3 = areaa([pC[0], pC[1], pB[0], pB[1], pK[0], pK[1], pM[0], pM[1]]) / 100;
                p1arr.innerHTML = fillDigits(Math.round(area1 * 10) / 100 + "", 4) + " + ";
                p2arr.innerHTML = fillDigits(Math.round(area2 * 10) / 100 + "", 4) + " = ";
                p3arr.innerHTML = fillDigits(Math.round(area3 * 10) / 100 + "", 4) + "";
            };
            pappus();
            let mouseOnD = false, mouseOnE = false, mouseDown = 0;
            document.body.onmousedown = function () {
                mouseOnD = false;
                mouseOnE = false;
                mouseDown--;
            };
            document.body.onmouseup = function () {
                mouseDown++;
            };
            svg.addEventListener("mousemove", (event) => {
                let p = new DOMPoint(event.clientX, event.clientY);
                p = p.matrixTransform(svg.getScreenCTM()?.inverse());
                if (!isInside(pA[0], pA[1], pB[0], pB[1], pC[0], pC[1], p.x, p.y)) {
                    const a = getEquationFromPoint(pA, pC);
                    const b = getEquationFromPoint(pA, pB);
                    if (!aboveBelow(pD, a[0], a[1]) && Math.abs(p.x - pD[0]) + Math.abs(p.y - pD[1]) < 10) {
                        mouseOnD = true;
                    } else if (!aboveBelow(pE, b[0], b[1]) && Math.abs(p.x - pE[0]) + Math.abs(p.y - pE[1]) < 10) {
                        mouseOnE = true;
                    } else {
                        mouseOnD = false;
                        mouseOnE = false;
                    }
                    if (mouseDown) {
                        if (mouseOnD) {
                            pD = [p.x, p.y];
                            setp(letterD, pD);
                            pappus();
                        } else if (mouseOnE) {
                            pE = [p.x, p.y];
                            setp(letterE, pE);
                            pappus();
                        }
                    }
                }
            });
        }
    },
);
</script>
