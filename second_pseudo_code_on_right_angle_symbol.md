# Pseduo code

## Define the following function

const RightAngleSymbol (pt0,pt1,pt2)

// We assume from the line (pt0,pt1) rotate to line (pt0,pt2) is 90 degrees counter-clockwise.
//this function would put the right angle symbol on to it. 

Compute dist1= distance (pt0, pt1)

Compute dist2= distance (pt0, pt2)


// assume the right angle symbol box side is 10

Let BoxSideLength = 10

Let Lambda1=10/(dist1-10)
Let Lambda2=10/(dist2-10)

// Here we need to define another function finding x=\Lambda*x1+(1-\Lambda)*x2
// x= SectionFormula (pt0, pt1,Lambda)
// For example, if $Lambda=1$, the function return the midpoint of x1 and x2

Let FirstPoint=SectionFormula (pt0, pt1,Lambda1)

Let FirstPoint=SectionFormula (pt0, pt2,Lambda1)

Let ThirdPoint=FirstPoint+SecondPoint-pt0

// note that the above is the vector additon/substraction

Draw redline segment from FirstPoint to ThirdPoint to SecondPoint




