import {
  Controls,
  defaultValuesObject,
  ValuesObject,
} from "@mattb.tech/graphique-controls";
import { importSketch, SketchExport } from "@mattb.tech/graphique-sketches";
import React, { useState } from "react";
import { useEffect } from "react";
import SketchOnCanvas from "./SketchOnCanvas";

export default function useSketch({
  sketchName,
  seed,
  controlValues,
}: {
  sketchName: string;
  seed: string;
  controlValues?: ValuesObject<Controls> | undefined;
}): { Component: React.ComponentType<{}>; meta: any } {
  const [sketchImport, setSketchImport] =
    useState<SketchExport<Controls> | null>(null);

  useEffect(() => {
    (async () => {
      const { sketch, meta } = await importSketch(sketchName);
      setSketchImport({ sketch, meta });
    })();
  }, [sketchName]);

  return {
    Component: sketchImport
      ? () => (
          <SketchOnCanvas
            sketch={sketchImport.sketch}
            seed={seed}
            controlValues={
              controlValues ??
              defaultValuesObject(sketchImport.meta.controls ?? [])
            }
          />
        )
      : () => null,
    meta: sketchImport?.meta ?? {},
  };
}
