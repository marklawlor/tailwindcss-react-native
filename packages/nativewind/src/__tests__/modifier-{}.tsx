import { testEachClassName } from "../test-utils";

describe("{}/<props>:", () => {
  testEachClassName([
    ["{}/test:color-black", { test: "rgba(0, 0, 0, 1)" }],
    ["{}/test.nested:color-black", { test: { nested: "rgba(0, 0, 0, 1)" } }],
    ["{}/&test:color-black", { style: { test: "rgba(0, 0, 0, 1)" } }],
    [
      "{}/&test.nested:color-black",
      { style: { test: { nested: "rgba(0, 0, 0, 1)" } } },
    ],
  ]);
});

// {}-[prop] is an alias for {}/<prop>:
describe("{}-[prop]:", () => {
  testEachClassName([
    ["{}-[test]:color-black", { test: "rgba(0, 0, 0, 1)" }],
    ["{}-[test.nested]:color-black", { test: { nested: "rgba(0, 0, 0, 1)" } }],
    ["{}-[&test]:color-black", { style: { test: "rgba(0, 0, 0, 1)" } }],
    [
      "{}-[&test.nested]:color-black",
      { style: { test: { nested: "rgba(0, 0, 0, 1)" } } },
    ],
  ]);
});

describe("{}-[props]/<attributes>:", () => {
  testEachClassName([
    ["{}-[test]/fontSize:text-base", { test: 14, style: { lineHeight: 21 } }],
    [
      "{}-[test.nested]/fontSize:text-base",
      { test: { nested: 14 }, style: { lineHeight: 21 } },
    ],
    ["{}-[&test]/fontSize:text-base", { style: { lineHeight: 21, test: 14 } }],
    [
      "{}-[&test.nested]/fontSize:text-base",
      { style: { lineHeight: 21, test: { nested: 14 } } },
    ],
  ]);
});
