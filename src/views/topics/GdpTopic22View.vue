<template>
    <TopicMeta :topic="topic" />

    <div id="Spieker-wrapper" style="padding-top: 40px;">
        <h2>Spieker Circle</h2>
        <canvas id="Spieker-canvas" width="500" height="500" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { makeLine, makeLabel, makeMovablePolygon, makeCircle } from "@/utils/canvas";
import { calculateThreeAngles, calculateMidpoint, calculateIncenter, calculateDistanceBetweenTwoPoints, calculateCircumcenter, calculateOrthocenter, calculateSignedDistanceFromPointToLine } from "@/utils/geometry";

const topic = indexTopicMap.get(22) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
        mounted() {
            const canvas = new fabric.Canvas("Spieker-canvas", {
                selection: false,
                backgroundColor: "floralwhite",
            });
            function makeSelectCircle(radius=3, center: fabric.Point = new fabric.Point(0, 0), fill = "black", padding = 20, strokeWidth = 1) {
                return new fabric.Circle({
                    originX: "center",
                    originY: "center",
                    left: center.x,
                    top: center.y,
                    hasControls: false,
                    hasBorders: false,
                    evented: false,
                    radius,
                    fill,
                    padding,
                    strokeWidth,
                });
            }
            //end of function
            const DtoELine = makeLine(undefined, undefined, undefined, "red");
            const EtoFLine = makeLine(undefined, undefined, undefined, "red");
            const FtoDLine = makeLine(undefined, undefined, undefined, "red");

            // vertices
            const aLabel = makeLabel("A");
            const bLabel = makeLabel("B");
            const cLabel = makeLabel("C");
            const dLabel = makeLabel("D");
            const eLabel = makeLabel("E");
            const fLabel = makeLabel("F");
            const xLabel = makeLabel("X");
            const circleA = makeSelectCircle();
            const circleB = makeSelectCircle();
            const circleC = makeSelectCircle();
            const circleX = makeSelectCircle();

            // spieker circle
            const spiekerCircle = makeCircle();

            // creating the triangle and lines across points
            const triangle = makeMovablePolygon([new fabric.Point(285, 75), new fabric.Point(75, 375), new fabric.Point(400, 375)],
                function (coords: fabric.Point[]) {
                    // set coordinates to point A
                    aLabel.set({
                        left: coords[0].x,
                        top:  coords[0].y - 30,
                    });
                    // set coordinates to point B
                    bLabel.set({
                        left: coords[1].x - 15,
                        top:  coords[1].y
                    });
                    // set coordinates to point C
                    cLabel.set({
                        left: coords[2].x + 5,
                        top:  coords[2].y
                    });
                    circleA.set({ left: coords[0].x, top: coords[0].y });
                    circleB.set({ left: coords[1].x, top: coords[1].y });
                    circleC.set({ left: coords[2].x, top: coords[2].y });

                    // find angles from coordinates
                    // const angles = calculateThreeAngles(coords[0], coords[1], coords[2]);
                    
                    // find midpoints from points A, B, C
                    const BCmidpoint = calculateMidpoint(coords[1], coords[2]);
                    const ACmidpoint = calculateMidpoint(coords[0], coords[2]);
                    const ABmidpoint = calculateMidpoint(coords[0], coords[1]);

                    // get circle coordinates by calculating incenter of inside triangle
                    const incenter = calculateIncenter(BCmidpoint, ACmidpoint, ABmidpoint);
                    const radius = calculateSignedDistanceFromPointToLine([incenter.x, incenter.y], [BCmidpoint.x, BCmidpoint.y], [ACmidpoint.x, ACmidpoint.y]);

                    spiekerCircle.set({
                        originX: "center",
                        originY: "center",
                        left: incenter.x,
                        top: incenter.y,
                        radius,
                        stroke: "green",
                        strokeWidth: 1,
                    });
                    console.log(spiekerCircle);

                    xLabel.set({
                        left: spiekerCircle.left,
                        top: spiekerCircle.top,
                    });
                    console.log("x:", [xLabel.left, xLabel.top]);
                    circleX.set({ left: xLabel.left, top: xLabel.top });

                    // find coordinates for point D
                    dLabel.set({
                        left: BCmidpoint.x - 10,
                        top: BCmidpoint.y,
                    });

                    // find coordinates for point E
                    eLabel.set({
                        left: ACmidpoint.x + 10,
                        top: ACmidpoint.y - 15,
                    });

                    // find coordinates for point F
                    fLabel.set({
                        left: ABmidpoint.x - 25,
                        top: ABmidpoint.y - 15,
                    });

                    // find coordinates for line from D to E
                    DtoELine.set({
                        x1: BCmidpoint.x,
                        y1: BCmidpoint.y,
                        x2: ACmidpoint.x,
                        y2: ACmidpoint.y,
                    });

                    // find coordinates for line from E to F
                    EtoFLine.set({
                        x1: ACmidpoint.x,
                        y1: ACmidpoint.y,
                        x2: ABmidpoint.x,
                        y2: ABmidpoint.y,
                    });

                    // find coordinates for line from F to D
                    FtoDLine.set({
                        x1: ABmidpoint.x,
                        y1: ABmidpoint.y,
                        x2: BCmidpoint.x,
                        y2: BCmidpoint.y,
                    });
                }
            );
            // add items to canvas
            canvas.add(triangle);

            canvas.add(aLabel);
            canvas.add(bLabel);
            canvas.add(cLabel);
            canvas.add(dLabel);
            canvas.add(eLabel);
            canvas.add(fLabel);
            canvas.add(xLabel);

            canvas.add(circleA);
            canvas.add(circleB);
            canvas.add(circleC);
            canvas.add(circleX);

            canvas.add(FtoDLine);
            canvas.add(EtoFLine);
            canvas.add(DtoELine);

            canvas.add(spiekerCircle);
        },
    },
);

/*eslint no-trailing-spaces: ["error", { "skipBlankLines": true, "ignoreComments": true }]*/
// see more at https://eslint.org/docs/latest/rules/no-trailing-spaces
</script>
