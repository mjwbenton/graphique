import { Controls, ValuesObject } from "@mattb.tech/graphique-controls";
import {
  importSketch,
  SketchExport,
  SketchMeta,
} from "@mattb.tech/graphique-sketches";
import React, { useState } from "react";
import { useEffect } from "react";
import SketchOnCanvas from "./SketchOnCanvas";

export default function useSketch(sketchName: string): {
  Component: React.ComponentType<{
    controlValues: ValuesObject<Controls>;
    seed: string;
  }>;
  meta: SketchMeta<Controls> | undefined;
} {
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
      ? ({
          controlValues,
          seed,
        }: {
          controlValues: ValuesObject<Controls>;
          seed: string;
        }) => (
          <SketchOnCanvas
            sketch={sketchImport.sketch}
            seed={seed}
            controlValues={controlValues}
          />
        )
      : () => null,
    meta: sketchImport?.meta ?? undefined,
  };
}
