<template>
  <TopicMeta :topic="topic" />

  <div id="Pascal-Brainchon-wrapper" style="padding-top: 40px">
    <ATypographyTitle :level="4">Animated Pappus' Theorem </ATypographyTitle>
    <ATypographyParagraph class="topics-description">
      <p>
        Pappus' Theorem, also known as Pappus' Hexagon Theorem, is named after Greek mathematician
        Pappus of Alexandria, who lived approximately 3rd or 4th century AD.
      </p>
      <p>
        Let <span v-katex>A, B, C</span> be three points on one line (the bottom line in the
        picture), and let <span v-katex>A', B', C'</span>be three points on another line (the top
        line in the picture). Let <span v-katex>X, Y, Z </span> be the intersections of
        <span v-katex>BC'</span> and <span v-katex>B'C</span>; <span v-katex>AC'</span> and
        <span v-katex>A'C</span>; and <span v-katex>AB'</span> and <span v-katex>A'B</span>,
        respectively. Then <span v-katex>X,Y,Z</span> are collinear.
      </p>
      <p>
        Click, hold and move one of the six points <span v-katex>A,B,C,A',B',C'</span>. One can see
        that the red line always passing points <span v-katex>X,Y,Z</span>. The red line is called
        the Pappus Line.
      </p>
    </ATypographyParagraph>
    <canvas id="Pascal-Brainchon-canvas" width="500" height="500" />
  </div>

  <div id="Pascal-wrapper" style="padding-top: 40px">
    <ATypographyTitle :level="4"> Animated Pascal's Theorem</ATypographyTitle>
    <ATypographyParagraph class="topics-description">
      <p>
        Pascal's Theorem is named after Blaise Pascal, which was formulated by Blaise Pascal in a
        note written in 1639 when he was only 16 years old.
      </p>
      <p>
        Pascal's Theorem states that if <span v-katex>ABCDEF</span> is an inscribed hexagon of a
        circle, then the intersections <span v-katex>X, Y, Z</span> of the three pairs of the
        opposite sides of the hexagon is collinear.
      </p>
      <p>
        Click, hold, and move any of points <span v-katex>A, B, C, D, E, F</span> to observe that
        points <span v-katex>X, Y, Z</span> are always collinear.
      </p>
      <p>
        Pascal's Theorem can be generalized to the case when a hexagon is inscribed in a conic
        curve. Since two lines can be regarded as a degenerated conic curve, Pappus' Theorem is a
        special case of the (generalized) Pascal Theorem.
      </p>
    </ATypographyParagraph>
    <canvas id="Pascal-canvas" width="500" height="500" />
  </div>

  <div id="Desargues-wrapper" style="padding-top: 40px">
    <ATypographyTitle :level="4"> Animated Desargues' Theorem</ATypographyTitle>
    <ATypographyParagraph class="topics-description">
      <p>
        Two triangles in a plane are perspective from a point <span v-katex>O</span>, called the
        center of perspectivity, if the lines joining corresponding vertices of the triangles meet
        at <span v-katex>O</span>. Dually, the triangles are said to be perspective from a line if
        the points of intersection of corresponding lines all lie on one line.
      </p>
      <p>
        Desargues' theorem, named after Girard Desargues, states that two triangles are perspective
        from a point, if and only if it is perspective from a point.
      </p>
      <p>
        In the following picture, assume that <span v-katex>AA', BB', CC'</span> are concurrent. Let
        <span v-katex>P,Q,R</span> be the intersections of <span v-katex>BC</span> and
        <span v-katex>B'C'</span>; <span v-katex>CA</span> and <span v-katex>C'A'</span>;
        <span v-katex>AB</span> and <span v-katex>A'B'</span>, respectively. Then
        <span v-katex>P, Q, R</span>
        are collinear.
      </p>
      <p>
        Click, hold, and move any of points <span v-katex>A, B, C </span> to observe that points
        <span v-katex>P,Q, R</span> are always collinear.
      </p>
    </ATypographyParagraph>
    <canvas id="Desargues-canvas" width="800" height="500" />
  </div>

  <div id="Brainchon-wrapper" style="padding-top: 40px">
    <ATypographyTitle :level="4"> Animated Brainchon's Theorem</ATypographyTitle>
    <ATypographyParagraph class="topics-description">
      <p>
        Brainchon's Theorem is named after French mathematician Charles Julien Brianchon. It is the
        famous dual theorem of Pascal's Theorem. Like Pascal's Theorem, it can also be generalized
        to the case of conic curves.
      </p>
      <p>
        Brainchon's Theorem states that if <span v-katex>ABCDEF</span> is a hexagon circumscribed a
        circle, then the main diagonals <span v-katex>AD, BE, CF</span>
        are concurrent.
      </p>
      <p>
        Click, hold, and move any of points <span v-katex>A, B, C, D, E, F</span> to observe that
        lines <span v-katex>AD, BE, CF</span> are always concurrent. The Hexagon
        <span v-katex>ABCDEF</span> doesn't have to be convex for the Brianchon's Theorem to hold.
      </p>
    </ATypographyParagraph>
    <canvas id="Brainchon-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { IEvent } from "fabric/fabric-impl";
import {
  calculateDistanceBetweenTwoPoints,
  calculateLineIntersectInLinearEquation,
  calculateLineIntersectInPoints,
  findSlope,
  polarToCartesian,
  solveLinearEquation,
  solvePerpendicularLineEquation,
} from "@/utils/geometry";

const topic = indexTopicMap.get(6) as Topic;

/**
 * Type definitions
 */
type Intersection = fabric.Intersection & {
  points?: fabric.Point[];
};

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */

type Circle = fabric.Circle & {
  [key: string]: any;
  intersects?: Circle[];
  upLine?: fabric.Line[];
  downLine?: fabric.Line[];
  crossLines?: Line[];
  label?: Label;
  leftBound?: Circle;
  rightBound?: Circle;
  moveLine?: Line; // The line on which the point moves.
  upBound?: Circle;
  downBound?: Circle;
  clockPoint?: Circle; // This point's neighbor on the clock direction.
  cntClockPoint?: Circle;
  clockLine?: Line;
  cntClockLine?: Line;
};

type Line = fabric.Line & {
  p1?: Circle;
  p2?: Circle;
  m?: number;
  b?: number;
  inter?: Circle; // The intersection with another Line. So far only for part III
  thatLine?: Line; // The other line to intersect with. So far only for part III
  tan?: Circle; // tangent point on circle. For part IV
};

interface Coord {
  x: number;
  y: number;
}

type Label = fabric.Text & {
  // The offset of a label away from the point it attatches to, so that
  // they won't mix in a mess.
  offSet: Coord;
};

interface LinearEq {
  m: number;
  b: number;
}

/**
 * Utility functions
 */
