import { invalidProperty, testEachClassName } from "../test-utils";

describe("Tables - Border Collapse", () => {
  testEachClassName([
    ["border-collapse", undefined, invalidProperty("border-collapse")],
    ["border-separate", undefined, invalidProperty("border-collapse")],
  ]);
});

describe("Tables - Border Spacing", () => {
  testEachClassName([
    ["border-spacing-0", undefined, invalidProperty("border-spacing")],
    ["border-spacing-x-0", undefined, invalidProperty("border-spacing")],
    ["border-spacing-y-0", undefined, invalidProperty("border-spacing")],
    ["border-spacing-px", undefined, invalidProperty("border-spacing")],
    ["border-spacing-x-px", undefined, invalidProperty("border-spacing")],
    ["border-spacing-y-px", undefined, invalidProperty("border-spacing")],
    ["border-spacing-1", undefined, invalidProperty("border-spacing")],
    ["border-spacing-x-1", undefined, invalidProperty("border-spacing")],
    ["border-spacing-y-1", undefined, invalidProperty("border-spacing")],
  ]);
});

describe("Tables - Table Layout", () => {
  testEachClassName([
    ["table-auto", undefined, invalidProperty("table-layout")],
    ["table-fixed", undefined, invalidProperty("table-layout")],
  ]);
});

describe("Tables - Caption Side", () => {
  testEachClassName([
    ["caption-top", undefined, invalidProperty("caption-side")],
    ["caption-bottom", undefined, invalidProperty("caption-side")],
  ]);
});
