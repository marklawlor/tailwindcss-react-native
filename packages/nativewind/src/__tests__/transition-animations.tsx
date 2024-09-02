import { testEachClassName } from "../test-utils";

/** TODO Rewrite these tests to actually test the properties, not what they just compile to */

describe.skip("Transitions & Animation - Transition Property", () => {
  testEachClassName(
    [
      // TODO: Add tests for all transition properties
      // "transition-none",
      // "transition-all",
      // "transition",
      // "transition-colors",
      // "transition-opacity",
      // "transition-shadow",
      // "transition-transform",
      [
        "transition-colors",
        {
          style: {
            backgroundColor: "transparent",
            borderColor: "transparent",
            color: "transparent",
          },
        },
      ],
      [
        "transition-opacity",
        {
          style: {
            opacity: 1,
          },
        },
      ],
    ],
    {
      animatedStyle: true,
    },
  );
});

describe.skip("Transitions & Animation - Transition Duration", () => {
  testEachClassName([["duration-75", {}]]);
});

describe.skip("Transitions & Animation - Transition Timing Function", () => {
  testEachClassName([
    ["ease-linear", {}],
    ["ease-in", {}],
    ["ease-out", {}],
    ["ease-in-out", {}],
  ]);
});

describe.skip("Transitions & Animation - Transition Delay", () => {
  testEachClassName([["delay-0", {}]]);
});

describe.skip("Transitions & Animation - Animation", () => {
  testEachClassName([
    [
      // TODO:
      // "animate-ping",
      // "animate-pulse",
      // "animate-bounce",

      "animate-none",
      {},
    ],
    [
      "animate-spin",
      {
        style: {
          transform: [{ rotate: "0deg" }],
        },
      },
    ],
    // [
    //   "animate-ping",
    //   {
    //     { style:  {
    //       opacity: NaN,
    //       transform: [{ scaleX: 1 }, { scaleY: 1 }],
    //     },
    //   },
    // ],
  ]);
});
