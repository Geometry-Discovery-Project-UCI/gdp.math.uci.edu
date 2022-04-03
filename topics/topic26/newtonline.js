const svg = document.querySelector("#newton-line");

const newton_shape = document.getElementById("newton_shape");
const newton_diag1 = document.getElementById("newton_diag1");
const newton_diag2 = document.getElementById("newton_diag2");
const line = document.getElementById("newton_line");
const lineBE = document.getElementById("newton_lineBE");
const lineCE = document.getElementById("newton_lineCE");
const lineBF = document.getElementById("newton_lineBF");
const lineAF = document.getElementById("newton_lineAF");
const lineEF = document.getElementById("newton_lineEF");

const intM = document.getElementById("newton_intM");
const intN = document.getElementById("newton_intN");
const intL = document.getElementById("newton_intL");

const letterA = document.querySelector("#letterA_newtonline");
const letterB = document.querySelector("#letterB_newtonline");
const letterC = document.querySelector("#letterC_newtonline");
const letterD = document.querySelector("#letterD_newtonline");
const letterL = document.querySelector("#letterL_newtonline");
const letterM = document.querySelector("#letterM_newtonline");
const letterN = document.querySelector("#letterN_newtonline");
const letterE = document.querySelector("#letterE_newtonline");
const letterF = document.querySelector("#letterF_newtonline");


const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

// Create a function to set all attributes simultaneously in one line
function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
}

// From geoutil.js
const lineLineIntersection = (A, B, C, D) => {
    var a1 = B[1] - A[1];
    var b1 = A[0] - B[0];
    var c1 = a1 * (A[0]) + b1 * (A[1]);

    var a2 = D[1] - C[1];
    var b2 = C[0] - D[0];
    var c2 = a2 * (C[0]) + b2 * (C[1]);

    var determinant = a1 * b2 - a2 * b1;

    if (determinant == 0) {
        return null;
    } else {
        var x = (b2 * c1 - b1 * c2) / determinant;
        var y = (a1 * c2 - a2 * c1) / determinant;
        return [x, y];
    }
};


const newton_line = (ptD) => {

    // From geoutil.js
    const findMidpoint = (pt0, pt1) => {
        return [(pt0[0] + pt1[0]) / 2, (pt0[1] + pt1[1]) / 2];
    };
    
    // From geoutil.js
    const findSlope = (pt0, pt1) => {
        if (pt0[0] != pt1[0]) {
            return (pt1[1] - pt0[1]) / (pt1[0] - pt0[0]);
        } else {
            return NaN;
        }
    };
    
    // From geoutil.js
    const drawLine = (a, b, l) => {
        l.setAttributeNS(null, "x1", a[0]);
        l.setAttributeNS(null, "y1", a[1]);
        l.setAttributeNS(null, "x2", b[0]);
        l.setAttributeNS(null, "y2", b[1]);
    }
    
    // From geoutil.js
    const drawFullLine = (pt, m, line) => {
        if (isNaN(m)) {
            m = 0;
        } else if (!isFinite(m)) {
            line.setAttributeNS(null, "x1", pt[0]);
            line.setAttributeNS(null, "y1", 0);
            line.setAttributeNS(null, "x2", pt[0]);
            line.setAttributeNS(null, "y2", CANVAS_HEIGHT);
            return null;
        }
        line.setAttributeNS(null, "x1", 0);
        line.setAttributeNS(null, "y1", -m * pt[0] + pt[1]);
        line.setAttributeNS(null, "x2", CANVAS_WIDTH);
        line.setAttributeNS(null, "y2", m * (CANVAS_WIDTH - pt[0]) + pt[1]);
    };
    
    // Create a new const to update attributes of a quadrilateral
    const drawQuadrilateral = (pt0, pt1, pt2, pt3, quadr) => {
        quadr.setAttributeNS(null, "points", [ptD,ptA,ptB,ptC])
    };

    // Initialize the coordinates for the four points of the quadrilateral
    ptA = [100,200];
    ptB = [50,300];
    ptC = [200,300];

    // Draw diagonals of the quadrilateral
    drawLine(ptD,ptB,newton_diag1);

    drawLine(ptA,ptC,newton_diag2);

    // Find the midpoints of the diagonals to draw the newton line
    newton_pt1 = findMidpoint(ptD,ptB);

    newton_pt2 = findMidpoint(ptA,ptC);

    // Use the two points on the newton line to draw full line
    drawFullLine(newton_pt1, findSlope(newton_pt1, newton_pt2), line);

    // Draw quadrilateral 
    drawQuadrilateral(ptD,ptA,ptB,ptC,newton_shape);

    // Calculate the points to extend the quadrilateral to a triangle
    ptE = lineLineIntersection(ptA,ptB,ptD,ptC)
    ptF = lineLineIntersection(ptA,ptD,ptB,ptC)

    // Find the midpoint between E and F
    ptL = findMidpoint(ptE,ptF)

    // Draw lines to extend the quadrilateral to a triangle
    drawLine(ptB,ptE,lineBE)
    drawLine(ptC,ptE,lineCE)
    drawLine(ptB,ptF,lineBF)
    drawLine(ptA,ptF,lineAF)
    drawLine(ptE,ptF,lineEF)

    // Change the coordinates of the labels
    setAttributes(letterD,{"x":ptD[0]+5, "y":ptD[1]-5, "font-size":"1.5rem"})
    setAttributes(letterM,{"x":newton_pt1[0]+10, "y":newton_pt1[1]+10, "font-size":"1.2rem"})
    setAttributes(letterN,{"x":newton_pt2[0]+10, "y":newton_pt2[1], "font-size":"1.2rem"})
    setAttributes(letterE,{"x":ptE[0]+10, "y":ptE[1], "font-size":"1.5rem"})
    setAttributes(letterF,{"x":ptF[0]+10, "y":ptF[1], "font-size":"1.5rem"})
    setAttributes(letterL,{"x":ptL[0], "y":ptL[1]-10, "font-size":"1.3rem"})
    
    // I didn't understand how to use const makeCircle in geoutil.js so I created my own
    const makeCircle = (r, x, y, ptoCircle) => {
        ptoCircle.setAttributeNS(null, "r", r);
        ptoCircle.setAttributeNS(null, "cx", x);
        ptoCircle.setAttributeNS(null, "cy", y);
    };

    // Make tiny circles to be nodes for points on the newton line
    makeCircle(2,newton_pt1[0],newton_pt1[1],intM);
    makeCircle(2,newton_pt2[0],newton_pt2[1],intN);
    makeCircle(2,ptL[0],ptL[1],intL);

};

// Initialize the coordinate for point D on the quadrilateral
ptD = [170,230]; // mouse move target

newton_line(ptD)

// Find new coordinates as mouse moves around and update those coordinates for point D
svg.addEventListener("mousemove", (event) => {
    var p = new DOMPoint(event.clientX, event.clientY);
    p = p.matrixTransform(svg.getScreenCTM().inverse());
    newton_line([p.x,p.y]);
});

// Set the coordinates to place the label for point A,B,C of the quadrilateral
setAttributes(letterA,{"x":ptA[0]-23, "y":ptA[1]+5, "font-size":"1.5rem"})
setAttributes(letterB,{"x":ptB[0]-20, "y":ptB[1]+7, "font-size":"1.5rem"})
setAttributes(letterC,{"x":ptC[0], "y":ptC[1]+30, "font-size":"1.5rem"})
