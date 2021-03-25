import Colour from "@mattb.tech/graphique-colour";
import Gradient from "@mattb.tech/graphique-colour/dist/Gradient";
import { linearScale, radiansToDegrees } from "@mattb.tech/graphique-maths";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import sign from "@mattb.tech/graphique-sign";

const SKETCH_ID = 8;

type Point = [number, number];
type Triangle = [Point, Point, Point];

export function sketch({
  canvas,
  seed,
}: {
  canvas: HTMLCanvasElement;
  seed: string;
}) {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

  // Background
  const baseColour = new Colour({ hue: random.degrees() });
  ctx.fillStyle = baseColour.lighten(47).toHSL();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Base triangle
  const baseLength = Math.min(canvas.width, canvas.height) * (15 / 16);
  const height = Math.sqrt(baseLength ** 2 - (baseLength / 2) ** 2);
  const baseTriangle: Triangle = [
    [canvas.width / 2, canvas.height / 2 - height / 2],
    [canvas.width / 2 + baseLength / 2, canvas.height / 2 + height / 2],
    [canvas.width / 2 - baseLength / 2, canvas.height / 2 + height / 2],
  ];
  ctx.fillStyle = baseColour.toHSL();
  drawTriangle(ctx, baseTriangle);

  // Overlay triangles
  const numberOfTriangles = random.scaledInt(4, 8);
  const triangles = [baseTriangle];
  for (let i = 0; i < numberOfTriangles; i++) {
    const selectedTriangle =
      triangles[random.scaledInt(0, triangles.length - 1)];
    triangles.push(createSubdividedTriangle(ctx, selectedTriangle));
  }

  sign(SKETCH_ID, seed)(ctx);
}

function createSubdividedTriangle(
  ctx: CanvasRenderingContext2D,
  triangle: Triangle
): Triangle {
  const selectedPointNumber = random.scaledInt(0, 2);
  const movePercent = 30; //random.scaled(15, 45);
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
  const hypotenuse = distance(newPoint, previousPoint);
  const adjacent = previousPoint[1] - newPoint[1];
  let angle = radiansToDegrees(Math.acos(adjacent / hypotenuse));
  if (selectedPointNumber === 1 && movePercent > 50) {
    angle = 180 + (180 - angle);
  }
  if (selectedPointNumber === 2) {
    angle = angle * -1;
  }
  const newColour = new Colour({ hue: random.degrees(), saturation: 75 });
  ctx.fillStyle = new Gradient(ctx, newColour.darken(5))
    .addColour(newColour, 0.01)
    .addColour(newColour.decreaseOpacity(40), 1)
    .spreadOver(hypotenuse)
    .rotate(angle)
    .moveTo(newPoint)
    .toCanvasGradient();
  drawTriangle(ctx, newTriangle);
  return newTriangle;
}

function distance(p1: [number, number], p2: [number, number]) {
  const xDistance = p2[0] - p1[0];
  const yDistance = p2[1] - p1[1];
  return Math.sqrt(xDistance ** 2 + yDistance ** 2);
}

function drawTriangle(ctx: CanvasRenderingContext2D, points: Triangle) {
  ctx.beginPath();
  ctx.lineTo.apply(ctx, points[0]);
  ctx.lineTo.apply(ctx, points[1]);
  ctx.lineTo.apply(ctx, points[2]);
  ctx.closePath();
  ctx.fill();
}
