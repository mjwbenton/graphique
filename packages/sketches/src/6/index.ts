import Colour from "@mattb.tech/graphique-colour";
import { Gradient } from "@mattb.tech/graphique-colour";
import { int, percentage } from "@mattb.tech/graphique-controls";
import { linearScale } from "@mattb.tech/graphique-maths";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import sign from "@mattb.tech/graphique-sign";
import { createNoise2D } from "simplex-noise";
import { Sketch, SketchMeta } from "../types";

const controls = [
  int("waveCount", 3),
  percentage("saturation", 0.5),
  percentage("lightness", 0.5),
] as const;

export const sketch: Sketch<typeof controls> = ({
  canvas,
  seed,
  controlValues,
}) => {
  resetRandomness(seed);
  const noise = createNoise2D(random.next);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
  const waveBaseHeight = canvas.height / (controlValues.waveCount + 1);
  const wavePoints = canvas.width;
  const maxOffset = waveBaseHeight;

  const saturation = controlValues.saturation * 100;
  const lightness = controlValues.lightness * 100;

  // Background
  ctx.fillStyle = new Colour({
    hue: random.degrees(),
    saturation,
    lightness,
  })
    .lighten(100 - lightness * 1.6)
    .toHSL();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  [...new Array(controlValues.waveCount).keys()].forEach((i) => {
    const startY = waveBaseHeight * (i + 1);
    const baseColour = new Colour({
      hue: random.degrees(),
      saturation,
      opacity: 0.5,
      lightness,
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
          noise(i * 0.0006, startY),
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

  sign({ meta, seed, controlValues })(ctx);
};

export const meta: SketchMeta<typeof controls> = {
  sketchName: "6",
  defaultSeed: "2t1vv",
  controls,
};
