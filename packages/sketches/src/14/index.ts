import sign from "@mattb.tech/graphique-sign";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import Colour, { Gradient } from "@mattb.tech/graphique-colour";
import { Sketch, SketchMeta } from "../types";
import { degreesToRadians } from "@mattb.tech/graphique-maths";

export const sketch: Sketch = async ({ canvas, seed }) => {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

  const sideLength = random.scaled(150, 400);
  const fillChance = random.scaled(0.1, 0.9);
  const distance = sideLength * random.scaled(0.6, 1.2);
  const start = (sideLength / 2) * -1;
  const xBoxes = Math.ceil(canvas.width / distance) + 1;
  const yBoxes = Math.ceil(canvas.height / distance) + 1;
  const angle = random.scaled(-20, 20);
  const cos = Math.cos(degreesToRadians(angle)) * sideLength;
  const sin = Math.sin(degreesToRadians(angle)) * sideLength;

  const lineColor = new Colour({
    hue: 0,
    saturation: 0,
    lightness: 10,
  });
  ctx.strokeStyle = lineColor.toHSL();
  ctx.lineWidth = random.scaledInt(2, 5);

  const palette1 = new Colour({ hue: random.degrees() })
    .saturate(random.scaled(-10, 40))
    .decreaseOpacity(random.scaled(0, 0.3))
    .createTriadPalette();

  const palette2 = new Colour({ hue: random.degrees() })
    .saturate(random.scaled(-10, 40))
    .decreaseOpacity(random.scaled(0, 0.3))
    .createTriadPalette();

  const palette = palette1.combine(palette2);

  [...new Array(xBoxes)].forEach((_, i) => {
    [...new Array(yBoxes)].forEach((_, j) => {
      const x = start + distance * i;
      const y = start + distance * j;
      ctx.beginPath();
      ctx.lineTo(x, y);
      ctx.lineTo(x + cos, y + sin);
      ctx.lineTo(x + cos + sin, y + sin + cos);
      ctx.lineTo(x + sin, y + cos);
      ctx.closePath();
      if (random.next() <= fillChance) {
        const selectedColor = palette.selectRandom();
        ctx.fillStyle = new Gradient(ctx, selectedColor)
          .addColour(selectedColor.lighten(random.scaledInt(30, 80)), 1)
          .spreadOver(sideLength * 1.5)
          .rotate(random.scaled(15, 75))
          .moveTo([x, y])
          .toCanvasGradient();
        ctx.fill();
      }
      ctx.stroke();
    });
  });

  sign({ meta, seed })(ctx);
};

export const meta: SketchMeta = {
  sketchName: "14",
  defaultSeed: "308ur",
  controls: [],
};
