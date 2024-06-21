import { hexToRgb } from "./hexToRgb";

export function hexToHsv(hex: string): [number, number, number] | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  let [r, g, b] = rgb.map((x) => x / 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s,
    v = max;

  let d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  } else {
    if (max === r) {
      h = (g - b) / d + (g < b ? 6 : 0);
    } else if (max === g) {
      h = (b - r) / d + 2;
    } else if (max === b) {
      h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return [h * 360, s * 100, v * 100];
}
