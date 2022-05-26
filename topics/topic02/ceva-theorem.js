const canvas = new fabric.Canvas("ceva-theorem-canvas", {
  selection: false,
  backgroundColor: "floralwhite",
});

const lineAD = makeLine();
const lineBE = makeLine();
const lineCF = makeLine();

const aLabel = makeLabel("A");
const bLabel = makeLabel("B");
const cLabel = makeLabel("C");
const dLabel = makeLabel("D");
const eLabel = makeLabel("E");
const fLabel = makeLabel("F");
const pLabel = makeLabel("P");

const dNode = makeCircle();
const eNode = makeCircle();
const fNode = makeCircle();

const valueBD = makeLabel("0");
const valueDC = makeLabel("0");
const valueCE = makeLabel("0");
const valueEA = makeLabel("0");
const valueAF = makeLabel("0");
const valueFB = makeLabel("0");
const resultText = makeLabel("1");

// create triangle
const triangle = new fabric.Polygon(
  [
    { x: 150, y: 100 },
    { x: 50, y: 400 },
    { x: 350, y: 400 },
  ],
  {
    fill: "transparent",
    strokeWidth: 1.5,
    stroke: "black",
    objectCaching: false,
    transparentCorners: false,
    cornerStyle: "circle",
    cornerColor: "transparent",
    cornerSize: 20,
    hasBorders: false,
    evented: false,
  }
);

// set coordinates and options for point P inside the triangle
const pointP = makeMovablePoint({
  x: 180,
  y: 310,
});

pointP.set({
  originX: "center",
  originY: "center",
  radius: 5,
  fill: "black",
});

// function to find points D,E,F and draw lines that depends on coordinates of point P
function movePointP() {
  // find slope and intercept of the line segments from vertices to point P
  const lineAP = solveLinearEquation(triangle.points[0], {
    x: pointP.left,
    y: pointP.top,
  });
  const lineBP = solveLinearEquation(triangle.points[1], {
    x: pointP.left,
    y: pointP.top,
  });
  const lineCP = solveLinearEquation(triangle.points[2], {
    x: pointP.left,
    y: pointP.top,
  });

  // find slope and intercept of the line segments between the vertices
  const lineAB = solveLinearEquation(triangle.points[0], triangle.points[1]);
  const lineBC = solveLinearEquation(triangle.points[1], triangle.points[2]);
  const lineAC = solveLinearEquation(triangle.points[0], triangle.points[2]);

  // calculate intersection points D,E,F
  const pointD = calculateLineIntersectInLinearEquation(
    lineAP.m,
    lineAP.b,
    lineBC.m,
    lineBC.b
  );

  const pointE = calculateLineIntersectInLinearEquation(
    lineBP.m,
    lineBP.b,
    lineAC.m,
    lineAC.b
  );

  const pointF = calculateLineIntersectInLinearEquation(
    lineCP.m,
    lineCP.b,
    lineAB.m,
    lineAB.b
  );

  // draw lines from vertices to points D,E,F
  lineAD.set({
    x1: triangle.points[0].x,
    y1: triangle.points[0].y,
    x2: pointD.x,
    y2: pointD.y,
    stroke: "black",
  });

  lineBE.set({
    x1: triangle.points[1].x,
    y1: triangle.points[1].y,
    x2: pointE.x,
    y2: pointE.y,
    stroke: "black",
  });

  lineCF.set({
    x1: triangle.points[2].x,
    y1: triangle.points[2].y,
    x2: pointF.x,
    y2: pointF.y,
    stroke: "black",
  });

  // set coordinates for the labels
  aLabel.set({
    left: triangle.points[0].x - 5,
    top: triangle.points[0].y - 30,
    fontSize: 20,
  });

  bLabel.set({
    left: triangle.points[1].x - 10,
    top: triangle.points[1].y + 10,
    fontSize: 20,
  });

  cLabel.set({
    left: triangle.points[2].x + 10,
    top: triangle.points[2].y + 10,
    fontSize: 20,
  });

  dLabel.set({
    left: pointD.x - 5,
    top: pointD.y + 10,
    fontSize: 18,
  });

  eLabel.set({
    left: pointE.x + 15,
    top: pointE.y - 15,
    fontSize: 18,
  });

  fLabel.set({
    left: pointF.x - 20,
    top: pointF.y - 15,
    fontSize: 18,
  });

  pLabel.set({
    left: pointP.left - 25,
    top: pointP.top - 10,
    fontSize: 18,
  });

  // set coordinates for the nodes
  dNode.set({
    left: pointD.x - 0.75 * 3,
    top: pointD.y - 0.75 * 3,
    radius: 2,
    fill: "blacks",
  });

  eNode.set({
    left: pointE.x - 0.75 * 3,
    top: pointE.y - 0.75 * 3,
    radius: 2,
    fill: "blacks",
  });

  fNode.set({
    left: pointF.x - 0.75 * 3,
    top: pointF.y - 0.75 * 3,
    radius: 2,
    fill: "blacks",
  });

  // calculate values for text
  const distBD =
    calculateDistanceBetweenTwoPoints(triangle.points[1], pointD) / 100;
  const distDC =
    calculateDistanceBetweenTwoPoints(triangle.points[2], pointD) / 100;
  const distCE =
    calculateDistanceBetweenTwoPoints(triangle.points[2], pointE) / 100;
  const distEA =
    calculateDistanceBetweenTwoPoints(triangle.points[0], pointE) / 100;
  const distAF =
    calculateDistanceBetweenTwoPoints(triangle.points[0], pointF) / 100;
  const distFB =
    calculateDistanceBetweenTwoPoints(triangle.points[1], pointF) / 100;

  // update values for text
  const valueList = [
    [distBD, distDC],
    [distCE, distEA],
    [distAF, distFB],
  ];
  const valueConst = [
    [valueBD, valueDC],
    [valueCE, valueEA],
    [valueAF, valueFB],
  ];

  valueList.forEach((value, i) => {
    const num = [
      String((Math.round(value[0] * 100) / 100).toFixed(2)),
      String((Math.round(value[1] * 100) / 100).toFixed(2)),
    ];

    valueConst[i][0].set({
      text: num[0],
      left: 330 + i * 50,
      top: 85,
      fontSize: 20,
      stroke: "black",
    });

    valueConst[i][1].set({
      text: num[1],
      left: 330 + i * 50,
      top: 110,
      fontSize: 20,
      stroke: "black",
    });
  });

  // calculate and update result
  const resultValue = Math.round(
    ((((distBD / distDC) * distCE) / distEA) * distAF) / distFB
  );
  resultText.set({
    text: "=  " + String(resultValue.toFixed(2)),
    left: 306,
    top: 155,
    fontSize: 20,
    stroke: "black",
  });
}

