import { importSketch } from "@mattb.tech/graphique-sketches";
import React, { useState } from "react";
import { useEffect } from "react";
import SketchOnCanvas from "./SketchOnCanvas";

export default function useSketch({
  sketchName,
  seed,
}: {
  sketchName: string;
  seed: string;
}): { Component: React.ComponentType<{}>; meta: any } {
  const [sketchImport, setSketchImport] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { sketch, meta } = await importSketch(sketchName);
      setSketchImport({ sketch, meta });
    })();
  }, [sketchName]);

  return {
    Component: sketchImport?.sketch
      ? () => <SketchOnCanvas sketch={sketchImport.sketch} seed={seed} />
      : () => null,
    meta: sketchImport?.meta ?? {},
  };
}