const makeLabel = (text: string, offSet = { x: 0, y: 0 }, fontSize = 24): Label => {
  const label = new fabric.Text(text, {
    hasControls: false,
    hasBorders: false,
    evented: false,
    fontSize,
  }) as Label;
  label.offSet = offSet;
  return label;
};

function isCircle(point: Circle | { top: number; left: number } | Coord): point is Circle {
  return point instanceof fabric.Circle;
}

// TODO use rest parameter
function setLabelToPoint(
  labels: Label[],
  points: Circle[] | { top: number; left: number }[] | Coord[]
): void {
  for (let index = 0; index < labels.length; index++) {
    const label = labels[index];
    const point = points[index];
    if ("left" in point) {
      label.left = point.left! + label.offSet.x;
      label.top = point.top! + label.offSet.y;
      if (isCircle(point)) {
        point.label = label;
      }
    } else {
      label.left = point.x + label.offSet.x;
      label.top = point.y + label.offSet.y;
    }
  }
}

function makeCircle(point: fabric.Point | Coord, radius?: number, fill?: any): Circle;
function makeCircle(x: number, y: number, radius?: any, fill?: string): Circle;
function makeCircle(
  x: number | fabric.Point | Coord,
  y?: number,
  radius?: any,
  fill?: string
): Circle {
  if (typeof x !== "number") {
    fill = radius;
    radius = y;
    y = x.y;
    x = x.x;
  }
  const point = new fabric.Circle({
    left: x,
    top: y,
    hasControls: false,
    hasBorders: false,
    evented: true,
    radius: radius || 3,
    fill: fill || "black",
    originX: "center",
    originY: "center",
    padding: 20,
  });
  return point;
}

function coordToPoint(cd: Coord): fabric.Point {
  return new fabric.Point(cd.x, cd.y);
}

function circleToCoord(...circle: Circle[]): fabric.Point[] {
  return circle.map((c) => new fabric.Point(c.left!, c.top!));
}

const makeLine = (
  pt1: Coord | fabric.Point | fabric.Circle,
  pt2: Coord | fabric.Point | fabric.Circle,
  strokeWidth?: number,
  stroke?: string
): Line => {
  let oldPt1;
  let oldPt2;
  if (pt1 instanceof fabric.Circle) {
    oldPt1 = pt1;
    pt1 = { x: pt1.left!, y: pt1.top! };
  }
  if (pt2 instanceof fabric.Circle) {
    oldPt2 = pt2;
    pt2 = { x: pt2.left!, y: pt2.top! };
  }
  const line = new fabric.Line([pt1.x, pt1.y, pt2.x, pt2.y], {
    stroke: stroke || "black",
    hasControls: false,
    hasBorders: false,
    evented: false,
    strokeWidth: strokeWidth || 1,
    originX: "center",
    originY: "center",
  }) as Line;
  if (oldPt1 instanceof fabric.Circle && oldPt2 instanceof fabric.Circle) {
    line.p1 = oldPt1;
    line.p2 = oldPt2;
  }
  return line;
};

function getIntersectFromLines(line1: fabric.Line, line2: fabric.Line): Coord {
  const l1 = solveLinearEquation(
    new fabric.Point(line1.x1!, line1.y1!),
    new fabric.Point(line1.x2!, line1.y2!)
  );
  const l2 = solveLinearEquation(
    new fabric.Point(line2.x1!, line2.y1!),
    new fabric.Point(line2.x2!, line2.y2!)
  );
  return calculateLineIntersectInLinearEquation(l1.m, l1.b, l2.m, l2.b);
}

function setLineFromPoints(line: fabric.Line, a: Coord, b: Coord): void {
  line.set({
    x1: a.x,
    y1: a.y,
    x2: b.x,
    y2: b.y,
  });
}

/**
 * Update the position of `inter` and `inter`'s `crossLines`
 * @param line1 The first line that intersects with line2
 * @param line2 The second line that intersects with line1
 * @param inter The intersection point
 */
function updateInterAndLine(line1: Line, line2: Line, inter: Circle): void {
  const newInter = calculateLineIntersectInPoints(line1, line2, true);
  if (newInter === null || newInter === undefined) return;
  inter.set({ left: newInter.x, top: newInter.y });
  if (inter.crossLines !== undefined) {
    inter.crossLines.forEach((line) => {
      line.set({
        x1: line.p1!.left,
        y1: line.p1!.top,
        x2: line.p2!.left,
        y2: line.p2!.top,
      });
    });
  }
}

function getTangentLine(inter: Coord, radius: number, center: Coord): LinearEq {
  const { m } = solveLinearEquation(inter, center);
  return solvePerpendicularLineEquation(m, inter);
}

function getInterByLinearEq(l1: LinearEq, l2: LinearEq): Coord {
  const coord = calculateLineIntersectInLinearEquation(l1.m, l1.b, l2.m, l2.b);
  return coord;
}

/**
 * Part IV
 */
