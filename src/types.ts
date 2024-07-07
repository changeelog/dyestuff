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

export type {
  ColorSpace,
  ColorValue,
  RGB,
  RGBA,
  HSL,
  HSLA,
  HSV,
  CMYK,
  LAB,
  LCH,
  XYZ,
  OKLCH,
  HEX,
  ANSI256,
  WebColor,
};

