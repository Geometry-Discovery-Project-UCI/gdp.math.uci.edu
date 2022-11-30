<template>
    <TopicMeta :topic="topic" />

    <div id="Davis-wrapper" style="padding-top: 40px;">
        <h2>Davis Triangle</h2>
        <canvas id="Davis-Triangle-canvas" width="500" height="500" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { makeLine, makeLabel, makeMovablePolygon, makeCircle } from "@/utils/canvas";
import { calculateThreeAngles, calculateIncenter, calculateDistanceBetweenTwoPoints, trilinearToCartesian, calculateMidpoint } from "@/utils/geometry";

const topic = indexTopicMap.get(28) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
        mounted() {
            const canvas = new fabric.Canvas("Davis-Triangle-canvas", {
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

            const aLabel = makeLabel("A");
            const bLabel = makeLabel("B");
            const cLabel = makeLabel("C");
            const dLabel = makeLabel("D");
            const eLabel = makeLabel("E");
            const fLabel = makeLabel("F");
            const gLabel = makeLabel("G");
            const hLabel = makeLabel("H");
            const iLabel = makeLabel("I");
            const oLabel = makeLabel("O");

            const circleD = makeSelectCircle();
            const circleE = makeSelectCircle();
            const circleF = makeSelectCircle();
            const circleG = makeSelectCircle();
            const circleH = makeSelectCircle();
            const circleI = makeSelectCircle();
            const circleO = makeSelectCircle();
            const inCircle = makeCircle();

            const triangle = makeMovablePolygon([new fabric.Point(315, 115), new fabric.Point(105, 325), new fabric.Point(390, 325)],
                function (coords: fabric.Point[]) {
                    aLabel.set({
                        left: coords[0].x - 8,
                        top:  coords[0].y - 32,
                    });

                    bLabel.set({
                        left: coords[1].x - 15,
                        top:  coords[1].y,
                    });

                    cLabel.set({
                        left: coords[2].x,
                        top:  coords[2].y,
                    });

                    const ABmidpoint = calculateMidpoint(coords[0], coords[1]);
                    circleI.set({
                        left: ABmidpoint.x - 20,
                        top: ABmidpoint.y + 20,
                        stroke: "red"
                    });

                    iLabel.set({
                        left: ABmidpoint.x - 15,
                        top: ABmidpoint.y + 20,
                    });

                    const AImidpoint = calculateMidpoint(coords[0], ABmidpoint);
                    circleH.set({
                        left: AImidpoint.x,
                        top: AImidpoint.y,
                        stroke: "red"
                    });

                    hLabel.set({
                        left: AImidpoint.x,
                        top: AImidpoint.y,
                    });

                    const BCmidpoint = calculateMidpoint(coords[1], coords[2]);
                    const BBCmidpoint = calculateMidpoint(coords[1], BCmidpoint);
                    circleD.set({
                        left: BBCmidpoint.x + 40,
                        top: BBCmidpoint.y,
                        stroke: "red"
                    });

                    dLabel.set({
                        left: BBCmidpoint.x + 40,
                        top: BBCmidpoint.y,
                    });

                    const CBCmidpoint = calculateMidpoint(coords[2], BCmidpoint);
                    circleE.set({
                        left: CBCmidpoint.x + 25,
                        top: CBCmidpoint.y,
                        stroke: "red"
                    });

                    eLabel.set({
                        left: CBCmidpoint.x + 25,
                        top: CBCmidpoint.y,
                    });

                    const ACmidpoint = calculateMidpoint(coords[0], coords[2]);
                    const AACmidpoint = calculateMidpoint(coords[0], ACmidpoint);
                    circleG.set({
                        left: AACmidpoint.x + 7,
                        top: AACmidpoint.y + 20,
                        stroke: "red"
                    });

                    gLabel.set({
                        left: AACmidpoint.x - 15,
                        top: AACmidpoint.y + 20,
                    });

                    const CACmidpoint = calculateMidpoint(coords[2], ACmidpoint);
                    circleF.set({
                        left: CACmidpoint.x,
                        top: CACmidpoint.y,
                        stroke: "red"
                    });

                    fLabel.set({
                        left: CACmidpoint.x + 10,
                        top: CACmidpoint.y - 10,
                    });
                    
                    const inCircleCoordinates = [new fabric.Point(CACmidpoint.x, CACmidpoint.y),
                                                 new fabric.Point(AImidpoint.x, AImidpoint.y),
                                                 new fabric.Point(BBCmidpoint.x + 40, BBCmidpoint.y)];
                    const angleInCircle = calculateThreeAngles(inCircleCoordinates[0], inCircleCoordinates[1], inCircleCoordinates[2]);
                    const circumcenterInCircle = trilinearToCartesian(
                        inCircleCoordinates[0],
                        inCircleCoordinates[1],
                        inCircleCoordinates[2],
                        Math.cos(angleInCircle.x),
                        Math.cos(angleInCircle.y),
                        Math.cos(angleInCircle.z)
                    );
                    const circumradiusInCircle = calculateDistanceBetweenTwoPoints(inCircleCoordinates[0], circumcenterInCircle);

                    inCircle.set({
                        originX: "center",
                        originY: "center",
                        left: circumcenterInCircle.x,
                        top: circumcenterInCircle.y,
                        radius: circumradiusInCircle,
                        stroke: "blue",
                        strokeWidth: 1
                    });

                    const incenter = calculateIncenter(inCircleCoordinates[0], inCircleCoordinates[1], inCircleCoordinates[2]);
                    circleO.set({
                        left: incenter.x,
                        top: incenter.y
                    });

                    oLabel.set({
                        left: incenter.x - 5,
                        top: incenter.y + 2
                    });
                }
            );

            canvas.add(triangle);
            canvas.add(inCircle);
            canvas.add(aLabel, bLabel, cLabel, dLabel, eLabel, fLabel, gLabel, hLabel, iLabel, oLabel);
            canvas.add(circleD, circleE, circleF, circleG, circleH, circleI, circleO);
        },
    },
);

/*eslint no-trailing-spaces: ["error", { "skipBlankLines": true, "ignoreComments": true }]*/
// see more at https://eslint.org/docs/latest/rules/no-trailing-spaces
</script>
