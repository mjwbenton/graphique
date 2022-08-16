import {
  Controls,
  encodeValuesObject,
  ValuesObject,
} from "@mattb.tech/graphique-controls";
import { SketchMeta } from "@mattb.tech/graphique-sketches";
import useEventListener from "@use-it/event-listener";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useOverlay } from "react-aria";
import Card from "./Card";
import visitSketchUrl from "./visitSketchUrl";

export default function ControlsOverlay({
  meta,
  seed,
  controlValues,
}: {
  meta: SketchMeta<Controls>;
  seed: string;
  controlValues: ValuesObject<Controls>;
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

  return controlsOpen ? (
    <Card
      ref={ref}
      {...overlayProps}
      className="absolute w-96 bottom-16 right-8"
    >
      <textarea
        className="w-full bg-orange-100"
        onChange={(e) => {
          try {
            const newEncodedControlValues = encodeValuesObject(
              meta.controls!,
              JSON.parse(e.target.value)
            );
            if (newEncodedControlValues.valid) {
              visitSketchUrl({
                router,
                sketchName: meta.sketchName,
                seed,
                encodedControlValues: newEncodedControlValues.result,
              });
            }
          } catch {
            console.error(`Cannot encode values object: ${e.target.value}`);
          }
        }}
      >
        {JSON.stringify(controlValues)}
      </textarea>
    </Card>
  ) : null;
}
