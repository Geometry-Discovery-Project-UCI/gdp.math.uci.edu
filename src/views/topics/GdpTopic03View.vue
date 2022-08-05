<template>
  <TopicMeta :topic="topic" />
  <ATypographyParagraph>

  </ATypographyParagraph>
  <div id="centroid-wrapper">
    <ATypographyTitle :level="4">Centroid Animated Illustration</ATypographyTitle>
    <canvas id="centroid-canvas" width="500" height="500"></canvas>
  </div>

  <ATypographyParagraph>

  </ATypographyParagraph>
  <div id="incenter-wrapper">
    <ATypographyTitle :level="4">Incenter Animated Illustration</ATypographyTitle>
    <canvas id="incenter-canvas" width="500" height="500"></canvas>
  </div>

  <ATypographyParagraph>

  </ATypographyParagraph>
  <div id="circumcenter-wrapper">
    <ATypographyTitle :level="4">Circumcenter Animated Illustration</ATypographyTitle>
    <canvas id="circumcenter-canvas" width="500" height="500"></canvas>
  </div>

  <ATypographyParagraph>

  </ATypographyParagraph>
  <div id="orthocenter-wrapper">
    <ATypographyTitle :level="4">Orthocenter Animated Illustration</ATypographyTitle>
    <canvas id="orthocenter-canvas" width="500" height="500"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import {
  makeCircle,
  makeLabel,
  makeLine,
  makeMovablePoint,
  makeMovablePolygon
} from "@/utils/canvas";
import {
  calculateCircumcenter,
  calculateDistanceFromPointToLine,
  calculateIncenter,
  calculateLineIntersectInPoints,
  calculateMidpoint, calculateOrthocenter,
  calculateThreeAngles, drawRightAngleSignCoords,
  getPedalPoint
} from "@/utils/geometry";
import {Circle, IEvent} from "fabric/fabric-impl";
const topic = indexTopicMap.get(3) as Topic;
export default defineComponent(
  {
    setup() {
      return { topic };
    },
    mounted() {
      // Centroid animation function
      (() => {
        const canvas = new fabric.Canvas("centroid-canvas", {
          selection: false,
          backgroundColor: "floralwhite",
        });

        const median1 = makeLine();
        const median2 = makeLine();
        const median3 = makeLine();

        // vertexes
        const aLabel = makeLabel("A");
        const bLabel = makeLabel("B");
        const cLabel = makeLabel("C");

        // midpoints
        const dLabel = makeLabel("D");
        const eLabel = makeLabel("E");
        const fLabel = makeLabel("F");

        // centroid
        const gLabel = makeLabel("G");

        const triangle = makeMovablePolygon(
          [new fabric.Point(125, 50), new fabric.Point(50, 450), new fabric.Point(450, 450)],
          function (coords: fabric.Point[]) {
            const mp1 = calculateMidpoint(coords[0], coords[1]);
            const mp2 = calculateMidpoint(coords[0], coords[2]);
            const mp3 = calculateMidpoint(coords[1], coords[2]);

            median1.set({
              x1: coords[0].x,
              y1: coords[0].y,
              x2: mp3.x,
              y2: mp3.y,
            });
            median2.set({
              x1: coords[1].x,
              y1: coords[1].y,
              x2: mp2.x,
              y2: mp2.y,
            });
            median3.set({
              x1: coords[2].x,
              y1: coords[2].y,
              x2: mp1.x,
              y2: mp1.y,
            });

            aLabel.set({
              left: coords[0].x,
              top: coords[0].y - 30,
            });
            bLabel.set({
              left: coords[1].x - 15,
              top: coords[1].y,
            });
            cLabel.set({
              left: coords[2].x + 5,
              top: coords[2].y,
            });

            dLabel.set({
              left: mp1.x - 25,
              top: mp1.y - 15,
            });
            eLabel.set({
              left: mp2.x + 15,
              top: mp2.y - 15,
            });
            fLabel.set({
              left: mp3.x,
              top: mp3.y,
            });

            const intersect = calculateLineIntersectInPoints(median1, median2) as fabric.Point;

            gLabel.set({
              left: intersect.x + 5,
              top: intersect.y + 10,
            });
          }
        );

        canvas.add(triangle);
        canvas.add(median1);
        canvas.add(median2);
        canvas.add(median3);

        canvas.add(aLabel);
        canvas.add(bLabel);
        canvas.add(cLabel);

        canvas.add(dLabel);
        canvas.add(eLabel);
        canvas.add(fLabel);

        canvas.add(gLabel);
      })();
      // Incenter animation function
      (() => {
        const canvas = new fabric.Canvas("incenter-canvas", {
          selection: false,
          backgroundColor: "floralwhite",
        });

        const bisectionOnAB = makeLine();
        const bisectionOnAC = makeLine();
        const bisectionOnBC = makeLine();

        // vertexes
        const aLabel = makeLabel("A");
        const bLabel = makeLabel("B");
        const cLabel = makeLabel("C");

        const dLabel = makeLabel("D");
        const eLabel = makeLabel("E");
        const fLabel = makeLabel("F");

        const iLabel = makeLabel("I");

        const incircle = makeCircle();

        const triangle = makeMovablePolygon([new fabric.Point(125, 50), new fabric.Point(50, 450), new fabric.Point(450, 450)],
          function (coords: fabric.Point[]) {
            aLabel.set({
              left: coords[0].x,
              top: coords[0].y - 30,
            });
            bLabel.set({
              left: coords[1].x - 15,
              top: coords[1].y,
            });
            cLabel.set({
              left: coords[2].x + 5,
              top: coords[2].y,
            });

            const incenter = calculateIncenter(coords[0], coords[1], coords[2]);
            iLabel.set({
              left: incenter.x + 5,
              top: incenter.y + 5,
              stroke: "blue"
            });
            const onBC = calculateLineIntersectInPoints(
              makeLine(coords[0], incenter),
              makeLine(coords[1], coords[2]),
              true
            ) as fabric.Point;
            const onAC = calculateLineIntersectInPoints(
              makeLine(coords[1], incenter),
              makeLine(coords[0], coords[2]),
              true
            ) as fabric.Point;
            const onAB = calculateLineIntersectInPoints(
              makeLine(coords[2], incenter),
              makeLine(coords[0], coords[1]),
              true
            ) as fabric.Point;

            dLabel.set({
              left: onAB.x - 25,
              top: onAB.y - 25,
            });
            eLabel.set({
              left: onAC.x + 10,
              top: onAC.y - 25,
            });
            fLabel.set({
              left: onBC?.x,
              top: onBC?.y,
            });

            bisectionOnAB.set({
              x1: coords[2].x,
              y1: coords[2].y,
              x2: onAB?.x,
              y2: onAB?.y,
            });
            bisectionOnAC.set({
              x1: coords[1].x,
              y1: coords[1].y,
              x2: onAC?.x,
              y2: onAC?.y,
            });
            bisectionOnBC.set({
              x1: coords[0].x,
              y1: coords[0].y,
              x2: onBC?.x,
              y2: onBC?.y,
            });

            const radius = calculateDistanceFromPointToLine(
              incenter,
              makeLine(coords[1], coords[2])
            );

            const centerOfCircle = incircle.translateToCenterPoint(
              incenter as fabric.Point,
              "right",
              "bottom"
            );
            incircle.set({
              radius,
              left: centerOfCircle.x,
              top: centerOfCircle.y,
              stroke: "blue"
            });
          }
        );

        canvas.add(triangle);

        canvas.add(aLabel);
        canvas.add(bLabel);
        canvas.add(cLabel);
        canvas.add(dLabel);
        canvas.add(eLabel);
        canvas.add(fLabel);
        canvas.add(iLabel);

        canvas.add(bisectionOnAB);
        canvas.add(bisectionOnAC);
        canvas.add(bisectionOnBC);

        canvas.add(incircle);
      })();

      // Circumcenter animation.
      (() => {
        const canvas = new fabric.Canvas("circumcenter-canvas", {
          selection: false,
          backgroundColor: "floralwhite",
        });
        // vertexes
        const aLabel = makeLabel("A");
        const bLabel = makeLabel("B");
        const cLabel = makeLabel("C");
        const oLabel = makeLabel("O");
        const dLabel = makeLabel("D");
        const eLabel = makeLabel("E");
        const fLabel = makeLabel("F");
        const lineOD = makeLine();
        const lineOE = makeLine();
        const lineOF = makeLine();
        const lineAO = makeLine();
        const lineBO = makeLine();
        const lineCO = makeLine();

        const radius = 200, centerX = 250, centerY = 250, pi = Math.PI;
        const circumCircle = makeCircle(radius, new fabric.Point(centerX, centerY), "transparent", 1);
        const center = makeCircle(2, new fabric.Point(centerX, centerY),"black", 1);
        const moveableA = makeMovablePoint(new fabric.Point(250, 50));
        moveableA.set({  originX:"center", originY: "center", radius: 3});
        const A = [moveableA.left as number, moveableA.top as number];
        const B = [centerX - radius * Math.cos(pi / 6), centerY + Math.sin(pi / 6) * radius];
        const C = [centerX + radius * Math.cos(pi / 6), centerY + Math.sin(pi / 6) * radius];
        // const pointA = new fabric.Point(A[0], A[1]);
        const pointA = new fabric.Point(A[0], A[1]);
        const pointB = new fabric.Point(B[0], B[1]);
        const pointC = new fabric.Point(C[0], C[1]);
        const lineAB = makeLine(pointA, pointB);
        const lineBC = makeLine(pointB, pointC);
        const lineAC = makeLine(pointA, pointC);
        circumCircle.set({originX: "center", originY: "center", stroke: "blue"});
        center.set({originX: "center", originY: "center", stroke: "black"});
        aLabel.set({left: moveableA.left as number - 10, top: moveableA.top as number - 30});
        bLabel.set({left: pointB.x - 15, top: pointB.y});
        cLabel.set({left: pointC.x, top: pointC.y});
        oLabel.set({left: center.left, top: center.top});

        const pointO = calculateCircumcenter(pointA, pointB, pointC);
        const pedalPointD = getPedalPoint(pointO, pointB, pointC);
        const pedalPointE = getPedalPoint(pointO, pointA, pointC);
        const pedalPointF = getPedalPoint(pointO,pointA, pointB);
        dLabel.set({left: pedalPointD.x - 5, top: pedalPointD.y});
        eLabel.set({left: pedalPointE.x + 5, top: pedalPointE.y - 10});
        fLabel.set({left: pedalPointF.x - 20, top: pedalPointF.y - 15});
        lineOD.set({
          x1:pointO.x, y1: pointO.y,
          x2:pedalPointD.x, y2: pedalPointD.y
        });
        lineOE.set({
          x1:pointO.x, y1: pointO.y,
          x2:pedalPointE.x, y2: pedalPointE.y
        });
        lineOF.set({
          x1:pointO.x, y1: pointO.y,
          x2:pedalPointF.x, y2: pedalPointF.y
        });
        lineAO.set({
          x1: pointA.x, y1: pointA.y,
          x2: pointO.x, y2: pointO.y,
          stroke:"red",
          strokeDashArray: [5,5]
        });
        lineBO.set({
          x1: pointB.x, y1: pointB.y,
          x2: pointO.x, y2: pointO.y,
          stroke:"red",
          strokeDashArray: [5,5]
        });
        lineCO.set({
          x1: pointC.x, y1: pointC.y,
          x2: pointO.x, y2: pointO.y,
          stroke:"red",
          strokeDashArray: [5,5]
        });

        const onMovePointA = (e: IEvent): void => {
          const a = e.target! as Circle;
          // const aLeft = a.left as number;
          // const aTop = a.top as number;
          // const cox = (a.left as number - centerX) / Math.sqrt((a.left as number - centerX) * (a.left as number - centerX) + (a[1] - yy) * (a[1] - yy));
         const cosx = (a.left as number - centerX) / Math.sqrt((a.left as number - centerX) * (a.left as number - centerX) + (a.top as number - centerY) * (a.top as number - centerY));
         const sinx = (a.top as number - centerY) / Math.sqrt((a.left as number - centerX) * (a.left as number - centerX) + (a.top as number - centerY) * (a.top as number - centerY));
          if (a.left as number >= 250) {
            a.set({
              left: centerX + radius * cosx,
              top: centerY + radius * sinx,
            });
          } else {
            a.set({
              left: centerX + radius * cosx,
              top: centerY + radius * sinx,
            });
          }
         aLabel.set({left: a.left as number , top: a.top as number + 10});
         lineAB.set({
            x1: moveableA.left, y1: moveableA.top,
            x2: pointB.x, y2: pointB.y,
            stroke: "black"
          });
          lineBC.set({
            x1: pointB.x, y1: pointB.y,
            x2: pointC.x, y2: pointC.y,
            stroke: "black"
          });
          lineAC.set({
            x1: moveableA.left, y1: moveableA.top,
            x2: pointC.x, y2: pointC.y,
            stroke: "black"
          });
          const movingA = new fabric.Point(a.left as number, a.top as number);
          const pointO = calculateCircumcenter(movingA, pointB, pointC);
          const pedalPointE = getPedalPoint(pointO, movingA, pointC);
          const pedalPointF = getPedalPoint(pointO,movingA, pointB);
          dLabel.set({left: pedalPointD.x - 5, top: pedalPointD.y});
          eLabel.set({left: pedalPointE.x + 5, top: pedalPointE.y - 10});
          fLabel.set({left: pedalPointF.x - 20, top: pedalPointF.y - 15});
          lineOD.set({
            x1:pointO.x, y1: pointO.y,
            x2:pedalPointD.x, y2: pedalPointD.y
          });
          lineOE.set({
            x1:pointO.x, y1: pointO.y,
            x2:pedalPointE.x, y2: pedalPointE.y
          });
          lineOF.set({
            x1:pointO.x, y1: pointO.y,
            x2:pedalPointF.x, y2: pedalPointF.y
          });
          lineAO.set({
            x1: movingA.x, y1: movingA.y,
            x2: pointO.x, y2: pointO.y,
            stroke:"red",
            strokeDashArray: [5,5]
          });
          // lineBO.set({
          //   x1: pointB.x, y1: pointB.y,
          //   x2: pointO.x, y2: pointO.y,
          //   stroke:"red",
          //   strokeDashArray: [5,5]
          // });
          // lineCO.set({
          //   x1: pointC.x, y1: pointC.y,
          //   x2: pointO.x, y2: pointO.y,
          //   stroke:"red",
          //   strokeDashArray: [5,5]
          // });
        };

        canvas.on("object:moving", onMovePointA);
        canvas.add(moveableA);
        canvas.add(aLabel);
        canvas.add(bLabel);
        canvas.add(cLabel);
        canvas.add(oLabel);
        canvas.add(dLabel);
        canvas.add(eLabel);
        canvas.add(fLabel);
        canvas.add(lineOD);
        canvas.add(lineOE);
        canvas.add(lineOF);
        canvas.add(lineAO);
        canvas.add(lineBO);
        canvas.add(lineCO);
        canvas.add(lineAB);
        canvas.add(lineBC);
        canvas.add(lineAC);
        canvas.add(circumCircle);
        canvas.add(center);
      })();

      // Orthocenter animation
      (() => {
        const canvas = new fabric.Canvas("orthocenter-canvas", {
          selection: false,
          backgroundColor: "floralwhite",
        });

        // vertexes
        const aLabel = makeLabel("A");
        const bLabel = makeLabel("B");
        const cLabel = makeLabel("C");
        const haLabel = makeLabel("Ha");
        const hbLabel = makeLabel("Hb");
        const hcLabel = makeLabel("Hc");
        const hLabel = makeLabel("H");
        const heightOnBC = makeLine();
        const heightOnAC = makeLine();
        const heightOnAB = makeLine();
        const hCenter = makeCircle();

        // Extension lines
        const lineBAHc = makeLine();
        const lineCAHb = makeLine();
        const lineABHc = makeLine();
        const lineCBHa = makeLine();
        const lineBCHa = makeLine();
        const lineACHb = makeLine();
        const lineBHbH = makeLine();
        const lineHaAH = makeLine();
        const lineAHaH = makeLine();
        const lineCHcH = makeLine();
        const lineHbBH = makeLine();
        const lineHcCH = makeLine();

        // Right angle sign lines
        const line1 = new fabric.Line([0,0,0,0]);
        const line2 = new fabric.Line([0,0,0,0]);
        const line3 = new fabric.Line([0,0,0,0]);
        const line4 = new fabric.Line([0,0,0,0]);
        const line5 = new fabric.Line([0,0,0,0]);
        const line6 = new fabric.Line([0,0,0,0]);

        const triangle = makeMovablePolygon([new fabric.Point(125, 50), new fabric.Point(50, 450), new fabric.Point(450, 450)],
          function (coords: fabric.Point[]) {
            aLabel.set({
              left: coords[0].x,
              top: coords[0].y - 30,
            });
            bLabel.set({
              left: coords[1].x - 15,
              top: coords[1].y,
            });
            cLabel.set({
              left: coords[2].x + 5,
              top: coords[2].y,
            });

            const pedalPointOnBC = getPedalPoint(coords[0], coords[1], coords[2]);
            heightOnBC.set({
              x1: coords[0].x,
              y1: coords[0].y,
              x2: pedalPointOnBC.x,
              y2: pedalPointOnBC.y,
              stroke: "green"
            });
            haLabel.set({
              left: pedalPointOnBC.x - 10,
              top: pedalPointOnBC.y,
            });

            const pedalPointOnAC = getPedalPoint(coords[1], coords[0], coords[2]);
            heightOnAC.set({
              x1: coords[1].x,
              y1: coords[1].y,
              x2: pedalPointOnAC.x,
              y2: pedalPointOnAC.y,
              stroke: "green"
            });
            hbLabel.set({
              left: pedalPointOnAC.x + 5,
              top: pedalPointOnAC.y - 20,
            });

            const pedalPointOnAB = getPedalPoint(coords[2], coords[0], coords[1]);
            heightOnAB.set({
              x1: coords[2].x,
              y1: coords[2].y,
              x2: pedalPointOnAB.x,
              y2: pedalPointOnAB.y,
              stroke: "green"
            });
            hcLabel.set({left: pedalPointOnAB.x - 35, top: pedalPointOnAB.y - 15,});

            // Orthocenter point H
            const angles = calculateThreeAngles(coords[0], coords[1], coords[2]);
            const pointH = calculateOrthocenter(coords[0], coords[1], coords[2]);
            hCenter.set({
              originX: "center",
              originY: "center",
              left: pointH.x,
              top: pointH.y,
              radius: 1.5,
              stroke: "green",
              fill: "green"
            });

            // Draw right angle sings
            drawRightAngleSignCoords(coords[0], pedalPointOnBC, coords[2], line1, line2, 8, "red");
            drawRightAngleSignCoords(coords[1], pedalPointOnAC, coords[0], line3, line4,8, "red");
            drawRightAngleSignCoords(coords[2], pedalPointOnAB, coords[1], line5, line6,8, "red");

            hLabel.set({left: pointH.x, top: pointH.y,});
            lineBAHc.set({stroke: "transparent",});
            lineCAHb.set({stroke: "transparent",});
            lineABHc.set({stroke: "transparent",});
            lineCBHa.set({stroke: "transparent",});
            lineBCHa.set({stroke: "transparent",});
            lineACHb.set({stroke: "transparent",});
            lineBHbH.set({stroke: "transparent",});
            lineHaAH.set({stroke: "transparent",});
            lineAHaH.set({stroke: "transparent",});
            lineCHcH.set({stroke: "transparent",});
            lineHbBH.set({stroke: "transparent",});
            lineHcCH.set({stroke: "transparent",});
            // Make extension line.
            const rightAngle = Math.PI / 2;
            if (angles.x > rightAngle) {  // when A is obtuse angle
              lineBAHc.set({
                x1: coords[0].x,
                y1: coords[0].y,
                x2: pedalPointOnAB.x,
                y2: pedalPointOnAB.y,
                stroke: "black",
                strokeDashArray: [5, 5],
              });
              lineCAHb.set({
                x1: coords[0].x,
                y1: coords[0].y,
                x2: pedalPointOnAC.x,
                y2: pedalPointOnAC.y,
                stroke: "black",
                strokeDashArray: [5, 5],
              });
              lineBHbH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: pedalPointOnAC.x,
                y2: pedalPointOnAC.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineCHcH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: pedalPointOnAB.x,
                y2: pedalPointOnAB.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineHaAH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: coords[0].x,
                y2: coords[0].y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
            }
            if (angles.y > rightAngle) { // when B is obtuse angle
              lineABHc.set({
                x1: coords[1].x,
                y1: coords[1].y,
                x2: pedalPointOnAB.x,
                y2: pedalPointOnAB.y,
                stroke: "black",
                strokeDashArray: [5, 5],
              });
              lineCBHa.set({
                x1: coords[1].x,
                y1: coords[1].y,
                x2: pedalPointOnBC.x,
                y2: pedalPointOnBC.y,
                stroke: "black",
                strokeDashArray: [5, 5],
              });
              lineAHaH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: pedalPointOnBC.x,
                y2: pedalPointOnBC.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineCHcH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: pedalPointOnAB.x,
                y2: pedalPointOnAB.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineHbBH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: coords[1].x,
                y2: coords[1].y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
            }
            if (angles.z > rightAngle){ // when C is obtuse angle
              lineACHb.set({
                x1: coords[2].x,
                y1: coords[2].y,
                x2: pedalPointOnAC.x,
                y2: pedalPointOnAC.y,
                stroke: "black",
                strokeDashArray: [5, 5],
              });
              lineBCHa.set({
                x1: coords[2].x,
                y1: coords[2].y,
                x2: pedalPointOnBC.x,
                y2: pedalPointOnBC.y,
                stroke: "black",
                strokeDashArray: [5, 5],
              });
              lineAHaH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: pedalPointOnBC.x,
                y2: pedalPointOnBC.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineBHbH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: pedalPointOnAC.x,
                y2: pedalPointOnAC.y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
              lineHcCH.set({
                x1: pointH.x,
                y1: pointH.y,
                x2: coords[2].x,
                y2: coords[2].y,
                stroke: "green",
                strokeDashArray: [5, 5],
              });
            }
          }
        );

        canvas.add(triangle);
        canvas.add(aLabel);
        canvas.add(bLabel);
        canvas.add(cLabel);
        canvas.add(haLabel);
        canvas.add(hbLabel);
        canvas.add(hcLabel);
        canvas.add(hLabel);
        canvas.add(heightOnBC);
        canvas.add(heightOnAC);
        canvas.add(heightOnAB);
        canvas.add(lineABHc);
        canvas.add(lineCBHa);
        canvas.add(lineBAHc);
        canvas.add(lineCAHb);
        canvas.add(lineBCHa);
        canvas.add(lineACHb);
        canvas.add(lineBHbH);
        canvas.add(lineHaAH);
        canvas.add(lineAHaH);
        canvas.add(lineCHcH);
        canvas.add(lineHbBH);
        canvas.add(lineHcCH);
        canvas.add(hCenter);
        canvas.add(line1);
        canvas.add(line2);
        canvas.add(line3);
        canvas.add(line4);
        canvas.add(line5);
        canvas.add(line6);
      })();
    },
  },
);
</script>
