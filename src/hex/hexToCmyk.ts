import { hexToRgb } from "./hexToRgb";

export function hexToCmyk(
  hex: string
): [number, number, number, number] | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  let [r, g, b] = rgb.map((x) => x / 255);
  let k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 1];
  let c = (1 - r - k) / (1 - k);
  let m = (1 - g - k) / (1 - k);
  let y = (1 - b - k) / (1 - k);
  return [c, m, y, k];
}
