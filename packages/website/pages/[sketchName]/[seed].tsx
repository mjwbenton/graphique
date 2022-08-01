import useEventListener from "@use-it/event-listener";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useOverlay } from "react-aria";
import Card from "../../src/Card";
import useSketch from "../../src/useSketch";

function Sketch({ sketchName, seed }: { sketchName: string; seed: string }) {
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
  const { Component, meta } = useSketch({
    sketchName: sketchName as string,
    seed: seed as string,
  });

  return (
    <>
      {controlsOpen ? (
        <Card {...overlayProps} className="absolute w-96 bottom-12 right-4">
          {JSON.stringify(meta)}
        </Card>
      ) : null}
      <div
        onClick={() => {
          router.replace(
            router.route,
            `/${sketchName}/${Math.random().toString(36).substr(2, 5)}`
          );
        }}
      >
        <Component />
      </div>
    </>
  );
}

export default function SketchPage() {
  const router = useRouter();
  const { sketchName, seed } = router.query;
  if (!sketchName || !seed) {
    return null;
  }
  return <Sketch sketchName={sketchName as string} seed={seed as string} />;
}
