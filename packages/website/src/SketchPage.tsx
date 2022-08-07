import { decodeValuesObject } from "@mattb.tech/graphique-controls";
import useEventListener from "@use-it/event-listener";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useOverlay } from "react-aria";
import Card from "./Card";
import newSeed from "./newSeed";
import useSketch from "./useSketch";

export default function SketchPage({
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
  const { Component, meta } = useSketch({
    sketchName: sketchName as string,
    seed: seed as string,
    controlValues,
  });

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
            `/${sketchName}/${newSeed()}${
              encodedControls ? `/${encodedControls}` : ""
            }`
          );
        }}
      >
        <Component />
      </div>
    </>
  );
}
