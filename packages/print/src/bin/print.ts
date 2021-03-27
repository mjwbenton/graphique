#!/usr/bin/env node

import { createCanvas } from "canvas";
import { createWriteStream } from "fs";

const CANVAS_SIZE_X = 3000;
const CANVAS_SIZE_Y = 2400;

const canvas = createCanvas(CANVAS_SIZE_X, CANVAS_SIZE_Y);

const [sketchName, seed] = process.argv.splice(2);
async function main() {
  const { sketch } = await import(
    `@mattb.tech/graphique-sketches/sketches/${sketchName}`
  );
  sketch({
    canvas,
    seed,
    createCanvas,
  });
  const filename = `graphique-${sketchName}-${seed}.png`;
  const output = createWriteStream(filename);
  canvas.createPNGStream().pipe(output);
  output.on("finish", () => console.log(filename));
}
main();
