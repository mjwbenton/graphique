import Colour from "@mattb.tech/graphique-colour";
import { Gradient } from "@mattb.tech/graphique-colour";
import {
  linearScale,
  angleBetween,
  distanceBetween,
} from "@mattb.tech/graphique-maths";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import sign from "@mattb.tech/graphique-sign";
import { Sketch, SketchMeta } from "../types";

type Point = [number, number];
type Triangle = [Point, Point, Point];

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

  // Base triangle
  const baseColour = new Colour({ hue: random.degrees() });
  const baseLength = Math.min(canvas.width, canvas.height) * (14 / 16);
  const height = Math.sqrt(baseLength ** 2 - (baseLength / 2) ** 2);
  const baseTriangle: Triangle = [
    [canvas.width / 2, canvas.height / 2 - height / 2],
    [canvas.width / 2 + baseLength / 2, canvas.height / 2 + height / 2],
    [canvas.width / 2 - baseLength / 2, canvas.height / 2 + height / 2],
  ];
  ctx.fillStyle = baseColour.toHSL();
  drawTriangle(ctx, baseTriangle);

  // Overlay triangles
  const numberOfTriangles = 8; //random.scaledInt(4, 8);
  const triangles = [baseTriangle];
  for (let i = 0; i < numberOfTriangles; i++) {
    const selectedTriangle =
      triangles[random.scaledInt(0, triangles.length - 1)];
    triangles.push(createSubdividedTriangle(ctx, selectedTriangle));
  }

  sign(meta.sketchName, seed)(ctx);
};

function createSubdividedTriangle(
  ctx: CanvasRenderingContext2D,
  triangle: Triangle
): Triangle {
  const selectedPointNumber = random.scaledInt(0, 2);
  const movePercent = random.scaled(20, 40);
  const selectedPoint = triangle[selectedPointNumber];
  const nextPoint = triangle[(selectedPointNumber + 1) % 3];
  const previousPoint = triangle[(selectedPointNumber + 2) % 3];
  const newPoint: Point = [
    linearScale(movePercent, [0, 100], [selectedPoint[0], nextPoint[0]]),
    linearScale(movePercent, [0, 100], [selectedPoint[1], nextPoint[1]]),
  ];
  const newTriangle: Triangle = [
    selectedPointNumber === 0 ? newPoint : triangle[0],
    selectedPointNumber === 1 ? newPoint : triangle[1],
    selectedPointNumber === 2 ? newPoint : triangle[2],
  ];
  const newColour = new Colour({ hue: random.degrees(), saturation: 75 });
  ctx.fillStyle = new Gradient(ctx, newColour.darken(5))
    .addColour(newColour, 0.01)
    .addColour(newColour.decreaseOpacity(random.scaled(10, 90)), 1)
    .moveTo(newPoint)
    .rotate(angleBetween(newPoint, nextPoint) + 90)
    .spreadOver(distanceBetween(newPoint, previousPoint))
    .toCanvasGradient();
  drawTriangle(ctx, newTriangle);
  return newTriangle;
}

function drawTriangle(ctx: CanvasRenderingContext2D, points: Triangle) {
  ctx.beginPath();
  ctx.lineTo.apply(ctx, points[0]);
  ctx.lineTo.apply(ctx, points[1]);
  ctx.lineTo.apply(ctx, points[2]);
  ctx.closePath();
  ctx.fill();
}

export const meta: SketchMeta = {
  sketchName: "8",
  defaultSeed: "79cc0",
};
