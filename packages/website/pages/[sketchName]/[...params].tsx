import { useRouter } from "next/router";
import { decodeValuesObject } from "@mattb.tech/graphique-controls";
import useEventListener from "@use-it/event-listener";
import { useRef, useState } from "react";
import { useOverlay } from "react-aria";
import useSketch from "../../src/useSketch";
import newSeed from "../../src/newSeed";
import Card from "../../src/Card";

export default function SketchPage() {
  const router = useRouter();
  const { sketchName, params } = router.query;
  const [seed, encodedControls] = params ?? [];
  if (!sketchName || !seed) {
    return null;
  }
  return (
    <SketchPageInner
      sketchName={sketchName as string}
      seed={seed}
      encodedControls={encodedControls}
    />
  );
}

function SketchPageInner({
  sketchName,
  seed,
  encodedControls,
}: {
  sketchName: string;
  seed: string;
  encodedControls?: string | undefined;
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
  const controlValues = encodedControls
    ? decodeValuesObject(encodedControls)
    : undefined;

  useEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === ".") {
      setControlsOpen(!controlsOpen);
    }
  });
  const { Component, meta, defaultControlValues } = useSketch({
    sketchName: sketchName as string,
    seed: seed as string,
    controlValues,
  });

  return (
    <>
      {controlsOpen ? (
        <Card {...overlayProps} className="absolute w-96 bottom-16 right-8">
          {JSON.stringify(controlValues ?? defaultControlValues)}
        </Card>
      ) : null}
      <div
        onClick={() => {
          router.replace(
            router.route,
            `/${sketchName}/${newSeed()}${
              encodedControls ? `/${encodedControls}` : ""
            }`,
            { shallow: true }
          );
        }}
      >
        <Component />
      </div>
    </>
  );
}
