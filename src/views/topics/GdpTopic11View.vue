<template>
  <TopicMeta :topic="topic" />
  <div id="dual-triangles-wrapper">
    <ATypographyTitle :level="4">Dual Triangles</ATypographyTitle>
    <canvas id="dual-triangles-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { fabric } from "fabric";
import { Topic } from "@/types";
import { makeCircle, makeLabel, makeLine, makeMovablePoint } from "@/utils/canvas";
import {
  calculateLineIntersectInLinearEquation,
  lineLineIntersection,
  solveLinearEquation,
  solvePerpendicularLineEquation,
} from "@/utils/geometry";

const topic = indexTopicMap.get(11) as Topic;

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("dual-triangles-canvas", {
      selection: false,
    });

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
        evented: true,
      });
    }

    const points = [
      new fabric.Point(200, 105),
      new fabric.Point(77, 322),
      new fabric.Point(422, 322),
    ];
    const triangle = createPolygon(points);
    const squareDPRI = createPolygon();
    const squarePEHQ = createPolygon();
    const squareRQGF = createPolygon();
    const trianglePQR = createPolygon();
    const triangleFRI = createPolygon();
    const trianglePDE = createPolygon();
    const triangleQHG = createPolygon();
    const triangleAFG = createPolygon();
    const triangleBDI = createPolygon();
    const triangleCEH = createPolygon();

    const pointA = makeMovablePoint(points[0], 3);
    const pointB = makeMovablePoint(points[1], 3);
    const pointC = makeMovablePoint(points[2], 3);

    pointA.set({
      fill: "black",
      padding: 20,
    });

    pointB.set({
      fill: "black",
      padding: 20,
    });

    pointC.set({
      fill: "black",
      padding: 20,
    });

    const aLabel = makeLabel("A");
    const bLabel = makeLabel("B");
    const cLabel = makeLabel("C");

    const pointD = makeCircle();
    const pointE = makeCircle();
    const pointP = makeCircle();
    const pointI = makeCircle();
    const pointH = makeCircle();
    const pointR = makeCircle();
    const pointQ = makeCircle();
    const pointF = makeCircle();
    const pointG = makeCircle();

    const linePD = makeLine();
    const linePE = makeLine();
    const lineDI = makeLine();
    const lineEH = makeLine();
    const lineIR = makeLine();
    const lineRP = makeLine();
    const lineHQ = makeLine();
    const linePQ = makeLine();
    const lineRQ = makeLine();
    const lineRF = makeLine();
    const lineQG = makeLine();
    const lineFG = makeLine();

    const areaLeft = new fabric.Text("0", {
      strokeWidth: 0.5,
      stroke: "black",
      fill: "black",
      fontSize: 15,
      textAlign: "center",
      evented: false,
      originX: "center",
      originY: "center",
    });

    const areaTop = new fabric.Text("0", {
      strokeWidth: 0.5,
      stroke: "black",
      fill: "black",
      fontSize: 15,
      textAlign: "center",
      evented: false,
      originX: "center",
      originY: "center",
    });

    const areaRight = new fabric.Text("0", {
      strokeWidth: 0.5,
      stroke: "black",
      fill: "black",
      fontSize: 15,
      textAlign: "center",
      evented: false,
      originX: "center",
      originY: "center",
    });

    const text = new fabric.Text("0", {
      strokeWidth: 0.5,
      stroke: "black",
      fill: "black",
      fontSize: 20,
      textAlign: "center",
      evented: false,
      originX: "center",
      originY: "center",
    });

    function moveVertices() {
      const vertices = [
        new fabric.Point(pointA.left as number, pointA.top as number),
        new fabric.Point(pointB.left as number, pointB.top as number),
        new fabric.Point(pointC.left as number, pointC.top as number),
      ];

      triangle.set({
        points: vertices,
      });

      aLabel.set({
        left: vertices[0].x - 7,
        top: vertices[0].y - 30,
      });

      bLabel.set({
        left: vertices[1].x - 25,
        top: vertices[1].y - 15,
      });

      cLabel.set({
        left: vertices[2].x + 10,
        top: vertices[2].y - 15,
      });

      const x = vertices[1].distanceFrom(vertices[2]); // BC
      const y = vertices[0].distanceFrom(vertices[2]); // AC
      const z = vertices[0].distanceFrom(vertices[1]); // AB
      const s = (x + y + z) / 2;

      const A = Math.sqrt(s * (s - x) * (s - y) * (s - z));

      const p = Math.sqrt(2 * (y * y + z * z) - x * x);
      const q = Math.sqrt(2 * (z * z + x * x) - y * y);
      const r = Math.sqrt(2 * (x * x + y * y) - z * z);

      const s1 = (p + q + r) / 2;
      const A1 = Math.sqrt(s1 * (s1 - p) * (s1 - q) * (s1 - r));

      const f = 3 * (A1 / A);
      const g = 3 * ((x * x + y * y + z * z + A1) / A);

      const k = (2 * Math.sqrt(f)) / (f + g);

      const a = k * p;
      const b = k * q;
      const c = k * r;

      const r1 = 3 * k * z;
      const q1 = 3 * k * y;
      const p1 = 3 * k * x;

      const cosA = (r1 ** 2 + b * b - a * a) / (2 * b * r1); // cos alpha
      const cosB = (z * z + x * x - y * y) / (2 * x * z);
      const sinB = Math.sqrt(1 - cosB ** 2);

      const BD = (b / sinB) * cosA;
      const DE = p1;
      const PD = b;
      const PE = c;

      const coordD = vertices[1].lerp(vertices[2], BD / vertices[1].distanceFrom(vertices[2]));

      const pD = new fabric.Point(coordD.x, coordD.y);

      pointD.set({
        left: pD.x,
        top: pD.y,
        originX: "center",
        originY: "center",
        radius: 1,
      });

      const coordE = vertices[1].lerp(
        vertices[2],
        (BD + DE) / vertices[1].distanceFrom(vertices[2])
      );

      const pE = new fabric.Point(coordE.x, coordE.y);
      pointE.set({
        left: pE.x,
        top: pE.y,
        originX: "center",
        originY: "center",
        radius: 1,
      });

      const cosTheta1 = (b ** 2 + p1 ** 2 - c ** 2) / (2 * b * p1);
      const sinTheta1 = Math.sqrt(1 - cosTheta1 ** 2);
      const dx = b * cosTheta1;
      const px = b * sinTheta1;

      const pQQ = pD.lerp(pE, dx / DE);
      const tanTheta = (pE.y - pD.y) / (pE.x - pD.x);
      const theta = Math.atan(tanTheta);

      const pP = new fabric.Point(pQQ.x + px * Math.sin(theta), pQQ.y - px * Math.cos(theta));

      pointP.set({
        left: pP.x,
        top: pP.y,
        originX: "center",
        originY: "center",
        radius: 1,
      });

      linePD.set({
        x1: pD.x,
        y1: pD.y,
        x2: pP.x,
        y2: pP.y,
      });

      linePE.set({
        x1: pE.x,
        y1: pE.y,
        x2: pP.x,
        y2: pP.y,
      });

      const eqPD = solveLinearEquation(pD, pP);
      const eqAB = solveLinearEquation(vertices[0], vertices[1]);

      const perpendicularToPDD = solvePerpendicularLineEquation(eqPD.m, pD);
      const pI = calculateLineIntersectInLinearEquation(
        eqAB.m,
        eqAB.b,
        perpendicularToPDD.m,
        perpendicularToPDD.b
      );

      pointI.set({
        left: pI.x,
        top: pI.y,
        originX: "center",
        originY: "center",
        radius: 1,
      });

      lineDI.set({
        x1: pD.x,
        y1: pD.y,
        x2: pI.x,
        y2: pI.y,
      });

      const eqPE = solveLinearEquation(pE, pP);
      const eqAC = solveLinearEquation(vertices[0], vertices[2]);

      const perpendicularToPEE = solvePerpendicularLineEquation(eqPE.m, pE);
      const pH = calculateLineIntersectInLinearEquation(
        eqAC.m,
        eqAC.b,
        perpendicularToPEE.m,
        perpendicularToPEE.b
      );

      pointH.set({
        left: pH.x,
        top: pH.y,
        originX: "center",
        originY: "center",
        radius: 1,
      });

      lineEH.set({
        x1: pE.x,
        y1: pE.y,
        x2: pH.x,
        y2: pH.y,
      });

      const eqID = solveLinearEquation(pI, pD);

      const perpendicularToIDI = solvePerpendicularLineEquation(eqID.m, pI);
      const perpendicularToPDP = solvePerpendicularLineEquation(eqPD.m, pP);
      const pR = calculateLineIntersectInLinearEquation(
        perpendicularToPDP.m,
        perpendicularToPDP.b,
        perpendicularToIDI.m,
        perpendicularToIDI.b
      );

      pointR.set({
        left: pR.x,
        top: pR.y,
        originX: "center",
        originY: "center",
        radius: 1,
      });

      lineIR.set({
        x1: pI.x,
        y1: pI.y,
        x2: pR.x,
        y2: pR.y,
      });

      lineRP.set({
        x1: pP.x,
        y1: pP.y,
        x2: pR.x,
        y2: pR.y,
      });

      const eqHE = solveLinearEquation(pE, pH);

      const perpendicularToHEH = solvePerpendicularLineEquation(eqHE.m, pH);
      const perpendicularToPEP = solvePerpendicularLineEquation(eqPE.m, pP);
      const pQ = calculateLineIntersectInLinearEquation(
        perpendicularToHEH.m,
        perpendicularToHEH.b,
        perpendicularToPEP.m,
        perpendicularToPEP.b
      );

      pointQ.set({
        left: pQ.x,
        top: pQ.y,
        originX: "center",
        originY: "center",
        radius: 1,
      });

      lineHQ.set({
        x1: pH.x,
        y1: pH.y,
        x2: pQ.x,
        y2: pQ.y,
      });

      linePQ.set({
        x1: pP.x,
        y1: pP.y,
        x2: pQ.x,
        y2: pQ.y,
      });

      lineRQ.set({
        x1: pR.x,
        y1: pR.y,
        x2: pQ.x,
        y2: pQ.y,
      });

      const eqRQ = solveLinearEquation(pR, pQ);
      const perpendicularToRQR = solvePerpendicularLineEquation(eqRQ.m, pR);
      const perpendicularToRQQ = solvePerpendicularLineEquation(eqRQ.m, pQ);

      const pF = calculateLineIntersectInLinearEquation(
        perpendicularToRQR.m,
        perpendicularToRQR.b,
        eqAB.m,
        eqAB.b
      );
      const pG = calculateLineIntersectInLinearEquation(
        perpendicularToRQQ.m,
        perpendicularToRQQ.b,
        eqAC.m,
        eqAC.b
      );

      pointF.set({
        left: pF.x,
        top: pF.y,
        originX: "center",
        originY: "center",
        radius: 1,
      });

      pointG.set({
        left: pG.x,
        top: pG.y,
        originX: "center",
        originY: "center",
        radius: 1,
      });

      lineRF.set({
        x1: pR.x,
        y1: pR.y,
        x2: pF.x,
        y2: pF.y,
      });

      lineQG.set({
        x1: pG.x,
        y1: pG.y,
        x2: pQ.x,
        y2: pQ.y,
      });

      lineFG.set({
        x1: pF.x,
        y1: pF.y,
        x2: pG.x,
        y2: pG.y,
      });

      triangleAFG.set({
        points: [vertices[0], pF, pG],
        fill: "#4ca64e",
      });

      triangleBDI.set({
        points: [vertices[1], pD, pI],
        fill: "#4ca64e",
      });

      triangleCEH.set({
        points: [vertices[2], pE, pH],
        fill: "#4ca64e",
      });

      squareDPRI.set({
        points: [pD, pP, pR, pI],
        fill: "white",
      });

      squarePEHQ.set({
        points: [pP, pE, pH, pQ],
        fill: "white",
      });

      squareRQGF.set({
        points: [pR, pQ, pG, pF],
        fill: "white",
      });

      trianglePQR.set({
        points: [pP, pQ, pR],
        fill: "#d9b38c",
      });

      triangleFRI.set({
        points: [pF, pR, pI],
        fill: "#ffea3d",
      });

      trianglePDE.set({
        points: [pP, pD, pE],
        fill: "#ffea3d",
      });

      triangleQHG.set({
        points: [pQ, pH, pG],
        fill: "#ffea3d",
      });

      const areaPD = Math.round((b * b) / 100);
      const centerOfAreaLeft = lineLineIntersection(
        [pD.x, pD.y],
        [pR.x, pR.y],
        [pP.x, pP.y],
        [pI.x, pI.y]
      );
      areaLeft.set({
        left: centerOfAreaLeft![0],
        top: centerOfAreaLeft![1],
        text: "b² = " + areaPD.toString(),
      });

      const areaPE = Math.round((c * c) / 100);
      const centerOfAreaRight = lineLineIntersection(
        [pP.x, pP.y],
        [pH.x, pH.y],
        [pE.x, pE.y],
        [pQ.x, pQ.y]
      );
      areaRight.set({
        left: centerOfAreaRight![0],
        top: centerOfAreaRight![1],
        text: "c² = " + areaPE.toString(),
      });

      const areaQR = Math.round((a * a) / 100);
      const centerOfAreaTop = lineLineIntersection(
        [pQ.x, pQ.y],
        [pF.x, pF.y],
        [pR.x, pR.y],
        [pG.x, pG.y]
      );
      areaTop.set({
        left: centerOfAreaTop![0],
        top: centerOfAreaTop![1],
        text: "a² = " + areaQR.toString(),
      });

      const ss = (a + b + c) / 2;
      const areaPQR = Math.round(Math.sqrt(ss * (ss - a) * (ss - b) * (ss - c)) / 100);
      const areaABC = Math.round(
        Math.pow(areaQR + areaPD + areaPE + 6 * areaPQR, 2) / (12 * areaPQR)
      );
      const tt =
        "The brown triangle area = " +
        areaPQR +
        "\n" +
        "The area of △ABC = (a² + b² + c² + 6A)²/12A\n= " +
        areaABC;

      text.set({
        text: tt,
        left: 250,
        top: 420,
      });
    }

    moveVertices();
    canvas.on("object:moving", moveVertices);

    canvas.add(
      triangle,
      squareDPRI,
      squarePEHQ,
      squareRQGF,
      trianglePQR,
      triangleFRI,
      trianglePDE,
      triangleQHG,
      triangleAFG,
      triangleBDI,
      triangleCEH
    );

    canvas.add(aLabel, bLabel, cLabel);

    canvas.add(
      linePD,
      linePE,
      lineDI,
      lineEH,
      lineIR,
      lineRP,
      lineHQ,
      linePQ,
      lineRQ,
      lineRF,
      lineQG,
      lineFG
    );

    canvas.add(
      pointA,
      pointB,
      pointC,
      pointD,
      pointE,
      pointP,
      pointI,
      pointH,
      pointR,
      pointQ,
      pointF,
      pointG
    );

    canvas.add(areaLeft, areaTop, areaRight, text);
  },
});
</script>
