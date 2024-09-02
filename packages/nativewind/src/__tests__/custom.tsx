import { testEachClassName } from "../test-utils";

describe("Custom - Ripple Color", () => {
  testEachClassName([
    ["ripple-black", { android_ripple: { color: "rgba(0, 0, 0, 1)" } }],
  ]);
});

describe("Custom - Ripple Borderless", () => {
  testEachClassName([["ripple-borderless", { android_ripple: { borderless: true } }]]);
});
