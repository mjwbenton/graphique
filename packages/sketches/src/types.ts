export interface Sketch {
  (args: {
    canvas: HTMLCanvasElement;
    seed: string;
    createCanvas: (width: number, height: number) => HTMLCanvasElement;
  }): void;
}

export interface SketchMeta {
  sketchName: string;
  defaultSeed: string;
}

export interface SketchExport {
  sketch: Sketch;
  meta: SketchMeta;
}
