import { invalidProperty, invalidValue, testEachClassName } from "../test-utils";

describe("Layout - Aspect Ratio", () => {
  testEachClassName([
    ["aspect-square", { style: { aspectRatio: 1 } }],
    ["aspect-video", { style: { aspectRatio: "16 / 9" } }],
    ["aspect-[4/3]", { style: { aspectRatio: "4 / 3" } }],
  ]);
});

describe("Layout - Container", () => {
  testEachClassName([["container", { style: { maxWidth: 640, width: "100%" } }]]);
});

describe("Layout - Columns", () => {
  testEachClassName([
    ["columns-1", undefined, invalidProperty("columns")],
    ["columns-2", undefined, invalidProperty("columns")],
  ]);
});

describe("Layout - Break After", () => {
  testEachClassName([
    ["break-after-auto", undefined, invalidProperty("break-after")],
    ["break-after-avoid", undefined, invalidProperty("break-after")],
    ["break-after-all", undefined, invalidProperty("break-after")],
    ["break-after-avoid-page", undefined, invalidProperty("break-after")],
    ["break-after-page", undefined, invalidProperty("break-after")],
    ["break-after-left", undefined, invalidProperty("break-after")],
    ["break-after-right", undefined, invalidProperty("break-after")],
    ["break-after-column", undefined, invalidProperty("break-after")],
  ]);
});

describe("Layout - Break Before", () => {
  testEachClassName([
    ["break-before-auto", undefined, invalidProperty("break-before")],
    ["break-before-avoid", undefined, invalidProperty("break-before")],
    ["break-before-all", undefined, invalidProperty("break-before")],
    ["break-before-avoid-page", undefined, invalidProperty("break-before")],
    ["break-before-page", undefined, invalidProperty("break-before")],
    ["break-before-left", undefined, invalidProperty("break-before")],
    ["break-before-right", undefined, invalidProperty("break-before")],
    ["break-before-column", undefined, invalidProperty("break-before")],
  ]);
});

describe("Layout - Break Inside", () => {
  testEachClassName([
    ["break-inside-auto", undefined, invalidProperty("break-inside")],
    ["break-inside-avoid", undefined, invalidProperty("break-inside")],
    ["break-inside-avoid-page", undefined, invalidProperty("break-inside")],
    ["break-inside-avoid-column", undefined, invalidProperty("break-inside")],
  ]);
});

describe("Layout - Box Decoration Break", () => {
  testEachClassName([
    [
      "box-decoration-clone",
      undefined,
      invalidProperty("box-decoration-break"),
    ],
    [
      "box-decoration-slice",
      undefined,
      invalidProperty("box-decoration-break"),
    ],
  ]);
});

describe("Layout - Box Sizing", () => {
  testEachClassName([
    ["box-border", undefined, invalidProperty("box-sizing")],
    ["box-content", undefined, invalidProperty("box-sizing")],
  ]);
});

describe("Layout - Display", () => {
  testEachClassName([
    ["flex", { style: { display: "flex" } }],
    ["hidden", { style: { display: "none" } }],
    ["block", undefined, invalidValue({ display: "block" })],
    ["inline-block", undefined, invalidValue({ display: "inline-block" })],
    ["inline", undefined, invalidValue({ display: "inline" })],
    ["inline-flex", undefined, invalidValue({ display: "inline-flex" })],
    ["table", undefined, invalidValue({ display: "table" })],
    ["inline-table", undefined, invalidValue({ display: "inline-table" })],
    ["table-caption", undefined, invalidValue({ display: "table-caption" })],
    ["table-cell", undefined, invalidValue({ display: "table-cell" })],
    ["table-column", undefined, invalidValue({ display: "table-column" })],
    [
      "table-column-group",
      undefined,
      invalidValue({ display: "table-column-group" }),
    ],
    [
      "table-footer-group",
      undefined,
      invalidValue({ display: "table-footer-group" }),
    ],
    [
      "table-header-group",
      undefined,
      invalidValue({ display: "table-header-group" }),
    ],
    [
      "table-row-group",
      undefined,
      invalidValue({ display: "table-row-group" }),
    ],
    ["table-row", undefined, invalidValue({ display: "table-row" })],
    ["flow-root", undefined, invalidValue({ display: "flow-root" })],
    ["grid", undefined, invalidValue({ display: "grid" })],
    ["inline-grid", undefined, invalidValue({ display: "inline-grid" })],
    ["contents", undefined, invalidValue({ display: "contents" })],
    ["list-item", undefined, invalidValue({ display: "list-item" })],
  ]);
});

describe("Layout - Floats", () => {
  testEachClassName([
    ["float-right", undefined, invalidProperty("float")],
    ["float-left", undefined, invalidProperty("float")],
    ["float-none", undefined, invalidProperty("float")],
  ]);
});

describe("Layout - Clear", () => {
  testEachClassName([
    ["clear-right", undefined, invalidProperty("clear")],
    ["clear-left", undefined, invalidProperty("clear")],
    ["clear-both", undefined, invalidProperty("clear")],
    ["clear-none", undefined, invalidProperty("clear")],
  ]);
});

describe("Layout - Isolation", () => {
  testEachClassName([
    ["isolate", undefined, invalidProperty("isolation")],
    ["isolation-auto", undefined, invalidProperty("isolation")],
  ]);
});

describe("Layout - Object Fit", () => {
  testEachClassName([
    ["object-contain", undefined, invalidProperty("object-fit")],
    ["object-cover", undefined, invalidProperty("object-fit")],
    ["object-fill", undefined, invalidProperty("object-fit")],
    ["object-none", undefined, invalidProperty("object-fit")],
    ["object-scale-down", undefined, invalidProperty("object-fit")],
  ]);
});

