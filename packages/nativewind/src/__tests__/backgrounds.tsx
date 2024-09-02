import { invalidProperty, invalidValue, testEachClassName } from "../test-utils";

describe("Backgrounds - Background Attachment", () => {
  testEachClassName([
    [
      "bg-fixed",
      undefined,
      invalidProperty("bg-fixed", "background-attachment"),
    ],
    [
      "bg-local",
      undefined,
      invalidProperty("bg-local", "background-attachment"),
    ],
    [
      "bg-scroll",
      undefined,
      invalidProperty("bg-local", "background-attachment"),
    ],
  ]);
});

describe("Backgrounds - Background Clip", () => {
  testEachClassName([
    ["bg-clip-border", undefined, invalidProperty("background-clip")],
    ["bg-clip-padding", undefined, invalidProperty("background-clip")],
    ["bg-clip-content", undefined, invalidProperty("background-clip")],
    ["bg-clip-text", undefined, invalidProperty("background-clip")],
  ]);
});

describe("Backgrounds - Background Color", () => {
  testEachClassName([
    [
      "bg-current",
      undefined,
      invalidValue({ "background-color": "currentcolor" }),
    ],
    ["bg-transparent", { style: { backgroundColor: "rgba(0, 0, 0, 0)" } }],
    [
      "bg-white",
      {
        style: {
          backgroundColor: "rgba(255, 255, 255, 1)",
        },
      },
    ],
  ]);
});

describe("Backgrounds - Background Origin", () => {
  testEachClassName([
    ["bg-origin-border", undefined, invalidProperty("background-origin")],
    ["bg-origin-padding", undefined, invalidProperty("background-origin")],
    ["bg-origin-content", undefined, invalidProperty("background-origin")],
  ]);
});

describe("Backgrounds - Background Position", () => {
  testEachClassName([
    ["bg-bottom", undefined, invalidProperty("background-position")],
    ["bg-center", undefined, invalidProperty("background-position")],
    ["bg-left", undefined, invalidProperty("background-position")],
    ["bg-left-bottom", undefined, invalidProperty("background-position")],
    ["bg-left-top", undefined, invalidProperty("background-position")],
    ["bg-right", undefined, invalidProperty("background-position")],
    ["bg-right-bottom", undefined, invalidProperty("background-position")],
    ["bg-right-top", undefined, invalidProperty("background-position")],
    ["bg-top", undefined, invalidProperty("background-position")],
  ]);
});

describe("Backgrounds - Background Repeat", () => {
  testEachClassName([["bg-repeat", undefined, invalidProperty("background-repeat")]]);
});

describe("Backgrounds - Background Size", () => {
  testEachClassName([
    ["bg-auto", undefined, invalidProperty("background-size")],
    ["bg-cover", undefined, invalidProperty("background-size")],
    ["bg-contain", undefined, invalidProperty("background-size")],
  ]);
});

describe("Backgrounds - Background Image", () => {
  testEachClassName([
    ["bg-none", undefined, invalidProperty("background-image")],
    ["bg-gradient-to-t", undefined, invalidProperty("background-image")],
    ["bg-gradient-to-tr", undefined, invalidProperty("background-image")],
    ["bg-gradient-to-r", undefined, invalidProperty("background-image")],
    ["bg-gradient-to-br", undefined, invalidProperty("background-image")],
    ["bg-gradient-to-b", undefined, invalidProperty("background-image")],
    ["bg-gradient-to-bl", undefined, invalidProperty("background-image")],
    ["bg-gradient-to-l", undefined, invalidProperty("background-image")],
    ["bg-gradient-to-tl", undefined, invalidProperty("background-image")],
  ]);
});

describe.skip("Backgrounds - Gradient Color Stops", () => {
  // TODO
});
