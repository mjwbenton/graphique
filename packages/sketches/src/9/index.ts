import Colour from "@mattb.tech/graphique-colour";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import { createNoise2D } from "simplex-noise";
import sign from "@mattb.tech/graphique-sign";
import { linearScale } from "@mattb.tech/graphique-maths";
import { Gradient } from "@mattb.tech/graphique-colour";

const SKETCH_ID = 9;

const NOISE_SCALE_FACTOR = 2.5;

export function sketch({
  canvas,
  seed,
  createCanvas,
}: {
  canvas: HTMLCanvasElement;
  seed: string;
  createCanvas: (width: number, height: number) => HTMLCanvasElement;
}) {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

  // Background
  const backgroundColour = new Colour({ hue: 0, saturation: 0, lightness: 95 });
  ctx.fillStyle = backgroundColour.toHSL();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const unitWidth = canvas.width / 18;
  const centery = canvas.height / 2;
  const radius = 3 * unitWidth;

  const palette = new Colour({ hue: random.degrees() })
    .saturate(30)
    .decreaseOpacity(0.2)
    .darken(30)
    .createTriadPalette();

  const circlePositions = [9, 5, 13];

  circlePositions.forEach((position) => {
    const centerx = unitWidth * position;
    const colour = palette.next();
    ctx.fillStyle = new Gradient(ctx, colour)
      .addColour(colour.lighten(40).shiftHue(20), 1)
      .moveTo([centerx - radius, centery - radius])
      .rotate(45)
      .spreadOver(radius * 2)
      .toCanvasGradient();
    ctx.beginPath();
    ctx.arc(centerx, centery, radius, 0, 2 * Math.PI);
    ctx.fill();
  });

  const noiseGenerator = createNoise2D(random.next);
  const noiseCanvas = createCanvas(
    canvas.width / NOISE_SCALE_FACTOR,
    canvas.height / NOISE_SCALE_FACTOR
  );
  const noiseCtx = noiseCanvas.getContext("2d")!;
  const noiseImage = noiseCtx.createImageData(
    noiseCanvas.width,
    noiseCanvas.height
  );

  const [r, g, b] = backgroundColour.toRBGValues();
  for (let x = 0; x < noiseCanvas.width; x++) {
    for (let y = 0; y < noiseCanvas.height; y++) {
      const index = y * noiseCanvas.width * 4 + x * 4;
      const noise = noiseGenerator(x * 0.15, y * 0.15);
      noiseImage.data[index] = r;
      noiseImage.data[index + 1] = g;
      noiseImage.data[index + 2] = b;
      if (noise > 0.7) {
        const opacity = linearScale(noise, [0.7, 1], [50, 150]);
        noiseImage.data[index + 3] = opacity;
      }
    }
  }

  noiseCtx.putImageData(noiseImage, 0, 0);
  ctx.drawImage(noiseCanvas, 0, 0, canvas.width, canvas.height);

  sign(SKETCH_ID, seed)(ctx);
}
