import { ColorConverter } from "./color-converter";
import { type ColorSpace, type ColorValue, type RGB } from "./types";

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

export { Color };
