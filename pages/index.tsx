import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/[sketchName]/[seed]" as="/1/test">
        <a>1</a>
      </Link>
    </>
  );
}
