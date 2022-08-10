import { createNoise2D } from "simplex-noise";
import sign from "@mattb.tech/graphique-sign";
import { degreesToRadians, linearScale } from "@mattb.tech/graphique-maths";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import Colour from "@mattb.tech/graphique-colour";
import { Sketch, SketchMeta } from "../types";

const CIRCLE_POINTS = 720;

const A = 200;
const SCALING_MAX = 180 ** 2 * A;
const SCALING_MIN = 0;
function noiseScale(degrees: number): number {
  const degFromZero = degrees <= 180 ? degrees : 360 - degrees;
  return Math.min(
    1,
    linearScale(degFromZero ** 2 * A, [SCALING_MIN, SCALING_MAX], [0, A])
  );
}

export const sketch: Sketch = ({ canvas, seed }) => {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
  const max_radius = Math.min(canvas.height, canvas.width) * 0.45;
  const min_radius = Math.min(canvas.height, canvas.width) * 0.2;
  const noise = createNoise2D(random.next);

  const numberOfCircles = Math.floor(random.scaled(5, 30));
  const distanceBetweenCircles = (max_radius - min_radius) / numberOfCircles;
  const maxNoiseOffset = random.scaled(
    distanceBetweenCircles / 5,
    distanceBetweenCircles / 0.5
  );
  const minNoiseOffset = maxNoiseOffset * -1;

  function pointsForCircle(
    radius: number,
    [centerx, centery]: [number, number]
  ): [number, number][] {
    return [...Array(CIRCLE_POINTS).keys()].map((point) => {
      const deg = linearScale(point, [0, CIRCLE_POINTS], [0, 360]);
      const noiseIndexDegs = (deg + radius) % 360;
      const radians = degreesToRadians(deg);
      const noisyRadius =
        radius +
        linearScale(
          noise(noiseIndexDegs * 0.06, radius),
          [-1, 1],
          [minNoiseOffset, maxNoiseOffset]
        ) *
          noiseScale(noiseIndexDegs);
      const x = Math.sin(radians) * noisyRadius + centerx;
      const y = Math.cos(radians) * noisyRadius + centery;
      return [x, y];
    });
  }

  // Off-white background
  ctx.fillStyle = new Colour({
    hue: random.degrees(),
    saturation: 30,
    lightness: 95,
  }).toHSL();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Rings
  const baseColour = new Colour({
    hue: random.degrees(),
    saturation: random.scaled(30, 90),
    lightness: 40,
  });
  [...Array(numberOfCircles).keys()].forEach((i) => {
    const radius = max_radius - i * distanceBetweenCircles;
    ctx.fillStyle = baseColour
      .lighten(linearScale(radius, [min_radius, max_radius], [0, 50]))
      .toHSL();
    ctx.beginPath();
    pointsForCircle(radius, [canvas.width / 2, canvas.height / 2]).forEach(
      ([x, y]) => {
        ctx.lineTo(x, y);
      }
    );
    ctx.closePath();
    ctx.fill();
  });

  sign({ sketchName: meta.sketchName, seed })(ctx);
};

export const meta: SketchMeta = {
  sketchName: "1",
  defaultSeed: "0m5a9",
};
