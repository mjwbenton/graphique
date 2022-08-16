#!/usr/bin/env node

import {
  command,
  positional,
  binary,
  run,
  option,
  number,
  string,
} from "cmd-ts";
import { createCanvas } from "canvas";
import { createWriteStream } from "fs";
import { importSketch } from "@mattb.tech/graphique-sketches";
import { defaultValuesObject } from "@mattb.tech/graphique-controls";

const DEFAULT_W = 3000;
const DEFAULT_H = 3000;

const app = command({
  name: "graphique-print",
  args: {
    sketch: positional({ type: string }),
    seed: positional({ type: string }),
    width: option({
      type: number,
      long: "width",
      short: "w",
      defaultValue: () => DEFAULT_W,
    }),
    height: option({
      type: number,
      long: "height",
      short: "h",
      defaultValue: () => DEFAULT_H,
    }),
    devicePixelRatio: option({
      type: number,
      long: "device-pixel-ratio",
      short: "dp",
      defaultValue: () => 1,
    }),
  },
  async handler({ sketch: sketchName, seed, width, height, devicePixelRatio }) {
    global.devicePixelRatio = devicePixelRatio;
    const canvas = createCanvas(width, height);
    const { sketch, meta } = await importSketch(sketchName);
    sketch({
      canvas: canvas as any,
      seed,
      createCanvas: createCanvas as any,
      controlValues: defaultValuesObject(meta.controls),
    });
    const filename = `graphique-${sketchName}-${seed}.png`;
    const output = createWriteStream(filename);
    canvas.createPNGStream().pipe(output);
    output.on("finish", () => console.log(filename));
  },
});

run(binary(app), process.argv);
