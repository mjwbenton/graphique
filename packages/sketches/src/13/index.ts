import sign from "@mattb.tech/graphique-sign";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import Colour, { Gradient } from "@mattb.tech/graphique-colour";
import { Sketch, SketchMeta } from "../types";
import { int, percentage } from "@mattb.tech/graphique-controls";

const controls = [int("boxes", 30), percentage("fillChance", 0.5)];

export const sketch: Sketch<typeof controls> = async ({
  canvas,
  seed,
  controlValues: { boxes, fillChance },
}) => {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

  const inset = Math.min(canvas.width, canvas.height) / 10;
  const startX =
    canvas.height > canvas.width
      ? inset
      : canvas.width / 2 - (canvas.height - inset * 2) / 2;
  const startY =
    canvas.width > canvas.height
      ? inset
      : canvas.height / 2 - (canvas.width - inset * 2) / 2;
  const boxSize = (inset * 8) / boxes;

  const baseColor = new Colour({
    hue: 0,
    saturation: 0,
    lightness: 10,
  });
  ctx.strokeStyle = baseColor.toHSL();
  ctx.lineWidth = 4;

  const palette = new Colour({ hue: random.degrees() })
    .saturate(20)
    .createTriadPalette();

  [...new Array(boxes)].forEach((_, i) => {
    [...new Array(boxes)].forEach((_, j) => {
      const box = [
        startX + i * boxSize,
        startY + j * boxSize,
        boxSize,
        boxSize,
      ] as const;
      if (random.next() <= fillChance) {
        const selectedColor = palette.selectRandom();
        ctx.fillStyle = new Gradient(ctx, selectedColor)
          .addColour(selectedColor.lighten(random.scaledInt(30, 80)), 1)
          .spreadOver(boxSize * 1.5)
          .rotate(random.scaled(15, 75))
          .moveTo([box[0], box[1]])
          .toCanvasGradient();
        ctx.fillRect(...box);
      }
      ctx.strokeRect(...box);
    });
  });

  ctx.fillStyle = new Gradient(ctx, baseColor.lighten(70))
    .addColour(baseColor.lighten(90), canvas.width)
    .rotate(15)
    .toCanvasGradient();
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, inset * 4, 0, 2 * Math.PI);
  ctx.rect(canvas.width, 0, canvas.width * -1, canvas.height);
  ctx.fill("evenodd");

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, inset * 4, 0, 2 * Math.PI);
  ctx.stroke();

  sign({ meta, seed })(ctx);
};

export const meta: SketchMeta<typeof controls> = {
  sketchName: "13",
  defaultSeed: "pxqoq",
  controls,
};
