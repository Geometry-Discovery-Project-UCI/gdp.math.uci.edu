{
  const canvas = new fabric.Canvas("orthocenter-canvas", {
    selection: false,
    backgroundColor: "floralwhite",
  });

  // vertexes
  const aLabel = makeLabel("A");
  const bLabel = makeLabel("B");
  const cLabel = makeLabel("C");

  const heightOnBC = makeLine();
  const heightOnAC = makeLine();
  const heightOnAB = makeLine();

  function getPedalPoint(from, toA, toB) {
    const targetLinEq = solveLinearEquation(toA, toB);
    const heightLinEq = solvePerpendicularLineEquation(targetLinEq.m, from);
    return calculateLineIntersectInLinearEquation(
      targetLinEq.m,
      targetLinEq.b,
      heightLinEq.m,
      heightLinEq.b
    );
  }

  const triangle = makeMovablePolygon(
    [
      {
        x: 125,
        y: 50,
      },
      {
        x: 50,
        y: 450,
      },
      {
        x: 450,
        y: 450,
      },
    ],
    function (coords) {
      aLabel.set({
        left: coords[0].x,
        top: coords[0].y - 30,
      });
      bLabel.set({
        left: coords[1].x - 15,
        top: coords[1].y,
      });
      cLabel.set({
        left: coords[2].x + 5,
        top: coords[2].y,
      });

      const pedalPointOnBC = getPedalPoint(coords[0], coords[1], coords[2]);
      heightOnBC.set({
        x1: coords[0].x,
        y1: coords[0].y,
        x2: pedalPointOnBC.x,
        y2: pedalPointOnBC.y,
      });

      const pedalPointOnAC = getPedalPoint(coords[1], coords[0], coords[2]);
      heightOnAC.set({
        x1: coords[1].x,
        y1: coords[1].y,
        x2: pedalPointOnAC.x,
        y2: pedalPointOnAC.y,
      });

      const pedalPointOnAB = getPedalPoint(coords[2], coords[0], coords[1]);
      heightOnAB.set({
        x1: coords[2].x,
        y1: coords[2].y,
        x2: pedalPointOnAB.x,
        y2: pedalPointOnAB.y,
      });
    }
  );

  canvas.add(triangle);

  canvas.add(aLabel);
  canvas.add(bLabel);
  canvas.add(cLabel);

  canvas.add(heightOnBC);
  canvas.add(heightOnAC);
  canvas.add(heightOnAB);
}
