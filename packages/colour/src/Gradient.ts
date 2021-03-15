import Colour from "./Colour";
import { degreesToRadians, linearScale } from "@mattb.tech/graphique-maths";

export interface GradientColourPoint {
  readonly colour: Colour;
  readonly distance: number;
}

export default class Gradient {
  private colours: Array<GradientColourPoint>;
  private direction: number;

  constructor(
    private readonly ctx: CanvasRenderingContext2D,
    startColour: Colour
  ) {
    this.colours = [{ colour: startColour, distance: 0 }];
    this.direction = 0;
  }

  private normalize(): void {
    this.colours.sort((a, b) => a.distance - b.distance);
  }

  private firstPoint(): GradientColourPoint {
    return this.colours[0];
  }

  private lastPoint(): GradientColourPoint {
    return this.colours[this.colours.length - 1];
  }

  addColour(colour: Colour, distance: number): Gradient {
    this.colours.push({ colour, distance });
    this.normalize();
    return this;
  }

  spreadOver(distanceOrStart: number, maybeEnd?: number): Gradient {
    const start = maybeEnd ? distanceOrStart : 0;
    const end = maybeEnd ? maybeEnd : distanceOrStart;
    this.colours = this.colours.map(({ colour, distance }) => ({
      colour,
      distance: linearScale(
        distance,
        [this.firstPoint().distance, this.lastPoint().distance],
        [start, end]
      ),
    }));
    return this;
  }

  rotate(degrees: number): Gradient {
    this.direction = (this.direction + degrees) % 360;
    return this;
  }

  toCanvasGradient(): CanvasGradient {
    const radians = degreesToRadians(this.direction);
    const cosAtAngle = Math.cos(radians);
    const sinAtAngle = Math.sin(radians);

    const gradient = this.ctx.createLinearGradient(
      cosAtAngle * this.firstPoint().distance,
      sinAtAngle * this.firstPoint().distance,
      cosAtAngle * this.lastPoint().distance,
      sinAtAngle * this.lastPoint().distance
    );

    this.colours.forEach(({ colour, distance }) => {
      gradient.addColorStop(
        linearScale(
          distance,
          [this.firstPoint().distance, this.lastPoint().distance],
          [0, 1]
        ),
        colour.toHSL()
      );
    });

    return gradient;
  }
}
