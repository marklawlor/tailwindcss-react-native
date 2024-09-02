import {
  invalidProperty,
  invalidValue,
  testEachClassName,
} from "../test-utils";

describe("Typography - Font Family", () => {
  testEachClassName([
    ["font-sans", { style: { fontFamily: "system font" } }],
    ["font-serif", { style: { fontFamily: "Georgia" } }],
    ["font-mono", { style: { fontFamily: "Courier New" } }],
  ]);
});

describe("Typography - Font Size", () => {
  testEachClassName([
    ["text-xs", { style: { fontSize: 10.5, lineHeight: 14 } }],
    ["text-base", { style: { fontSize: 14, lineHeight: 21 } }],
  ]);
});

describe("Typography - Font Smoothing", () => {
  testEachClassName([
    [
      "antialiased",
      {
        warning: () =>
          new Map([
            [
              "antialiased",
              [
                {
                  property: "-webkit-font-smoothing",
                  type: "IncompatibleNativeProperty",
                },
                {
                  property: "-moz-osx-font-smoothing",
                  type: "IncompatibleNativeProperty",
                },
              ],
            ],
          ]),
      },
    ],
    [
      "subpixel-antialiased",
      {
        warning: () =>
          new Map([
            [
              "subpixel-antialiased",
              [
                {
                  property: "-webkit-font-smoothing",
                  type: "IncompatibleNativeProperty",
                },
                {
                  property: "-moz-osx-font-smoothing",
                  type: "IncompatibleNativeProperty",
                },
              ],
            ],
          ]),
      },
    ],
  ]);
});

describe("Typography - Font Style", () => {
  testEachClassName([
    ["italic", { style: { fontStyle: "italic" } }],
    ["not-italic", { style: { fontStyle: "normal" } }],
  ]);
});

describe("Typography - Font Weight", () => {
  testEachClassName([
    ["font-thin", { style: { fontWeight: "100" } }],
    ["font-normal", { style: { fontWeight: "400" } }],
    ["font-black", { style: { fontWeight: "900" } }],
  ]);
});

describe("Typography - Font Variant Numeric", () => {
  testEachClassName([
    ["normal-nums", undefined, invalidProperty("font-variant-numeric")],
    ["ordinal", undefined, invalidProperty("font-variant-numeric")],
    ["slashed-zero", undefined, invalidProperty("font-variant-numeric")],
    ["lining-nums", undefined, invalidProperty("font-variant-numeric")],
    ["oldstyle-nums", undefined, invalidProperty("font-variant-numeric")],
    ["proportional-nums", undefined, invalidProperty("font-variant-numeric")],
    ["tabular-nums", undefined, invalidProperty("font-variant-numeric")],
    ["diagonal-fractions", undefined, invalidProperty("font-variant-numeric")],
    ["stacked-fractions", undefined, invalidProperty("font-variant-numeric")],
  ]);
});

describe("Typography - Letter Spacing", () => {
  testEachClassName([
    ["tracking-tighter", { style: { letterSpacing: -0.5 } }],
    ["tracking-tight", { style: { letterSpacing: -0.25 } }],
    ["tracking-normal", { style: { letterSpacing: 0 } }],
    ["tracking-wide", { style: { letterSpacing: 0.25 } }],
    ["tracking-wider", { style: { letterSpacing: 0.5 } }],
    ["tracking-widest", { style: { letterSpacing: 1 } }],
  ]);
});

describe.only("Typography - Line Clamp", () => {
  testEachClassName([
    // [
    //   "line-clamp-1",
    //   { props: { numberOfLines: 1 }, {style:  { overflow: "hidden" }}},
    // ],
    // [
    //   "line-clamp-2",
    //   { props: { numberOfLines: 2 }, {style:  { overflow: "hidden" }}},
    // ],
    // [
    //   "line-clamp-3",
    //   { props: { numberOfLines: 3 }, {style:  { overflow: "hidden" }}},
    // ],
    // [
    //   "line-clamp-4",
    //   { props: { numberOfLines: 4 }, {style:  { overflow: "hidden" }}},
    // ],
    // [
    //   "line-clamp-5",
    //   { props: { numberOfLines: 5 }, {style:  { overflow: "hidden" }}},
    // ],
    // [
    //   "line-clamp-6",
    //   { props: { numberOfLines: 6 }, {style:  { overflow: "hidden" }}},
    // ],
    [
      "line-clamp-none",
      { numberOfLines: 0 },
      { style: { overflow: "visible" } },
    ],
  ]);
});

