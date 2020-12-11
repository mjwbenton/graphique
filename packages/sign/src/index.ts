export default function sign(
  sketchId: string | number,
  seed: string
): (ctx: CanvasRenderingContext2D) => void {
  return (ctx: CanvasRenderingContext2D) => {
    const sign = `mattb / ${sketchId} / ${seed}`;
    ctx.font = "14px Consolas, Monaco, monospace";
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    const { width } = ctx.measureText(sign);
    ctx.fillText(sign, ctx.canvas.width - (20 + width), ctx.canvas.height - 20);
  };
}