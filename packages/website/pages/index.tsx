import Link from "next/link";
import Image from "next/image";
import sketches from "@mattb.tech/graphique-sketches";

function Sketch({ sketch }: { sketch: string }) {
  return (
    <div className="relative p-4 mb-8 mr-8 border border-blue-500">
      <Link href="/[sketchName]/[seed]" as={`/${sketch}/${sketch}`}>
        <a>
          <Image
            src={`/thumbnails/${sketch}-thumbnail.png`}
            alt={`Thumbnail for sketch ${sketch}`}
            width={250}
            height={250}
            layout="fixed"
          />
          <div className="absolute bottom-6 left-6 text-3xl font-semibold">
            {sketch}
          </div>
        </a>
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <div className="m-8 space-y-10">
      <h1 className="text-5xl italic underline">Graphique</h1>
      <div className="flex flex-wrap">
        {sketches.map((sketch) => (
          <Sketch sketch={sketch} key={sketch} />
        ))}
      </div>
    </div>
  );
}
