{
const svg = document.querySelector("#tri-app_isotomic");
const pi = 3.14;

const radius = 200;
const xx = 250;
const yy = 250;

var pA = [xx + Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
var pB = [xx - Math.cos(pi / 6) * radius, yy + Math.sin(pi / 6) * radius];
var pC = [xx - Math.cos(pi / 3) * radius, yy - Math.sin(pi / 3) * radius];
const points = [pA, pB, pC];
var pP = [349, 305];

mAB = (pA[1] - pA[1]) / (pB[0] - pA[0]);
mBC = (pB[1] - pC[1]) / (pB[0] - pC[0]);
mAC = (pA[1] - pC[1]) / (pA[0] - pC[0]);

const tri = document.querySelector("#tri_isotomic");
const cir = document.querySelector("#ptoCircle_isotomic");
const line4 = document.querySelector("#lineA_isotomic");
const line5 = document.querySelector("#lineB_isotomic");
const line6 = document.querySelector("#lineC_isotomic");
const line7 = document.querySelector("#lineAp_isotomic");
const line8 = document.querySelector("#lineBp_isotomic");
const line9 = document.querySelector("#lineCp_isotomic");
// dot = document.querySelector("#dot_isotomic");
const letterB = document.querySelector("#letterB_isotomic");
const letterA = document.querySelector("#letterA_isotomic");
const letterC = document.querySelector("#letterC_isotomic");
const letterP = document.querySelector("#letterP_isotomic");


ptoAngles = [1.4, 3.4, 5, 6];

letterA.setAttribute("x", pA[0] + 5);
letterA.setAttribute("y", pA[1]);
letterB.setAttribute("x", pB[0] - 20);
letterB.setAttribute("y", pB[1] + 5);
letterC.setAttribute("x", pC[0] - 5);
letterC.setAttribute("y", pC[1] - 5);

const isotomicMouse = (p) => {
 

  if (isInside(pA[0], pA[1], pB[0], pB[1], pC[0], pC[1], p.x, p.y)) {
    pP = [p.x, p.y];
    /*dot.setAttributeNS(null, "cx", pP[0]);
    dot.setAttributeNS(null, "cy", pP[1]);*/
    letterP.setAttribute("x", pP[0]);
    letterP.setAttribute("y", pP[1] - 10);
 
  } else {
 
    return;
  }

  var cosx =
    (p.x - xx) / Math.sqrt((p.x - xx) * (p.x - xx) + (p.y - yy) * (p.y - yy));
  var sinx =
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

  var theta = Math.atan(-1 / mBC);
  var dist = distToLine([p.x, p.y], pC, pA);
  p2 = [p.x - dist * Math.cos(theta), p.y - dist * Math.sin(theta)];
  
  const pCN = lineLineIntersection(pC, pP, pA, pB);
  drawLine(pC, pCN, line4)
  
  const pAN = lineLineIntersection(pA, pP, pC, pB);
  drawLine(pA, pAN, line5)
  
  const pBN = lineLineIntersection(pB, pP, pC, pA);
  drawLine(pB, pBN, line6);
  
  const dC = findDistance(pCN, pB);
  const pDC = pointAlongLine(pA, pB, dC);
  drawLine(pC, pDC, line7);
  
  const dA = findDistance(pAN, pB);
  const pDA = pointAlongLine(pC, pB, dA);
  drawLine(pA, pDA, line8);
  
  const dB = findDistance(pBN, pC);
  const pDB = pointAlongLine(pA, pC, dB);
  drawLine(pB, pDB, line9);
};

var pPoint = DOMPoint.fromPoint({x: 160, y: 260, z: 0, w: 0});
isotomicMouse(pPoint);
 
tri.setAttributeNS(null, "points", makeString(points));
// svg.("onclick", (event) => {
//   var p;
// });
svg.addEventListener("mousemove", (event) => {

  var p = new DOMPoint(event.clientX, event.clientY);
  p = p.matrixTransform(svg.getScreenCTM().inverse());
  isotomicMouse(p);

  // if ()
  
})};
