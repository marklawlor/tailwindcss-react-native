import { testComponent, testEachClassName } from "../test-utils";

describe("Custom - Elevation", () => {
  testEachClassName([
    [
      "elevation",
      {
        style: {
          elevation: 3,
        },
      },
    ],
    [
      "elevation-sm",
      {
        style: {
          elevation: 1,
        },
      },
    ],
  ])
});
