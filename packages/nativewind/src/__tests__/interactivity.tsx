import { invalidProperty, testEachClassName } from "../test-utils";

describe("Interactivity - Accent Color", () => {
  testEachClassName([
    ["accent-inherit", undefined, invalidProperty("accent-color")],
    ["accent-current", undefined, invalidProperty("accent-color")],
    ["accent-white", undefined, invalidProperty("accent-color")],
  ]);
});

describe("Interactivity - Appearance", () => {
  testEachClassName([["appearance-none", undefined, invalidProperty("appearance")]]);
});

describe("Interactivity - Cursor", () => {
  testEachClassName([
    ["cursor-auto", undefined, invalidProperty("cursor")],
    ["cursor-default", undefined, invalidProperty("cursor")],
    ["cursor-default", undefined, invalidProperty("cursor")],
  ]);
});

describe("Interactivity - Caret Color", () => {
  testEachClassName([
    // ["caret-inherit", undefined, invalidProperty("caret-color")],
    // ["caret-current", undefined, invalidProperty("caret-color")],
    ["caret-white", { cursorColor: "rgba(255, 255, 255, 1)" }],
  ]);
});

describe("Interactivity - Pointer Events", () => {
  testEachClassName([
    ["pointer-events-none", { style: { pointerEvents: "none" } }],
    ["pointer-events-auto", { style: { pointerEvents: "auto" } }],
    ["pointer-events-box-none", { style: { pointerEvents: "box-none" } }],
    ["pointer-events-box-only", { style: { pointerEvents: "box-only" } }],
  ]);
});

describe("Interactivity - Resize", () => {
  testEachClassName([
    ["resize-none", undefined, invalidProperty("resize")],
    ["resize-y", undefined, invalidProperty("resize")],
    ["resize-x", undefined, invalidProperty("resize")],
    ["resize", undefined, invalidProperty("resize")],
  ]);
});

describe("Interactivity - Scroll Behavior", () => {
  testEachClassName([
    ["scroll-auto", undefined, invalidProperty("scroll-behavior")],
    ["scroll-smooth", undefined, invalidProperty("scroll-behavior")],
  ]);
});

describe("Interactivity - Scroll Margin", () => {
  testEachClassName([
    ["scroll-m-0", undefined, invalidProperty("scroll-margin")],
    [
      "scroll-mx-0",
      undefined,
      invalidProperty("scroll-margin-left", "scroll-margin-right"),
    ],
    [
      "scroll-my-0",
      undefined,
      invalidProperty("scroll-margin-top", "scroll-margin-bottom"),
    ],
    ["scroll-mt-0", undefined, invalidProperty("scroll-margin-top")],
    ["scroll-mr-0", undefined, invalidProperty("scroll-margin-right")],
    ["scroll-mb-0", undefined, invalidProperty("scroll-margin-bottom")],
    ["scroll-ml-0", undefined, invalidProperty("scroll-margin-left")],
    ["scroll-ms-0", undefined, invalidProperty("scroll-margin-inline-start")],
    ["scroll-me-0", undefined, invalidProperty("scroll-margin-inline-end")],
    ["scroll-m-px", undefined, invalidProperty("scroll-margin")],
    [
      "scroll-mx-px",
      undefined,
      invalidProperty("scroll-margin-left", "scroll-margin-right"),
    ],
    [
      "scroll-my-px",
      undefined,
      invalidProperty("scroll-margin-top", "scroll-margin-bottom"),
    ],
    ["scroll-mt-px", undefined, invalidProperty("scroll-margin-top")],
    ["scroll-mr-px", undefined, invalidProperty("scroll-margin-right")],
    ["scroll-mb-px", undefined, invalidProperty("scroll-margin-bottom")],
    ["scroll-ml-px", undefined, invalidProperty("scroll-margin-left")],
    ["scroll-ms-px", undefined, invalidProperty("scroll-margin-inline-start")],
    ["scroll-me-px", undefined, invalidProperty("scroll-margin-inline-end")],
  ]);
});

