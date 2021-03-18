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
