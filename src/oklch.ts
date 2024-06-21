function linearSrgbToOklab(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

function oklabToOklch(L: number, a: number, b: number): [number, number, number] {
  const C = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * 180 / Math.PI;
  if (h < 0) h += 360;

  return [L, C, h];
}

function srgbToLinear(x: number): number {
  if (x <= 0.04045) {
      return x / 12.92;
  } else {
      return Math.pow((x + 0.055) / 1.055, 2.4);
  }
}

export function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;

  const r_linear = srgbToLinear(r);
  const g_linear = srgbToLinear(g);
  const b_linear = srgbToLinear(b);

  const [L, a, b_] = linearSrgbToOklab(r_linear, g_linear, b_linear);

  return oklabToOklch(L, a, b_);
}

function oklchToOklab(L: number, C: number, h: number): [number, number, number] {
  const a = C * Math.cos(h * Math.PI / 180);
  const b = C * Math.sin(h * Math.PI / 180);
  return [L, a, b];
}

function oklabToLinearSrgb(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
      +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

function linearToSrgb(x: number): number {
  if (x <= 0.0031308) {
      return 12.92 * x;
  } else {
      return 1.055 * Math.pow(x, 1/2.4) - 0.055;
  }
}

export function oklchToRgb(L: number, C: number, h: number): [number, number, number] {
  const [L_lab, a_lab, b_lab] = oklchToOklab(L, C, h);

  const [r_linear, g_linear, b_linear] = oklabToLinearSrgb(L_lab, a_lab, b_lab);

  const r = Math.round(linearToSrgb(r_linear) * 255);
  const g = Math.round(linearToSrgb(g_linear) * 255);
  const b = Math.round(linearToSrgb(b_linear) * 255);

  return [
      Math.max(0, Math.min(255, r)),
      Math.max(0, Math.min(255, g)),
      Math.max(0, Math.min(255, b))
  ];
}

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}