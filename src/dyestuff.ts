type RGB = [number, number, number];
type RGBA = [number, number, number, number];
type HSL = [number, number, number];
type HSLA = [number, number, number, number];
type HSV = [number, number, number];
type CMYK = [number, number, number, number];
type LAB = [number, number, number];
type LCH = [number, number, number];
type XYZ = [number, number, number];
type OKLCH = [number, number, number];
type HEX = string;
type ANSI256 = number;
type WebColor = string;

type ColorSpace =
  | "RGB"
  | "RGBA"
  | "HSL"
  | "HSLA"
  | "HSV"
  | "CMYK"
  | "LAB"
  | "LCH"
  | "XYZ"
  | "OKLCH"
  | "HEX"
  | "ANSI256"
  | "WebColor";

type ColorValue =
  | RGB
  | RGBA
  | HSL
  | HSLA
  | HSV
  | CMYK
  | LAB
  | LCH
  | XYZ
  | OKLCH
  | HEX
  | ANSI256
  | WebColor;

class Color {
  private value: ColorValue;
  private space: ColorSpace;

  constructor(value: ColorValue, space: ColorSpace) {
    this.value = value;
    this.space = space;
  }

  public getValue(): ColorValue {
    return this.value;
  }

  public getSpace(): ColorSpace {
    return this.space;
  }

  public to(targetSpace: ColorSpace): Color {
    if (this.space === targetSpace) {
      return this;
    }

    const rgb = this.toRGB();
    const targetValue = ColorConverter.fromRGB(rgb, targetSpace);
    return new Color(targetValue, targetSpace);
  }

  private toRGB(): RGB {
    return ColorConverter.toRGB(this.value, this.space);
  }

  public static fromRGB(rgb: RGB): Color {
    return new Color(rgb, "RGB");
  }

  public static random(): Color {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return Color.fromRGB([r, g, b]);
  }
}