function partFour() {
  const cvsBra = new fabric.Canvas("Brainchon-canvas", {
    selection: false,
    backgroundColor: "floralwhite",
  });
  const RADIUS = 120;
  const center = { x: 250, y: 250 } as Coord;
  const centerPoint = makeCircle(center);
  centerPoint.evented = false;

  const circle = new fabric.Circle({
    radius: RADIUS,
    fill: "",
    strokeWidth: 1,
    stroke: "black",
    left: center.x - RADIUS,
    top: center.y - RADIUS,
    hasControls: false,
    selectable: false,
    evented: false,
  });
  cvsBra.add(circle);

  const taf = coordToPoint(polarToCartesian(RADIUS, 30, center));
  const tab = coordToPoint(polarToCartesian(RADIUS, 80, center));
  const tbc = coordToPoint(polarToCartesian(RADIUS, 120, center));
  const tcd = coordToPoint(polarToCartesian(RADIUS, 2000, center));
  const tde = coordToPoint(polarToCartesian(RADIUS, 280, center));
  const tef = coordToPoint(polarToCartesian(RADIUS, -20, center));

  const abLinear = getTangentLine(tab, RADIUS, center);
  const bcLinear = getTangentLine(tbc, RADIUS, center);
  const cdLinear = getTangentLine(tcd, RADIUS, center);
  const deLinear = getTangentLine(tde, RADIUS, center);
  const efLinear = getTangentLine(tef, RADIUS, center);
  const faLinear = getTangentLine(taf, RADIUS, center);

  const pa = makeCircle(getInterByLinearEq(abLinear, faLinear));
  const pb = makeCircle(getInterByLinearEq(abLinear, bcLinear));
  const pc = makeCircle(getInterByLinearEq(bcLinear, cdLinear));
  const pd = makeCircle(getInterByLinearEq(cdLinear, deLinear));
  const pe = makeCircle(getInterByLinearEq(deLinear, efLinear));
  const pf = makeCircle(getInterByLinearEq(efLinear, faLinear));

  const ab = makeLine(pa, pb);
  const bc = makeLine(pb, pc);
  const cd = makeLine(pd, pc);
  const de = makeLine(pd, pe);
  const ef = makeLine(pf, pe);
  const fa = makeLine(pf, pa);

  ab.tan = makeCircle(new fabric.Point(pa.left!, pa.top!).lerp({ x: pb.left!, y: pb.top! }, 0.5));
  bc.tan = makeCircle(new fabric.Point(pc.left!, pc.top!).lerp({ x: pb.left!, y: pb.top! }, 0.5));
  cd.tan = makeCircle(new fabric.Point(pc.left!, pc.top!).lerp({ x: pd.left!, y: pd.top! }, 0.5));
  de.tan = makeCircle(new fabric.Point(pd.left!, pd.top!).lerp({ x: pe.left!, y: pe.top! }, 0.5));
  ef.tan = makeCircle(new fabric.Point(pe.left!, pe.top!).lerp({ x: pf.left!, y: pf.top! }, 0.5));
  fa.tan = makeCircle(new fabric.Point(pa.left!, pa.top!).lerp({ x: pf.left!, y: pf.top! }, 0.5));
  // Tangent lines
  ab.tan.clockLine = makeLine(ab.tan, pa);
  ab.tan.cntClockLine = makeLine(ab.tan, pb);
  bc.tan.clockLine = makeLine(bc.tan, pb);
  bc.tan.cntClockLine = makeLine(bc.tan, pc);
  cd.tan.clockLine = makeLine(cd.tan, pc);
  cd.tan.cntClockLine = makeLine(cd.tan, pd);
  de.tan.clockLine = makeLine(de.tan, pd);
  de.tan.cntClockLine = makeLine(de.tan, pe);
  ef.tan.clockLine = makeLine(ef.tan, pe);
  ef.tan.cntClockLine = makeLine(ef.tan, pf);
  fa.tan.clockLine = makeLine(fa.tan, pf);
  fa.tan.cntClockLine = makeLine(fa.tan, pa);
  ab.tan.clockLine.set({ x1: 0, y1: 0, x2: 0, y2: 0 });
  bc.tan.clockLine.set({ x1: 0, y1: 0, x2: 0, y2: 0 });
  cd.tan.clockLine.set({ x1: 0, y1: 0, x2: 0, y2: 0 });
  de.tan.clockLine.set({ x1: 0, y1: 0, x2: 0, y2: 0 });
  ef.tan.clockLine.set({ x1: 0, y1: 0, x2: 0, y2: 0 });
  fa.tan.clockLine.set({ x1: 0, y1: 0, x2: 0, y2: 0 });
  [ab, bc, cd, de, ef, fa].forEach((line) => {
    if (line.tan !== undefined) {
      line.tan.clockLine?.set({ strokeDashArray: [10], stroke: "Aqua" });
      line.tan.cntClockLine?.set({ strokeDashArray: [10], stroke: "Aqua" });
      // line.tan.clockLine?.set({x1: 0, y1: 0, x2: 0, y2: 0});
      // line.tan.cntClockLine?.set({x1: 0, y1: 0, x2: 0, y2: 0});
      cvsBra.add(line.tan.clockLine!, line.tan.cntClockLine!);
    }
  });

  const ad = makeLine(pa, pd, undefined, "green");
  const be = makeLine(pb, pe, undefined, "green");
  const cf = makeLine(pc, pf, undefined, "green");
  Object.assign(ad, solveLinearEquation({ x: ad.x1!, y: ad.y1! }, { x: ad.x2!, y: ad.y2! }));
  Object.assign(be, solveLinearEquation({ x: be.x1!, y: be.y1! }, { x: be.x2!, y: be.y2! }));
  const intersection = makeCircle(
    getInterByLinearEq({ m: ad.m!, b: ad.b! }, { m: be.m!, b: be.b! }),
    3,
    "red"
  );
  intersection.set({ selectable: false, evented: false });
  const ia = makeLine(intersection, pa, undefined, "green");
  const ib = makeLine(intersection, pb, undefined, "green");
  const ic = makeLine(intersection, pc, undefined, "green");
  const id = makeLine(intersection, pd, undefined, "green");
  const ie = makeLine(intersection, pe, undefined, "green");
  const iF = makeLine(intersection, pf, undefined, "green");

  pa.clockLine = fa;
  pa.cntClockLine = ab;
  pb.clockLine = ab;
  pb.cntClockLine = bc;
  pc.clockLine = bc;
  pc.cntClockLine = cd;
  pd.clockLine = cd;
  pd.cntClockLine = de;
  pe.clockLine = de;
  pe.cntClockLine = ef;
  pf.clockLine = ef;
  pf.cntClockLine = fa;

  pa.clockPoint = pf;
  pa.cntClockPoint = pb;
  pb.clockPoint = pa;
  pb.cntClockPoint = pc;
  pc.clockPoint = pb;
  pc.cntClockPoint = pd;
  pd.clockPoint = pc;
  pd.cntClockPoint = pe;
  pe.clockPoint = pd;
  pe.cntClockPoint = pf;
  pf.clockPoint = pe;
  pf.cntClockPoint = pa;

  ab.p1 = pa;
  ab.p2 = pb;
  bc.p1 = pb;
  bc.p2 = pc;
  cd.p1 = pc;
  cd.p2 = pd;
  de.p1 = pd;
  de.p2 = pe;
  ef.p1 = pe;
  ef.p2 = pf;
  fa.p1 = pa;
  fa.p2 = pf;
  ad.p1 = pa;
  ad.p2 = pd;
  be.p1 = pb;
  be.p2 = pe;
  cf.p1 = pc;
  cf.p2 = pf;
  ia.p1 = pa;
  ib.p1 = pb;
  ic.p1 = pc;
  id.p1 = pd;
  ie.p1 = pe;
  iF.p1 = pf;

  const aLabel = makeLabel("A", { x: 10, y: -20 });
  const bLabel = makeLabel("B", { x: 0, y: -30 });
  const cLabel = makeLabel("C", { x: -25, y: -5 });
  const dLabel = makeLabel("D", { x: -5, y: 10 });
  const eLabel = makeLabel("E");
  const fLabel = makeLabel("F");
  const oLabel = makeLabel("O");
  setLabelToPoint(
    [aLabel, bLabel, cLabel, dLabel, eLabel, fLabel, oLabel],
    [pa, pb, pc, pd, pe, pf, centerPoint]
  );
  cvsBra.add(aLabel, bLabel, cLabel, dLabel, eLabel, fLabel, oLabel);
  cvsBra.add(pa, pb, pc, pd, pe, pf, centerPoint);
  cvsBra.add(ia, ib, ic, id, ie, iF);
  cvsBra.add(intersection);
  cvsBra.add(ab, bc, cd, de, ef, fa);

  const onPointMove = (e: IEvent): void => {
    const p = e.target! as Circle;
    let dist = calculateDistanceBetweenTwoPoints(circleToCoord(p)[0], center);
    const offset = 10;
    if (dist <= RADIUS + offset) {
      dist = RADIUS + offset;
    }
    const alpha = Math.acos(RADIUS / dist);
    let rad = Math.atan(-findSlope([center.x, center.y], [p.left!, p.top!]));

    if (p.left! < center.x) {
      rad -= Math.PI;
    }
    // Restrict movement outside of circle.
    if (dist <= RADIUS + offset) {
      const onCircle = polarToCartesian(RADIUS + offset, rad, center, false);
      p.set({ left: onCircle.x, top: onCircle.y });
    }
    setLabelToPoint([p.label!], [p]);
    const clkRad = rad - alpha;
    const cntClkRad = alpha + rad;
    // New tangent point and lines
    const clkT = polarToCartesian(RADIUS, clkRad, center, false);
    const cntClkT = polarToCartesian(RADIUS, cntClkRad, center, false);
    // Update closest tangent points.
    p.clockLine!.tan!.set({ left: clkT.x, top: clkT.y });
    p.cntClockLine!.tan!.set({ left: cntClkT.x, top: cntClkT.y });
    const clkLinearEq = solveLinearEquation(circleToCoord(p)[0], clkT);
    const cntClkLinearEq = solveLinearEquation(circleToCoord(p)[0], cntClkT);

    // New intersections
    let clkLine = p.clockPoint!.clockLine!;
    let cntClkLine = p.cntClockPoint!.cntClockLine!;
    const clkP = getInterByLinearEq(
      clkLinearEq,
      solveLinearEquation({ x: clkLine.x1!, y: clkLine.y1! }, { x: clkLine.x2!, y: clkLine.y2! })
    );
    p.clockPoint!.set({ left: clkP.x, top: clkP.y });
    const cntClkP = getInterByLinearEq(
      cntClkLinearEq,
      solveLinearEquation(
        { x: cntClkLine.x1!, y: cntClkLine.y1! },
        { x: cntClkLine.x2!, y: cntClkLine.y2! }
      )
    );
    p.cntClockPoint!.set({ left: cntClkP.x, top: cntClkP.y });

    // Update lines accordingly
    setLineFromPoints(
      clkLine,
      { x: clkLine.p1!.left!, y: clkLine.p1!.top! },
      { x: clkLine.p2!.left!, y: clkLine.p2!.top! }
    );
    setLineFromPoints(
      cntClkLine,
      { x: cntClkLine.p1!.left!, y: cntClkLine.p1!.top! },
      { x: cntClkLine.p2!.left!, y: cntClkLine.p2!.top! }
    );
    // clkLine.tan!.set();
    // Update strokes
    [clkLine, cntClkLine].forEach((line) => {
      if (
        line.tan !== undefined &&
        line.tan.clockLine !== undefined &&
        line.tan.cntClockLine !== undefined
      ) {
        setLineFromPoints(
          line.tan.clockLine,
          { x: line.tan.clockLine.p1!.left!, y: line.tan.clockLine.p1!.top! },
          { x: line.tan.clockLine.p2!.left!, y: line.tan.clockLine.p2!.top! }
        );
        setLineFromPoints(
          line.tan.cntClockLine,
          { x: line.tan.cntClockLine.p1!.left!, y: line.tan.cntClockLine.p1!.top! },
          { x: line.tan.cntClockLine.p2!.left!, y: line.tan.cntClockLine.p2!.top! }
        );
      }
    });

    clkLine = p.clockLine!;
    setLineFromPoints(
      clkLine,
      { x: clkLine.p1!.left!, y: clkLine.p1!.top! },
      { x: clkLine.p2!.left!, y: clkLine.p2!.top! }
    );
    cntClkLine = p.cntClockLine!;
    setLineFromPoints(
      cntClkLine,
      { x: cntClkLine.p1!.left!, y: cntClkLine.p1!.top! },
      { x: cntClkLine.p2!.left!, y: cntClkLine.p2!.top! }
    );
    // Update intersections
    [ad, be].forEach((line) => {
      setLineFromPoints(
        line,
        { x: line.p1!.left!, y: line.p1!.top! },
        { x: line.p2!.left!, y: line.p2!.top! }
      );
    });
    [clkLine, cntClkLine].forEach((line) => {
      if (
        line.tan !== undefined &&
        line.tan.clockLine !== undefined &&
        line.tan.cntClockLine !== undefined
      ) {
        setLineFromPoints(
          line.tan.clockLine,
          { x: line.tan.clockLine.p1!.left!, y: line.tan.clockLine.p1!.top! },
          { x: line.tan.clockLine.p2!.left!, y: line.tan.clockLine.p2!.top! }
        );
        setLineFromPoints(
          line.tan.cntClockLine,
          { x: line.tan.cntClockLine.p1!.left!, y: line.tan.cntClockLine.p1!.top! },
          { x: line.tan.cntClockLine.p2!.left!, y: line.tan.cntClockLine.p2!.top! }
        );
      }
    });

    Object.assign(ad, solveLinearEquation({ x: ad.x1!, y: ad.y1! }, { x: ad.x2!, y: ad.y2! }));
    Object.assign(be, solveLinearEquation({ x: be.x1!, y: be.y1! }, { x: be.x2!, y: be.y2! }));
    const updateInter = getInterByLinearEq({ m: ad.m!, b: ad.b! }, { m: be.m!, b: be.b! });
    intersection.set({ left: updateInter.x, top: updateInter.y });
    [ia, ib, ic, id, ie, iF].forEach((line) =>
      setLineFromPoints(
        line,
        { x: line.p1!.left!, y: line.p1!.top! },
        { x: intersection.left!, y: intersection.top! }
      )
    );

    setLabelToPoint(
      [p.clockPoint!.label!, p.cntClockPoint!.label!],
      [p.clockPoint!, p.cntClockPoint!]
    );
  };

  cvsBra.on("object:moving", onPointMove);
}

