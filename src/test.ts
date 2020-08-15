import { createCanvas } from "canvas";
import { createWriteStream } from "fs";
import seed from "seed-random";
import SimplexNoise from "simplex-noise";

const CANVAS_SIZE = 1000;
const NOISE_MAX = 8.0;
const NOISE_MIN = -5.0;
const RINGS = 10;
const DISTANCE = 8.0;
const LARGEST_RADIUS = 200;

const random = seed("1234sdfdfg");
const noise = new SimplexNoise(random);

function linearScale(
  value: number,
  [currmin, currmax]: [number, number],
  [newmin, newmax]: [number, number]
) {
  const percent = (value - currmin) / (currmax - currmin);
  return (newmax - newmin) * percent + newmin;
}

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
  return [...Array(360).keys()].map((deg) => {
    const noiseIndexDegs = (deg + radius) % 360;
    const radians = deg * (Math.PI / 180);
    console.log({
      deg,
      noise: noiseScale(deg),
    });
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

const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#FFFFFF";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

[...Array(RINGS).keys()].forEach((i) => {
  const radius = LARGEST_RADIUS - i * DISTANCE;
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath();
  pointsForCircle(radius, [CANVAS_SIZE / 2, CANVAS_SIZE / 2]).forEach(
    ([x, y], i, arr) => {
      ctx.lineTo(x, y);
      // Connect back to the first point
      if (i == arr.length - 1) {
        ctx.lineTo(arr[0][0], arr[0][1]);
      }
    }
  );
  ctx.stroke();
});

const output = createWriteStream(`${__dirname}/test.png`);
canvas.createPNGStream().pipe(output);
output.on("finish", () => console.log("Finished!"));
