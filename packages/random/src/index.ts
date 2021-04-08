import seedRandom from "seed-random";
import { linearScale } from "@mattb.tech/graphique-maths";

let currentSeed = "DEFAULT";
let source = seedRandom(currentSeed);

export function resetRandomness(seed: string) {
  currentSeed = seed;
  source = seedRandom(currentSeed);
}

export function getSeed() {
  return currentSeed;
}

const scaled = (min: number, max: number) =>
  linearScale(source(), [0, 1], [min, max]);

export default {
  next: () => source(),
  scaled,
  scaledInt: (min: number, max: number) => Math.floor(scaled(min, max + 1)),
  degrees: () => scaled(0, 360),
  percent: () => scaled(0, 100),
};
