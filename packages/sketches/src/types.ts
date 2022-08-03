import { Controls, ValuesObject } from "@mattb.tech/graphique-controls";

export interface Sketch<T extends Controls = []> {
  (args: {
    canvas: HTMLCanvasElement;
    seed: string;
    createCanvas: (width: number, height: number) => HTMLCanvasElement;
    controlValues: ValuesObject<T>;
  }): void;
}

export interface SketchMeta<T extends Controls = []> {
  sketchName: string;
  defaultSeed: string;
  controls?: T;
}

export interface SketchExport<T extends Controls = []> {
  sketch: Sketch<T>;
  meta: SketchMeta<T>;
}