describe("Interactivity - Scroll Padding", () => {
  testEachClassName([
    ["scroll-p-0", undefined, invalidProperty("scroll-padding")],
    [
      "scroll-px-0",
      undefined,
      invalidProperty("scroll-padding-left", "scroll-padding-right"),
    ],
    [
      "scroll-py-0",
      undefined,
      invalidProperty("scroll-padding-top", "scroll-padding-bottom"),
    ],
    ["scroll-pt-0", undefined, invalidProperty("scroll-padding-top")],
    ["scroll-pr-0", undefined, invalidProperty("scroll-padding-right")],
    ["scroll-pb-0", undefined, invalidProperty("scroll-padding-bottom")],
    ["scroll-pl-0", undefined, invalidProperty("scroll-padding-left")],
    ["scroll-ps-0", undefined, invalidProperty("scroll-padding-inline-start")],
    ["scroll-pe-0", undefined, invalidProperty("scroll-padding-inline-end")],
    ["scroll-p-px", undefined, invalidProperty("scroll-padding")],
    [
      "scroll-px-px",
      undefined,
      invalidProperty("scroll-padding-left", "scroll-padding-right"),
    ],
    [
      "scroll-py-px",
      undefined,
      invalidProperty("scroll-padding-top", "scroll-padding-bottom"),
    ],
    ["scroll-pt-px", undefined, invalidProperty("scroll-padding-top")],
    ["scroll-pr-px", undefined, invalidProperty("scroll-padding-right")],
    ["scroll-pb-px", undefined, invalidProperty("scroll-padding-bottom")],
    ["scroll-pl-px", undefined, invalidProperty("scroll-padding-left")],
    ["scroll-ps-px", undefined, invalidProperty("scroll-padding-inline-start")],
    ["scroll-pe-px", undefined, invalidProperty("scroll-padding-inline-end")],
  ]);
});

describe("Interactivity - Scroll Snap Align", () => {
  testEachClassName([
    ["snap-start", undefined, invalidProperty("scroll-snap-align")],
    ["snap-end", undefined, invalidProperty("scroll-snap-align")],
    ["snap-center", undefined, invalidProperty("scroll-snap-align")],
    ["snap-align-none", undefined, invalidProperty("scroll-snap-align")],
  ]);
});

describe("Interactivity - Scroll Snap Stop", () => {
  testEachClassName([
    ["snap-normal", undefined, invalidProperty("scroll-snap-stop")],
    ["snap-always", undefined, invalidProperty("scroll-snap-stop")],
  ]);
});

describe("Interactivity - Scroll Snap Type", () => {
  testEachClassName([
    ["snap-none", undefined, invalidProperty("scroll-snap-type")],
    ["snap-x", undefined, invalidProperty("scroll-snap-type")],
    ["snap-y", undefined, invalidProperty("scroll-snap-type")],
    ["snap-both", undefined, invalidProperty("scroll-snap-type")],
    // These properties just generate variables
    ["snap-mandatory", {}],
    ["snap-proximity", {}],
  ]);
});

describe("Interactivity - Touch Action", () => {
  testEachClassName([
    ["touch-auto", undefined, invalidProperty("touch-action")],
    ["touch-none", undefined, invalidProperty("touch-action")],
    ["touch-pan-x", undefined, invalidProperty("touch-action")],
    ["touch-pan-left", undefined, invalidProperty("touch-action")],
    ["touch-pan-right", undefined, invalidProperty("touch-action")],
    ["touch-pan-y", undefined, invalidProperty("touch-action")],
    ["touch-pan-up", undefined, invalidProperty("touch-action")],
    ["touch-pan-down", undefined, invalidProperty("touch-action")],
    ["touch-pinch-zoom", undefined, invalidProperty("touch-action")],
    ["touch-manipulation", undefined, invalidProperty("touch-action")],
  ]);
});

describe("Interactivity - User Select", () => {
  testEachClassName([
    ["select-none", { style: { userSelect: "none" } }],
    ["select-text", { style: { userSelect: "text" } }],
    ["select-all", { style: { userSelect: "all" } }],
    ["select-auto", { style: { userSelect: "auto" } }],
  ]);
});

describe("Interactivity - Will Change", () => {
  testEachClassName([
    ["will-change-auto", undefined, invalidProperty("will-change")],
    ["will-change-scroll", undefined, invalidProperty("will-change")],
    ["will-change-contents", undefined, invalidProperty("will-change")],
    ["will-change-transform", undefined, invalidProperty("will-change")],
  ]);
});
