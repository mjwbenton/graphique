import { useRouter } from "next/router";
import SketchPage from "../../src/SketchPage";

export default function SketchWithSeed() {
  const router = useRouter();
  const { sketchName, params } = router.query;
  const [seed, encodedControls] = params ?? [];
  if (!sketchName || !seed) {
    return null;
  }
  return (
    <SketchPage
      sketchName={sketchName as string}
      seed={seed}
      encodedControls={encodedControls}
    />
  );
}