describe("Typography - Line Height", () => {
  testEachClassName([
    ["leading-3", { style: { lineHeight: 10.5 } }],
    ["leading-4", { style: { lineHeight: 14 } }],
  ]);
});

describe("Typography - List Style Image", () => {
  testEachClassName([
    ["list-image-none", undefined, invalidProperty("list-{style: i}age")],
  ]);
});

describe("Typography - List Style Position", () => {
  testEachClassName([
    ["list-inside", undefined, invalidProperty("list-{style: p}sition")],
    ["list-outside", undefined, invalidProperty("list-{style: p}sition")],
  ]);
});

describe("Typography - List Style Type", () => {
  testEachClassName([
    ["list-none", undefined, invalidProperty("list-{style: t}pe")],
    ["list-disc", undefined, invalidProperty("list-{style: t}pe")],
    ["list-decimal", undefined, invalidProperty("list-{style: t}pe")],
  ]);
});

describe("Typography - Text Align", () => {
  testEachClassName([
    ["text-left", { style: { textAlign: "left" } }],
    ["text-center", { style: { textAlign: "center" } }],
    ["text-right", { style: { textAlign: "right" } }],
    ["text-justify", { style: { textAlign: "justify" } }],
  ]);
});

describe("Typography - Text Color", () => {
  testEachClassName([
    ["text-black", { style: { color: "rgba(0, 0, 0, 1)" } }],
    ["text-white", { style: { color: "rgba(255, 255, 255, 1)" } }],
    ["text-transparent", { style: { color: "rgba(0, 0, 0, 0)" } }],
    ["text-slate-50", { style: { color: "rgba(248, 250, 252, 1)" } }],
    [
      "text-white/50",
      { style: { color: "rgba(255, 255, 255, 0.501960813999176)" } },
    ],
    ["text-current", undefined, invalidValue({ color: "currentcolor" })],
    ["text-inherit", undefined, invalidValue({ color: "inherit" })],
  ]);
});

describe("Typography - Text Decoration", () => {
  testEachClassName([
    ["underline", { style: { textDecorationLine: "underline" } }],
    ["line-through", { style: { textDecorationLine: "line-through" } }],
    ["no-underline", { style: { textDecorationLine: "none" } }],
    [
      "overline",
      undefined,
      invalidValue({ "text-decoration-line": "overline" }),
    ],
  ]);
});

describe("Typography - Text Decoration Color", () => {
  testEachClassName([
    [
      "decoration-black",
      { style: { textDecorationColor: "rgba(0, 0, 0, 1)" } },
    ],
    [
      "decoration-white",
      { style: { textDecorationColor: "rgba(255, 255, 255, 1)" } },
    ],
    [
      "decoration-transparent",
      { style: { textDecorationColor: "rgba(0, 0, 0, 0)" } },
    ],
    [
      "decoration-slate-50",
      { style: { textDecorationColor: "rgba(248, 250, 252, 1)" } },
    ],
    [
      "decoration-current",
      undefined,
      invalidValue({ "text-decoration-color": "currentcolor" }),
    ],
    [
      "decoration-inherit",
      undefined,
      invalidValue({ "text-decoration-color": "inherit" }),
    ],
  ]);
});

describe("Typography - Text Decoration Style", () => {
  testEachClassName([
    ["decoration-solid", { style: { textDecorationStyle: "solid" } }],
    ["decoration-double", { style: { textDecorationStyle: "double" } }],
    ["decoration-dotted", { style: { textDecorationStyle: "dotted" } }],
    ["decoration-dashed", { style: { textDecorationStyle: "dashed" } }],
    [
      "decoration-wavy",
      undefined,
      invalidValue({ "text-decoration-style": "wavy" }),
    ],
  ]);
});

