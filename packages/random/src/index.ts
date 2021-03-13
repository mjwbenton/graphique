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

export default {
  next: source,
  scaled: (min: number, max: number) =>
    linearScale(source(), [0, 1], [min, max]),
  scaledInt: (min: number, max: number) =>
    Math.floor(linearScale(source(), [0, 1], [min, max + 1])),
};