movePointP();

canvas.on("object:moving", movePointP);

const equationText = [
  ["BD", "DC"],
  ["CE", "EA"],
  ["AF", "FB"],
];
equationText.forEach((equation, i) => {
  canvas.add(
    new fabric.Text(equation[0]).set({
      left: 335 + i * 50,
      top: 25,
      strokeWidth: 1,
      stroke: "black",
      fill: "black",
      fontSize: 20,
      evented: false,
    })
  );

  canvas.add(
    new fabric.Text(equation[1]).set({
      left: 335 + i * 50,
      top: 50,
      strokeWidth: 1,
      stroke: "black",
      fill: "black",
      fontSize: 20,
      evented: false,
    })
  );
});

const signCoords = [27, 87];
signCoords.forEach((signCoord, i) => {
  canvas.add(
    new fabric.Text("____  ____  ____", {
      left: 330,
      top: signCoord,
      strokeWidth: 1,
      stroke: "black",
      fill: "black",
      fontSize: 20,
      evented: false,
    })
  );

  canvas.add(
    new fabric.Text("=           .         .", {
      left: 306,
      top: signCoord + 5,
      strokeWidth: 1,
      stroke: "black",
      fill: "black",
      fontSize: 20,
      evented: false,
    })
  );
});

canvas.add(triangle);
canvas.add(lineAD);
canvas.add(lineBE);
canvas.add(lineCF);

canvas.add(aLabel);
canvas.add(bLabel);
canvas.add(cLabel);
canvas.add(dLabel);
canvas.add(eLabel);
canvas.add(fLabel);
canvas.add(pLabel);

canvas.add(pointP);
canvas.add(dNode);
canvas.add(eNode);
canvas.add(fNode);

canvas.add(valueBD);
canvas.add(valueDC);
canvas.add(valueCE);
canvas.add(valueEA);
canvas.add(valueAF);
canvas.add(valueFB);
canvas.add(resultText);
