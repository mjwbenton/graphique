import Link from "next/link";

export default function Home() {
  return (
    <div className="layout">
      <div className="sketch">
        <Link href="/[sketchName]/[seed]" as="/1/1">
          <a>1</a>
        </Link>
      </div>
      <div className="sketch">
        <Link href="/[sketchName]/[seed]" as="/2/2">
          <a>2</a>
        </Link>
      </div>
    </div>
  );
}
