export function rgbToHsl(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const cmax = Math.max(r, g, b);
  const cmin = Math.min(r, g, b);
  const diff = cmax - cmin;

  let h = 0;
  let s = 0;
  let l = (cmax + cmin) / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - cmax - cmin) : diff / (cmax + cmin);

    switch (cmax) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }

    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

export function rgbToHsv(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, v * 100];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return "#" + toHex(r) + toHex(g) + toHex(b);
}

export function rgbToCmyk(
  r: number,
  g: number,
  b: number
): [number, number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return [c * 100, m * 100, y * 100, k * 100];
}

export function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

  return [x * 100, y * 100, z * 100];
}

export function rgbToLab(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  let [x, y, z] = rgbToXyz(r, g, b);

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  const l = 116 * y - 16;
  const a = 500 * (x - y);
  const b2 = 200 * (y - z);

  return [l, a, b2];
}

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

console.log(rgbToOklch(255, 0, 0));

export function rgbToAnsi256(r: number, g: number, b: number): number {
  if (r === g && g === b) {
    if (r < 8) {
      return 16;
    }
    if (r > 248) {
      return 231;
    }
    return Math.round(((r - 8) / 247) * 24) + 232;
  }

  const ansi =
    16 +
    36 * Math.round((r / 255) * 5) +
    6 * Math.round((g / 255) * 5) +
    Math.round((b / 255) * 5);

  return ansi;
}