/**
 * Part III
 */
function partThree() {
  const cvsDes = new fabric.Canvas("Desargues-canvas", {
    selection: false,
    backgroundColor: "floralwhite",
  });
  /**
   * Position initialization.
   */
  const cvsWidth = 800;
  // (2,5.5)--(0,6)--(1.5,4)
  const mul = 50;
  const yOffset = 470;
  const xOffset = 75;
  const pointC = makeCircle(xOffset + 2 * mul, yOffset - 5.5 * mul);
  const pointB = makeCircle(xOffset + 0 * mul, yOffset - 6 * mul);
  const pointA = makeCircle(xOffset + 1.5 * mul, yOffset - 4 * mul);
  // (5.5,1.125)--(0,0)--(2.25,2)
  const pointPrimeC = makeCircle(xOffset + mul * 5.5, yOffset - mul * 1.125, 1, undefined);
  const pointPrimeB = makeCircle(xOffset + mul * 0, yOffset - mul * 0, 1, undefined);
  const pointPrimeA = makeCircle(xOffset + mul * 2.25, yOffset - mul * 2, 1, undefined);
  const abc = new fabric.Polygon(circleToCoord(pointA, pointB, pointC), { fill: "yellow" });
  const primeTriangle = new fabric.Polygon(circleToCoord(pointPrimeA, pointPrimeB, pointPrimeC), {
    fill: "#5efc03",
  });
  abc.selectable = false;
  abc.evented = false;
  primeTriangle.selectable = false;
  primeTriangle.evented = false;
  cvsDes.add(abc, primeTriangle);
  cvsDes.add(pointA, pointB, pointC, pointPrimeA, pointPrimeB, pointPrimeC);

  const aLabel = makeLabel("A", { x: 15, y: -10 });
  const bLabel = makeLabel("B", { x: -18, y: 5 });
  const cLabel = makeLabel("C", { x: 15, y: -20 });
  const aprimeLabel = makeLabel("A'", { x: -10, y: 5 });
  const bprimeLabel = makeLabel("B'");
  const cprimeLabel = makeLabel("C'");
  const movablePoints = [pointA, pointB, pointC, pointPrimeA, pointPrimeB, pointPrimeC];
  setLabelToPoint([aLabel, bLabel, cLabel, aprimeLabel, bprimeLabel, cprimeLabel], movablePoints);
  // const pointsFromMovables = movablePoints.map(ele => new fabric.Point(ele.left!, ele.top!));
  // const [pa, pb, pc, ppa, ppb, ppc] = pointsFromMovables;
  cvsDes.add(aLabel, bLabel, cLabel, aprimeLabel, bprimeLabel, cprimeLabel);

  const aAprime = makeLine(pointA, pointPrimeA);
  const bBprime = makeLine(pointB, pointPrimeB);
  // const cCprime = makeLine(pointC, pointPrimeC);
  // cvsDes.add(aAprime, bBprime, cCprime);
  const pO = calculateLineIntersectInPoints(aAprime, bBprime, true);
  const pointO = makeCircle(pO!, 0.5);
  const oBp = makeLine(pointO, pointPrimeB);
  const oCp = makeLine(pointO, pointPrimeC);
  const oAp = makeLine(pointO, pointPrimeA);
  pointB.moveLine = oBp;
  pointA.moveLine = oAp;
  pointC.moveLine = oCp;
  pointA.upBound = pointPrimeA;
  pointA.downBound = pointO;
  pointB.upBound = pointPrimeB;
  pointB.downBound = pointO;
  pointC.upBound = pointPrimeC;
  pointC.downBound = pointO;
  Object.assign(
    oAp,
    solveLinearEquation(
      { x: pointO.left!, y: pointO.top! },
      { x: pointPrimeA.left!, y: pointPrimeA.top! }
    )
  );
  Object.assign(
    oBp,
    solveLinearEquation(
      { x: pointO.left!, y: pointO.top! },
      { x: pointPrimeB.left!, y: pointPrimeB.top! }
    )
  );
  Object.assign(
    oCp,
    solveLinearEquation(
      { x: pointO.left!, y: pointO.top! },
      { x: pointPrimeC.left!, y: pointPrimeC.top! }
    )
  );
  cvsDes.add(pointO, oBp, oCp, oAp);
  // Triangle part
  const ab = makeLine(pointA, pointB);
  const ac = makeLine(pointA, pointC);
  const bc = makeLine(pointB, pointC);
  const apBp = makeLine(pointPrimeA, pointPrimeB);
  const apCp = makeLine(pointPrimeA, pointPrimeC);
  const bpCp = makeLine(pointPrimeB, pointPrimeC);
  cvsDes.add(ab, ac, bc, apBp, apCp, bpCp);
  // Assign respective lines and points
  Object.assign(ab, {
    p1: pointA,
    p2: pointB,
    thatLine: apBp,
  });
  Object.assign(ac, {
    p1: pointA,
    p2: pointC,
    thatLine: apCp,
  });
  Object.assign(bc, {
    p1: pointC,
    p2: pointB,
    thatLine: bpCp,
  });
  Object.assign(apBp, {
    p1: pointPrimeA,
    p2: pointPrimeB,
    thatLine: ab,
  });
  Object.assign(apCp, {
    p1: pointPrimeA,
    p2: pointPrimeC,
    thatLine: ac,
  });
  Object.assign(bpCp, {
    p1: pointPrimeC,
    p2: pointPrimeB,
    thatLine: bc,
  });
  pointA.crossLines = [ab, ac];
  pointB.crossLines = [ab, bc];
  pointC.crossLines = [ac, bc];

  // Collinear & cocurrent
  const pointP = makeCircle(calculateLineIntersectInPoints(bc, bpCp, true)!, 0.5);
  const cp = makeLine(pointC, pointP);
  const cpP = makeLine(pointPrimeC, pointP);

  const pointQ = makeCircle(calculateLineIntersectInPoints(ac, apCp, true)!, 0.5);
  const pointR = makeCircle(calculateLineIntersectInPoints(ab, apBp, true)!, 0.5);
  const aq = makeLine(pointA, pointQ);
  const apQ = makeLine(pointPrimeA, pointQ);
  const ar = makeLine(pointA, pointR);
  const apR = makeLine(pointPrimeA, pointR);
  const pq = makeLine(pointP, pointQ);
  pq.p1 = pointP;
  pq.p2 = pointQ;
  cvsDes.add(cp, cpP, aq, apQ, ar, apR, pq);
  cvsDes.add(pointP, pointQ, pointR);
  // Assigning intersections
  ab.inter = pointR;
  apBp.inter = pointR;
  ac.inter = pointQ;
  apCp.inter = pointQ;
  bc.inter = pointP;
  bpCp.inter = pointP;
  // Intersection lines
  pointR.crossLines = [ar, apR];
  ar.p1 = pointA;
  ar.p2 = pointR;
  apR.p1 = pointPrimeA;
  apR.p2 = pointR;
  pointQ.crossLines = [aq, apQ];
  aq.p1 = pointQ;
  aq.p2 = pointA;
  apQ.p1 = pointPrimeA;
  apQ.p2 = pointQ;
  pointP.crossLines = [cp, cpP];
  cp.p1 = pointC;
  cp.p2 = pointP;
  cpP.p1 = pointPrimeC;
  cpP.p2 = pointP;
  const oLabel = makeLabel("O", { x: -5, y: -30 });
  const pLabel = makeLabel("P");
  const qLabel = makeLabel("Q", { x: -25, y: 0 });
  const rLabel = makeLabel("R", { x: 10, y: 0 });
  setLabelToPoint([oLabel, pLabel, qLabel, rLabel], [pointO, pointP, pointQ, pointR]);
  cvsDes.add(oLabel, pLabel, qLabel, rLabel);
  [pointPrimeA, pointPrimeB, pointPrimeC, pointO, pointP, pointQ, pointR].forEach((p) => {
    p.set({ lockMovementX: true, lockMovementY: true, evented: false });
  });

  // Interaction
  const onPointMove = (e: IEvent): void => {
    const p = e.target! as Circle;
    // Restrict movement to line
    if (p.moveLine !== undefined) {
      // Restric boundries
      if (p.upBound !== undefined && p.top! > p.upBound.top!) p.top = p.upBound.top;
      if (p.downBound !== undefined && p.top! < p.downBound.top!) p.top = p.downBound.top;
      let x = (p.top! - p.moveLine.b!) / p.moveLine.m!;
      if (p.moveLine.m === Infinity) x = p.moveLine.x1!;
      p.set("left", x);
    }
    abc.set("points", circleToCoord(pointA, pointB, pointC));

    if (p.crossLines !== undefined) {
      p.crossLines.forEach((line) => {
        // Adjust line position
        line.set({
          x1: line.p1!.left,
          y1: line.p1!.top,
          x2: line.p2!.left,
          y2: line.p2!.top,
        });
        // Adjust intersections accordingly
        if (line.inter !== undefined && line.inter.crossLines !== undefined) {
          updateInterAndLine(line, line.thatLine!, line.inter);
          setLabelToPoint([line.inter.label!], [line.inter]);
        }
      });
    }
    // Update the collinear PQ line
    // Extend to canvas width
    Object.assign(
      pq,
      solveLinearEquation({ x: pq.p1!.left!, y: pq.p1!.top! }, { x: pq.p2!.left!, y: pq.p2!.top! })
    );
    pq.set({
      x1: 0,
      y1: pq.b,
      x2: cvsWidth,
      y2: cvsWidth * pq.m! + pq.b!,
    });
    // Update according to position change
    if (p.label !== undefined) {
      setLabelToPoint([p.label], [p]);
    }
  };
  cvsDes.on("object:moving", onPointMove);
}

