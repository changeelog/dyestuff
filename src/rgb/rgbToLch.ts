import { rgbToLab } from "./rgbToLab";

export function rgbToLch(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  const [l, a, b2] = rgbToLab(r, g, b);
  const c = Math.sqrt(a * a + b2 * b2);
  let h = Math.atan2(b2, a) * (180 / Math.PI);
  if (h < 0) {
    h += 360;
  }
  return [l, c, h];
}
