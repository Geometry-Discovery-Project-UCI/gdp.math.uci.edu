{
    const canvas = new fabric.Canvas("symmedian-canvas", {
        selection: false
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

    const gLabel = makeLabel("G");

    const incircle = makeCircle();

    const triangle = makeMovablePolygon([{
        x: 125,
        y: 50
    }, {
        x: 50,
        y: 250
    }, {
        x: 250,
        y: 250
    }], function (coords) {
        aLabel.set({
            left: coords[0].x,
            top: coords[0].y - 30
        });
        bLabel.set({
            left: coords[1].x - 15,
            top: coords[1].y
        });
        cLabel.set({
            left: coords[2].x + 5,
            top: coords[2].y
        });


        const AB = calculateDistanceBetweenTwoPoints(coords[0], coords[1])
        const AC = calculateDistanceBetweenTwoPoints(coords[0], coords[2])
        const BC = calculateDistanceBetweenTwoPoints(coords[1], coords[2])


        const incenter = calculateTriangleCenter(coords[0], coords[1], coords[2],1,1,1);
        console.log(incenter);
        gLabel.set({
            left: incenter.x + 5,
            top: incenter.y + 5
        });
        const onBC = calculateLineIntersectInPoints(makeLine(coords[0], incenter), makeLine(coords[1], coords[2]), true);
        const onAC = calculateLineIntersectInPoints(makeLine(coords[1], incenter), makeLine(coords[0], coords[2]), true);
        const onAB = calculateLineIntersectInPoints(makeLine(coords[2], incenter), makeLine(coords[0], coords[1]), true);

        dLabel.set({
            left: onAB.x - 25,
            top: onAB.y - 25
        })
        eLabel.set({
            left: onAC.x + 10,
            top: onAC.y - 25
        })
        fLabel.set({
            left: onBC.x,
            top: onBC.y
        })

        bisectionOnAB.set({
            x1: coords[2].x,
            y1: coords[2].y,
            x2: onAB.x,
            y2: onAB.y
        });
        bisectionOnAC.set({
            x1: coords[1].x,
            y1: coords[1].y,
            x2: onAC.x,
            y2: onAC.y
        });
        bisectionOnBC.set({
            x1: coords[0].x,
            y1: coords[0].y,
            x2: onBC.x,
            y2: onBC.y
        });

        const radius = calculateDistanceFromPointToLine(incenter, makeLine(coords[1], coords[2]));
        centerOfCircle = incircle.translateToCenterPoint({
            x: incenter.x,
            y: incenter.y
        }, "right", "bottom");
        incircle.set({
            radius,
            left: centerOfCircle.x,
            top: centerOfCircle.y
        });
    });

    canvas.add(triangle);

    canvas.add(aLabel);
    canvas.add(bLabel);
    canvas.add(cLabel);
    canvas.add(dLabel);
    canvas.add(eLabel);
    canvas.add(fLabel);
    canvas.add(gLabel);

    canvas.add(bisectionOnAB);
    canvas.add(bisectionOnAC);
    canvas.add(bisectionOnBC);

    //canvas.add(incircle)
}