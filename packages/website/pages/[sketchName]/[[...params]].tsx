import { useRouter } from "next/router";
import {
  decodeValuesObject,
  defaultValuesObject,
  encodeValuesObject,
} from "@mattb.tech/graphique-controls";
import useEventListener from "@use-it/event-listener";
import { useRef, useState } from "react";
import { useOverlay } from "react-aria";
import useSketch from "../../src/useSketch";
import newSeed from "../../src/newSeed";
import Card from "../../src/Card";

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
      seed={seed}
      encodedControlValues={encodedControlValues}
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
  encodedControlValues?: string | undefined;
}) {
  const router = useRouter();
  const [controlsOpen, setControlsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { overlayProps } = useOverlay(
    {
      isOpen: controlsOpen,
      isDismissable: true,
    },
    ref
  );

  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === ".") {
      setControlsOpen(!controlsOpen);
    }
  });

  const controlValues = encodedControlValues
    ? decodeValuesObject(encodedControlValues)
    : undefined;

  const { Component, meta } = useSketch({
    sketchName,
    seed,
    controlValues,
  });

  // If we don't have a seed we need to redirect to include it in the URL
  // If we don't have control values when this sketch has controls we need to redirect to include it in the URL
  if (meta && (!seed || (!encodedControlValues && meta.controls))) {
    router.replace(
      router.route,
      buildSketchURL({
        sketchName,
        seed: seed ?? meta.defaultSeed,
        encodedControlValues:
          encodedControlValues ??
          encodeValuesObject(defaultValuesObject(meta.controls)),
      })
    );
  }
  return (
    <>
      {controlsOpen ? (
        <Card {...overlayProps} className="absolute w-96 bottom-16 right-8">
          {JSON.stringify(controlValues)}
        </Card>
      ) : null}
      <div
        onClick={() => {
          router.replace(
            router.route,
            buildSketchURL({
              sketchName,
              seed: newSeed(),
              encodedControlValues,
            }),
            { shallow: true }
          );
        }}
      >
        <Component />
      </div>
    </>
  );
}

function buildSketchURL({
  sketchName,
  seed,
  encodedControlValues,
}: {
  sketchName: string;
  seed: string;
  encodedControlValues?: string | undefined;
}) {
  return `/${sketchName}/${seed}${
    encodedControlValues ? `/${encodedControlValues}` : ""
  }`;
}
