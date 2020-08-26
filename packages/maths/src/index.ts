export function linearScale(
  value: number,
  [currmin, currmax]: [number, number],
  [newmin, newmax]: [number, number]
) {
  const percent = (value - currmin) / (currmax - currmin);
  return (newmax - newmin) * percent + newmin;
}
