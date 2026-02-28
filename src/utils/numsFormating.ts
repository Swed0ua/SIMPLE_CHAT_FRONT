export function randomNumber(
  min: number,
  max: number,
  isFloat: boolean = true,
): number {
  const randomValue = Math.random() * (max - min) + min;
  if (isFloat) {
    return randomValue;
  }
  return Math.floor(randomValue);
}
