// cSpell:ignore borderless
import { Config } from "tailwindcss";
import { AtRule } from "postcss";
import plugin from "tailwindcss/plugin";
import { PluginUtils } from "tailwindcss/types/config";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";

import { hairlineWidth, platformSelect } from "../theme";
import { darkModeAtRule } from "./dark-mode";
import { color } from "./color";
import { verify } from "./verify";
import { translateX, translateY } from "./translate";
import { shadows } from "./shadows";
import { allowedColors } from "./common";
import { nativeSwitch } from "./switch";

const kebabCase = (str: string) => {
  return str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase(),
  );
};

const nativePlugins = plugin(function ({
  addBase,
  addUtilities,
  addVariant,
  config,
  matchUtilities,
  matchVariant,
  theme,
  ...other
}) {
  const nativePlatforms = ["android", "ios", "windows", "macos"];

  // RN requires the unit, so reset the defaults
  // This is an undocumented feature of Tailwind that allows you to modify the @default layer
  (other as any).addDefaults("transform", {
    "--tw-rotate": "0deg",
    "--tw-skew-x": "0deg",
    "--tw-skew-y": "0deg",
  });

  /**
   * `display-mode` is a valid media query, but the ${platform} values are not.
   *
   * We need to either add a new Media Condition or hijack an existing one,
   * display-mode seems good enough?
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode
   */
  for (const platform of nativePlatforms) {
    addVariant(platform, `@media (display-mode: ${platform})`);
  }

  addVariant(
    "native",
    nativePlatforms.map((platform) => `@media (display-mode: ${platform})`),
  );

  /**
   * The native module requires the `.dark` selector to pickup darkMode variables
   * when using darkMode: 'class'
   *
   * If the user never uses the word 'dark' the selector will never be processed
   * This is an edge case, but one we often encounter in testing (where .dark)
   * will only contain CSS variables and never referenced directly
   */
  config("safelist").push("dark");

  /**
   * Change the visible/invisible classes
   *
   */
  addUtilities({
    ".visible": { opacity: 1 },
    ".invisible": { opacity: 0 },
  } as any);

  addUtilities({
    ".border-continuous": {
      "@rn-move -rn-border-curve border-curve": "true",
      "-rn-border-curve": "continuous",
    },
    ".border-circular": {
      "@rn-move -rn-border-curve border-curve": "true",
      "-rn-border-curve": "circular",
    }
  });

  /**
   * move-[]:
   */
  matchVariant(
    "{}",
    (value = "", { modifier, container }: any) => {
      value = kebabCase(value.replace(/&/, "\\&").replaceAll(".", "\\."));

      if (modifier) {
        modifier = modifier.replace(/&/, "\\&").replaceAll(".", "\\.");
      }

      if (modifier && !value) {
        value = modifier;
        modifier = undefined;
      }

      container.walkRules((rule: any) => {
        rule.append(
          new AtRule({
            name: "rn-move",
            params: `${modifier ?? "\\*"} ${value}`,
          }),
        );
      });
      return `&`;
    },
    { values: { DEFAULT: undefined } },
  );

  /**
   * Native Prop remapping
   */
  addVariant("selection", (({ container }: any) => {
    container.walkRules((rule: any) => {
      rule.append(
        new AtRule({ name: "rn-move", params: "color selectionColor" }),
      );
    });
    return "&";
  }) as any);

  addVariant("placeholder", (({ container }: any) => {
    container.walkRules((rule: any) => {
      rule.append(
        new AtRule({ name: "rn-move", params: "color placeholderTextColor" }),
      );
    });
    return "&";
  }) as any);

  // https://github.com/tailwindlabs/tailwindcss/blob/eb2fe9494b638c3b67194f3ddf3c040f064e060d/src/corePlugins.js#L624-L629
  addUtilities({
    ".pointer-events-none": { "pointer-events": "none" },
    ".pointer-events-auto": { "pointer-events": "auto" },
    ".pointer-events-box-none": { "pointer-events": "box-none" },
    ".pointer-events-box-only": { "pointer-events": "box-only" },
  });

  // https://github.com/tailwindlabs/tailwindcss/blob/eb2fe9494b638c3b67194f3ddf3c040f064e060d/src/corePlugins.js#L729C3-L750C5
  matchUtilities(
    {
      "line-clamp": (value) => ({
        "&": {
          "@rn-move -rn-number-of-lines number-of-lines": "true",
          overflow: "hidden",
          "-rn-number-of-lines": value,
        },
      }),
    },
    { values: theme("lineClamp") },
  );

  addUtilities({
    ".line-clamp-none": {
      "&": {
        "@rn-move -rn-number-of-lines number-of-lines": "true",
        overflow: "visible",
        "-rn-number-of-lines": "0",
      },
    },
  });

  /**
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  matchUtilities(
    {
      ripple: (value) => {
        return {
          "&": {
            "@rn-move color android_ripple\\.color": "true",
            color: toColorValue(value),
          },
        };
      },
    },
    {
      values: flattenColorPalette(theme("rippleColor")),
      type: ["color", "any"],
    },
  );
  matchUtilities(
    {
      ripple: (value) => {
        return {
          "&": {
            "@rn-move -rn-borderless android_ripple\\.borderless": "true",
            "-rn-borderless": value,
          },
        };
      },
    },
    {
      values: {
        borderless: "true",
        bordered: "false",
      },
      type: "any",
    },
  );

  matchUtilities(
    {
      caret: (value) => {
        return {
          "&": {
            "@rn-move caret-color cursor-color": "true",
            "caret-color": toColorValue(value),
          },
        };
      },
    },
    {
      values: flattenColorPalette(theme("caretColor")),
      type: ["color", "any"],
    },
  );

  /**
   * SVG Prop remapping
   */
  matchUtilities(
    {
      fill: (value) => {
        return {
          "&": {
            "@rn-move fill": "true",
            fill: `${toColorValue(value)}`,
          },
        };
      },
    },
    { values: flattenColorPalette(theme("fill")), type: ["color", "any"] },
  );

  matchUtilities(
    {
      stroke: (value) => ({
        "&": {
          "@rn-move stroke": "true",
          stroke: toColorValue(value),
        },
      }),
    },
    { values: flattenColorPalette(theme("stroke")), type: ["color", "any"] },
  );

  matchUtilities(
    {
      stroke: (value) => ({
        "&": {
          "@rn-move stroke-width": "true",
          strokeWidth: toColorValue(value),
        },
      }),
    },
    { values: theme("strokeWidth"), type: ["length", "number", "percentage"] },
  );
});

