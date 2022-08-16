import { NextRouter } from "next/router";

export default function visitSketchUrl({
  router,
  sketchName,
  seed,
  encodedControlValues,
}: {
  router: NextRouter;
  sketchName: string;
  seed: string;
  encodedControlValues?: string | undefined;
}) {
  router.replace(
    router.route,
    `/${sketchName}/${seed}${
      encodedControlValues ? `/${encodedControlValues}` : ""
    }`,
    { shallow: true }
  );
}
