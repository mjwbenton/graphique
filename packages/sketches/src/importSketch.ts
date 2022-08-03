import { Controls } from "@mattb.tech/graphique-controls";
import { SketchExport } from "./types";

export function importSketch(
  sketchName: string
): Promise<SketchExport<Controls>> {
  return import(
    `@mattb.tech/graphique-sketches/sketches/${sketchName}/index.js`
  );
}
