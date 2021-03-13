import sign from "@mattb.tech/graphique-sign";
import random, { resetRandomness } from "@mattb.tech/graphique-random";
import { polygonCentroid } from "geometric";
import Colour from "@mattb.tech/graphique-colour";

const SKETCH_ID = 2;

const DIVISION_SIZE_X = 200;
const DIVISION_SIZE_Y = 200;
const POINT_BOX_MARGIN = 10;

function subdivideSpace(
  { width: areaWidth, height: areaHeight }: { width: number; height: number },
  {
    width: subdivisionWidth,
    height: subdivisionHeight,
  }: { width: number; height: number },
  margin: number = 0
): {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}[] {
  const numberX = Math.floor(areaWidth / subdivisionWidth);
  const numberY = Math.floor(areaHeight / subdivisionHeight);
  const outerMarginX = (areaWidth % subdivisionWidth) / 2;
  const outerMarginY = (areaHeight % subdivisionHeight) / 2;
  return [...Array(numberY).keys()].flatMap((y) =>
    [...Array(numberX).keys()].map((x) => ({
      top: outerMarginY + margin + subdivisionHeight * y,
      bottom: outerMarginY - margin + subdivisionHeight * (y + 1),
      left: outerMarginX + margin + subdivisionWidth * x,
      right: outerMarginX - margin + subdivisionWidth * (x + 1),
      width: subdivisionWidth,
      height: subdivisionHeight,
    }))
  );
}

export function sketch({
  canvas,
  seed,
}: {
  canvas: HTMLCanvasElement;
  seed: string;
}) {
  resetRandomness(seed);
  const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

  const baseColour = new Colour({
    hue: random.degrees(),
    saturation: 50,
    lightness: 50,
  });

  // Off-white background
  ctx.fillStyle = baseColour.desaturate(10).lighten(45).toHSL();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Use colour complementary to the background colour as stroke colour
  ctx.strokeStyle = baseColour
    .saturate(10)
    .darken(20)
    .createComplementaryPalette()
    .select(1)
    .toHSL();

  subdivideSpace(canvas, {
    width: DIVISION_SIZE_X,
    height: DIVISION_SIZE_Y,
  }).forEach(({ top, left, bottom, right, width, height }) => {
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

    const center = polygonCentroid([
      topLeft,
      topRight,
      bottomRight,
      bottomLeft,
      topLeft,
    ]);

    ctx.beginPath();
    ctx.lineTo(...topLeft);
    ctx.lineTo(...center);
    ctx.lineTo(...bottomRight);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(...bottomLeft);
    ctx.lineTo(...center);
    ctx.lineTo(...topRight);
    ctx.stroke();
  });

  sign(SKETCH_ID, seed)(ctx);
}
