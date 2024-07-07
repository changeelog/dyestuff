#!/usr/bin/env node

import { Color } from "./color";
import { ColorSpace, ColorValue, RGB } from "./types";

class ColorCLI {
  private static readonly commands: Record<string, (args: string[]) => void> = {
    convert: (args: string[]) => ColorCLI.convert(args),
    random: () => ColorCLI.random(),
    help: () => ColorCLI.showHelp(),
    man: () => ColorCLI.showManual(),
  };

  private static readonly colorCodes = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    fg: {
      black: "\x1b[30m",
      red: "\x1b[31m",
      green: "\x1b[32m",
      yellow: "\x1b[33m",
      blue: "\x1b[34m",
      magenta: "\x1b[35m",
      cyan: "\x1b[36m",
      white: "\x1b[37m",
    },
    bg: {
      black: "\x1b[40m",
      red: "\x1b[41m",
      green: "\x1b[42m",
      yellow: "\x1b[43m",
      blue: "\x1b[44m",
      magenta: "\x1b[45m",
      cyan: "\x1b[46m",
      white: "\x1b[47m",
    },
  };

  public static run(args: string[]): void {
    const command = args[2];
    const commandArgs = args.slice(3);

    if (command in this.commands) {
      this.commands[command](commandArgs);
    } else {
      console.log(
        `${this.colorCodes.fg.red}Unknown command. Use "help" to see available commands.${this.colorCodes.reset}`
      );
    }
  }

  private static convert(args: string[]): void {
    if (args.length !== 3) {
      console.log(
        `${this.colorCodes.fg.red}Usage: convert <fromSpace> <toSpace> <colorValue>${this.colorCodes.reset}`
      );
      return;
    }

    const [fromSpace, toSpace, colorValue] = args;

    try {
      const parsedValue = this.parseColorValue(
        colorValue,
        fromSpace as ColorSpace
      );
      const color = new Color(parsedValue, fromSpace as ColorSpace);
      const convertedColor = color.to(toSpace as ColorSpace);
      console.log(
        `${this.colorCodes.fg.green}Converted color: ${this.formatColorValue(
          convertedColor.getValue(),
          convertedColor.getSpace()
        )}${this.colorCodes.reset}`
      );
      this.displayColorSample(convertedColor.getValue() as RGB);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `${this.colorCodes.fg.red}Error: ${error.message}${this.colorCodes.reset}`
        );
      } else {
        console.error(
          `${this.colorCodes.fg.red}An unknown error occurred${this.colorCodes.reset}`
        );
      }
    }
  }

  private static random(): void {
    const randomColor = Color.random();
    console.log(
      `${this.colorCodes.fg.green}Random color: ${this.formatColorValue(
        randomColor.getValue(),
        randomColor.getSpace()
      )}${this.colorCodes.reset}`
    );
    this.displayColorSample(randomColor.getValue() as RGB);
  }

  private static generatePalette(args: string[]): void {
    const count = args.length > 0 ? parseInt(args[0]) : 5;
    const palette = Array.from({ length: count }, () => Color.random());
    console.log(
      `${this.colorCodes.fg.cyan}Generated palette:${this.colorCodes.reset}`
    );
    palette.forEach((color, index) => {
      console.log(
        `  ${index + 1}. ${this.formatColorValue(
          color.getValue(),
          color.getSpace()
        )}`
      );
      this.displayColorSample(color.getValue() as RGB);
    });
  }

  private static analyzeColor(args: string[]): void {
    if (args.length !== 2) {
      console.log(
        `${this.colorCodes.fg.red}Usage: analyze <colorSpace> <colorValue>${this.colorCodes.reset}`
      );
      return;
    }

    const [space, colorValue] = args;
    try {
      const parsedValue = this.parseColorValue(colorValue, space as ColorSpace);
      const color = new Color(parsedValue, space as ColorSpace);
      const rgb = color.to("RGB").getValue() as RGB;
      const hsl = color.to("HSL").getValue() as [number, number, number];
      const hex = color.to("HEX").getValue() as string;

      console.log(
        `${this.colorCodes.fg.cyan}Color Analysis:${this.colorCodes.reset}`
      );
      console.log(
        `  Original: ${this.formatColorValue(parsedValue, space as ColorSpace)}`
      );
      console.log(`  RGB: ${rgb.join(", ")}`);
      console.log(
        `  HSL: ${hsl.map((v, i) => (i === 0 ? `${v}°` : `${v}%`)).join(", ")}`
      );
      console.log(`  HEX: ${hex}`);
      console.log(`  Brightness: ${this.calculateBrightness(rgb)}%`);
      console.log(
        `  Perceived Brightness: ${this.calculatePerceivedBrightness(rgb)}%`
      );
      this.displayColorSample(rgb);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `${this.colorCodes.fg.red}Error: ${error.message}${this.colorCodes.reset}`
        );
      } else {
        console.error(
          `${this.colorCodes.fg.red}An unknown error occurred${this.colorCodes.reset}`
        );
      }
    }
  }

  private static showHelp(): void {
    const helpText = `
${this.colorCodes.fg.yellow}${this.colorCodes.bright}Dyestuff(1)                    User Commands                   Dyestuff(1)${this.colorCodes.reset}

${this.colorCodes.fg.cyan}${this.colorCodes.bright}NAME${this.colorCodes.reset}
       dyestuff - A command-line interface for color conversions and operations

${this.colorCodes.fg.cyan}${this.colorCodes.bright}SYNOPSIS${this.colorCodes.reset}
       dyestuff COMMAND [ARGUMENTS]

${this.colorCodes.fg.cyan}${this.colorCodes.bright}COMMANDS${this.colorCodes.reset}
  ${this.colorCodes.fg.green}convert${this.colorCodes.reset} <fromSpace> <toSpace> <colorValue>
                        Convert a color from one space to another
  ${this.colorCodes.fg.green}random${this.colorCodes.reset}                Generate a random color
  ${this.colorCodes.fg.green}palette${this.colorCodes.reset} [count]       Generate a color palette
  ${this.colorCodes.fg.green}analyze${this.colorCodes.reset} <colorSpace> <colorValue>
                        Analyze a color and display its properties
  ${this.colorCodes.fg.green}help${this.colorCodes.reset}                  Display this help message
  ${this.colorCodes.fg.green}man${this.colorCodes.reset}                   Display the full manual page

${this.colorCodes.fg.cyan}${this.colorCodes.bright}COLOR SPACES${this.colorCodes.reset}
  RGB, RGBA, HSL, HSLA, HSV, CMYK, LAB, LCH, XYZ, OKLCH, HEX, ANSI256, WebColor

${this.colorCodes.fg.cyan}${this.colorCodes.bright}EXAMPLES${this.colorCodes.reset}
  dyestuff convert RGB HEX 255,0,0
  dyestuff random
  dyestuff palette 5
  dyestuff analyze RGB 255,128,0

For more detailed information, use 'dyestuff man'.
`;

    console.log(helpText);
  }

  private static showManual(): void {
    const manPage = `
${this.colorCodes.fg.yellow}${this.colorCodes.bright}Dyestuff(1)                    User Commands                   Dyestuff(1)${this.colorCodes.reset}

${this.colorCodes.fg.cyan}${this.colorCodes.bright}NAME${this.colorCodes.reset}
       dyestuff - A command-line interface for color conversions and operations

${this.colorCodes.fg.cyan}${this.colorCodes.bright}SYNOPSIS${this.colorCodes.reset}
       dyestuff COMMAND [ARGUMENTS]

${this.colorCodes.fg.cyan}${this.colorCodes.bright}DESCRIPTION${this.colorCodes.reset}
       dyestuff is a utility for converting colors between different color spaces
       and performing various color operations.

${this.colorCodes.fg.cyan}${this.colorCodes.bright}COMMANDS${this.colorCodes.reset}
       ${this.colorCodes.fg.green}convert${this.colorCodes.reset} <fromSpace> <toSpace> <colorValue>
              Convert a color from one color space to another.

       ${this.colorCodes.fg.green}random${this.colorCodes.reset}
              Generate a random color.

       ${this.colorCodes.fg.green}palette${this.colorCodes.reset} [count]
              Generate a color palette with the specified number of colors.
              Default count is 5 if not specified.

       ${this.colorCodes.fg.green}analyze${this.colorCodes.reset} <colorSpace> <colorValue>
              Analyze a color and display its properties in various color spaces.

       ${this.colorCodes.fg.green}help${this.colorCodes.reset}
              Display a brief help message.

       ${this.colorCodes.fg.green}man${this.colorCodes.reset}
              Display this manual page.

${this.colorCodes.fg.cyan}${this.colorCodes.bright}COLOR SPACES${this.colorCodes.reset}
       The following color spaces are supported:

       RGB    Red, Green, Blue (0-255 for each channel)
       RGBA   Red, Green, Blue, Alpha (0-255 for RGB, 0-1 for Alpha)
       HSL    Hue (0-360), Saturation (0-100), Lightness (0-100)
       HSLA   Hue, Saturation, Lightness, Alpha (0-1 for Alpha)
       HSV    Hue (0-360), Saturation (0-100), Value (0-100)
       CMYK   Cyan, Magenta, Yellow, Key (0-100 for each channel)
       LAB    L* (0-100), a* (-128 to 127), b* (-128 to 127)
       LCH    Lightness (0-100), Chroma (0-230), Hue (0-360)
       XYZ    X, Y, Z (0-95.047, 0-100, 0-108.883)
       OKLCH  Lightness (0-1), Chroma (0-0.4), Hue (0-360)
       HEX    Hexadecimal representation (#RRGGBB)
       ANSI256 ANSI 256-color code (0-255)
       WebColor Named web colors (e.g., "red", "blue", "coral")

${this.colorCodes.fg.cyan}${this.colorCodes.bright}EXAMPLES${this.colorCodes.reset}
       Convert a color from RGB to HEX:
              dyestuff convert RGB HEX 255,0,0

       Generate a random color:
              dyestuff random

       Generate a palette of 5 colors:
              dyestuff palette 5

       Analyze a color:
              dyestuff analyze RGB 255,128,0

${this.colorCodes.fg.cyan}${this.colorCodes.bright}NOTES${this.colorCodes.reset}
       When inputting color values, use commas to separate multiple values
       within a single color space (e.g., "255,0,0" for RGB).
`;

    console.log(manPage);
  }

  private static parseColorValue(value: string, space: ColorSpace): ColorValue {
    switch (space) {
      case "RGB":
      case "RGBA":
      case "HSL":
      case "HSLA":
      case "HSV":
      case "CMYK":
      case "LAB":
      case "LCH":
      case "XYZ":
      case "OKLCH":
        return value.split(",").map(Number) as ColorValue;
      case "HEX":
      case "WebColor":
        return value;
      case "ANSI256":
        return parseInt(value);
      default:
        throw new Error(`Parsing for ${space} is not implemented`);
    }
  }

  private static formatColorValue(
    value: ColorValue,
    space: ColorSpace
  ): string {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value.toString();
  }

  private static displayColorSample(rgb: RGB): void {
    const [r, g, b] = rgb;
    console.log(
      `${this.colorCodes.bg.black}${this.colorCodes.fg.white}Color sample:${this.colorCodes.reset} \x1b[48;2;${r};${g};${b}m     \x1b[0m`
    );
  }

  private static calculateBrightness(rgb: RGB): number {
    const [r, g, b] = rgb;
    return Math.round(((r + g + b) / (3 * 255)) * 100);
  }

  private static calculatePerceivedBrightness(rgb: RGB): number {
    const [r, g, b] = rgb;
    return Math.round(((0.299 * r + 0.587 * g + 0.114 * b) / 255) * 100);
  }
}

// Run the CLI
ColorCLI.run(process.argv);
