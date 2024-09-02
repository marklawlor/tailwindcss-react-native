import { invalidValue, testEachClassName } from "../test-utils";

describe("Border - Border Radius", () => {
  testEachClassName([
    ["rounded", { style: { borderRadius: 3.5 } }],
    [
      "rounded-t",
      { style: { borderTopLeftRadius: 3.5, borderTopRightRadius: 3.5 } },
    ],
    [
      "rounded-b",
      { style: { borderBottomLeftRadius: 3.5, borderBottomRightRadius: 3.5 } },
    ],
    ["rounded-full", { style: { borderRadius: 9999 } }],
  ]);
});

describe("Border - Border Width", () => {
  testEachClassName([
    ["border-0", { style: { borderWidth: 0 } }],
    ["border-x-0", { style: { borderRightWidth: 0, borderLeftWidth: 0 } }],
    ["border-y-0", { style: { borderTopWidth: 0, borderBottomWidth: 0 } }],
    ["border-s-0", { style: { borderLeftWidth: 0 } }],
    ["border-e-0", { style: { borderRightWidth: 0 } }],
    ["border-t-0", { style: { borderTopWidth: 0 } }],
    ["border-r-0", { style: { borderRightWidth: 0 } }],
    ["border-b-0", { style: { borderBottomWidth: 0 } }],
    ["border-l-0", { style: { borderLeftWidth: 0 } }],
    ["border-2", { style: { borderWidth: 2 } }],
    ["border-x-2", { style: { borderRightWidth: 2, borderLeftWidth: 2 } }],
    ["border-y-2", { style: { borderTopWidth: 2, borderBottomWidth: 2 } }],
    ["border-s-2", { style: { borderLeftWidth: 2 } }],
    ["border-e-2", { style: { borderRightWidth: 2 } }],
    ["border-t-2", { style: { borderTopWidth: 2 } }],
    ["border-r-2", { style: { borderRightWidth: 2 } }],
    ["border-b-2", { style: { borderBottomWidth: 2 } }],
    ["border-l-2", { style: { borderLeftWidth: 2 } }],
  ]);
});

describe("Border - Border Color", () => {
  testEachClassName([
    ["border-white", { style: { borderColor: "rgba(255, 255, 255, 1)" } }],
    [
      "border-x-white",
      {
        style: {
          borderLeftColor: "rgba(255, 255, 255, 1)",
          borderRightColor: "rgba(255, 255, 255, 1)",
        },
      },
    ],
    [
      "border-y-white",
      {
        style: {
          borderTopColor: "rgba(255, 255, 255, 1)",
          borderBottomColor: "rgba(255, 255, 255, 1)",
        },
      },
    ],
    ["border-t-white", { style: { borderTopColor: "rgba(255, 255, 255, 1)" } }],
    [
      "border-b-white",
      { style: { borderBottomColor: "rgba(255, 255, 255, 1)" } },
    ],
    [
      "border-l-white",
      { style: { borderLeftColor: "rgba(255, 255, 255, 1)" } },
    ],
    [
      "border-r-white",
      { style: { borderRightColor: "rgba(255, 255, 255, 1)" } },
    ],
    [
      "border-current",
      undefined,
      invalidValue({
        "border-top-color": "currentcolor",
        "border-bottom-color": "currentcolor",
        "border-left-color": "currentcolor",
        "border-right-color": "currentcolor",
      }),
    ],
    [
      "border-inherit",
      undefined,
      invalidValue({
        "border-color": "inherit",
      }),
    ],
    [
      "border-x-inherit",
      undefined,
      invalidValue({
        "border-left-color": "inherit",
        "border-right-color": "inherit",
      }),
    ],
    [
      "border-y-current",
      undefined,
      invalidValue({
        "border-top-color": "currentcolor",
        "border-bottom-color": "currentcolor",
      }),
    ],
    [
      "border-y-inherit",
      undefined,
      invalidValue({
        "border-top-color": "inherit",
        "border-bottom-color": "inherit",
      }),
    ],
    [
      "border-t-current",
      undefined,
      invalidValue({
        "border-top-color": "currentcolor",
      }),
    ],
    [
      "border-t-inherit",
      undefined,
      invalidValue({
        "border-top-color": "inherit",
      }),
    ],
    [
      "border-b-current",
      undefined,
      invalidValue({
        "border-bottom-color": "currentcolor",
      }),
    ],
    [
      "border-b-inherit",
      undefined,
      invalidValue({
        "border-bottom-color": "inherit",
      }),
    ],
    [
      "border-l-current",
      undefined,
      invalidValue({
        "border-left-color": "currentcolor",
      }),
    ],
    [
      "border-l-inherit",
      undefined,
      invalidValue({
        "border-left-color": "inherit",
      }),
    ],
    [
      "border-r-current",
      undefined,
      invalidValue({
        "border-right-color": "currentcolor",
      }),
    ],
    [
      "border-r-inherit",
      undefined,
      invalidValue({
        "border-right-color": "inherit",
      }),
    ],
  ]);
});

describe("Borders - Border Style", () => {
  testEachClassName([
    ["border-solid", { style: { borderStyle: "solid" } }],
    ["border-dashed", { style: { borderStyle: "dashed" } }],
    ["border-dotted", { style: { borderStyle: "dotted" } }],
    ["border-none", undefined, invalidValue({ "border-style": "none" })],
    ["border-double", undefined, invalidValue({ "border-style": "double" })],
    ["border-hidden", undefined, invalidValue({ "border-style": "hidden" })],
  ]);
});

describe.skip("Borders - Divide Width", () => {
  // TODO
});

describe.skip("Borders - Divide Color", () => {
  // TODO
});

describe.skip("Borders - Divide Style", () => {
  // TODO
});

describe.skip("Borders - Outline Width", () => {
  // TODO
});

describe.skip("Borders - Outline Color", () => {
  // TODO
});

describe.skip("Borders - Outline Style", () => {
  // TODO
});

describe.skip("Borders - Outline Offset", () => {
  // TODO
});

describe.skip("Borders - Ring Width", () => {
  // TODO
});

describe.skip("Borders - Ring Color", () => {
  // TODO
});

describe.skip("Borders - Ring Offset Width", () => {
  // TODO
});

describe.skip("Borders - Ring Offset Color", () => {
  // TODO
});
