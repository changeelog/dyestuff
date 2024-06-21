export function rgbToOklch(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  let r_linear = r / 255;
  let g_linear = g / 255;
  let b_linear = b / 255;

  r_linear =
    r_linear > 0.04045
      ? Math.pow((r_linear + 0.055) / 1.055, 2.4)
      : r_linear / 12.92;
  g_linear =
    g_linear > 0.04045
      ? Math.pow((g_linear + 0.055) / 1.055, 2.4)
      : g_linear / 12.92;
  b_linear =
    b_linear > 0.04045
      ? Math.pow((b_linear + 0.055) / 1.055, 2.4)
      : b_linear / 12.92;

  // Convert to OKLAB
  const l =
    0.4122214708 * r_linear + 0.5363325363 * g_linear + 0.0514459929 * b_linear;
  const m =
    0.2119034982 * r_linear + 0.6806995451 * g_linear + 0.1073969566 * b_linear;
  const s =
    0.0883024619 * r_linear + 0.2817188376 * g_linear + 0.6299787005 * b_linear;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // Convert to OKLCH
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_oklab = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + b_oklab * b_oklab);
  let h = Math.atan2(b_oklab, a) * (180 / Math.PI);
  if (h < 0) {
    h += 360;
  }

  return [L * 100, C * 100, h];
}
