{
    const svg = document.querySelector("#app-5centers");
    const tri = document.querySelector("#tri-incenter");

    const letterA = document.querySelector('#letterA_03');
    const letterB = document.querySelector('#letterB_03');
    const letterC = document.querySelector('#letterC_03');
    const letterF = document.querySelector('#letterF_03');
    const letterD = document.querySelector('#letterD_03');
    const letterE = document.querySelector('#letterE_03');

    const line1 = document.getElementById("line1_03");
    const line2 = document.getElementById("line2_03");
    const line3 = document.getElementById("line3_03");
    
    pB = [76, 360];
    pC = [423, 360];
    
    letterC.setAttribute("x", pC[0] + 5);
    letterC.setAttribute("y", pC[1] + 6);
    letterB.setAttribute("x", pB[0] - 20);
    letterB.setAttribute("y", pB[1] + 5);

    const findPointwithFixedRatio = (pt0, pt1, lambda) => {
        return [(1 - lambda) * pt0[0] + lambda * pt1[0], (1 - lambda) * pt0[1] + lambda * pt1[1]];
    };

    const incenter = (p) => {
        let pA = [p.x, p.y];
        p = [166, 51];
        let points = [pA, pB, pC];
        tri.setAttributeNS(null, "points", makeString(points));

        letterA.setAttribute("x", pA[0] - 5);
        letterA.setAttribute("y", pA[1] - 5);

        let a = findDistance(pC, pB);
        let b = findDistance(pC, pA);
        let c = findDistance(pA, pB);

        let lambdaD = c / (c + b);
        let lambdaE = a / (c + a);
        let lambdaF = b / (a + b);

        let pD = findPointwithFixedRatio(pB, pC, lambdaD);
        let pE = findPointwithFixedRatio(pC, pA, lambdaE);
        let pF = findPointwithFixedRatio(pA, pB, lambdaF);

        letterD.setAttribute("x", pD[0]);
        letterD.setAttribute("y", pD[1] + 25);

        letterE.setAttribute("x", pE[0] + 5);
        letterE.setAttribute("y", pE[1] + 5);

        letterF.setAttribute("x", pF[0] - 15);
        letterF.setAttribute("y", pF[1] + 5);

        drawLine(pA, pD, line1);
        drawLine(pB, pE, line2);
        drawLine(pC, pF, line3);

    }

    incenter(new Vector(166, 51));

    const animate = (event) => {
        var p = new DOMPoint(event.clientX, event.clientY);
        p = p.matrixTransform(svg.getScreenCTM().inverse());
        incenter(p);
    }

    svg.addEventListener("mousedown", (event) => {
        if (event.buttons == 1) {
            animate(event);
        }
    })

    svg.addEventListener("mousemove", (event) => {
        if (event.buttons == 1) {
            animate(event);
        }
    })
}