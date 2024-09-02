import { invalidProperty, testEachClassName } from "../test-utils";

describe("Filters - Blur", () => {
  testEachClassName([["blur", undefined, invalidProperty("filter")]]);
});

describe("Filters - Brightness", () => {
  testEachClassName([["brightness-0", undefined, invalidProperty("filter")]]);
});

describe("Filters - Contrast", () => {
  testEachClassName([
    ["contrast-0", undefined, invalidProperty("filter")],
    ["contrast-50", undefined, invalidProperty("filter")],
    ["contrast-200", undefined, invalidProperty("filter")],
  ]);
});

describe("Filters - Drop Shadow", () => {
  testEachClassName([["drop-shadow", undefined, invalidProperty("filter")]]);
});

describe("Filters - Grayscale", () => {
  testEachClassName([
    ["grayscale", undefined, invalidProperty("filter")],
    ["grayscale-0", undefined, invalidProperty("filter")],
  ]);
});

describe("Filters - Hue Rotate", () => {
  testEachClassName([
    ["hue-rotate-0", undefined, invalidProperty("filter")],
    ["hue-rotate-180", undefined, invalidProperty("filter")],
  ]);
});

describe("Filters - Invert", () => {
  testEachClassName([
    ["invert-0", undefined, invalidProperty("filter")],
    ["invert", undefined, invalidProperty("filter")],
  ]);
});

describe("Filters - Saturate", () => {
  testEachClassName([
    ["saturate-0", undefined, invalidProperty("filter")],
    ["saturate-100", undefined, invalidProperty("filter")],
  ]);
});

describe("Filters - Sepia", () => {
  testEachClassName([["sepia", undefined, invalidProperty("filter")]]);
});

describe("Filters - Backdrop Blur", () => {
  testEachClassName([
    ["backdrop-blur-none", undefined, invalidProperty("backdrop-filter")],
  ]);
});

describe("Filters - Backdrop Brightness", () => {
  testEachClassName([
    ["backdrop-brightness-0", undefined, invalidProperty("backdrop-filter")],
  ]);
});

describe("Filters - Backdrop Contrast", () => {
  testEachClassName([
    ["backdrop-contrast-0", undefined, invalidProperty("backdrop-filter")],
  ]);
});

describe("Filters - Backdrop Grayscale", () => {
  testEachClassName([
    ["backdrop-grayscale-0", undefined, invalidProperty("backdrop-filter")],
  ]);
});

describe("Filters - Backdrop Hue Rotate", () => {
  testEachClassName([
    ["backdrop-hue-rotate-0", undefined, invalidProperty("backdrop-filter")],
  ]);
});

describe("Filters - Backdrop Invert", () => {
  testEachClassName([
    ["backdrop-invert-0", undefined, invalidProperty("backdrop-filter")],
  ]);
});

describe("Filters - Backdrop Opacity", () => {
  testEachClassName([
    ["backdrop-opacity-0", undefined, invalidProperty("backdrop-filter")],
  ]);
});

describe("Filters - Backdrop Saturate", () => {
  testEachClassName([
    ["backdrop-saturate-0", undefined, invalidProperty("backdrop-filter")],
  ]);
});

describe("Filters - Backdrop Sepia", () => {
  testEachClassName([
    ["backdrop-sepia-0", undefined, invalidProperty("backdrop-filter")],
  ]);
});
