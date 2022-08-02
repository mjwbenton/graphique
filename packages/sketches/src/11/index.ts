import Colour from "@mattb.tech/graphique-colour";
import { Gradient } from "@mattb.tech/graphique-colour";
import {
  angleBetween,
  distanceBetween,
  degreesToRadians,
} from "@mattb.tech/graphique-maths";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import sign from "@mattb.tech/graphique-sign";
import { Sketch, SketchMeta } from "../types";

const MAX_SIDES = 30;
const MIN_SIDES = 3;

type Point = [number, number];
type Shape = Point[];

export const sketch: Sketch = ({ canvas, seed }) => {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

  // Background colour
  ctx.fillStyle = new Colour({
    hue: 60,
    saturation: 50,
    lightness: 97,
  }).toHSL();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const { baseLength, basePoint } = calculatePosition(canvas);

  for (let i = MAX_SIDES; i >= MIN_SIDES; i--) {
    addShape(ctx, basePoint, baseLength, i);
  }

  sign(meta.sketchName, seed)(ctx);
};

function calculatePosition({
  width,
  height,
}: {
  width: number;
  height: number;
}): { baseLength: number; basePoint: Point } {
  // Assumes that this is a shape with an even number of sides
  const angle = 360 / (MAX_SIDES * 2);
  const desiredHeight = Math.min(width, height) * (15 / 16);
  const baseLength = Math.tan(degreesToRadians(angle)) * desiredHeight;
  const basePoint: Point = [
    width / 2 - baseLength / 2,
    (height - desiredHeight) / 2,
  ];
  return { baseLength, basePoint };
}

function addShape(
  ctx: CanvasRenderingContext2D,
  basePoint: Point,
  baseLength: number,
  sides: number
) {
  const angleChangeDegrees = 360 / sides;
  const shape = [...Array(sides - 1)].reduce<Shape>(
    (points, _, i) => {
      points.push(
        add(points[points.length - 1], [
          Math.cos(degreesToRadians(angleChangeDegrees * i)) * baseLength,
          Math.sin(degreesToRadians(angleChangeDegrees * i)) * baseLength,
        ])
      );
      return points;
    },
    [basePoint]
  );
  const colour = new Colour({
    hue: random.degrees(),
    saturation: 30,
    opacity: 0.7,
  });
  const midPoint = shape[Math.floor(shape.length / 2)];
  ctx.fillStyle = new Gradient(ctx, colour.darken(5))
    .addColour(colour, 0.01)
    .addColour(colour.decreaseOpacity(random.scaled(10, 50)), 1)
    .moveTo(basePoint)
    .rotate(angleBetween(basePoint, midPoint))
    .spreadOver(distanceBetween(basePoint, midPoint))
    .toCanvasGradient();
  ctx.lineWidth = 1;
  ctx.strokeStyle = colour.toHSL();
  ctx.beginPath();
  shape.forEach((point) => ctx.lineTo(...point));
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function add(point: Point, point2: Point): Point {
  return [point[0] + point2[0], point[1] + point2[1]];
}

export const meta: SketchMeta = {
  sketchName: "11",
  defaultSeed: "t4rxd",
};
