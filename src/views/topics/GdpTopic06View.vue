<template>
  <TopicMeta :topic="topic" />
  <div id="Pascal-Brainchon-wrapper">
    <canvas id="Pascal-Brainchon-canvas" width="500" height="500" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { indexTopicMap } from '@/data';
import { Topic } from '@/types';
import { fabric } from 'fabric';
import { makeLabel, makeLine, makeMovablePoint } from '@/utils/canvas';
import { IEvent } from 'fabric/fabric-impl';
import { calculateLineIntersectInLinearEquation, solveLinearEquation } from '@/utils/geometry';

const topic = indexTopicMap.get(6) as Topic;

/**
 * Type definitions
 */
type Intersection = {
  status?: string
  points?: Array<fabric.Point>
}

type Circle = fabric.Circle & {
  [key: string]: any,
  intersects?: Array<Circle>,
  upLine?: Array<fabric.Line>,
  downLine?: Array<fabric.Line>,
  crossLines?: Array<fabric.Line>,
  label?: fabric.Text,
}

type Line = fabric.Line & {
  p1?: Circle,
  p2?: Circle,
  m?: number,
  b?: number,
}

type Coord = {
  x: number,
  y: number,
}

/**
 * Utility functions
 */
const setLableToPoint = (labels: Array<fabric.Text>, points: Array<Circle>): void => {
  for (let index = 0; index < labels.length; index++) {
    let label = labels[index];
    let point = points[index]
    label.left = point.left
    label.top = point.top
    point.label = label
  }
}

function makeCircle(point: fabric.Point, radius?: number, fill?: any): Circle
function makeCircle(x: number, y: number, radius?: number, fill?: any): Circle
function makeCircle(x: number | fabric.Point, y?: number, radius?: number, fill?: any): Circle {
  if (x instanceof fabric.Point) {
    y = x.y
    x = x.x
  }
  let point = makeMovablePoint({ x: x, y: y })
  point.set({
    originX: "center",
    originY: "center",
    radius: radius || 5,
    fill: fill || "black",
  })
  return point
}

function getIntersectFromLines(line1: fabric.Line, line2: fabric.Line): Coord {
  let l1 = solveLinearEquation({ x: line1.x1, y: line1.y1 }, { x: line1.x2, y: line1.y2 })
  let l2 = solveLinearEquation({ x: line2.x1, y: line2.y1 }, { x: line2.x2, y: line2.y2 })
  return calculateLineIntersectInLinearEquation(l1.m, l1.b, l2.m, l2.b)
}


