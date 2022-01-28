{
const svg = document.querySelector("#tri-app-morley");
const tri1 = document.querySelector("#tri-morley1");
const tri2 = document.querySelector("#tri-morley2"); 
const letterA = document.querySelector('#letterA_morley');
const letterB = document.querySelector('#letterB_morley');
const letterC = document.querySelector('#letterC_morley');
const letterAp = document.querySelector('#letterAP_morley');
const letterBp = document.querySelector('#letterBP_morley');
const letterCp = document.querySelector('#letterCP_morley');
const line0 = document.getElementById("line0_morley");
const line1 = document.getElementById("line1_morley");
const line2 = document.getElementById("line2_morley");
const line3 = document.getElementById("line3_morley");
const line4 = document.getElementById("line4_morley");
const line5 = document.getElementById("line5_morley");
const line6 = document.getElementById("line6_morley");
  

function GetD(A, B, C, flag){
    let v1 = C.sub(B);
    let v2 = A.sub(B);
    let a1 = v1.angleBetween(v2);
    a1 = flag * a1;
    v1 = v1.rotate(a1 / 3);
     
    let v3 = B.sub(C);
    let v4 = A.sub(C);
    let a2 = v3.angleBetween(v4);
    a2 = flag * a2;
    v3 = v3.rotate(-a2 / 3);
    
    return getLineIntersection(B, v1, C, v3); 
}

pA = [423, 360];
pB = [76, 360];
letterC.setAttribute("x", pA[0] + 5);
letterC.setAttribute("y", pA[1] + 5);
letterB.setAttribute("x", pB[0] - 15);
letterB.setAttribute("y", pB[1] + 5);
const morley = (p) => { 
    let pC = [p.x, p.y];
    p = [166,51];
    let points = [pA, pB, pC];
    tri1.setAttributeNS(null, "points", makeString(points));

    letterA.setAttribute("x", pC[0]);
    letterA.setAttribute("y", pC[1] - 5);
    let A = new Vector(pA[0], pA[1]);
    let B = new Vector(pB[0], pB[1]);
    let C = new Vector(pC[0], pC[1]);

    if (pC[1] > pA[1]) {
        flag = -1;
    }
    else {
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
    let primePoints = [[Cprime.x, Cprime.y], [Bprime.x, Bprime.y], [Aprime.x, Aprime.y]];

    tri2.setAttributeNS(null, "points", makeString(primePoints));    
};

morley(new Vector(166, 51));

svg.addEventListener("mousemove", (event) => {
  var p = new DOMPoint(event.clientX, event.clientY);
  
  p = p.matrixTransform(svg.getScreenCTM().inverse());

  morley(p);  
});


}    
 
   