/**
 * Part II
 */

function partTwo() {
  const cvsPascal = new fabric.Canvas("Pascal-canvas", {
    selection: false,
    backgroundColor: "aliceblue",
  });
  const RADIUS = 80;
  const center = { x: 150, y: 350 } as Coord;
  let pointA = coordToPoint(polarToCartesian(RADIUS, 10, center));
  let pointB = coordToPoint(polarToCartesian(RADIUS, 45, center));
  let pointC = coordToPoint(polarToCartesian(RADIUS, 80, center));
  let pointD = coordToPoint(polarToCartesian(RADIUS, 110, center));
  let pointE = coordToPoint(polarToCartesian(RADIUS, 225, center));
  let pointF = coordToPoint(polarToCartesian(RADIUS, 310, center));

  const aLabel = makeLabel("A", { x: 5, y: -10 });
  const bLabel = makeLabel("B", { x: -20, y: 0 });
  const cLabel = makeLabel("C", { x: -10, y: 10 });
  const dLabel = makeLabel("D", { x: -35, y: -20 });
  const eLabel = makeLabel("E", { x: -10, y: 5 });
  const fLabel = makeLabel("F", { x: 1, y: 10 });
  setLabelToPoint(
    [aLabel, bLabel, cLabel, dLabel, eLabel, fLabel],
    [pointA, pointB, pointC, pointD, pointE, pointF]
  );
  cvsPascal.add(aLabel, bLabel, cLabel, dLabel, eLabel, fLabel);

  const circle = new fabric.Circle({
    radius: RADIUS,
    fill: "",
    strokeWidth: 1,
    stroke: "black",
    left: center.x - RADIUS,
    top: center.y - RADIUS,
    hasControls: false,
    selectable: false,
  });
  cvsPascal.add(circle);

  const xLable = makeLabel("X", { x: 0, y: -30 });
  const yLable = makeLabel("Y", { x: -15, y: 0 });
  const zLable = makeLabel("Z", { x: 5, y: -25 });
  const pointX = new fabric.Point(0, 0);
  const pointY = new fabric.Point(0, 0);
  const pointZ = new fabric.Point(0, 0);
  const xy = makeLine(pointX, pointY, 1, "red");

  function createLine(points?: number[], color?: string, strokeWidth?: number) {
    return new fabric.Line(points || [], {
      originX: "center",
      originY: "center",
      hasControls: false,
      hasBorders: false,
      evented: false,
      stroke: color || "black",
      strokeWidth: strokeWidth || 1,
    });
  }
  const dx = makeLine(pointX, pointD, 1, "blue");
  const bx = makeLine(pointB, pointX, 1, "blue");
  const cz = makeLine(pointC, pointZ, 1, "blue");
  const az = makeLine(pointA, pointZ, 1, "blue");
  const by = makeLine(pointB, pointY, 1, "blue");
  const fy = makeLine(pointF, pointY, 1, "blue");

  function circleRestrict(p: fabric.Point): fabric.Point {
    let rad = Math.atan(-findSlope([center.x, center.y], [p.x, p.y]));
    if (p.x < center.x) {
      rad -= Math.PI;
    }
    const coord = polarToCartesian(RADIUS, rad, center, false);
    p.setFromPoint(coord);
    return p;
  }

  const pa = makeCircle(pointA);
  const pb = makeCircle(pointB);
  const pc = makeCircle(pointC);
  const pd = makeCircle(pointD);
  const pe = makeCircle(pointE);
  const pf = makeCircle(pointF);
  const circles = [pa, pb, pc, pd, pe, pf];
  cvsPascal.add(pa, pb, pc, pd, pe, pf);

  const poly = makeMovablePolygon(
    [pointA, pointB, pointC, pointD, pointE, pointF],
    function (coords: fabric.Point[]) {
      [pointA, pointB, pointC, pointD, pointE, pointF] = coords;
      for (let idx = 0; idx < coords.length; idx++) {
        const c = circles[idx];
        const coord = coords[idx];
        c.set({ left: coord.x, top: coord.y });
      }
      setLabelToPoint([aLabel, bLabel, cLabel, dLabel, eLabel, fLabel], coords);
      pointX.setFromPoint(
        calculateLineIntersectInPoints(
          // de - ab
          makeLine(pointD, pointE),
          makeLine(pointA, pointB),
          true
        ) as fabric.Point
      );
      pointY.setFromPoint(
        calculateLineIntersectInPoints(
          // ef - bc
          makeLine(pointF, pointE),
          makeLine(pointC, pointB),
          true
        ) as fabric.Point
      );
      pointZ.setFromPoint(
        calculateLineIntersectInPoints(
          // af - dc
          makeLine(pointF, pointA),
          makeLine(pointC, pointD),
          true
        ) as fabric.Point
      );
      setLabelToPoint([xLable, yLable, zLable], [pointX, pointY, pointZ]);
      setLineFromPoints(dx, pointX, pointD);
      setLineFromPoints(bx, pointB, pointX);
      setLineFromPoints(cz, pointC, pointZ);
      setLineFromPoints(az, pointA, pointZ);
      setLineFromPoints(by, pointB, pointY);
      setLineFromPoints(fy, pointF, pointY);
      const { m, b } = solveLinearEquation(pointX, pointY);
      const y1 = m * 500 + b;
      setLineFromPoints(xy, { x: 500, y: y1 }, { x: 0, y: b });
    },
    circleRestrict
  );
  cvsPascal.add(dx, bx, cz, az, by, fy, xy);
  cvsPascal.add(poly, xLable, yLable, zLable);

  function _polygonPositionHandler(fn?: (points: fabric.Point[]) => void) {
    return function (
      this: { pointIndex: number },
      _dim: any,
      _finalMatrix: any,
      fabricObject: fabric.Polygon
    ) {
      const c = fabricObject.points!.map(function (pt: fabric.Point) {
        const transformPoint = new fabric.Point(
          pt.x - fabricObject.pathOffset.x,
          pt.y - fabricObject.pathOffset.y
        );
        return fabric.util.transformPoint(
          transformPoint,
          fabric.util.multiplyTransformMatrices(
            fabricObject.canvas!.viewportTransform!,
            fabricObject.calcTransformMatrix()
          )
        );
      });
      if (fn !== undefined) {
        fn(c);
      }
      return c[this.pointIndex];
    };
  }

  function _actionHandler(
    _eventData: any,
    transform: fabric.Transform,
    x: number,
    y: number,
    fn: (p: fabric.Point) => fabric.Point
  ) {
    type MyFabricObject = fabric.Polygon & { __corner: any };
    const polygon = transform.target as MyFabricObject;
    const currentControl: any = polygon.controls[polygon.__corner];
    const mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), "center", "center");
    const polygonBaseSize = polygon._getNonTransformedDimensions();
    const size = polygon._getTransformedDimensions(0, 0);
    const finalPointPosition = new fabric.Point(
      (mouseLocalPosition.x * polygonBaseSize.x) / size.x + polygon.pathOffset.x,
      (mouseLocalPosition.y * polygonBaseSize.y) / size.y + polygon.pathOffset.y
    );
    polygon.points![currentControl.pointIndex] = fn(finalPointPosition);
    return true;
  }

  function _anchorWrapper(
    anchorIndex: number,
    fn: (
      eventData: MouseEvent,
      transform: fabric.Transform,
      x: number,
      y: number,
      fn2: (p: fabric.Point) => fabric.Point
    ) => any,
    fn2: (p: fabric.Point) => fabric.Point
  ) {
    return function (eventData: MouseEvent, transform: fabric.Transform, x: number, y: number) {
      const fabricObject = transform.target as any;
      const absolutePoint = fabric.util.transformPoint(
        new fabric.Point(
          fabricObject.points![anchorIndex].x - fabricObject.pathOffset.x,
          fabricObject.points![anchorIndex].y - fabricObject.pathOffset.y
        ),
        fabricObject.calcTransformMatrix()
      );
      const actionPerformed = fn(eventData, transform, x, y, fn2);
      const polygonBaseSize = fabricObject._getNonTransformedDimensions();
      const newX =
        (fabricObject.points![anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x;
      const newY =
        (fabricObject.points![anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
      return actionPerformed;
    };
  }

  function makeMovablePolygon(
    vertexes: fabric.Point[],
    fn: (points: fabric.Point[]) => void,
    fn2: (p: fabric.Point) => fabric.Point
  ) {
    const polygon = new fabric.Polygon(vertexes, {
      fill: "transparent",
      strokeWidth: 1.5,
      stroke: "black",
      objectCaching: false,
      transparentCorners: false,
      cornerStyle: "circle",
      cornerColor: "transparent",
      cornerSize: 20,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true,
    });
    polygon.controls = polygon.points!.reduce(function (acc: any, _point, index) {
      type MyFabricControl = fabric.Control & {
        pointIndex: number;
      };
      const control = new fabric.Control({
        positionHandler: _polygonPositionHandler(fn),
        actionHandler: _anchorWrapper(
          index > 0 ? index - 1 : polygon.points!.length - 1,
          _actionHandler,
          fn2
        ),
        actionName: "modifyPolygon",
      }) as MyFabricControl;
      control.pointIndex = index;
      acc["p" + index] = control;
      return acc;
    }, {});
    return polygon;
  }
}

export default defineComponent({
  setup() {
    return { topic };
  },
  mounted() {
    const canvas = new fabric.Canvas("Pascal-Brainchon-canvas", {
      selection: false,
      backgroundColor: "floralwhite",
    });

    const bottomLine = new fabric.Line([0, 400, 500, 400], { // # TODO use reduce
      stroke: "black",
      hasControls: false,
      hasBorders: false,
      evented: false,
      strokeWidth: 2,
    }) as Line;
    Object.assign(
      bottomLine,
      solveLinearEquation(
        new fabric.Point(bottomLine.x1!, bottomLine.y1!),
        new fabric.Point(bottomLine.x2!, bottomLine.y2!)
      )
    );
    // y = -0.12x + 100
    const upperLine = new fabric.Line([0, 130, 500, 40], {
      stroke: "black",
      hasControls: false,
      hasBorders: false,
      evented: false,
      strokeWidth: 2,
    }) as Line;
    Object.assign(
      upperLine,
      solveLinearEquation(
        new fabric.Point(upperLine.x1!, upperLine.y1!),
        new fabric.Point(upperLine.x2!, upperLine.y2!)
      )
    );

    const aLabel = makeLabel("A", { x: -20, y: 15 });
    const bLabel = makeLabel("B", { x: 0, y: 15 });
    const cLabel = makeLabel("C", { x: 5, y: 15 });
    const aprimeLabel = makeLabel("A'", { x: -20, y: -40 });
    const bprimeLabel = makeLabel("B'", { x: 0, y: -40 });
    const cprimeLabel = makeLabel("C'", { x: 0, y: -40 });
    const xLabel = makeLabel("X", { x: 20, y: 0 });
    const yLabel = makeLabel("Y", { x: -5, y: 5 });
    const zLabel = makeLabel("Z", { x: -30, y: 0 });

    // updated each point below (for Picture 1) to have radius 3, although it seems that makeCircle function already defaults radius 3 and padding 20
    const pointA = makeCircle(50, 400, 3);
    const pointB = makeCircle(250, 400, 3);
    const pointC = makeCircle(450, 400, 3);
    const pointPrimeA = makeCircle(50, upperLine.m! * 50 + upperLine.b!, 3);
    const pointPrimeB = makeCircle(250, upperLine.m! * 250 + upperLine.b!, 3);
    const pointPrimeC = makeCircle(450, upperLine.m! * 450 + upperLine.b!, 3);

    const movablePoints = [pointA, pointB, pointC, pointPrimeA, pointPrimeB, pointPrimeC];

    setLabelToPoint([aLabel, bLabel, cLabel, aprimeLabel, bprimeLabel, cprimeLabel], movablePoints);

    const pointsFromMovables = movablePoints.map((ele) => new fabric.Point(ele.left!, ele.top!));
    const [pA, pB, pC, ppA, ppB, ppC] = pointsFromMovables;
    const aBprime = makeLine(pA, ppB, undefined, "blue");
    const aCprime = makeLine(pA, ppC, undefined, "blue");
    const bAprime = makeLine(pB, ppA, undefined, "blue");
    const bCprime = makeLine(pB, ppC, undefined, "blue");
    const cAprime = makeLine(pC, ppA, undefined, "blue");
    const cBprime = makeLine(pC, ppB, undefined, "blue");

    const pZ = fabric.Intersection.intersectLineLine(pA, ppB, ppA, pB).points![0];

    const pY = (fabric.Intersection.intersectLineLine(pA, ppC, ppA, pC) as Intersection).points![0];
    const pX = (fabric.Intersection.intersectLineLine(pB, ppC, pC, ppB) as Intersection).points![0];
    const [pointX, pointY, pointZ] = [pX, pY, pZ].map((p) => makeCircle(p, 0.5, 0));
    // set fill to red for points X, Y, Z
    pointX.fill = "red";
    pointY.fill = "red";
    pointZ.fill = "red";
    // Disable user dragging on intersections
    pointX.set({ lockMovementX: true, lockMovementY: true });
    pointY.set({ lockMovementX: true, lockMovementY: true });
    pointZ.set({ lockMovementX: true, lockMovementY: true });

    setLabelToPoint([zLabel, yLabel, xLabel], [pointZ, pointY, pointX]);

    pointA.rightBound = pointB;
    pointB.leftBound = pointA;
    pointB.rightBound = pointC;
    pointC.leftBound = pointB;
    pointPrimeA.rightBound = pointPrimeB;
    pointPrimeB.leftBound = pointPrimeA;
    pointPrimeB.rightBound = pointPrimeC;
    pointPrimeC.leftBound = pointPrimeB;

    const COLL_OFF_SET = 100;
    const collinearLine = makeLine(pZ, pX, 2, "red") as Line;
    collinearLine.p1 = pointZ;
    collinearLine.p2 = pointX;
    Object.assign(
      collinearLine,
      solveLinearEquation(
        new fabric.Point(collinearLine.p1!.left!, collinearLine.p1!.top!),
        new fabric.Point(collinearLine.p2!.left!, collinearLine.p2!.top!)
      )
    );
    collinearLine.set({
      x1: collinearLine.p1!.left! - COLL_OFF_SET,
      y1: collinearLine.m! * (collinearLine.p1!.left! - COLL_OFF_SET) + collinearLine.b!,
      x2: collinearLine.p2!.left! + COLL_OFF_SET,
      y2: collinearLine.m! * (collinearLine.p2!.left! + COLL_OFF_SET) + collinearLine.b!,
    });

    // Bind related lines and intersects to points
    pointA.upLine = [aBprime, aCprime];
    pointA.intersects = [pointZ, pointY];
    pointB.upLine = [bAprime, bCprime];
    pointB.intersects = [pointZ, pointX];
    pointC.upLine = [cAprime, cBprime];
    pointC.intersects = [pointY, pointX];
    pointPrimeA.downLine = [bAprime, cAprime];
    pointPrimeA.intersects = [pointZ, pointY];
    pointPrimeB.downLine = [aBprime, cBprime];
    pointPrimeB.intersects = [pointZ, pointX];
    pointPrimeC.downLine = [aCprime, bCprime];
    pointPrimeC.intersects = [pointY, pointX];

    // Bind lines to intersects
    pointZ.crossLines = [aBprime, bAprime];
    pointY.crossLines = [cAprime, aCprime];
    pointX.crossLines = [bCprime, cBprime];

    const onPointMove = (e: IEvent): void => {
      const p = e.target! as Circle;
      // Setting the boundaries of the point's position
      if (p.leftBound !== undefined && p.left! < p.leftBound.left!) {
        p.left = p.leftBound.left;
      }
      if (p.rightBound !== undefined && p.left! > p.rightBound.left!) {
        p.left = p.rightBound.left;
      }
      if (p.upLine !== undefined) {
        p.top = 400; // Hard-coded for now
      } else if (p.downLine !== undefined) {
        p.top = upperLine.m! * p.left! + upperLine.b!;
      }

      if (p.upLine !== undefined) {
        p.upLine.forEach((line) => line.set({ x1: p.left }));
      }
      if (p.downLine !== undefined) {
        p.downLine.forEach((line) => line.set({ x2: p.left, y2: p.top }));
      }

      if (p.intersects !== undefined) {
        p.intersects.forEach((inter) => {
          const [l1, l2] = inter.crossLines!;
          const intersect = getIntersectFromLines(l1, l2);
          const coord = { left: intersect.x, top: intersect.y };
          inter.set(coord);
          if (inter.label !== undefined) {
            setLabelToPoint([inter.label!], [coord]);
          }
        });
        Object.assign(
          collinearLine,
          solveLinearEquation(
            { x: collinearLine.p1!.left!, y: collinearLine.p1!.top! },
            { x: collinearLine.p2!.left!, y: collinearLine.p2!.top! }
          )
        );
        collinearLine.set({
          x1: collinearLine.p1!.left! - COLL_OFF_SET,
          y1: collinearLine.m! * (collinearLine.p1!.left! - COLL_OFF_SET) + collinearLine.b!,
          x2: collinearLine.p2!.left! + COLL_OFF_SET,
          y2: collinearLine.m! * (collinearLine.p2!.left! + COLL_OFF_SET) + collinearLine.b!,
        });
      }

      if (p.label !== undefined) {
        setLabelToPoint([p.label!], [{ top: p.top!, left: p.left! }]);
      }
    };

    canvas.on("object:moving", onPointMove);

    canvas.add(
      aLabel,
      bLabel,
      cLabel,
      aprimeLabel,
      bprimeLabel,
      cprimeLabel,
      xLabel,
      yLabel,
      zLabel
    );
    canvas.add(...movablePoints);
    canvas.add(aBprime, aCprime, bAprime, bCprime, cAprime, cBprime, collinearLine);
    canvas.add(pointX, pointY, pointZ);
    canvas.add(bottomLine, upperLine);

    /**
     * Part two of animation Pascal Theorem
     */
    partTwo();

    /**
     * Part three of animation: Desargues' Theorem
     */
    partThree();

    /**
     * Part IV
     */
    partFour();
  },
});

/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
</script>
