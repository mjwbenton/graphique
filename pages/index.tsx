import Link from "next/link";

export default function Home() {
  return (
    <div className="layout">
      <div className="sketch">
        <Link href="/[sketchName]/[seed]" as="/1/test">
          <a>1</a>
        </Link>
      </div>
    </div>
  );
}
