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
