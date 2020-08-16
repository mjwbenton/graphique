import { useLayoutEffect, useRef } from "react";
import useWindowSize from "./useWindowSize";

export default async function dynamicSketchComponent(
  sketchName: string
): Promise<React.ComponentType<{}>> {
  const { sketch } = await import(
    `@mattb.tech/graphique-sketches/sketches/${sketchName}/index.js`
  );
  return () => {
    const canvasEl = useRef<HTMLCanvasElement>(null);
    const { width, height } = useWindowSize();
    useLayoutEffect(() => {
      const canvas = canvasEl.current!;
      canvas.width = width;
      canvas.height = height;
      sketch({ canvas, seed: "test" });
    });
    return <canvas ref={canvasEl}></canvas>;
  };
}
