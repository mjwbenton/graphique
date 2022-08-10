import {
  Controls,
  encodeValuesObject,
  ValuesObject,
} from "@mattb.tech/graphique-controls";

export default function sign({
  sketchName,
  seed,
  controlValues,
}: {
  sketchName: string;
  seed: string;
  controlValues?: ValuesObject<Controls>;
}): (ctx: CanvasRenderingContext2D) => void {
  return (ctx: CanvasRenderingContext2D) => {
    const sign = [
      "mattb",
      sketchName,
      seed,
      ...(controlValues ? [encodeValuesObject(controlValues)] : []),
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
