import SimplexNoise from "simplex-noise";
import sign from "@mattb.tech/graphique-sign";
import { degreesToRadians, linearScale } from "@mattb.tech/graphique-maths";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import Colour from "@mattb.tech/graphique-colour";

const SKETCH_ID = 3;

const CIRCLE_POINTS = 720;
const POSITION_OF_SHAPES = [1, 3, 2];
const NUMBER_OF_SHAPES = POSITION_OF_SHAPES.length;
const CIRCLES_PER_SHAPE = [3, 5];

const A = 500;
const SCALING_MAX = 180 ** 2 * A;
const SCALING_MIN = 0;
function noiseScale(degrees: number): number {
  const degFromZero = degrees <= 180 ? degrees : 360 - degrees;
  return Math.min(
    1,
    linearScale(degFromZero ** 2 * A, [SCALING_MIN, SCALING_MAX], [0, A])
  );
}

export function sketch({
  canvas,
  seed,
}: {
  canvas: HTMLCanvasElement;
  seed: string;
}) {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
  const max_radius = Math.min(canvas.height, canvas.width) * 0.2;
  const min_radius = Math.min(canvas.height, canvas.width) * 0.05;
  const noise = new SimplexNoise(random.next);
  const numberOfCircles = Math.floor(
    random.scaled(CIRCLES_PER_SHAPE[0], CIRCLES_PER_SHAPE[1])
  );
  const distanceBetweenCircles = (max_radius - min_radius) / numberOfCircles;
  const maxNoiseOffset = random.scaled(
    distanceBetweenCircles,
    distanceBetweenCircles * 2
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
          noise.noise2D(noiseIndexDegs * 0.06, radius),
          [-1, 1],
          [minNoiseOffset, maxNoiseOffset]
        ) *
          noiseScale(noiseIndexDegs);
      const x = Math.sin(radians) * noisyRadius + centerx;
      const y = Math.cos(radians) * noisyRadius + centery;
      return [x, y];
    });
  }

  const baseColour = new Colour({
    hue: random.degrees(),
    saturation: 50,
    lightness: 50,
  });

  // Off-white background
  ctx.fillStyle = baseColour.lighten(47).toHSL();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const palette = baseColour.saturate(20).createTriadPalette();

  POSITION_OF_SHAPES.forEach((shapePosition) => {
    const wider = canvas.width > canvas.height;
    const centery = wider
      ? canvas.height / 2
      : (canvas.height / (NUMBER_OF_SHAPES + 1)) * shapePosition;
    const centerx = wider
      ? (canvas.width / (NUMBER_OF_SHAPES + 1)) * shapePosition
      : canvas.width / 2;
    const color = palette.next();

    [...Array(numberOfCircles).keys()].forEach((i) => {
      const radius = max_radius - i * distanceBetweenCircles;
      ctx.fillStyle = color
        .lighten(linearScale(radius, [min_radius, max_radius], [0, 30]))
        .toHSL();
      ctx.beginPath();
      pointsForCircle(radius, [centerx, centery]).forEach(([x, y]) => {
        ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fill();
    });
  });

  sign(SKETCH_ID, seed)(ctx);
}
