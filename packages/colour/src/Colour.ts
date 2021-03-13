import Palette from "./Palette";

export interface ColourParams {
  readonly hue: number;
  readonly saturation: number;
  readonly lightness: number;
}

export default class Colour {
  private readonly hue: number;
  private readonly saturation: number;
  private readonly lightness: number;

  constructor(params: ColourParams) {
    this.hue = params.hue;
    this.saturation = params.saturation;
    this.lightness = params.lightness;
    if (this.hue > 360 || this.hue < 0) {
      throw new Error(`Invalid hue ${this.hue}`);
    }
    if (this.lightness > 100 || this.lightness < 0) {
      throw new Error(`Invalid lightness ${this.lightness}`);
    }
    if (this.saturation > 100 || this.saturation < 0) {
      throw new Error(`Invalid saturation ${this.saturation}`);
    }
  }

  toHSL(): string {
    return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
  }

  override(params: Partial<ColourParams>): Colour {
    return new Colour({
      hue: params.hue ?? this.hue,
      saturation: params.saturation ?? this.saturation,
      lightness: params.lightness ?? this.lightness,
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

  createTriadPalette(): Palette {
    return new Palette([this, this.shiftHue(120), this.shiftHue(240)]);
  }

  createComplementaryPalette(): Palette {
    return new Palette([this, this.shiftHue(180)]);
  }
}

function addHue(hue: number, add: number) {
  return (hue + add) % 360;
}

function addPercent(existing: number, add: number) {
  return Math.max(0, Math.min(existing + add, 100));
}
