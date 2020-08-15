import { createCanvas } from "canvas";
import { createWriteStream } from "fs";
import seed from "seed-random";
import SimplexNoise from "simplex-noise";
import path from "path";

const SKETCH = "1";
const SEED = "cheese";

const random = seed(SEED);
const noise = new SimplexNoise(random);

function linearScale(
  value: number,
  [currmin, currmax]: [number, number],
  [newmin, newmax]: [number, number]
) {
  const percent = (value - currmin) / (currmax - currmin);
  return (newmax - newmin) * percent + newmin;
}

function scaledRandom(min: number, max: number) {
  return linearScale(random(), [0, 1], [min, max]);
}

const CANVAS_SIZE_X = 3000;
const CANVAS_SIZE_Y = 2400;
const LARGEST_RADIUS = 1000;
const CIRCLE_POINTS = 720;
const SMALLEST_RADIUS = 400;
const RINGS = Math.floor(scaledRandom(5, 30));
const DISTANCE = (LARGEST_RADIUS - SMALLEST_RADIUS) / RINGS;
const NOISE_MAX = scaledRandom(DISTANCE / 5, DISTANCE / 0.5);
const NOISE_MIN = NOISE_MAX * -1;

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

function pointsForCircle(
  radius: number,
  [centerx, centery]: [number, number]
): [number, number][] {
  return [...Array(CIRCLE_POINTS).keys()].map((point) => {
    const deg = linearScale(point, [0, CIRCLE_POINTS], [0, 360]);
    const noiseIndexDegs = (deg + radius) % 360;
    const radians = deg * (Math.PI / 180);
    const noisyRadius =
      radius +
      linearScale(
        noise.noise2D(noiseIndexDegs * 0.06, radius),
        [-1, 1],
        [NOISE_MIN, NOISE_MAX]
      ) *
        noiseScale(noiseIndexDegs);
    const x = Math.sin(radians) * noisyRadius + centerx;
    const y = Math.cos(radians) * noisyRadius + centery;
    return [x, y];
  });
}

const canvas = createCanvas(CANVAS_SIZE_X, CANVAS_SIZE_Y);
const ctx = canvas.getContext("2d");

// Off-white background
ctx.fillStyle = `hsl(${scaledRandom(0, 360)}, 30%, 95%)`;
ctx.fillRect(0, 0, CANVAS_SIZE_X, CANVAS_SIZE_Y);

// Rings
const baseColor = scaledRandom(0, 360);
const saturation = scaledRandom(30, 90);
[...Array(RINGS).keys()].forEach((i) => {
  const radius = LARGEST_RADIUS - i * DISTANCE;
  ctx.fillStyle = `hsl(${baseColor}, ${saturation}%, ${linearScale(
    radius,
    [SMALLEST_RADIUS, LARGEST_RADIUS],
    [40, 90]
  )}%)`;
  ctx.beginPath();
  pointsForCircle(radius, [CANVAS_SIZE_X / 2, CANVAS_SIZE_Y / 2]).forEach(
    ([x, y]) => {
      ctx.lineTo(x, y);
    }
  );
  ctx.closePath();
  ctx.fill();
});

// Sign
const sign = `mattb / ${SKETCH} / ${SEED}`;
ctx.font = "40px Fira Code";
ctx.fillStyle = "rgba(0,0,0,0.3)";
const { width } = ctx.measureText(sign);
ctx.fillText(sign, CANVAS_SIZE_X - (50 + width), CANVAS_SIZE_Y - 50);

const output = createWriteStream(
  path.join(__dirname, "..", `${SKETCH}-${SEED}.png`)
);
canvas.createPNGStream().pipe(output);
output.on("finish", () => console.log("Finished!"));
