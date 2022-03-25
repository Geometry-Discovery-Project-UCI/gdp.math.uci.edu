{ 
    const canvas = new fabric.Canvas("morley-canvas", {
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


    const morley = (p) => {
        let pC = [p.x, p.y];
        p = [166, 51];
        let points = [pA, pB, pC];
        tri1.setAttributeNS(null, "points", makeString(points));

        letterA.setAttribute("x", pC[0]);
        letterA.setAttribute("y", pC[1] - 5);
        let A = new Vector(pA[0], pA[1]);
        let B = new Vector(pB[0], pB[1]);
        let C = new Vector(pC[0], pC[1]);

        if (pC[1] > pA[1]) {
            flag = -1;
        } else {
            flag = 1;
        }

        let Cprime = GetD(C, A, B, flag);
        let Bprime = GetD(B, C, A, flag);
        let Aprime = GetD(A, B, C, flag);
        let cP = [Cprime.x, Cprime.y];
        let bP = [Bprime.x, Bprime.y];
        let aP = [Aprime.x, Aprime.y];
        drawLine(cP, pB, line1);
        drawLine(aP, pB, line2);
        drawLine(cP, pA, line3);
        drawLine(bP, pA, line4);
        drawLine(aP, pC, line5);
        drawLine(bP, pC, line6);
        letterAp.setAttribute("x", cP[0]);
        letterAp.setAttribute("y", cP[1]);
        letterBp.setAttribute("x", bP[0]);
        letterBp.setAttribute("y", bP[1]);
        letterCp.setAttribute("x", aP[0]);
        letterCp.setAttribute("y", aP[1]);
        let primePoints = [
            [Cprime.x, Cprime.y],
            [Bprime.x, Bprime.y],
            [Aprime.x, Aprime.y]
        ];
        tri2.setAttributeNS(null, "points", makeString(primePoints));
    };

    morley(new Vector(166, 51));

    svg.addEventListener("mousemove", (event) => {
        var p = new DOMPoint(event.clientX, event.clientY);

        p = p.matrixTransform(svg.getScreenCTM().inverse());

        morley(p);
    });
}