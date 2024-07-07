import { Color } from "./color";
import { type HSL, type RGB } from "./types";

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

export { ColorManipulation };