describe("Layout - Object Position", () => {
  testEachClassName([
    ["object-bottom", undefined, invalidProperty("object-position")],
    ["object-center", undefined, invalidProperty("object-position")],
    ["object-left", undefined, invalidProperty("object-position")],
    ["object-left-bottom", undefined, invalidProperty("object-position")],
    ["object-left-top", undefined, invalidProperty("object-position")],
    ["object-right", undefined, invalidProperty("object-position")],
    ["object-right-bottom", undefined, invalidProperty("object-position")],
    ["object-right-top", undefined, invalidProperty("object-position")],
    ["object-top", undefined, invalidProperty("object-position")],
  ]);
});

describe("Layout - Overflow", () => {
  testEachClassName([
    ["overflow-auto", undefined, invalidValue({ overflow: "auto" })],
    ["overflow-clip", undefined, invalidValue({ overflow: "clip" })],
    ["overflow-scroll", undefined, invalidValue({ overflow: "scroll" })],
    ["overflow-x-auto", undefined, invalidProperty("overflow-x")],
    ["overflow-y-auto", undefined, invalidProperty("overflow-y")],
    ["overflow-x-hidden", undefined, invalidProperty("overflow-x")],
    ["overflow-y-hidden", undefined, invalidProperty("overflow-y")],
    ["overflow-x-clip", undefined, invalidProperty("overflow-x")],
    ["overflow-y-clip", undefined, invalidProperty("overflow-y")],
    ["overflow-x-visible", undefined, invalidProperty("overflow-x")],
    ["overflow-y-visible", undefined, invalidProperty("overflow-y")],
    ["overflow-x-scroll", undefined, invalidProperty("overflow-x")],
    ["overflow-y-scroll", undefined, invalidProperty("overflow-y")],
    ["overflow-hidden", { style: { overflow: "hidden" } }],
    ["overflow-visible", { style: { overflow: "visible" } }],
  ]);
});

describe("Layout - Overscroll Behavior", () => {
  testEachClassName([
    ["overscroll-auto", undefined, invalidProperty("overscroll-behavior")],
    ["overscroll-contain", undefined, invalidProperty("overscroll-behavior")],
    ["overscroll-none", undefined, invalidProperty("overscroll-behavior")],
    ["overscroll-y-auto", undefined, invalidProperty("overscroll-behavior-y")],
    [
      "overscroll-y-contain",
      undefined,
      invalidProperty("overscroll-behavior-y"),
    ],
    ["overscroll-y-none", undefined, invalidProperty("overscroll-behavior-y")],
    ["overscroll-x-auto", undefined, invalidProperty("overscroll-behavior-x")],
    [
      "overscroll-x-contain",
      undefined,
      invalidProperty("overscroll-behavior-x"),
    ],
    ["overscroll-x-none", undefined, invalidProperty("overscroll-behavior-x")],
  ]);
});

describe("Layout - Position", () => {
  testEachClassName([
    ["absolute", { style: { position: "absolute" } }],
    ["relative", { style: { position: "relative" } }],
    ["static", undefined, invalidValue({ position: "static" })],
    ["fixed", undefined, invalidValue({ position: "fixed" })],
    ["sticky", undefined, invalidValue({ position: "sticky" })],
  ]);
});

describe("Layout - Top Right Bottom Left", () => {
  testEachClassName([
    ["top-0", { style: { top: 0 } }],
    ["top-px", { style: { top: 1 } }],
    ["top-1", { style: { top: 3.5 } }],
    ["top-1/2", { style: { top: "50%" } }],
    ["top-full", { style: { top: "100%" } }],
    ["top-[10px]", { style: { top: 10 } }],
    ["bottom-0", { style: { bottom: 0 } }],
    ["bottom-px", { style: { bottom: 1 } }],
    ["bottom-1", { style: { bottom: 3.5 } }],
    ["bottom-1/2", { style: { bottom: "50%" } }],
    ["bottom-full", { style: { bottom: "100%" } }],
    ["bottom-[10px]", { style: { bottom: 10 } }],
    ["left-0", { style: { left: 0 } }],
    ["left-px", { style: { left: 1 } }],
    ["left-1", { style: { left: 3.5 } }],
    ["left-1/2", { style: { left: "50%" } }],
    ["left-full", { style: { left: "100%" } }],
    ["left-[10px]", { style: { left: 10 } }],
    ["right-0", { style: { right: 0 } }],
    ["right-px", { style: { right: 1 } }],
    ["right-1", { style: { right: 3.5 } }],
    ["right-1/2", { style: { right: "50%" } }],
    ["right-full", { style: { right: "100%" } }],
    ["right-[10px]", { style: { right: 10 } }],
    [
      "inset-auto",
      undefined,
      invalidValue({
        top: "auto",
        bottom: "auto",
        left: "auto",
        right: "auto",
      }),
    ],
    ["inset-x-auto", undefined, invalidValue({ left: "auto", right: "auto" })],
    ["inset-y-auto", undefined, invalidValue({ top: "auto", bottom: "auto" })],
    ["top-auto", undefined, invalidValue({ top: "auto" })],
    ["right-auto", undefined, invalidValue({ right: "auto" })],
    ["bottom-auto", undefined, invalidValue({ bottom: "auto" })],
    ["left-auto", undefined, invalidValue({ left: "auto" })],
  ]);
});

describe("Layout - Visibility", () => {
  testEachClassName([
    ["visible", { style: { opacity: 1 } }],
    ["invisible", { style: { opacity: 0 } }],
  ]);
});

describe("Layout - Z-Index", () => {
  testEachClassName([
    ["z-auto", undefined, invalidValue({ "z-index": "auto" })],
    ["z-0", { style: { zIndex: 0 } }],
  ]);
});
