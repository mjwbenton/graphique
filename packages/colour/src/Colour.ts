import Palette from "./Palette";
import convert from "color-convert";

export interface ColourParams {
  readonly hue: number;
  readonly saturation: number;
  readonly lightness: number;
  readonly opacity: number;
}

export default class Colour {
  private readonly hue: number;
  private readonly saturation: number;
  private readonly lightness: number;
  private readonly opacity: number;

  constructor(params: Partial<ColourParams> & Pick<ColourParams, "hue">) {
    this.hue = params.hue;
    this.saturation = params.saturation ?? 50;
    this.lightness = params.lightness ?? 50;
    this.opacity = params.opacity ?? 1;
    if (this.hue > 360 || this.hue < 0) {
      throw new Error(`Invalid hue ${this.hue}`);
    }
    if (this.lightness > 100 || this.lightness < 0) {
      throw new Error(`Invalid lightness ${this.lightness}`);
    }
    if (this.saturation > 100 || this.saturation < 0) {
      throw new Error(`Invalid saturation ${this.saturation}`);
    }
    if (this.opacity > 1 || this.opacity < 0) {
      throw new Error(`Invalid opacity ${this.opacity}`);
    }
  }

  toRBGValues(): [number, number, number] {
    return convert.hsl.rgb([this.hue, this.saturation, this.lightness]);
  }

  toHSL(): string {
    if (this.opacity != 1) {
      return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.opacity})`;
    } else {
      return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
    }
  }

  override(params: Partial<ColourParams>): Colour {
    return new Colour({
      hue: params.hue ?? this.hue,
      saturation: params.saturation ?? this.saturation,
      lightness: params.lightness ?? this.lightness,
      opacity: params.opacity ?? this.opacity,
    });
  }

  shiftHue(amount: number): Colour {
    return this.override({
      hue: addHue(this.hue, amount),
    });
  }

  lighten(amount: number): Colour {
    return this.override({
      lightness: addPercent(this.lightness, amount),
    });
  }

  darken(amount: number): Colour {
    return this.override({
      lightness: addPercent(this.lightness, amount * -1),
    });
  }

  saturate(amount: number): Colour {
    return this.override({
      saturation: addPercent(this.saturation, amount),
    });
  }

  desaturate(amount: number): Colour {
    return this.override({
      saturation: addPercent(this.saturation, amount * -1),
    });
  }

  increaseOpacity(amount: number): Colour {
    return this.override({
      opacity: addOpacity(this.opacity, amount),
    });
  }

  decreaseOpacity(amount: number): Colour {
    return this.override({
      opacity: addOpacity(this.opacity, amount * -1),
    });
  }

  createPaletteWith(
    ...createFuncs: ReadonlyArray<(base: Colour) => Colour>
  ): Palette {
    return new Palette([this, ...createFuncs.map((f) => f(this))]);
  }

  createTriadPalette(): Palette {
    return this.createPaletteWith(
      (c) => c.shiftHue(120),
      (c) => c.shiftHue(240)
    );
  }

  createComplementaryPalette(): Palette {
    return this.createPaletteWith((c) => c.shiftHue(180));
  }
}

function addHue(hue: number, add: number) {
  return (hue + add) % 360;
}

function addPercent(existing: number, add: number) {
  return Math.max(0, Math.min(100, existing + add));
}

function addOpacity(existing: number, add: number) {
  return Math.max(0, Math.min(1, existing + add));
}
