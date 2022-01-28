const svg = document.querySelector('#tri-app');
const points = [[50,350],[250,350],[150,150]];
const tri = document.querySelector('#tri0');
const line0 = document.querySelector('#line0');
const line1 = document.querySelector('#line1');

const ptolemy = document.querySelector('#ptolemy');
const ptoCircle = document.querySelector('#ptoCircle');
const ptoRadius = parseFloat(ptoCircle.getAttribute('r'));

const ptoABK = document.querySelector('#ptoABK');
const ptoBCD = document.querySelector('#ptoBCD');
const ptoBCK = document.querySelector('#ptoBCK');
const ptoABD = document.querySelector('#ptoABD');

const letterA = document.querySelector('#letterA');
const letterB = document.querySelector('#letterB');
const letterC = document.querySelector('#letterC');
const letterD = document.querySelector('#letterD');
const letterK = document.querySelector('#letterK');

const sliderA = document.querySelector('#sliderA');

const makeString = (arr) => {
  return `${arr[0][0]},${arr[0][1]} ${arr[1][0]},${arr[1][1]} ${arr[2][0]},${arr[2][1]}`
}

const makeTriangle = (pt0, pt1, pt2, ptoTri) => {
  ptoTri.setAttributeNS(null, "points", makeString([pt0,pt1,pt2]));
}

const findMidpoint = (pt0, pt1) => {
  return [(pt0[0]+pt1[0])/2, (pt0[1]+pt1[1])/2]
}

const findSlope = (pt0, pt1) => {
  if (pt0[0] != pt1[0]) {
    return (pt1[1]-pt0[1])/(pt1[0]-pt0[0])
  } else {
    return NaN
  }
}

const findDistance = (pt0, pt1) => {
  return Math.sqrt((pt0[0]-pt1[0])**2 + (pt0[1]-pt1[1])**2)
}

const drawFullLine = (pt, m, line) => {
  // NaN only occurs if the triangle side is vertical.
  if (isNaN(m)) {
    m = 0;
  } else if (!isFinite(m)) {
    line.setAttributeNS(null, "x1", pt[0]);
    line.setAttributeNS(null, "y1", 0);
    // Replace 500 with the height
    line.setAttributeNS(null, "x2", pt[0]);
    line.setAttributeNS(null, "y2", 500);
    return null;
  }
  line.setAttributeNS(null, "x1", 0);
  line.setAttributeNS(null, "y1", -m*pt[0]+pt[1]);
  // Replace 300 with the width
  line.setAttributeNS(null, "x2", 300);
  line.setAttributeNS(null, "y2", m*(300-pt[0])+pt[1]);
}

ptoAngles = [1.4, 3.4, 5, 6];

const ptoPointRad = (theta, rad) => {
  return [rad*Math.cos(theta), -rad*Math.sin(theta)]
}

const ptoPoint = (theta) => {
  return ptoPointRad(theta, ptoRadius)
}

var [ptoA, ptoB, ptoC, ptoD] = ptoAngles.map(ptoPoint);

var AB = findDistance(ptoA, ptoB);
var AC = findDistance(ptoA, ptoC);
var BD = findDistance(ptoB, ptoD);
var CD = findDistance(ptoC, ptoD);
var AK = AB*CD/BD;
var uAC = [(ptoC[0] - ptoA[0])/AC, (ptoC[1] - ptoA[1])/AC];
var ptoK = [ptoA[0] + uAC[0]*AK, ptoA[1] + uAC[1]*AK];

letterA.setAttributeNS(null, "x", ptoPointRad(ptoAngles[0], ptoRadius+5)[0]);
letterA.setAttributeNS(null, "y",  ptoPointRad(ptoAngles[0], ptoRadius+5)[1]);

letterB.setAttributeNS(null, "x", ptoPointRad(ptoAngles[1], ptoRadius+15)[0]);
letterB.setAttributeNS(null, "y",  ptoPointRad(ptoAngles[1], ptoRadius+15)[1]);

