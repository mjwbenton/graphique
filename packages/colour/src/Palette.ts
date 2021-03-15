import Colour from "./Colour";
import random from "@mattb.tech/graphique-random";

export default class Palette {
  private pointer: number;
  constructor(private readonly colours: ReadonlyArray<Colour>) {
    this.pointer = 0;
  }

  next(): Colour {
    const colour = this.colours[this.pointer];
    this.pointer++;
    return colour;
  }

  forEach(callbackfn: (value: Colour, index: number) => void): void {
    this.colours.forEach(callbackfn);
  }

  selectRandom(): Colour {
    return this.select(random.scaledInt(0, this.size() - 1));
  }

  size(): number {
    return this.colours.length;
  }

  select(index: number): Colour {
    if (index >= this.size()) {
      throw new Error(`Index ${index} larger than palette size ${this.size()}`);
    }
    return this.colours[index];
  }
}
