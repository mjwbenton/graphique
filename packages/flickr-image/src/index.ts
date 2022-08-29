import { request, gql } from "graphql-request";
import { loadImage } from "canvas";
import fetch from "cross-fetch";

const ENDPOINT = "https://api.mattb.tech";

const QUERY = gql`
  query FlickrImage($id: ID!) {
    photo(photoId: $id) {
      id
      sources {
        url
        width
        height
      }
    }
  }
`;

export default async function writeFlickrImageToCanvas(
  id: string,
  canvas: HTMLCanvasElement
) {
  const imageUrl = selectUrlFromResponse(
    await request(ENDPOINT, QUERY, { id })
  );
  if (!imageUrl) {
    throw new Error(`Cannot find image with id ${id}`);
  }
  const img = await loadImageData(imageUrl);
  canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function selectUrlFromResponse(response: any): string | undefined {
  return response?.photo?.sources[0]?.url;
}

async function loadImageData(url: string): Promise<CanvasImageSource> {
  if (typeof window !== "undefined") {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve(img);
      };
    });
  } else {
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    return (await loadImage(buffer)) as unknown as CanvasImageSource;
  }
}
