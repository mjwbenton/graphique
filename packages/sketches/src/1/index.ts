import seedRandom from "seed-random";
import SimplexNoise from "simplex-noise";
import sign from "@mattb.tech/graphique-sign";

const SKETCH_ID = 1;

const CIRCLE_POINTS = 720;

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

export function sketch({
  canvas,
  seed,
}: {
  canvas: HTMLCanvasElement;
  seed: string;
}) {
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
  const max_radius = Math.min(canvas.height, canvas.width) * 0.45;
  const min_radius = Math.min(canvas.height, canvas.width) * 0.2;
  const random = seedRandom(seed);
  const noise = new SimplexNoise(random);

  function scaledRandom(min: number, max: number) {
    return linearScale(random(), [0, 1], [min, max]);
  }

  const numberOfCircles = Math.floor(scaledRandom(5, 30));
  const distanceBetweenCircles = (max_radius - min_radius) / numberOfCircles;
  const maxNoiseOffset = scaledRandom(
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
      const radians = deg * (Math.PI / 180);
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

  // Off-white background
  ctx.fillStyle = `hsl(${scaledRandom(0, 360)}, 30%, 95%)`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Rings
  const baseColor = scaledRandom(0, 360);
  const saturation = scaledRandom(30, 90);
  [...Array(numberOfCircles).keys()].forEach((i) => {
    const radius = max_radius - i * distanceBetweenCircles;
    ctx.fillStyle = `hsl(${baseColor}, ${saturation}%, ${linearScale(
      radius,
      [min_radius, max_radius],
      [40, 90]
    )}%)`;
    ctx.beginPath();
    pointsForCircle(radius, [canvas.width / 2, canvas.height / 2]).forEach(
      ([x, y]) => {
        ctx.lineTo(x, y);
      }
    );
    ctx.closePath();
    ctx.fill();
  });

  sign(SKETCH_ID, seed)(ctx);
}
