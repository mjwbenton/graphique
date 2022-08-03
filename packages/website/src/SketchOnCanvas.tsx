import { Controls, ValuesObject } from "@mattb.tech/graphique-controls";
import { Sketch } from "@mattb.tech/graphique-sketches";
import { useLayoutEffect, useRef } from "react";
import useWindowSize from "./useWindowSize";

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export default function SketchOnCanvas<T extends Controls>({
  sketch,
  seed,
  controlValues,
}: {
  sketch: Sketch<T>;
  seed: string;
  controlValues: ValuesObject<T>;
}) {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const { width, height } = useWindowSize();
  const devicePixelRatio = window.devicePixelRatio ?? 1;
  useLayoutEffect(() => {
    const canvas = canvasEl.current!;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    sketch({ canvas, seed, createCanvas, controlValues });
  });
  return <canvas style={{ height, width }} ref={canvasEl}></canvas>;
}
