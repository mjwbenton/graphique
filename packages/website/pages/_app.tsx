import Head from "next/head";
import "../src/styles.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Graphique</title>
      </Head>
      <div className="font-mono">
        <Component {...pageProps} />
      </div>
    </>
  );
}
