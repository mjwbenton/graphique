import Head from "next/head";
import dynamic from "next/dynamic";
import dynamicSketchComponent from "../src/dynamicSketchComponent";

export default function Home() {
  const DynamicSketchComponent = dynamic(dynamicSketchComponent("1"), {
    ssr: false,
  });

  return (
    <>
      <Head>
        <title>Graphique</title>
      </Head>
      <div>
        <DynamicSketchComponent />
      </div>
    </>
  );
}
