import { testEachClassName } from "../test-utils";

describe("Preset - color-*", () => {
  testEachClassName([["color-black", { style: { color: "rgba(0, 0, 0, 1)" } }]]);
});