letterC.setAttributeNS(null, "x", ptoPointRad(ptoAngles[2], ptoRadius+15)[0]);
letterC.setAttributeNS(null, "y",  ptoPointRad(ptoAngles[2], ptoRadius+15)[1]);

letterD.setAttributeNS(null, "x", ptoPointRad(ptoAngles[3], ptoRadius+5)[0]);
letterD.setAttributeNS(null, "y",  ptoPointRad(ptoAngles[3], ptoRadius+5)[1]);

letterK.setAttributeNS(null, "x", ptoK[0]+3);
letterK.setAttributeNS(null, "y", ptoK[1]);

tri.setAttributeNS(null, "points", makeString(points));

svg.addEventListener('mousemove', (event) => {
  var p = new DOMPoint(event.clientX, event.clientY);
  p = p.matrixTransform(svg.getScreenCTM().inverse());
  mid0 = findMidpoint(points[0],[p.x,p.y]);
  m0 = findSlope(points[0], [p.x,p.y]);
  mid1 = findMidpoint(points[1],[p.x,p.y]);
  m1 = findSlope(points[1], [p.x,p.y]);
  tri.setAttributeNS(null, "points", makeString([points[0],points[1],[p.x,p.y]]));
  drawFullLine(mid0, -1/m0, line0);
  drawFullLine(mid1, -1/m1, line1);
});

makeTriangle(ptoA, ptoB, ptoK, ptoABK);
makeTriangle(ptoB, ptoC, ptoD, ptoBCD);
makeTriangle(ptoB, ptoC, ptoK, ptoBCK);
makeTriangle(ptoA, ptoB, ptoD, ptoABD);


const ptoRadio = document.querySelectorAll('input[name="shaded"]');

const shadeTriangle = (val) => {
  if (val === "shade1") {
    ptoABK.setAttribute("style", "fill:hsla(0, 100%, 90%, .3)");
    ptoBCD.setAttribute("style", "fill:hsla(203, 100%, 90%, .3)");
    ptoBCK.setAttribute("style", "fill:none");
    ptoABD.setAttribute("style", "fill:none");
  } else if (val === "shade2") {
    ptoABK.setAttribute("style", "fill:none");
    ptoBCD.setAttribute("style", "fill:none");
    ptoBCK.setAttribute("style", "fill:hsla(0, 100%, 90%, .3)");
    ptoABD.setAttribute("style", "fill:hsla(203, 100%, 90%, .3)");
  } else if (val === "none") {
    ptoABK.setAttribute("style", "fill:none");
    ptoBCD.setAttribute("style", "fill:none");
    ptoBCK.setAttribute("style", "fill:none");
    ptoABD.setAttribute("style", "fill:none");
  }
}

for (var i = 0; i < ptoRadio.length; i++) {
  ptoRadio[i].addEventListener('change', () => {
    shadeTriangle(document.querySelector('input[name="shaded"]:checked').value);
  });
}

sliderA.addEventListener('change', (event) => {
  ptoAngles[0] = parseFloat(event.target.value);
  [ptoA, ptoB, ptoC, ptoD] = ptoAngles.map(ptoPoint);

  AB = findDistance(ptoA, ptoB);
  AC = findDistance(ptoA, ptoC);
  AK = AB*CD/BD;
  uAC = [(ptoC[0] - ptoA[0])/AC, (ptoC[1] - ptoA[1])/AC];
  ptoK = [ptoA[0] + uAC[0]*AK, ptoA[1] + uAC[1]*AK];

  makeTriangle(ptoA, ptoB, ptoK, ptoABK);
  makeTriangle(ptoB, ptoC, ptoD, ptoBCD);
  makeTriangle(ptoB, ptoC, ptoK, ptoBCK);
  makeTriangle(ptoA, ptoB, ptoD, ptoABD);

  letterA.setAttributeNS(null, "x", ptoPointRad(ptoAngles[0], ptoRadius+5)[0]);
  letterA.setAttributeNS(null, "y",  ptoPointRad(ptoAngles[0], ptoRadius+5)[1]);

  letterK.setAttributeNS(null, "x", ptoK[0]+3);
  letterK.setAttributeNS(null, "y", ptoK[1]);
});
