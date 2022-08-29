import { defaultValuesObject } from "@mattb.tech/graphique-controls";
import sketches, { importSketch } from "@mattb.tech/graphique-sketches";
import { createCanvas } from "canvas";
import { createWriteStream, mkdir } from "fs";
import path from "path";
import { promisify } from "util";

const mkdirPromise = promisify(mkdir);

const CANVAS_SIZE_X = 1000;
const CANVAS_SIZE_Y = 1000;

async function generateThumbnails() {
  try {
    await mkdirPromise(path.join(__dirname, "..", "thumbnails"));
  } catch (err: any) {
    if (err.code !== "EEXIST") {
      throw new Error(err);
    }
  }
  await Promise.all(
    sketches.map(async (sketchName) => {
      const { sketch, meta } = await importSketch(sketchName);
      const canvas = createCanvas(CANVAS_SIZE_X, CANVAS_SIZE_Y);
      await sketch({
        canvas: canvas as any,
        seed: meta.defaultSeed,
        createCanvas: createCanvas as any,
        controlValues: defaultValuesObject(meta.controls),
      });
      const filename = path.join(
        __dirname,
        "..",
        "thumbnails",
        `${sketchName}-thumbnail.png`
      );
      const output = createWriteStream(filename);
      canvas.createPNGStream().pipe(output);
      output.on("finish", () => console.log(filename));
    })
  );
}
generateThumbnails();
