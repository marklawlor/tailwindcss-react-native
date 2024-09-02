import { testEachClassName } from "../test-utils";

describe("SVG - Fill", () => {
  testEachClassName([["fill-black", { fill: "rgba(0, 0, 0, 1)" }]]);
});

describe("SVG - Stroke", () => {
  testEachClassName([["stroke-black", { stroke: "rgba(0, 0, 0, 1)" }]]);
});

describe("SVG - Stroke Width", () => {
  testEachClassName([["stroke-1", { strokeWidth: 1 }]]);
});
