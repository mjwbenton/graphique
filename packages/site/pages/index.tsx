import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href="/s/[sketchName]/[seed]" as="/s/1/test">
        <a>1</a>
      </Link>
      <Link href="/s/[sketchName]/[seed]" as="/s/2/123">
        <a>2</a>
      </Link>
    </>
  );
}
