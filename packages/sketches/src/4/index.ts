import Colour from "@mattb.tech/graphique-colour";
import { Gradient } from "@mattb.tech/graphique-colour";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import sign from "@mattb.tech/graphique-sign";
import { percentOf } from "@mattb.tech/graphique-maths";

const SKETCH_ID = 4;

export function sketch({
  canvas,
  seed,
}: {
  canvas: HTMLCanvasElement;
  seed: string;
}) {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
  const sectionHeight = percentOf(canvas.height, 100 / 7);
  const margin = sectionHeight;

  [...new Array(3).keys()].forEach((i) => {
    const startY = sectionHeight * (2 * i + 1);
    const baseColour = new Colour({
      hue: random.degrees(),
      saturation: 70,
      opacity: 0.5,
    });
    const startRotation = random.scaled(60, 120);
    baseColour.createTriadPalette().forEach((colour, i) => {
      const palette = colour.createPaletteWith((c) => c.decreaseOpacity(0.5));
      const gradient = new Gradient(ctx, palette.select(0))
        .addColour(palette.select(1), 1)
        .addColour(palette.select(1), -1)
        .rotate((startRotation + i * 30) % 360)
        .spreadOver(-canvas.width + margin * 2, canvas.width - margin * 2);

      ctx.fillStyle = gradient.toCanvasGradient();
      ctx.strokeStyle = baseColour.darken(10).toHSL();
      ctx.fillRect(
        sectionHeight,
        startY,
        canvas.width - sectionHeight * 2,
        sectionHeight
      );
      ctx.strokeRect(
        sectionHeight,
        startY,
        canvas.width - sectionHeight * 2,
        sectionHeight
      );
    });
  });

  sign(SKETCH_ID, seed)(ctx);
}
