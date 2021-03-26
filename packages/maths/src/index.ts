export function linearScale(
  value: number,
  [currmin, currmax]: [number, number],
  [newmin, newmax]: [number, number]
) {
  const percent = (value - currmin) / (currmax - currmin);
  return (newmax - newmin) * percent + newmin;
}

export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function addPercentTo(value: number, percent: number): number {
  return value + value * (percent / 100);
}

export function subtractPercentFrom(value: number, percent: number): number {
  return addPercentTo(value, percent * -1);
}

export function percentOf(value: number, percent: number): number {
  return value * (percent / 100);
}

export function isOdd(value: number): boolean {
  return value % 2 === 1;
}

export function isEven(value: number): boolean {
  return value % 2 === 0;
}

/*
 * Find the angle of the vector between two points.
 * The same as `arc()` 0 degrees is a horizontal line right.
 */
export function angleBetween(p0: [number, number], p1: [number, number]) {
  const offset = p1[0] < p0[0] ? 180 : 360;
  return (
    (radiansToDegrees(Math.atan((p1[1] - p0[1]) / (p1[0] - p0[0]))) + offset) %
    360
  );
}
