<template>
    <TopicMeta :topic="topic" />
    <ATypographyParagraph>
        The description of Newton Line
    </ATypographyParagraph>
    <div id="Newton-Line-wapper">
        <ATypographyTitle :level="4">Newton Line</ATypographyTitle>
        <canvas id="Newton-Line-canvas" width="500" height="500" />
    </div>
</template>

<script lang="ts">
    {
        setup() {
            return { topic };
        },
            const canvas = new fabric.Canvas("Newton-Line-canvas", {
                selection: false,
            });
            // Creates movable quadrilateral
            const CANVAS_HEIGHT = 500;
            const CANVAS_WIDTH = 500;

            // Creates line and label objects
            const diagAC = makeLine();
            const diagBD = makeLine();
            const diagEF = makeLine();

            const newtonLine = makeLine(); // line MN

            const lineBE = makeLine();
            const lineCE = makeLine();
            const lineBF = makeLine();
            const lineAF = makeLine();

            const aLabel = makeLabel("A");
            const bLabel = makeLabel("B");
            const cLabel = makeLabel("C");
            const dLabel = makeLabel("D");
            const eLabel = makeLabel("E");
            const fLabel = makeLabel("F");
            const lLabel = makeLabel("L");
            const mLabel = makeLabel("M");
            const nLabel = makeLabel("N");

            const mNode = makeCircle();
            const nNode = makeCircle();
            const lNode = makeCircle();

            // Creates movable quadrilateral
            const quadrilateral = makeMovablePolygon(
                [
                    {
                        x: 110,
                        y: 265,
                    },
                    {
                        x: 70,
                        y: 420,
                    },
                    {
                        x: 270,
                        y: 420,
                    },
                    {
                        x: 245,
                        y: 340,
                    },
                ],
                function (coords: Array<fabric.Point>) {
                    // Change quadrilateral color
                    quadrilateral.set({
                        stroke: "green",
                    });

                    // Since quadrilateral and coords
                    // have different top and left values
                    const leftOffset = 0.75;
                    const topOffset = 0.75;

                    // Update the label coordinates
                    // for the four points of the quadrilateral
                    aLabel.set({
                        left: coords[0].x - 25,
                        top: coords[0].y - 25,
                        fill: "green",
                    });

                    bLabel.set({
                        left: coords[1].x - 15,
                        top: coords[1].y,
                        fill: "green",
                    });

                    cLabel.set({
                        left: coords[2].x,
                        top: coords[2].y,
                        fill: "green",
                    });

                    dLabel.set({
                        left: coords[3].x + 5,
                        top: coords[3].y - 25,
                        fill: "green",
                    });

                    // Update the line coordinates
                    // for the diagonals of the quadrilateral
                    diagAC.set({
                        x1: coords[0].x,
                        y1: coords[0].y,
                        x2: coords[2].x,
                        y2: coords[2].y,
                        stroke: "gray",
                    });

                    diagBD.set({
                        x1: coords[1].x,
                        y1: coords[1].y,
                        x2: coords[3].x,
                        y2: coords[3].y,
                        stroke: "gray",
                    });

                    // Calculate the midpoints of the diagonals
                    // (Newton's Line passes through these two points)
                    const midpoint1 = calculateMidpoint(coords[0], coords[2]);
                    const midpoint2 = calculateMidpoint(coords[1], coords[3]);

                    // Calculate the slope between two midpoints
                    // (Slope of Newton's Line)
                    const slope = calculateSlope(midpoint1, midpoint2);

                    // Update Newton's line coordinates
                    // that extend from border to border
                    // (1) When slope is not finite, draw vertical line
                    if (!isFinite(slope)) {
                        newtonLine.set({
                            x1: midpoint1.x,
                            y1: 0,
                            x2: midpoint1.x,
                            y2: CANVAS_HEIGHT,
                            stroke: "red",
                        });
                        // (2) When length between 2 points = 0, set slope = 0
                    } else if (isNaN(slope)) {
                        newtonLine.set({
                            x1: 0,
                            y1: midpoint1.y,
                            x2: CANVAS_WIDTH,
                            y2: midpoint1.y,
                            stroke: "red",
                        });
                        // (3) Else, draw the line using linear equations with slope and midpoint1
                    } else {
                        newtonLine.set({
                            x1: 0,
                            y1: -slope * midpoint1.x + midpoint1.y - topOffset,
                            x2: CANVAS_WIDTH,
                            y2: slope * (CANVAS_WIDTH - midpoint1.x) + midpoint1.y - topOffset,
                            stroke: "red",
                        });
                    }

                    // Creates 4 constants to be 4 sides of the quadrilateral
                    // Used to determine when the opposite sides are parallel
                    const lineBA = makeLine(coords[1], coords[0]);
                    const lineCD = makeLine(coords[2], coords[3]);
                    const lineAD = makeLine(coords[0], coords[3]);
                    const lineBC = makeLine(coords[1], coords[2]);
                    lineAD.set({
                        x1: coords[0].x,
                        y1: coords[0].y,
                        x2: coords[3].x,
                        y2: coords[3].y,
                        stroke: "black",
                    });

                    const pointE = calculateLineIntersectInPoints(lineBA, lineCD, true);
                    const pointF = calculateLineIntersectInPoints(lineAD, lineBC, true);

                    // Update the label coordinates
                    // for the intersection point E
                    eLabel.set({
                        left: pointE?.x - 7,
                        top: pointE?.y - 30,
                    });

                    // Update the line coordinates
                    // to extend the sides of the quadrilateral to the intersection point E
                    lineBE.set({
                        x1: coords[0].x - leftOffset,
                        y1: coords[0].y - topOffset,
                        x2: pointE?.x - leftOffset,
                        y2: pointE?.y - topOffset,
                        strokeWidth: 1.5,
                    });

                    lineCE.set({
                        x1: coords[3].x - leftOffset,
                        y1: coords[3].y - topOffset,
                        x2: pointE?.x - leftOffset,
                        y2: pointE?.y - topOffset,
                        strokeWidth: 1.5,
                    });

                    // Update the label coordinates
                    // for the intersection point F
                    fLabel.set({
                        left: pointF?.x + 10,
                        top: pointF?.y - 2,
                    });

                    // Update the line coordinates
                    // to extend the sides of the quadrilateral to the intersection point E
                    lineAF.set({
                        x1: coords[3].x - leftOffset,
                        y1: coords[3].y - topOffset,
                        x2: pointF?.x - leftOffset,
                        y2: pointF?.y - topOffset,
                        strokeWidth: 1.5,
                    });

                    lineBF.set({
                        x1: coords[2].x - leftOffset,
                        y1: coords[2].y - topOffset,
                        x2: pointF?.x - leftOffset,
                        y2: pointF?.y - topOffset,
                        strokeWidth: 1.5,
                    });

                    // Update the line coordinates
                    // that connects the two intersection points E,F
                    diagEF.set({
                        x1: pointE?.x - leftOffset,
                        y1: pointE?.y - topOffset,
                        x2: pointF?.x - leftOffset,
                        y2: pointF?.y - topOffset,
                        stroke: "gray",
                    });

                    // Find the coordinates and update the label for points M, N, L
                    const pointM = calculateLineIntersectInPoints(
                        makeLine(coords[1], coords[3]),
                        newtonLine,
                        true
                    );

                    mLabel.set({
                        left: pointM?.x,
                        top: pointM?.y,
                        fontSize: 18,
                    });

                    const pointN = calculateLineIntersectInPoints(
                        makeLine(coords[0], coords[2]),
                        newtonLine,
                        true
                    );

                    nLabel.set({
                        left: pointN?.x - 23,
                        top: pointN?.y - 10,
                        fontSize: 18,
                    });

                    const pointL = calculateLineIntersectInPoints(
                        makeLine(pointE, pointF),
                        newtonLine,
                        true
                    );

                    lLabel.set({
                        left: pointL?.x + 15,
                        top: pointL?.y - 10,
                        fontSize: 18,
                    });

                    // Update the centers and radius
                    // of the points L,M,N nodes
                    mNode.set({
                        left: pointM?.x - leftOffset * 2,
                        top: pointM?.y - topOffset * 2,
                        radius: 2,
                        fill: "red",
                        stroke: "red",
                    });

                    nNode.set({
                        left: pointN?.x - leftOffset * 2,
                        top: pointN?.y - topOffset * 2,
                        radius: 2,
                        fill: "red",
                        stroke: "red",
                    });

                    lNode.set({
                        left: pointL?.x - leftOffset * 2,
                        top: pointL?.y - topOffset * 2,
                        radius: 2,
                        fill: "red",
                        stroke: "red",
                    });
                }
            );

            canvas.add(diagAC);
            canvas.add(diagBD);
            canvas.add(diagEF);

            canvas.add(newtonLine);

            canvas.add(lineBE);
            canvas.add(lineCE);
            canvas.add(lineAF);
            canvas.add(lineBF);

            canvas.add(aLabel);
            canvas.add(bLabel);
            canvas.add(cLabel);
            canvas.add(dLabel);
            canvas.add(eLabel);
            canvas.add(fLabel);
            canvas.add(mLabel);
            canvas.add(nLabel);
            canvas.add(lLabel);

            canvas.add(mNode);
            canvas.add(nNode);
            canvas.add(lNode);

            canvas.add(quadrilateral);
        }
    },
);
</script>
