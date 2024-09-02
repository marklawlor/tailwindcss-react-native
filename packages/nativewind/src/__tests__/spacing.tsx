import { testEachClassName } from "../test-utils";

describe("Spacing - Padding", () => {
  testEachClassName([
    ["p-0", { style: { padding: 0 } }],
    ["px-0", { style: { paddingLeft: 0, paddingRight: 0 } }],
    ["py-0", { style: { paddingTop: 0, paddingBottom: 0 } }],
    ["pt-0", { style: { paddingTop: 0 } }],
    ["pr-0", { style: { paddingRight: 0 } }],
    ["pb-0", { style: { paddingBottom: 0 } }],
    ["pl-0", { style: { paddingLeft: 0 } }],
    ["ps-0", { style: { paddingStart: 0 } }],
    ["pe-0", { style: { paddingEnd: 0 } }],
  ]);
});

describe("Spacing - Margin", () => {
  testEachClassName([
    ["m-0", { style: { margin: 0 } }],
    ["mx-0", { style: { marginLeft: 0, marginRight: 0 } }],
    ["my-0", { style: { marginTop: 0, marginBottom: 0 } }],
    ["mt-0", { style: { marginTop: 0 } }],
    ["mr-0", { style: { marginRight: 0 } }],
    ["mb-0", { style: { marginBottom: 0 } }],
    ["ml-0", { style: { marginLeft: 0 } }],
    ["ms-0", { style: { marginStart: 0 } }],
    ["me-0", { style: { marginEnd: 0 } }],
    ["m-auto", { style: { margin: "auto" } }],
  ]);
});

describe.skip("Spacing - Space Between", () => {
  testEachClassName([]);
});
