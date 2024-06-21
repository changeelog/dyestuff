import { hexToRgb } from "./hexToRgb";

export function hexToLab(hex: string): [number, number, number] | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  // Convert RGB to XYZ
  let [r, g, b] = rgb.map((x) => {
    x /= 255;
    return x > 0.04045 ? Math.pow((x + 0.055) / 1.055, 2.4) : x / 12.92;
  });

  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  // Convert XYZ to Lab
  [x, y, z] = [x, y, z].map((v) =>
    v > 0.008856 ? Math.pow(v, 1 / 3) : 7.787 * v + 16 / 116
  );

  let L = 116 * y - 16;
  let A = 500 * (x - y);
  let B = 200 * (y - z);

  return [L, A, B];
}
