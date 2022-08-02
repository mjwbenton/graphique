import fs from "fs";
import path from "path";
import { promisify } from "util";

const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

async function generateIndex(): Promise<void> {
  const files = await readdir(__dirname);
  const sketches = files
    .filter((file) => !file.endsWith(".ts"))
    .sort((a, b) => parseInt(a) - parseInt(b));
  await writeFile(
    path.join(__dirname, "index.ts"),
    `
export * from "./importSketch";
export * from "./types";
const SKETCHES= ${JSON.stringify(sketches)};
export default SKETCHES;
    `
  );
}
generateIndex();
