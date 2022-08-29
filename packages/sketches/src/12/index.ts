import { createNoise2D } from "simplex-noise";
import sign from "@mattb.tech/graphique-sign";
import { degreesToRadians, linearScale } from "@mattb.tech/graphique-maths";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import Colour from "@mattb.tech/graphique-colour";
import { Sketch, SketchMeta } from "../types";
import { string, percentage } from "@mattb.tech/graphique-controls";
import writeFlickrImageToCanvas from "@mattb.tech/graphique-flickr-image";

const CIRCLE_POINTS = 360;
const NUMBER_OF_CIRCLES = 12;

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

const controls = [
  string("flickrId", "52248360410"),
  percentage("posX", 0.3),
  percentage("posY", 0.2),
  percentage("maxRadius", 0.15),
];

export const sketch: Sketch<typeof controls> = async ({
  canvas,
  seed,
  controlValues: { flickrId, posX, posY, maxRadius: maxRadiusPercent },
}) => {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
  const maxRadius = maxRadiusPercent * Math.min(canvas.width, canvas.height);
  const minRadius = maxRadius / 3;
  const noise = createNoise2D(random.next);

  const distanceBetweenCircles = (maxRadius - minRadius) / NUMBER_OF_CIRCLES;
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

  await writeFlickrImageToCanvas(flickrId, canvas);

  // Rings
  const baseColour = new Colour({
    hue: random.degrees(),
    saturation: random.scaled(30, 90),
    lightness: 40,
    opacity: 0.2,
  });
  [...Array(NUMBER_OF_CIRCLES).keys()].forEach((i) => {
    const radius = maxRadius - i * distanceBetweenCircles;
    ctx.fillStyle = baseColour
      .lighten(linearScale(radius, [minRadius, maxRadius], [0, 50]))
      .toHSL();
    ctx.beginPath();
    pointsForCircle(radius, [
      canvas.width * posX,
      canvas.height * posY,
    ]).forEach(([x, y]) => {
      ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
  });

  sign({ meta, seed })(ctx);
};

export const meta: SketchMeta<typeof controls> = {
  sketchName: "12",
  defaultSeed: "0mlvw",
  controls,
};
