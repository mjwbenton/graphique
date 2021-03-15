import Link from "next/link";

function Sketch({ sketch }: { sketch: string }) {
  return (
    <div className="p-4 border border-blue-500">
      <Link href="/[sketchName]/[seed]" as={`/${sketch}/${sketch}`}>
        <a>{sketch}</a>
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <div className="m-8 space-y-10">
      <h1 className="text-5xl italic underline">Graphique</h1>
      <div className="flex space-x-8">
        <Sketch sketch="1" />
        <Sketch sketch="2" />
        <Sketch sketch="3" />
        <Sketch sketch="4" />
      </div>
    </div>
  );
}
