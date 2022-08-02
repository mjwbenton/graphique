import Colour from "@mattb.tech/graphique-colour";
import { Gradient } from "@mattb.tech/graphique-colour";
import { linearScale, isOdd } from "@mattb.tech/graphique-maths";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import sign from "@mattb.tech/graphique-sign";
import { createNoise2D } from "simplex-noise";
import { Sketch, SketchMeta } from "../types";

const NUMBER_OF_WAVES = 8;

export const sketch: Sketch = ({ canvas, seed }) => {
  resetRandomness(seed);
  const noise = createNoise2D(random.next);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;
  const waveBaseHeight = canvas.height / (2 * NUMBER_OF_WAVES);
  const wavePoints = canvas.width;
  const maxOffset = waveBaseHeight;

  const palette = new Colour({ hue: random.degrees() }).createTriadPalette();

  // Background
  ctx.fillStyle = palette.next().lighten(20).toHSL();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  [...new Array(NUMBER_OF_WAVES).keys()].forEach((waveNum) => {
    const startY = waveBaseHeight * waveNum;
    const colour = palette.next();
    const gradient = new Gradient(ctx, colour)
      .addColour(colour.lighten(isOdd(waveNum) ? 10 : 25).shiftHue(60), 1)
      .spreadOver(0, canvas.width)
      .rotate(random.scaled(-60, 60))
      .moveTo([0, startY]);

    ctx.fillStyle = gradient.toCanvasGradient();
    ctx.beginPath();
    const offsets = [...new Array(wavePoints).keys()].map((x) =>
      linearScale(
        noise(x * 0.001 ** linearScale(x, [0, wavePoints], [1, 0.8]), startY),
        [-1, 1],
        [0, maxOffset]
      )
    );
    offsets.forEach((offset, i) => {
      ctx.lineTo(i, startY + offset);
    });
    offsets.reverse().forEach((offset, i) => {
      ctx.lineTo(canvas.width - (i - 1), canvas.height - (startY + offset + 1));
    });
    ctx.closePath();
    ctx.fill();
  });

  sign(meta.sketchName, seed)(ctx);
};

export const meta: SketchMeta = {
  sketchName: "7",
  defaultSeed: "py43r",
};
