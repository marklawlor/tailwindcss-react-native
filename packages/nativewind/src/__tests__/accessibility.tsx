import { invalidProperty, invalidValue, testEachClassName } from "../test-utils";

describe("Accessibility - Screen Readers", () => {
  testEachClassName([
    [
      "sr-only",
      {
        style: {
          borderWidth: 0,
          height: 1,
          margin: -1,
          overflow: "hidden",
          padding: 0,
          position: "absolute",
          width: 1,
        },
      },
      invalidProperty("sr-only", "clip", "white-space"),
    ],
    [
      "not-sr-only",
      {
        style: {
          margin: 0,
          overflow: "visible",
          padding: 0,
        },
      },
      invalidValue({
        position: "static",
        width: "auto",
        height: "auto",
        clip: "auto",
        "white-space": "normal",
      }),
    ],
  ]);
});
