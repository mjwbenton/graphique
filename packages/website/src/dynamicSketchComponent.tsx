import { useLayoutEffect, useRef } from "react";
import useWindowSize from "./useWindowSize";

export default async function dynamicSketchComponent(
  sketchName: string,
  seed: string
): Promise<React.ComponentType<{}>> {
  const { sketch } = await import(
    `@mattb.tech/graphique-sketches/sketches/${sketchName}/index.js`
  );
  return () => {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const { width, height } = useWindowSize();
    const devicePixelRatio = window.devicePixelRatio ?? 1;
    useLayoutEffect(() => {
      const canvas = canvasEl.current!;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      sketch({ canvas, seed });
    });
    return <canvas style={{ height, width }} ref={canvasEl}></canvas>;
  };
}
