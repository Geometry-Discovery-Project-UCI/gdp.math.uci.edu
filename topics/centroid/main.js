{
    const canvas = new fabric.Canvas("centroid-canvas", {
        selection: false
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
        const mp1 = calculateMidpoint(coords[0], coords[1]);
        const mp2 = calculateMidpoint(coords[0], coords[2]);
        const mp3 = calculateMidpoint(coords[1], coords[2]);

        median1.set({
            x1: coords[0].x,
            y1: coords[0].y,
            x2: mp3.x,
            y2: mp3.y
        });
        median2.set({
            x1: coords[1].x,
            y1: coords[1].y,
            x2: mp2.x,
            y2: mp2.y
        });
        median3.set({
            x1: coords[2].x,
            y1: coords[2].y,
            x2: mp1.x,
            y2: mp1.y
        });

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

        dLabel.set({
            left: mp1.x - 25,
            top: mp1.y - 15
        });
        eLabel.set({
            left: mp2.x + 15,
            top: mp2.y - 15
        });
        fLabel.set({
            left: mp3.x,
            top: mp3.y
        });

        const intersect = calculateIntersect(median1, median2);

        gLabel.set({
            left: intersect.x + 5,
            top: intersect.y + 10
        });
    });

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
}