class ColorConverter {
  private static readonly webColors: Record<WebColor, RGB> = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50],
  };

  public static getSupportedSpaces(): ColorSpace[] {
    return [
      "RGB",
      "RGBA",
      "HSL",
      "HSLA",
      "HSV",
      "CMYK",
      "LAB",
      "LCH",
      "XYZ",
      "OKLCH",
      "HEX",
      "ANSI256",
      "WebColor",
    ];
  }

  private static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  public static toRGB(color: ColorValue, space: ColorSpace): RGB {
    switch (space) {
      case "RGB":
        return color as RGB;
      case "RGBA":
        return (color as RGBA).slice(0, 3) as RGB;
      case "HSL":
        return this.hslToRgb(color as HSL);
      case "HSLA":
        return this.hslToRgb((color as HSLA).slice(0, 3) as HSL);
      case "HSV":
        return this.hsvToRgb(color as HSV);
      case "CMYK":
        return this.cmykToRgb(color as CMYK);
      case "LAB":
        return this.labToRgb(color as LAB);
      case "LCH":
        return this.labToRgb(this.lchToLab(color as LCH));
      case "XYZ":
        return this.xyzToRgb(color as XYZ);
      case "OKLCH":
        return this.oklchToRgb(color as OKLCH);
      case "HEX":
        return this.hexToRgb(color as HEX);
      case "ANSI256":
        return this.ansi256ToRgb(color as ANSI256);
      case "WebColor":
        return this.webColors[color as WebColor] || [0, 0, 0];
      default:
        throw new Error(`Unsupported color space: ${space}`);
    }
  }

  public static fromRGB(rgb: RGB, targetSpace: ColorSpace): ColorValue {
    switch (targetSpace) {
      case "RGB":
        return rgb;
      case "RGBA":
        return [...rgb, 1] as RGBA;
      case "HSL":
        return this.rgbToHsl(rgb);
      case "HSLA":
        return [...this.rgbToHsl(rgb), 1] as HSLA;
      case "HSV":
        return this.rgbToHsv(rgb);
      case "CMYK":
        return this.rgbToCmyk(rgb);
      case "LAB":
        return this.rgbToLab(rgb);
      case "LCH":
        return this.labToLch(this.rgbToLab(rgb));
      case "XYZ":
        return this.rgbToXyz(rgb);
      case "OKLCH":
        return this.rgbToOklch(rgb);
      case "HEX":
        return this.rgbToHex(rgb);
      case "ANSI256":
        return this.rgbToAnsi256(rgb);
      case "WebColor":
        return this.findClosestWebColor(rgb);
      default:
        throw new Error(`Unsupported target color space: ${targetSpace}`);
    }
  }

  private static rgbToHex(rgb: RGB): HEX {
    return "#" + rgb.map((x) => x.toString(16).padStart(2, "0")).join("");
  }

  private static hexToRgb(hex: HEX): RGB {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  }

  private static rgbToHsl(rgb: RGB): HSL {
    const [r, g, b] = rgb.map((x) => x / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  private static hslToRgb(hsl: HSL): RGB {
    const [h, s, l] = [hsl[0] / 360, hsl[1] / 100, hsl[2] / 100];
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  private static rgbToCmyk(rgb: RGB): CMYK {
    const [r, g, b] = rgb.map((x) => x / 255);
    const k = 1 - Math.max(r, g, b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;
    return [c * 100, m * 100, y * 100, k * 100];
  }

  private static cmykToRgb(cmyk: CMYK): RGB {
    const [c, m, y, k] = cmyk.map((x) => x / 100);
    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);
    return [Math.round(r), Math.round(g), Math.round(b)];
  }

  private static rgbToHsv(rgb: RGB): HSV {
    const [r, g, b] = rgb.map((x) => x / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max !== min) {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, v * 100];
  }

  private static hsvToRgb(hsv: HSV): RGB {
    const [h, s, v] = [hsv[0] / 360, hsv[1] / 100, hsv[2] / 100];
    let r = 0,
      g = 0,
      b = 0;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        [r, g, b] = [v, t, p];
        break;
      case 1:
        [r, g, b] = [q, v, p];
        break;
      case 2:
        [r, g, b] = [p, v, t];
        break;
      case 3:
        [r, g, b] = [p, q, v];
        break;
      case 4:
        [r, g, b] = [t, p, v];
        break;
      case 5:
        [r, g, b] = [v, p, q];
        break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  private static rgbToLab(rgb: RGB): LAB {
    const [r, g, b] = rgb.map((x) => x / 255);
    let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    let y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    let z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

    [x, y, z] = [x, y, z].map((v) =>
      v > 0.008856 ? Math.pow(v, 1 / 3) : 7.787 * v + 16 / 116
    );

    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b_value = 200 * (y - z);

    return [l, a, b_value];
  }

  private static labToRgb(lab: LAB): RGB {
    let [l, a, b] = lab;
    let y = (l + 16) / 116;
    let x = a / 500 + y;
    let z = y - b / 200;

    [x, y, z] = [x, y, z].map((v) =>
      Math.pow(v, 3) > 0.008856 ? Math.pow(v, 3) : (v - 16 / 116) / 7.787
    );

    const r = x * 3.2404542 - y * 1.5371385 - z * 0.4985314;
    const g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
    const b_value = x * 0.0556434 - y * 0.2040259 + z * 1.0572252;

    return [r, g, b_value].map((v) =>
      Math.round(this.clamp(v, 0, 1) * 255)
    ) as RGB;
  }

  private static rgbToXyz(rgb: RGB): XYZ {
    const [r, g, b] = rgb.map((v) => {
      v /= 255;
      return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
    });

    const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    const z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

    return [x * 100, y * 100, z * 100];
  }

  private static xyzToRgb(xyz: XYZ): RGB {
    let [x, y, z] = xyz.map((v) => v / 100);

    const r = x * 3.2404542 - y * 1.5371385 - z * 0.4985314;
    const g = x * -0.969266 + y * 1.8760108 + z * 0.041556;
    const b = x * 0.0556434 - y * 0.2040259 + z * 1.0572252;

    return [r, g, b].map((v) => {
      v = v > 0.0031308 ? 1.055 * Math.pow(v, 1 / 2.4) - 0.055 : 12.92 * v;
      return Math.round(this.clamp(v, 0, 1) * 255);
    }) as RGB;
  }

  private static labToLch(lab: LAB): LCH {
    const [l, a, b] = lab;
    const c = Math.sqrt(a * a + b * b);
    let h = Math.atan2(b, a) * (180 / Math.PI);
    if (h < 0) {
      h += 360;
    }
    return [l, c, h];
  }

  private static lchToLab(lch: LCH): LAB {
    const [l, c, h] = lch;
    const a = c * Math.cos(h * (Math.PI / 180));
    const b = c * Math.sin(h * (Math.PI / 180));
    return [l, a, b];
  }

  private static rgbToOklch(rgb: RGB): OKLCH {
    const lab = this.rgbToLab(rgb);
    const lch = this.labToLch(lab);
    // Note: this is a simplified conversion, not precise
    return [lch[0] / 100, lch[1] / 100, lch[2]];
  }

  private static oklchToRgb(oklch: OKLCH): RGB {
    // Note: this is a simplified conversion, not precise
    const lch: LCH = [oklch[0] * 100, oklch[1] * 100, oklch[2]];
    const lab = this.lchToLab(lch);
    return this.labToRgb(lab);
  }

  private static rgbToAnsi256(rgb: RGB): ANSI256 {
    const [r, g, b] = rgb;
    if (r === g && g === b) {
      if (r < 8) return 16;
      if (r > 248) return 231;
      return Math.round(((r - 8) / 247) * 24) + 232;
    }
    return (
      16 +
      36 * Math.round((r / 255) * 5) +
      6 * Math.round((g / 255) * 5) +
      Math.round((b / 255) * 5)
    );
  }

  private static ansi256ToRgb(ansi: ANSI256): RGB {
    if (ansi < 16) {
      return [0, 0, 0]; // Simplified: returns black for 0-15
    } else if (ansi >= 232) {
      const c = (ansi - 232) * 10 + 8;
      return [c, c, c];
    } else {
      ansi -= 16;
      const rem = ansi % 36;
      return [
        Math.round((Math.floor(ansi / 36) / 5) * 255),
        Math.round((Math.floor(rem / 6) / 5) * 255),
        Math.round(((rem % 6) / 5) * 255),
      ];
    }
  }

  private static findClosestWebColor(rgb: RGB): WebColor {
    let closestColor = "";
    let minDistance = Infinity;

    for (const [name, webRgb] of Object.entries(this.webColors)) {
      const distance = Math.sqrt(
        Math.pow(rgb[0] - webRgb[0], 2) +
          Math.pow(rgb[1] - webRgb[1], 2) +
          Math.pow(rgb[2] - webRgb[2], 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = name;
      }
    }

    return closestColor as WebColor;
  }
}

class ColorManipulation {
  public static lighten(color: Color, amount: number): Color {
    const hsl = color.to("HSL").getValue() as HSL;
    hsl[2] = Math.min(100, hsl[2] + amount);
    return new Color(hsl, "HSL");
  }

  public static darken(color: Color, amount: number): Color {
    const hsl = color.to("HSL").getValue() as HSL;
    hsl[2] = Math.max(0, hsl[2] - amount);
    return new Color(hsl, "HSL");
  }

  public static saturate(color: Color, amount: number): Color {
    const hsl = color.to("HSL").getValue() as HSL;
    hsl[1] = Math.min(100, hsl[1] + amount);
    return new Color(hsl, "HSL");
  }

  public static desaturate(color: Color, amount: number): Color {
    const hsl = color.to("HSL").getValue() as HSL;
    hsl[1] = Math.max(0, hsl[1] - amount);
    return new Color(hsl, "HSL");
  }

  public static mix(color1: Color, color2: Color, weight: number = 0.5): Color {
    const rgb1 = color1.to("RGB").getValue() as RGB;
    const rgb2 = color2.to("RGB").getValue() as RGB;
    const w = 2 * weight - 1;
    const a = 0; // Add support for alpha channel

    const w1 = (w * a === -1 ? w : (w + a) / (1 + w * a)) + 1;
    const w2 = 1 - w1;

    const mixed: RGB = [
      Math.round(rgb1[0] * w1 + rgb2[0] * w2),
      Math.round(rgb1[1] * w1 + rgb2[1] * w2),
      Math.round(rgb1[2] * w1 + rgb2[2] * w2),
    ];

    return new Color(mixed, "RGB");
  }

  public static complement(color: Color): Color {
    const hsl = color.to("HSL").getValue() as HSL;
    hsl[0] = (hsl[0] + 180) % 360;
    return new Color(hsl, "HSL");
  }

  public static invert(color: Color): Color {
    const rgb = color.to("RGB").getValue() as RGB;
    return new Color(rgb.map((v) => 255 - v) as RGB, "RGB");
  }
}

export { Color, ColorConverter, ColorManipulation };
export type {
  ColorSpace,
  ColorValue,
  RGB,
  HSL,
  HSV,
  CMYK,
  LAB,
  LCH,
  XYZ,
  OKLCH,
  HEX,
  ANSI256,
};
