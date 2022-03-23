{
    const canvas = new fabric.Canvas("symmedian-canvas", {
        selection: false
    });

    const SymmedianOnAB = makeLine(null,null,1,"red");
    const SymmedianOnCA = makeLine();
    const SymmedianOnBC = makeLine();

    // vertexes
    const aLabel = makeLabel("A");
    const bLabel = makeLabel("B");
    const cLabel = makeLabel("C");

    const dLabel = makeLabel("D");
    const eLabel = makeLabel("E");
    const fLabel = makeLabel("F");

    const gLabel = makeLabel("G");



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


        const AB = calculateDistanceBetweenTwoPoints(coords[0], coords[1]);
        const CA = calculateDistanceBetweenTwoPoints(coords[0], coords[2]);
        const BC = calculateDistanceBetweenTwoPoints(coords[1], coords[2]);


       const symmedian = TrilinearToCartesian(coords[0], coords[1], coords[2], BC,CA,AB);

       // const symmedian = calculateIncenter(coords[0], coords[1], coords[2]);


        gLabel.set({
            left: symmedian.x + 5,
            top: symmedian.y + 5
        });
        const onBC = calculateLineIntersectInPoints(makeLine(coords[0], symmedian), makeLine(coords[1], coords[2],1,"red"), true);
        const onCA = calculateLineIntersectInPoints(makeLine(coords[1], symmedian), makeLine(coords[0], coords[2]), true);
        const onAB = calculateLineIntersectInPoints(makeLine(coords[2], symmedian), makeLine(coords[0], coords[1]), true);

        dLabel.set({
            left: onAB.x - 25,
            top: onAB.y - 25
        })
        eLabel.set({
            left: onCA.x + 10,
            top: onCA.y - 25
        })
        fLabel.set({
            left: onBC.x,
            top: onBC.y
        })

        SymmedianOnAB.set({
            x1: coords[2].x,
            y1: coords[2].y,
            x2: onAB.x,
            y2: onAB.y
        });
        SymmedianOnCA.set({
            x1: coords[1].x,
            y1: coords[1].y,
            x2: onCA.x,
            y2: onCA.y
        });
        SymmedianOnBC.set({
            x1: coords[0].x,
            y1: coords[0].y,
            x2: onBC.x,
            y2: onBC.y
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

    canvas.add(SymmedianOnAB);
    canvas.add(SymmedianOnCA);
    canvas.add(SymmedianOnBC);

    //canvas.add(incircle)
}