import sign from "@mattb.tech/graphique-sign";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import Colour from "@mattb.tech/graphique-colour";
import { subdivideSpace } from "../2";
import SimplexNoise from "simplex-noise";
import { degreesToRadians, linearScale } from "@mattb.tech/graphique-maths";
import Gradient from "@mattb.tech/graphique-colour/dist/Gradient";

const SKETCH_ID = "10";
const LENGTH = 30;
const WIDTH = 10;
const NOISE_SCALE = 0.0017;

const DIVISION_SIZE = 10;

export function sketch({
  canvas,
  seed,
}: {
  canvas: HTMLCanvasElement;
  seed: string;
}) {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

  const baseColour = new Colour({
    hue: random.degrees(),
  });

  // Off-white background
  const backgroundColour = baseColour.desaturate(10).lighten(45);
  ctx.fillStyle = backgroundColour.toHSL();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Use same colour for stroke
  ctx.lineWidth = WIDTH;
  ctx.lineCap = "round";

  const noiseGenerator = new SimplexNoise(random.next);

  subdivideSpace(canvas, {
    width: DIVISION_SIZE,
    height: DIVISION_SIZE,
  }).forEach(({ centerx, centery }) => {
    ctx.beginPath();
    ctx.lineTo(centerx, centery);
    const degrees = linearScale(
      noiseGenerator.noise2D(centerx * NOISE_SCALE, centery * NOISE_SCALE),
      [-1, 1],
      [0, 360]
    );
    const xDiff = Math.cos(degreesToRadians(degrees)) * LENGTH;
    const yDiff = Math.sin(degreesToRadians(degrees)) * LENGTH;
    const strokeColour = baseColour
      .decreaseOpacity(0.15)
      .saturate(5)
      .lighten(10);
    ctx.strokeStyle = new Gradient(ctx, strokeColour)
      .addColour(strokeColour.shiftHue(degrees).lighten(10), 1)
      .rotate(degrees)
      .spreadOver(LENGTH)
      .moveTo([centerx, centery])
      .toCanvasGradient();
    ctx.lineTo(centerx + xDiff, centery + yDiff);
    ctx.stroke();
  });

  sign(SKETCH_ID, seed)(ctx);
}
