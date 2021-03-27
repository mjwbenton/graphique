import sketches from "@mattb.tech/graphique-sketches";
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
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw new Error(err);
    }
  }
  await Promise.all(
    sketches.map(async (sketchId) => {
      const { sketch } = await import(
        `@mattb.tech/graphique-sketches/sketches/${sketchId}`
      );
      const canvas = createCanvas(CANVAS_SIZE_X, CANVAS_SIZE_Y);
      sketch({
        canvas,
        seed: sketchId,
        createCanvas,
      });
      const filename = path.join(
        __dirname,
        "..",
        "thumbnails",
        `${sketchId}-thumbnail.png`
      );
      const output = createWriteStream(filename);
      canvas.createPNGStream().pipe(output);
      output.on("finish", () => console.log(filename));
    })
  );
}
generateThumbnails();
