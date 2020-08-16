import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import dynamicSketchComponent from "../../../src/dynamicSketchComponent";

export default function Sketch() {
  const router = useRouter();
  const { sketchName, seed } = router.query;

  const DynamicSketchComponent = dynamic(
    dynamicSketchComponent(sketchName as string, seed as string),
    {
      ssr: false,
    }
  );

  return (
    <>
      <Head>
        <title>Graphique</title>
      </Head>
      <div
        onClick={() => {
          router.push(
            router.route,
            `/s/${sketchName}/${Math.random().toString(36).substr(2, 5)}`
          );
        }}
      >
        <DynamicSketchComponent />
      </div>
    </>
  );
}
