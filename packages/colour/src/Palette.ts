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

  selectRandom(): Colour {
    return this.colours[random.scaledInt(0, this.colours.length - 1)];
  }
}
