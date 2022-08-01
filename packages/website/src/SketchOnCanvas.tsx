import { useLayoutEffect, useRef } from "react";
import useWindowSize from "./useWindowSize";

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export default function SketchOnCanvas({
  sketch,
  seed,
}: {
  sketch: any;
  seed: string;
}) {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { width, height } = useWindowSize();
  const devicePixelRatio = window.devicePixelRatio ?? 1;
  useLayoutEffect(() => {
    const canvas = canvasEl.current!;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    sketch({ canvas, seed, createCanvas });
  });
  return <canvas style={{ height, width }} ref={canvasEl}></canvas>;
}
