import sign from "@mattb.tech/graphique-sign";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import Colour, { Gradient } from "@mattb.tech/graphique-colour";
import { Sketch, SketchMeta } from "../types";
import { degreesToRadians } from "@mattb.tech/graphique-maths";

export const sketch: Sketch = async ({ canvas, seed }) => {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

  const sideLength = random.scaled(30, 100);
  const yDistance = sideLength * random.scaled(0.2, 0.6);
  const xDistance = sideLength * random.scaled(1.1, 3.0);
  const rotation = random.scaled(-45, 45);
  const start = (sideLength / 2) * -1;
  const stacks = Math.ceil(canvas.width / xDistance) + 1;
  const boxes = Math.ceil(canvas.height / yDistance) + 1;
  const startAngle = random.scaled(-20, 20);

  const lineColor = new Colour({
    hue: 0,
    saturation: 0,
    lightness: 10,
  });
  ctx.strokeStyle = lineColor.toHSL();
  ctx.lineWidth = 2;

  ctx.rotate(degreesToRadians(rotation));

  [...new Array(stacks)].forEach((_, i) => {
    const palette = new Colour({ hue: random.degrees() })
      .saturate(random.scaled(-10, 40))
      .decreaseOpacity(random.scaled(0, 0.3))
      .createComplementaryPalette();
    [...new Array(boxes)].forEach((_, j) => {
      const cos = Math.cos(degreesToRadians(startAngle + j * 4)) * sideLength;
      const sin = Math.sin(degreesToRadians(startAngle + j * 4)) * sideLength;
      const x = start + xDistance * i;
      const y = start + yDistance * j;
      ctx.beginPath();
      ctx.lineTo(x, y);
      ctx.lineTo(x + cos, y + sin);
      ctx.lineTo(x + cos + sin, y + sin + cos);
      ctx.lineTo(x + sin, y + cos);
      ctx.closePath();
      const selectedColor = palette.selectRandom();
      ctx.fillStyle = new Gradient(ctx, selectedColor)
        .addColour(selectedColor.lighten(random.scaledInt(30, 80)), 1)
        .spreadOver(sideLength * 1.5)
        .rotate(random.scaled(15, 75))
        .moveTo([x, y])
        .toCanvasGradient();
      ctx.fill();
      ctx.stroke();
    });
  });

  ctx.rotate(degreesToRadians(rotation * -1));

  sign({ meta, seed })(ctx);
};

export const meta: SketchMeta = {
  sketchName: "15",
  defaultSeed: "iiaqw",
  controls: [],
};
