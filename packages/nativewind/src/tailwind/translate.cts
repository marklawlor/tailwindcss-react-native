import createUtilityPlugin from "tailwindcss/lib/util/createUtilityPlugin";

let cssTransformValue = [
  "translate(var(--tw-translate-x), var(--tw-translate-y))",
  "rotate(var(--tw-rotate))",
  "skewX(var(--tw-skew-x))",
  "skewY(var(--tw-skew-y))",
  "scaleX(var(--tw-scale-x))",
  "scaleY(var(--tw-scale-y))",
].join(" ");

/**
 * React Native doesn't support % values for translate styles.
 * We need to change Tailwindcss to use the `react-native-css-interop` ch and cw units
 */

// This is identical to the core plugin, except it uses the theme value `translateX` instead of `translate`
export const translateX = createUtilityPlugin(
  "translateX",
  [
    [
      [
        "translate-x",
        [
          ["@defaults transform", {}],
          "--tw-translate-x",
          ["transform", cssTransformValue],
        ],
      ],
    ],
  ],
  { supportsNegativeValues: true },
);

// This is identical to the core plugin, except it uses the theme value `translateY` instead of `translate`
export const translateY = createUtilityPlugin(
  "translateY",
  [
    [
      [
        "translate-y",
        [
          ["@defaults transform", {}],
          "--tw-translate-y",
          ["transform", cssTransformValue],
        ],
      ],
    ],
  ],
  { supportsNegativeValues: true },
);