describe("Typography - Text Decoration Thickness", () => {
  testEachClassName([
    [
      "decoration-auto",
      undefined,
      invalidProperty("text-decoration-thickness"),
    ],
    [
      "decoration-from-font",
      undefined,
      invalidProperty("text-decoration-thickness"),
    ],
    ["decoration-0", undefined, invalidProperty("text-decoration-thickness")],
    ["decoration-1", undefined, invalidProperty("text-decoration-thickness")],
  ]);
});

describe("Typography - Text Underline Offset", () => {
  testEachClassName([
    [
      "underline-offset-auto",
      undefined,
      invalidProperty("text-underline-offset"),
    ],
    ["underline-offset-0", undefined, invalidProperty("text-underline-offset")],
  ]);
});

describe("Typography - Text Transform", () => {
  testEachClassName([
    ["uppercase", { style: { textTransform: "uppercase" } }],
    ["lowercase", { style: { textTransform: "lowercase" } }],
    ["capitalize", { style: { textTransform: "capitalize" } }],
    ["normal-case", { style: { textTransform: "none" } }],
  ]);
});

describe("Typography - Text Overflow", () => {
  testEachClassName([
    ["text-ellipsis", undefined, invalidProperty("text-overflow")],
    ["text-clip", undefined, invalidProperty("text-overflow")],
  ]);
});

describe("Typography - Text Indent", () => {
  testEachClassName([
    ["indent-px", undefined, invalidProperty("text-indent")],
    ["indent-0", undefined, invalidProperty("text-indent")],
    ["indent-1", undefined, invalidProperty("text-indent")],
  ]);
});

describe("Typography - Vertical Align", () => {
  testEachClassName([
    [
      "align-baseline",
      undefined,
      invalidValue({ "vertical-align": "baseline" }),
    ],
    ["align-top", { style: { verticalAlign: "top" } }],
    ["align-middle", { style: { verticalAlign: "middle" } }],
    ["align-bottom", { style: { verticalAlign: "bottom" } }],
    [
      "align-text-top",
      undefined,
      invalidValue({ "vertical-align": "text-top" }),
    ],
    [
      "align-text-bottom",
      undefined,
      invalidValue({ "vertical-align": "text-bottom" }),
    ],
    ["align-sub", undefined, invalidValue({ "vertical-align": "sub" })],
    ["align-super", undefined, invalidValue({ "vertical-align": "super" })],
  ]);
});

describe("Typography - Whitespace", () => {
  testEachClassName([
    ["whitespace-normal", undefined, invalidProperty("white-space")],
    ["whitespace-nowrap", undefined, invalidProperty("white-space")],
    ["whitespace-pre", undefined, invalidProperty("white-space")],
    ["whitespace-pre-line", undefined, invalidProperty("white-space")],
    ["whitespace-pre-wrap", undefined, invalidProperty("white-space")],
  ]);
});

describe("Typography - Word Break", () => {
  testEachClassName([
    [
      "break-normal",
      {
        warning: () =>
          new Map([
            [
              "break-normal",
              [
                {
                  property: "overflow-wrap",
                  type: "IncompatibleNativeProperty",
                },
                { property: "word-break", type: "IncompatibleNativeProperty" },
              ],
            ],
          ]),
      },
    ],
    ["break-words", undefined, invalidProperty("overflow-wrap")],
    ["break-all", undefined, invalidProperty("word-break")],
  ]);
});

describe("Typography - Hyphens", () => {
  testEachClassName([
    ["hyphens-none", undefined, invalidProperty("hyphens")],
    ["hyphens-manual", undefined, invalidProperty("hyphens")],
    ["hyphens-auto", undefined, invalidProperty("hyphens")],
  ]);
});

describe("Typography - Content", () => {
  testEachClassName([["content-none", undefined, invalidProperty("content")]]);
});