const preset: Config = {
  content: [],
  theme: {
    extend: {
      borderCurve: {
        continuous: "continuous",
        curve: "curve",
      },
      fontFamily: {
        sans: platformSelect({ android: "san-serif", ios: "'system font'" }),
        serif: platformSelect({ android: "serif", ios: "Georgia" }),
        mono: platformSelect({ android: "mono", ios: "'Courier New'" }),
      },
      elevation: {
        sm: "1",
        DEFAULT: "3",
        md: "6",
        lg: "8",
        xl: "13",
        "2xl": "24",
        none: "0",
      },
      boxShadow: {
        sm: " 0px 1px 1px rgba(0, 0, 0, 0.35)",
        DEFAULT: "0px 1px 4px rgba(0, 0, 0, 0.35)",
        md: "0px 3px 10px rgba(0, 0, 0, 0.35)",
        lg: "0px 4px 10px rgba(0, 0, 0, 0.35)",
        xl: "0px 6px 19px rgba(0, 0, 0, 0.35)",
        "2xl": "0px 12px 38px rgba(0, 0, 0, 0.35) ",
        none: "0 0 #0000",
      },
      translateX: ({ theme }: PluginUtils) => ({
        ...theme("spacing"),
        "1/2": "50rnw",
        "1/3": "33.333333rnw",
        "2/3": "66.666667rnw",
        "1/4": "25rnw",
        "2/4": "50rnw",
        "3/4": "75rnw",
        full: "100rnw",
      }),
      translateY: ({ theme }: PluginUtils) => ({
        ...theme("spacing"),
        "1/2": "50rnh",
        "1/3": "33.333333rnh",
        "2/3": "66.666667rnh",
        "1/4": "25rnh",
        "2/4": "50rnh",
        "3/4": "75rnh",
        full: "100rnh",
      }),
      borderWidth: {
        hairline: hairlineWidth(),
      },
      letterSpacing: {
        tighter: "-0.5px",
        tight: "-0.25px",
        normal: "0px",
        wide: "0.25px",
        wider: "0.5px",
        widest: "1px",
      },
      transitionProperty: {
        DEFAULT:
          "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, perspective, rotate, rotateX, rotateY, rotateZ, scale, scaleX, scaleY, translateX, translateY, skewX, skewY, filter, backdrop-filter",
        all: "background-color, border-bottom-color, border-bottom-left-radius, border-bottom-right-radius, border-bottom-width, border-color, border-left-color, border-left-width, border-radius, border-right-color, border-right-width, border-top-color, border-top-width, border-width, color, fill, font-size, font-weight, gap, letter-spacing, line-height, margin, margin-bottom, margin-left, margin-right, margin-top, object-position, opacity, order, padding, padding-bottom, padding-left, padding-right, padding-top, rotate, scale, stroke, text-decoration, text-decoration-color, perspective, rotate, rotateX, rotateY, rotateZ, scale, scaleX, scaleY, translateX, translateY, skewX, skewY, transform-origin, translate, vertical-align, visibility, word-spacing, z-index",
        transform:
          "perspective, rotate, rotateX, rotateY, rotateZ, scale, scaleX, scaleY, translateX, translateY, skewX, skewY",
      },
      trackColor: allowedColors,
      thumbColor: allowedColors,
      rippleColor: allowedColors,
    },
  },
  plugins: [
    color,
    darkModeAtRule,
    shadows,
    translateX,
    translateY,
    verify,
    nativePlugins,
    nativeSwitch,
  ],
  corePlugins: {
    preflight: false,
    backgroundOpacity: false,
    borderOpacity: false,
    boxShadow: false,
    caretColor: false,
    divideOpacity: false,
    fill: false,
    placeholderColor: false,
    placeholderOpacity: false,
    lineClamp: false,
    ringOpacity: false,
    stroke: false,
    strokeWidth: false,
    textOpacity: false,
    translate: false,
    pointerEvents: false,
    visibility: false,
  },
};

export default preset;
