import sign from "@mattb.tech/graphique-sign";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import { polygonCentroid } from "geometric";
import Colour from "@mattb.tech/graphique-colour";
import { subdivideSpace } from "../2";
import { Gradient } from "@mattb.tech/graphique-colour";
import { Sketch, SketchMeta } from "../types";

const DIVISION_SIZE_X = 350;
const DIVISION_SIZE_Y = 350;
const CIRCLE_MARGIN = 35;
const POINT_BOX_MARGIN = 40;

export const sketch: Sketch = ({ canvas, seed }) => {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

  const baseColour = new Colour({
    hue: random.degrees(),
  });

  // Off-white background
  const backgroundColour = baseColour.desaturate(10).lighten(45);
  ctx.fillStyle = backgroundColour.toHSL();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Use same colour for stroke
  ctx.lineWidth = 3;
  ctx.strokeStyle = backgroundColour.decreaseOpacity(0.2).toHSL();

  // Create gradient for circles.
  // Use the other hues in a triad palette from the background
  const palette = baseColour.desaturate(10).lighten(20).createTriadPalette();
  const gradient = new Gradient(ctx, palette.select(1))
    .addColour(palette.select(2), 1)
    .rotate(45);

  subdivideSpace(
    canvas,
    {
      width: DIVISION_SIZE_X,
      height: DIVISION_SIZE_Y,
    },
    CIRCLE_MARGIN
  ).forEach(({ top, left, bottom, right, width, height }) => {
    const subdivisionCenter = [(left + right) / 2, (top + bottom) / 2];
    ctx.fillStyle = gradient
      .moveTo([left, top])
      .spreadOver(width)
      .toCanvasGradient();
    ctx.beginPath();
    ctx.arc(
      subdivisionCenter[0],
      subdivisionCenter[1],
      width / 2,
      0,
      2 * Math.PI
    );
    ctx.closePath();
    ctx.fill();

    const topLeft: [number, number] = [
      random.scaled(
        left + POINT_BOX_MARGIN,
        left + width / 2 - POINT_BOX_MARGIN
      ),
      random.scaled(
        top + POINT_BOX_MARGIN,
        top + height / 2 - POINT_BOX_MARGIN
      ),
    ];
    const topRight: [number, number] = [
      random.scaled(
        left + width / 2 + POINT_BOX_MARGIN,
        right - POINT_BOX_MARGIN
      ),
      random.scaled(
        top + POINT_BOX_MARGIN,
        top + height / 2 - POINT_BOX_MARGIN
      ),
    ];
    const bottomRight: [number, number] = [
      random.scaled(
        left + width / 2 + POINT_BOX_MARGIN,
        right - POINT_BOX_MARGIN
      ),
      random.scaled(
        top + height / 2 + POINT_BOX_MARGIN,
        bottom - POINT_BOX_MARGIN
      ),
    ];
    const bottomLeft: [number, number] = [
      random.scaled(
        left + POINT_BOX_MARGIN,
        left + width / 2 - POINT_BOX_MARGIN
      ),
      random.scaled(
        top + height / 2 + POINT_BOX_MARGIN,
        bottom - POINT_BOX_MARGIN
      ),
    ];
    ctx.beginPath();
    ctx.lineTo(...topLeft);
    ctx.lineTo(...topRight);
    ctx.lineTo(...bottomRight);
    ctx.lineTo(...bottomLeft);
    ctx.closePath();
    ctx.stroke();

    const polyCenter = polygonCentroid([
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
      topLeft,
    ]);

    ctx.beginPath();
    ctx.lineTo(...topLeft);
    ctx.lineTo(...polyCenter);
    ctx.lineTo(...bottomRight);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(...bottomLeft);
    ctx.lineTo(...polyCenter);
    ctx.lineTo(...topRight);
    ctx.stroke();
  });

  sign({ meta, seed })(ctx);
};

export const meta: SketchMeta = {
  sketchName: "5",
  defaultSeed: "7zztg",
  controls: [],
};
