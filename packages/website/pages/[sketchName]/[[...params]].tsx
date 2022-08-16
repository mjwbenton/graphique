import { useRouter } from "next/router";
import {
  decodeValuesObject,
  defaultValuesObjectEncoded,
  ValuesObject,
  Controls,
} from "@mattb.tech/graphique-controls";
import useSketch from "../../src/useSketch";
import newSeed from "../../src/newSeed";
import ControlsOverlay from "../../src/ControlsOverlay";
import visitSketchUrl from "../../src/visitSketchUrl";

export default function SketchPage() {
  const router = useRouter();
  const { sketchName, params } = router.query;
  const [seed, encodedControlValues] = params ?? [];
  if (!sketchName) {
    return null;
  }
  return (
    <SketchPageInner
      sketchName={sketchName as string}
      seed={seed as string | undefined}
      encodedControlValues={encodedControlValues as string | undefined}
    />
  );
}

function SketchPageInner({
  sketchName,
  seed,
  encodedControlValues,
}: {
  sketchName: string;
  seed: string | undefined;
  encodedControlValues: string | undefined;
}) {
  const router = useRouter();
  const { Component, meta } = useSketch(sketchName);

  if (!meta || !Component) {
    return null;
  }

  // If we don't have a seed we need to redirect to include it in the URL
  // If we don't have control values when this sketch has controls we need to redirect to include it in the URL
  if (!seed || (meta.controls.length > 0 && !encodedControlValues)) {
    visitSketchUrl({
      router,
      sketchName,
      seed: seed ?? meta.defaultSeed,
      encodedControlValues:
        encodedControlValues ?? defaultValuesObjectEncoded(meta.controls),
    });
    return null;
  }

  const decodedResult = decodeValuesObject(
    meta.controls,
    encodedControlValues ?? ""
  );
  if (!decodedResult.valid) {
    throw new Error("Invalid control values!");
  }
  const controlValues = decodedResult.result;

  return (
    <>
      {meta.controls ? (
        <ControlsOverlay
          meta={meta}
          seed={seed}
          controlValues={controlValues}
        />
      ) : null}
      <div
        onClick={() => {
          visitSketchUrl({
            router,
            sketchName,
            seed: newSeed(),
            encodedControlValues,
          });
        }}
      >
        <Component controlValues={controlValues} seed={seed} />
      </div>
    </>
  );
}
