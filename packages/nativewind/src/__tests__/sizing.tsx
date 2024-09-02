import { Dimensions } from "react-native";
import { invalidValue, testEachClassName } from "../test-utils";

describe("Sizing - Width", () => {
  testEachClassName([
    ["w-0", { style: { width: 0 } }],
    ["w-px", { style: { width: 1 } }],
    ["w-1", { style: { width: 3.5 } }],
    ["w-1/2", { style: { width: "50%" } }],
    ["w-full", { style: { width: "100%" } }],
    ["w-auto", undefined, invalidValue({ width: "auto" })],
    ["w-min", undefined, invalidValue({ width: "min-content" })],
    ["w-max", undefined, invalidValue({ width: "max-content" })],
    ["w-fit", undefined, invalidValue({ width: "fit-content" })],
    ["w-screen", { style: { width: Dimensions.get("window").width } }],
  ]);
});

describe("Sizing - Min Width", () => {
  testEachClassName([
    ["min-w-0", { style: { minWidth: 0 } }],
    ["min-w-full", { style: { minWidth: "100%" } }],
    ["min-w-min", undefined, invalidValue({ "min-width": "min-content" })],
    ["min-w-max", undefined, invalidValue({ "min-width": "max-content" })],
    ["min-w-fit", undefined, invalidValue({ "min-width": "fit-content" })],
  ]);
});

describe("Sizing - Max Width", () => {
  testEachClassName([
    ["max-w-0", { style: { maxWidth: 0 } }],
    ["max-w-full", { style: { maxWidth: "100%" } }],
    ["max-w-min", undefined, invalidValue({ "max-width": "min-content" })],
    ["max-w-max", undefined, invalidValue({ "max-width": "max-content" })],
    ["max-w-fit", undefined, invalidValue({ "max-width": "fit-content" })],
  ]);
});

describe("Sizing - Height", () => {
  testEachClassName([
    ["h-0", { style: { height: 0 } }],
    ["h-px", { style: { height: 1 } }],
    ["h-1", { style: { height: 3.5 } }],
    ["h-1/2", { style: { height: "50%" } }],
    ["h-full", { style: { height: "100%" } }],
    ["h-auto", undefined, invalidValue({ height: "auto" })],
    ["h-min", undefined, invalidValue({ height: "min-content" })],
    ["h-max", undefined, invalidValue({ height: "max-content" })],
    ["h-fit", undefined, invalidValue({ height: "fit-content" })],
    ["h-screen", { style: { height: Dimensions.get("window").height } }],
  ]);
});

describe("Sizing - Min Height", () => {
  testEachClassName([
    ["min-h-0", { style: { minHeight: 0 } }],
    ["min-h-full", { style: { minHeight: "100%" } }],
    ["min-h-min", undefined, invalidValue({ "min-height": "min-content" })],
    ["min-h-max", undefined, invalidValue({ "min-height": "max-content" })],
    ["min-h-fit", undefined, invalidValue({ "min-height": "fit-content" })],
  ]);
});

describe("Sizing - Max Height", () => {
  testEachClassName([
    ["max-h-0", { style: { maxHeight: 0 } }],
    ["max-h-full", { style: { maxHeight: "100%" } }],
    ["max-h-min", undefined, invalidValue({ "max-height": "min-content" })],
    ["max-h-max", undefined, invalidValue({ "max-height": "max-content" })],
    ["max-h-fit", undefined, invalidValue({ "max-height": "fit-content" })],
  ]);
});
