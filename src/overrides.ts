import { fabric } from "fabric";

declare module "fabric" {
    // eslint-disable-next-line
    namespace fabric {
        interface Point {
            dot: (that: Point) => number
        }

        interface Intersection {
            status?: string,
            points?: Point[],
            intersectLineLine: (a1: Point, a2: Point, b1: Point, b2: Point, isSegment?: boolean) => Intersection,
        }
    }
}

export function overrides() {
    fabric.Point.prototype.dot = function (that) {
        return this.x * that.x + this.y * that.y;
    };

    fabric.Point.prototype.lerp = function (that, t = 0.5) {
        return new fabric.Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
    };

    fabric.Intersection.prototype.intersectLineLine = function (a1, a2, b1, b2, isSegment = false): fabric.Intersection {
        let result: fabric.Intersection;
        const uaT = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x),
            ubT = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x),
            uB = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
        if (uB !== 0) {
            const ua = uaT / uB,
                ub = ubT / uB;
            if (!isSegment || 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
                result = new fabric.Intersection("Intersection");
                result.appendPoint(new fabric.Point(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
            } else {
                result = new fabric.Intersection();
            }
        } else {
            if (uaT === 0 || ubT === 0) {
                result = new fabric.Intersection("Coincident");
            } else {
                result = new fabric.Intersection("Parallel");
            }
        }
        return result;
    };
}
