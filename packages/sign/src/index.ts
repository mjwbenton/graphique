import {
  Controls,
  encodeValuesObject,
  ValuesObject,
} from "@mattb.tech/graphique-controls";

export default function sign({
  meta: { sketchName, controls },
  seed,
  controlValues,
}: {
  meta: { sketchName: string; controls?: Controls | undefined };
  seed: string;
  controlValues?: ValuesObject<Controls>;
}): (ctx: CanvasRenderingContext2D) => void {
  const controlValuesResult =
    controlValues && controls
      ? encodeValuesObject(controls, controlValues)
      : undefined;
  return (ctx: CanvasRenderingContext2D) => {
    const sign = [
      "mattb",
      sketchName,
      seed,
      ...(controlValuesResult?.valid ? [controlValuesResult.result] : []),
    ].join(" / ");
    const devicePixelRatio =
      global?.devicePixelRatio ??
      (typeof window !== "undefined" ? window.devicePixelRatio ?? 1 : 1);
    ctx.font = `${14 * devicePixelRatio}px Consolas, Monaco, monospace`;
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    const { width } = ctx.measureText(sign);
    ctx.fillText(sign, ctx.canvas.width - (20 + width), ctx.canvas.height - 20);
  };
}
