import { SketchExport } from "./types";

export function importSketch(sketchName: string): Promise<SketchExport> {
  return import(
    `@mattb.tech/graphique-sketches/sketches/${sketchName}/index.js`
  );
}
