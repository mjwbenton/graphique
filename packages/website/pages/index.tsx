import Link from "next/link";
import Image from "next/image";
import sketches from "@mattb.tech/graphique-sketches";
import Card from "../src/Card";

function Sketch({ sketch }: { sketch: string }) {
  return (
    <Card className="relative mb-8 mr-8">
      <Link href={`/${sketch}`}>
        <a className="flex">
          <Image
            src={`/thumbnails/${sketch}-thumbnail.png`}
            alt={`Thumbnail for sketch ${sketch}`}
            width={250}
            height={250}
            layout="fixed"
            className="bg-white"
          />
          <div className="absolute bottom-4 left-6 text-3xl font-semibold">
            {sketch}
          </div>
        </a>
      </Link>
    </Card>
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
