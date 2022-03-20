{
  const svg = document.querySelector("#tri-app");
  const pi = 3.14;

  const radius = 200;
  const xx = 250;
  const yy = 250;
  const makeString = (arr) => {
    return `${arr[0][0]},${arr[0][1]} ${arr[1][0]},${arr[1][1]} ${arr[2][0]},${arr[2][1]}`;
};
  let pA = [xx + Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
  let pB = [xx - Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
  let pC = [xx - Math.cos(pi / 3) * radius, yy - Math.sin(pi / 3) * radius];
  const points = [pA, pB, pC];

  mAB = (pA[1] - pA[1]) / (pB[0] - pA[0]);
  mBC = (pB[1] - pC[1]) / (pB[0] - pC[0]);
  mAC = (pA[1] - pC[1]) / (pA[0] - pC[0]);

  const tri = document.querySelector("#tri_simsonline");
  const cir = document.querySelector("#ptoCircle_simsonline");
  const line0 = document.querySelector("#line0_simsonline");
  const line1 = document.querySelector("#line1_simsonline");
  const line2 = document.querySelector("#line2_simsonline");
  const line3 = document.querySelector("#line3_simsonline");
  const line4 = document.querySelector("#line4_simsonline");
  const lineE = document.querySelector("#lineExtend_simsonline");
  const lineE2 = document.querySelector("#lineExtend2_simsonline");
  const raA = document.querySelector("#rightAngleA_simsonline");
  const raB = document.querySelector("#rightAngleB_simsonline");
  const raC = document.getElementById("rightAngleC_simsonline");

  const letterA = document.querySelector("#letterA_simsonline");
  const letterB = document.querySelector("#letterB_simsonline");
  const letterC = document.querySelector("#letterC_simsonline");
  const letterP = document.querySelector("#letterP_simsonline");
  const moveMouse = (p) => {


    let cosx =
      (p.x - xx) / Math.sqrt((p.x - xx) * (p.x - xx) + (p.y - yy) * (p.y - yy));
    let sinx =
      (p.y - yy) / Math.sqrt((p.x - xx) * (p.x - xx) + (p.y - yy) * (p.y - yy));

    p.x = xx + radius * cosx;
    p.y = yy + radius * sinx;

    mid0 = findMidpoint(points[0], [p.x, p.y]);
    m0 = findSlope(points[0], [p.x, p.y]);
    mid1 = findMidpoint(points[1], [p.x, p.y]);
    m1 = findSlope(points[1], [p.x, p.y]);

    tri.setAttributeNS(
      null,
      "points",
      makeString([points[0], points[1], points[2]])
    );
    p1 = [p.x, pA[1]];
    //.log([p.x, p.y], pA, pB);
    let pAi =  projectPoint2Line([p.x , p.y], pA, pC);
    
    mAi = (pAi[1] - p1[1]) / (pAi[0] - p1[0]); 
    
    drawLine(pAi, [p.x, p.y], line2);
    drawLine(p1, [p.x, p.y], line0);
    let pBi =  projectPoint2Line([p.x , p.y], pB, pC);
    //drawLine(p1, pBi, line3); 
    //drawLine(p1, pAi, line4);
    drawFullLine(p1, findSlope(p1, pAi),line3);

    drawLine(pBi, [p.x, p.y], line1);

    let theta = Math.atan(-1 / mBC);
    let dist = distToLine([p.x, p.y], pC, pA);
    p2 = [p.x - dist * Math.cos(theta), p.y - dist * Math.sin(theta)];

    // drawFullLine(p2, findSlope(p1, p2), line3);
    raA.setAttribute("width", 8);
    raA.setAttribute("height", 8);
    if (p.y > p1[1]) {
      raA.setAttribute("y", p1[1]);

    } else { 
      raA.setAttribute("y",p1[1] - 8);
    }

    if (p.x > p1[0]) {
      raA.setAttribute("x", p1[0]);
    } else {
      raA.setAttribute("x", p1[0] - 8);
    } 

  letterP.setAttribute("x", p.x);
  letterP.setAttribute("y", p.y - 10);
  letterP.setAttribute("font-size", "1.5rem");

    let section = pedalPoint(pC, pB, pA, [p.x, p.y]);
    // console.log(section);
    let pP = [p.x, p.y];
    let disToA = findDistance(pA, pP);
    let disToB = findDistance(pB, pP);
    let disToC = findDistance(pC, pP);
    let tBC = Math.atan(mBC);
    let tAC = Math.atan(mAC);

    

    if (section == 2) {
      drawLine(pC, pBi, lineE);
      drawLine(pA, p1, lineE2);
      raB.setAttribute("x", pBi[0]);
    raB.setAttribute("y", pBi[1]);
    raB.setAttribute("transform", "rotate(" + String(radiansToDegress(tBC)) + " " + String(pBi[0]) + " " + String(pBi[1]) + ")");
    raC.setAttribute("x", pAi[0]);
    raC.setAttribute("y", pAi[1] - 8);
    raC.setAttribute("transform", "rotate(" + String(radiansToDegress(tAC)) + " " + String(pAi[0]) + " " + String(pAi[1]) + ")");
   
    }
    if (section == 4) {
      drawLine(pB, pBi, lineE);
      drawLine(pA, p1, lineE2);
      raC.setAttribute("x", pAi[0]);
    raC.setAttribute("y", pAi[1]);
    raC.setAttribute("transform", "rotate(" + String(radiansToDegress(tAC)) + " " + String(pAi[0]) + " " + String(pAi[1]) + ")");
   
      raB.setAttribute("x", pBi[0]);
    raB.setAttribute("y", pBi[1]);
    raB.setAttribute("transform", "rotate(" + String(radiansToDegress(tBC)) + " " + String(pBi[0]) + " " + String(pBi[1]) + ")");
   
    }
    if (section == 6) {
      drawLine(pC, pAi, lineE);
      drawLine(pB, p1, lineE2);
      raC.setAttribute("x", pAi[0]);
    raC.setAttribute("y", pAi[1]);
    raC.setAttribute("transform", "rotate(" + String(radiansToDegress(tAC)) + " " + String(pAi[0]) + " " + String(pAi[1]) + ")");
   
      raB.setAttribute("x", pBi[0] - 8);
    raB.setAttribute("y", pBi[1] - 8);
    raB.setAttribute("transform", "rotate(" + String(radiansToDegress(tBC)) + " " + String(pBi[0]) + " " + String(pBi[1]) + ")");
   
    }
    
    
    
     
  }
  let p = new DOMPoint(xx - Math.cos(pi * 5/ 9 ) * radius, yy - Math.sin(pi / 9) * radius);
  moveMouse(p);
  ptoAngles = [1.4, 3.4, 5, 6];


  tri.setAttributeNS(null, "points", makeString(points));

  svg.addEventListener("mousemove", (event) => {
    p = new DOMPoint(event.clientX, event.clientY);
    p = p.matrixTransform(svg.getScreenCTM().inverse());
    moveMouse(p);
 
  });

  letterA.setAttribute("x", pA[0]);
  letterA.setAttribute("y", pA[1] + 5);
  letterA.setAttribute("font-size", "1.5rem");

  letterB.setAttribute("x", pB[0] -20);
  letterB.setAttribute("y", pB[1] +10);
  letterB.setAttribute("font-size", "1.5rem");
  
  letterC.setAttribute("x", pC[0] - 10);
  letterC.setAttribute("y", pC[1] - 10);
  letterC.setAttribute("font-size", "1.5rem");



}