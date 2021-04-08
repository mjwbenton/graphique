import Colour from "@mattb.tech/graphique-colour";
import { Gradient } from "@mattb.tech/graphique-colour";
import { linearScale } from "@mattb.tech/graphique-maths";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import sign from "@mattb.tech/graphique-sign";
import SimplexNoise from "simplex-noise";

const SKETCH_ID = 6;

export function sketch({
  canvas,
  seed,
}: {
  canvas: HTMLCanvasElement;
  seed: string;
}) {
  resetRandomness(seed);
  const noise = new SimplexNoise(random.next);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
  const waveBaseHeight = canvas.height / 4;
  const wavePoints = canvas.width;
  const maxOffset = waveBaseHeight;

  // Background
  ctx.fillStyle = new Colour({ hue: random.degrees() }).lighten(20).toHSL();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  [...new Array(3).keys()].forEach((i) => {
    const startY = waveBaseHeight * (i + 1);
    const baseColour = new Colour({
      hue: random.degrees(),
      opacity: 0.5,
    });
    baseColour.createTriadPalette().forEach((colour, i) => {
      const palette = colour.createPaletteWith((c) => c.decreaseOpacity(0.5));
      const gradient = new Gradient(ctx, palette.select(0))
        .addColour(palette.select(1), 1)
        .addColour(palette.select(1), -1)
        .spreadOver(-maxOffset * 2, maxOffset * 2)
        .rotate(random.scaled(75, 105))
        .moveTo([0, startY]);

      ctx.fillStyle = gradient.toCanvasGradient();
      ctx.beginPath();
      [...new Array(wavePoints).keys()].forEach((i) => {
        const offset = linearScale(
          noise.noise2D(i * 0.0006, startY),
          [-1, 1],
          [-1 * maxOffset, maxOffset]
        );
        ctx.lineTo(i, startY + offset);
      });
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
    });
  });

  sign(SKETCH_ID, seed)(ctx);
}
