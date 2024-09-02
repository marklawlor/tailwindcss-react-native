import { invalidProperty, testEachClassName } from "../test-utils";

describe("Effects - Box Shadow", () => {
  testEachClassName([
    [
      "shadow-sm",
      {
        style: {
          shadowColor: "rgba(0, 0, 0, 0.3490196168422699)",
          shadowOpacity: 1,
          shadowOffset: {
            height: 1,
            width: 0,
          },
          shadowRadius: 1,
        },
      },
    ],
    [
      "shadow",
      {
        style: {
          shadowColor: "rgba(0, 0, 0, 0.3490196168422699)",
          shadowOpacity: 1,
          shadowOffset: {
            height: 1,
            width: 0,
          },
          shadowRadius: 4,
        },
      },
    ],
    [
      "shadow-none",
      {
        style: {
          shadowColor: "rgba(0, 0, 0, 0)",
          shadowOpacity: 1,
          shadowOffset: {
            height: 0,
            width: 0,
          },
          shadowRadius: 0,
        },
      },
    ],
  ]);
});

describe.skip("Effects - Box Shadow Color", () => {
  // TODO
});

describe("Effects - Opacity", () => {
  testEachClassName([
    ["opacity-0", { style: { opacity: 0 } }],
    ["opacity-100", { style: { opacity: 1 } }],
  ]);
});

describe("Effects - Mix Blend Mode", () => {
  testEachClassName([
    ["mix-blend-normal", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-multiply", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-screen", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-overlay", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-darken", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-lighten", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-color-dodge", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-color-burn", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-hard-light", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-soft-light", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-difference", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-exclusion", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-hue", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-saturation", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-color", undefined, invalidProperty("mix-blend-mode")],
    ["mix-blend-luminosity", undefined, invalidProperty("mix-blend-mode")],
  ]);
});

describe("Effects - Background Blend Mode", () => {
  testEachClassName([
    ["bg-blend-normal", undefined, invalidProperty("background-blend-mode")],
    ["bg-blend-multiply", undefined, invalidProperty("background-blend-mode")],
    ["bg-blend-screen", undefined, invalidProperty("background-blend-mode")],
    ["bg-blend-overlay", undefined, invalidProperty("background-blend-mode")],
    ["bg-blend-darken", undefined, invalidProperty("background-blend-mode")],
    ["bg-blend-lighten", undefined, invalidProperty("background-blend-mode")],
    [
      "bg-blend-color-dodge",
      undefined,
      invalidProperty("background-blend-mode"),
    ],
    [
      "bg-blend-color-burn",
      undefined,
      invalidProperty("background-blend-mode"),
    ],
    [
      "bg-blend-hard-light",
      undefined,
      invalidProperty("background-blend-mode"),
    ],
    [
      "bg-blend-soft-light",
      undefined,
      invalidProperty("background-blend-mode"),
    ],
    [
      "bg-blend-difference",
      undefined,
      invalidProperty("background-blend-mode"),
    ],
    ["bg-blend-exclusion", undefined, invalidProperty("background-blend-mode")],
    ["bg-blend-hue", undefined, invalidProperty("background-blend-mode")],
    [
      "bg-blend-saturation",
      undefined,
      invalidProperty("background-blend-mode"),
    ],
    ["bg-blend-color", undefined, invalidProperty("background-blend-mode")],
    [
      "bg-blend-luminosity",
      undefined,
      invalidProperty("background-blend-mode"),
    ],
  ]);
});
