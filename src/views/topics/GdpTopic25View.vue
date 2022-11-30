<template>
    <TopicMeta :topic="topic" />

    <div id="Brocard-Points-wrapper" style="padding-top: 40px;">
        <h2>Brocard Points</h2>
        <canvas id="Brocard-Points-canvas" width="700" height="700" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { indexTopicMap } from "@/data";
import { Topic } from "@/types";
import { fabric } from "fabric";
import { makeLine, makeLabel, makeMovablePolygon, makeCircle } from "@/utils/canvas";
import { calculateThreeAngles, calculateIncenter, calculateDistanceBetweenTwoPoints, trilinearToCartesian } from "@/utils/geometry";

const topic = indexTopicMap.get(25) as Topic;

export default defineComponent(
    {
        setup() {
            return { topic };
        },
        mounted() {
            const canvas = new fabric.Canvas("Brocard-Points-canvas", {
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
            const pLabel = makeLabel("P");

            const circleA = makeSelectCircle();
            const circleB = makeSelectCircle();
            const circleC = makeSelectCircle();

            const lineAP = makeLine();
            const lineBP = makeLine();
            const lineCP = makeLine();

            const circlePAB = makeCircle();
            const circlePBC = makeCircle();
            const circlePCA = makeCircle();

            const angleOmega1Label = makeLabel("ω");
            const angleOmega2Label = makeLabel("ω");
            const angleOmega3Label = makeLabel("ω");

            const triangle = makeMovablePolygon([new fabric.Point(450, 325), new fabric.Point(230, 135), new fabric.Point(175, 325)],
                function (coords: fabric.Point[]) {
                    // set coordinates to point A
                    aLabel.set({
                        left: coords[0].x - 5,
                        top:  coords[0].y,
                    });
                    // set coordinates to point B
                    bLabel.set({
                        left: coords[1].x + 10,
                        top:  coords[1].y - 20
                    });
                    // set coordinates to point C
                    cLabel.set({
                        left: coords[2].x - 5,
                        top:  coords[2].y
                    });

                    circleA.set({ left: coords[0].x, top: coords[0].y });
                    circleB.set({ left: coords[1].x, top: coords[1].y });
                    circleC.set({ left: coords[2].x, top: coords[2].y });

                    const lineA = coords[1].distanceFrom(coords[2]);
                    const lineB = coords[0].distanceFrom(coords[2]);
                    const lineC = coords[0].distanceFrom(coords[1]);

                    const pointP = trilinearToCartesian(coords[0], coords[1], coords[2], lineC/lineB, lineA/lineC, lineB/lineA);
                    pLabel.set({
                        left: pointP.x - 5,
                        top: pointP.y + 5
                    });

                    lineAP.set({x1: coords[0].x, y1: coords[0].y, x2: pointP.x, y2: pointP.y});
                    lineBP.set({x1: coords[1].x, y1: coords[1].y, x2: pointP.x, y2: pointP.y});
                    lineCP.set({x1: coords[2].x, y1: coords[2].y, x2: pointP.x, y2: pointP.y});
                
                    const anglePAB = calculateThreeAngles(pointP, coords[0], coords[1]);
                    const circumcenterPAB = trilinearToCartesian(
                        pointP,
                        coords[0],
                        coords[1],
                        Math.cos(anglePAB.x),
                        Math.cos(anglePAB.y),
                        Math.cos(anglePAB.z)
                    );
                    const circumradiusPAB = calculateDistanceBetweenTwoPoints(pointP, circumcenterPAB);

                    circlePAB.set({
                        originX: "center",
                        originY: "center",
                        left: circumcenterPAB.x,
                        top: circumcenterPAB.y,
                        radius: circumradiusPAB,
                        stroke: "blue",
                        strokeWidth: 1,
                        strokeDashArray: [5, 5]
                    });

                    const anglePBC = calculateThreeAngles(pointP, coords[1], coords[2]);
                    const circumcenterPBC = trilinearToCartesian(
                        pointP,
                        coords[1],
                        coords[2],
                        Math.cos(anglePBC.x),
                        Math.cos(anglePBC.y),
                        Math.cos(anglePBC.z)
                    );
                    const circumradiusPBC = calculateDistanceBetweenTwoPoints(pointP, circumcenterPBC);

                    circlePBC.set({
                        originX: "center",
                        originY: "center",
                        left: circumcenterPBC.x,
                        top: circumcenterPBC.y,
                        radius: circumradiusPBC,
                        stroke: "blue",
                        strokeWidth: 1,
                        strokeDashArray: [5, 5]
                    });

                    const anglePCA = calculateThreeAngles(pointP, coords[2], coords[0]);
                    const circumcenterPCA = trilinearToCartesian(
                        pointP,
                        coords[2],
                        coords[0],
                        Math.cos(anglePCA.x),
                        Math.cos(anglePCA.y),
                        Math.cos(anglePCA.z)
                    );
                    const circumradiusPCA = calculateDistanceBetweenTwoPoints(pointP, circumcenterPCA);

                    circlePCA.set({
                        originX: "center",
                        originY: "center",
                        left: circumcenterPCA.x,
                        top: circumcenterPCA.y,
                        radius: circumradiusPCA,
                        stroke: "blue",
                        strokeWidth: 1,
                        strokeDashArray: [5, 5]
                    });

                    angleOmega1Label.set({
                        left: coords[0].x - anglePAB.x - 45,
                        top: coords[0].y - anglePAB.y - 35
                    });

                    angleOmega2Label.set({
                        left: coords[2].x - anglePCA.x + 30,
                        top: coords[2].y - anglePCA.y - 25
                    });

                    angleOmega3Label.set({
                        left: coords[1].x - anglePBC.x - 5,
                        top: coords[1].y - anglePBC.y + 30
                    });
                }
            );

            canvas.add(aLabel, bLabel, cLabel, pLabel);
            canvas.add(lineAP, lineBP, lineCP);
            canvas.add(circleA, circleB, circleC);
            canvas.add(circlePAB, circlePBC, circlePCA);
            canvas.add(angleOmega1Label, angleOmega2Label, angleOmega3Label);
            canvas.add(triangle);
        },
    },
);

/*eslint no-trailing-spaces: ["error", { "skipBlankLines": true, "ignoreComments": true }]*/
// see more at https://eslint.org/docs/latest/rules/no-trailing-spaces
</script>