export default defineComponent(
  {
    setup() {
      return { topic };
    },
    mounted() {
      const canvas = new fabric.Canvas("Pascal-Brainchon-canvas", {
        selection: false,
        backgroundColor: "floralwhite",
      });
      const log = console.log

      const aLabel = makeLabel("A");
      const bLabel = makeLabel("B");
      const cLabel = makeLabel("C");
      const aprimeLabel = makeLabel("A'");
      const bprimeLabel = makeLabel("B'");
      const cprimeLabel = makeLabel("C'");
      const xLabel = makeLabel("X")
      const yLabel = makeLabel("Y")
      const zLabel = makeLabel("Z")


      const pointA = makeCircle(50, 400)
      const pointB = makeCircle(250, 400)
      const pointC = makeCircle(450, 400)
      const pointPrimeA = makeCircle(50, 94)
      const pointPrimeB = makeCircle(250, 70)
      const pointPrimeC = makeCircle(450, 46)

      const movablePoints = [pointA, pointB, pointC, pointPrimeA, pointPrimeB, pointPrimeC]

      setLableToPoint(
        [aLabel, bLabel, cLabel, aprimeLabel, bprimeLabel, cprimeLabel],
        movablePoints
      )

      let pointsFromMovables = movablePoints.map(ele => new fabric.Point(ele.left!, ele.top!))
      log("pointsFromMovables", pointsFromMovables)
      const [pA, pB, pC, ppA, ppB, ppC] = pointsFromMovables
      // log([pA, pB, pC, ppA, ppB, ppC])
      const aBprime = makeLine(pA, ppB, null, "blue")
      const aCprime = makeLine(pA, ppC, null, "blue")
      const bAprime = makeLine(pB, ppA, null, "blue")
      const bCprime = makeLine(pB, ppC, null, "blue")
      const cAprime = makeLine(pC, ppA, null, "blue")
      const cBprime = makeLine(pC, ppB, null, "blue")
      let bottomLine = new fabric.Line(  // # TODO use reduce
        [0, 400, 500, 400],
        {
          stroke: "black",
          hasControls: false,
          hasBorders: false,
          evented: false,
          strokeWidth: 2,
        }
      ) as Line;
      Object.assign(bottomLine, solveLinearEquation(
        { x: bottomLine.x1, y: bottomLine.y1 }, { x: bottomLine.x2, y: bottomLine.y2 }
      ))
      // y = -0.12x + 100
      let upperLine = new fabric.Line(
        [0, 100, 500, 40],
        {
          stroke: "black",
          hasControls: false,
          hasBorders: false,
          evented: false,
          strokeWidth: 2,
        }
      ) as Line;
      Object.assign(upperLine, solveLinearEquation(
        { x: upperLine.x1, y: upperLine.y1 }, { x: upperLine.x2, y: upperLine.y2 }
      ))

      // aBprime.set({x1: 60})
      const pZ = (fabric.Intersection.intersectLineLine(
        pA, ppB, ppA, pB) as Intersection).points![0]
      const pY = (fabric.Intersection.intersectLineLine(
        pA, ppC, ppA, pC) as Intersection).points![0]
      const pX = (fabric.Intersection.intersectLineLine(
        pB, ppC, pC, ppB) as Intersection).points![0]
      const [pointX, pointY, pointZ] = [pX, pY, pZ].map(p => makeCircle(p, undefined, 3))
      log("pointX", pointX)
      setLableToPoint([zLabel, yLabel, xLabel], [pointZ, pointY, pointX])

      const collinearLine = makeLine(pZ, pX, 2, "red") as Line
      collinearLine.p1 = pointZ
      collinearLine.p2 = pointX

      // Bind related lines and intersects to points
      pointA.upLine = [aBprime, aCprime]
      pointA.intersects = [pointZ, pointY]
      pointB.upLine = [bAprime, bCprime]
      pointB.intersects = [pointZ, pointX]
      pointC.upLine = [cAprime, cBprime]
      pointC.intersects = [pointY, pointX]
      pointPrimeA.downLine = [bAprime, cAprime]
      pointPrimeA.intersects = [pointZ, pointY]
      pointPrimeB.downLine = [aBprime, cBprime]
      pointPrimeB.intersects = [pointZ, pointX]
      pointPrimeC.downLine = [aCprime, bCprime]
      pointPrimeC.intersects = [pointY, pointX]

      // Bind lines to intersects
      pointZ.crossLines = [aBprime, bAprime]
      pointY.crossLines = [cAprime, aCprime]
      pointX.crossLines = [bCprime, cBprime]

      const onPointMove = (e: IEvent): void => {
        let p = e.target! as Circle
        if (p.upLine != null) {
          p.top = 400 // Hard-coded for now
        } else {
          p.top = upperLine.m! * p.left! + upperLine.b!
        }

        p.upLine && p.upLine.forEach(line => line.set({ x1: p.left }))
        p.downLine && p.downLine.forEach(line => line.set({ x2: p.left, y2: p.top }))

        p.intersects && p.intersects.forEach(inter => {
          let [l1, l2] = inter.crossLines!
          let intersect = getIntersectFromLines(l1, l2)
          let coord = { left: intersect.x, top: intersect.y }
          inter.set(coord)
          inter.label?.set(coord)
        })
        p.intersects && collinearLine.set({
          x1: collinearLine.p1?.left,
          y1: collinearLine.p1?.top,
          x2: collinearLine.p2?.left,
          y2: collinearLine.p2?.top
        })

        p.label && p.label.set({top: p.top, left: p.left})
      }

      canvas.on("object:moving", onPointMove)

      // aBprime.controls = 
      // log("aBprime", aBprime)

      canvas.add(aLabel, bLabel, cLabel,
        aprimeLabel, bprimeLabel, cprimeLabel, xLabel, yLabel, zLabel)
      canvas.add(...movablePoints)
      canvas.add(aBprime, aCprime, bAprime, bCprime, cAprime, cBprime, collinearLine)
      canvas.add(pointX, pointY, pointZ)
      canvas.add(bottomLine, upperLine)
      // const pB = new fabric.Point(90, 100);
    },
  },
);
</script>