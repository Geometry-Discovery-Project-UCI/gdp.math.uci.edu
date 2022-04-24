{
  const svg = document.querySelector("#tucker-circles");
  const tri = document.querySelector("#triangle");

  const letterA = document.querySelector("#letterA");
  const letterB = document.querySelector("#letterB");
  const letterC = document.querySelector("#letterC");
  const letterF = document.querySelector("#letterF");
  const letterD = document.querySelector("#letterD");
  const letterE = document.querySelector("#letterE");
  const letterG = document.querySelector("#letterG");
  const letterH = document.querySelector("#letterH");
  const letterI = document.querySelector("#letterI");

  const line1 = document.getElementById("line1");
  const line2 = document.getElementById("line2");
  const line3 = document.getElementById("line3");
  const line4 = document.getElementById("line4");
  const line5 = document.getElementById("line5");
  const line6 = document.getElementById("line6");

  pA = [300, 51];
  pC = [423, 360];
  pB = [76, 360];
  pD = [300, 360];

  letterA.setAttribute("x", pA[0]);
  letterA.setAttribute("y", pA[1] - 15);
  letterC.setAttribute("x", pC[0] + 5);
  letterC.setAttribute("y", pC[1] + 6);
  letterB.setAttribute("x", pB[0] - 20);
  letterB.setAttribute("y", pB[1] + 5);

  const points = [pA, pB, pC];
  tri.setAttributeNS(null, "points", makeString(points));

  const findPointwithFixedRatio = (pt0, pt1, lambda) => {
    return [
      (1 - lambda) * pt0[0] + lambda * pt1[0],
      (1 - lambda) * pt0[1] + lambda * pt1[1],
    ];
  };

  const tucker = (p) => {
    const pD = [p.x, 360];
    // p=[300,360];
    letterD.setAttribute("x", pD[0]);
    letterD.setAttribute("y", pD[1] + 25);

    const cd = findDistance(pC, pD);
    const a = findDistance(pC, pB);
    const b = findDistance(pC, pA);
    const c = findDistance(pA, pB);

    const lambdaD = cd / a;

    const pE = findPointwithFixedRatio(pC, pA, lambdaD);

    letterE.setAttribute("x", pE[0] + 5);
    letterE.setAttribute("y", pE[1] + 5);

    drawLine(pE, pD, line1);

    const ae = findDistance(pA, pE);
    lambdaE = (ae * b) / c / c;
    const pF = findPointwithFixedRatio(pA, pB, lambdaE);

    letterF.setAttribute("x", pF[0] - 15);
    letterF.setAttribute("y", pF[1] + 5);

    drawLine(pE, pF, line2);

    const bf = findDistance(pB, pF);
    const lambdaF = bf / c;

    const pG = findPointwithFixedRatio(pB, pC, lambdaF);

    letterG.setAttribute("x", pG[0]);
    letterG.setAttribute("y", pG[1] + 25);

    drawLine(pG, pF, line3);

    const cg = findDistance(pC, pG);
    const lambdaG = (cg * a) / b / b;
    const pH = findPointwithFixedRatio(pC, pA, lambdaG);

    letterH.setAttribute("x", pH[0] + 5);
    letterH.setAttribute("y", pH[1] + 5);

    drawLine(pG, pH, line4);

    const ah = findDistance(pA, pH);
    const lambdaH = ah / b;

    const pI = findPointwithFixedRatio(pA, pB, lambdaH);

    letterI.setAttribute("x", pI[0] - 15);
    letterI.setAttribute("y", pI[1] + 5);
    drawLine(pH, pI, line5);
    drawLine(pD, pI, line6);
  };

  tucker(new Vector(300, 360));

  svg.addEventListener("mousemove", (event) => {
    let p = new DOMPoint(event.clientX, event.clientY);

    p = p.matrixTransform(svg.getScreenCTM().inverse());

    tucker(p);
  });
}
