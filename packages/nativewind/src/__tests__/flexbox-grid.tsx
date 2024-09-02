import { invalidProperty, invalidValue, testEachClassName } from "../test-utils";

describe("Flexbox & Grid - Flex Basis", () => {
  testEachClassName([
    ["basis-auto", undefined, invalidValue({ "flex-basis": "auto" })],
    ["basis-0", { style: { flexBasis: 0 } }],
    ["basis-1", { style: { flexBasis: 3.5 } }],
    ["basis-px", { style: { flexBasis: 1 } }],
    ["basis-full", { style: { flexBasis: "100%" } }],
    ["basis-1/2", { style: { flexBasis: "50%" } }],
  ]);
});

describe("Flexbox & Grid - Flex Direction", () => {
  testEachClassName([
    ["flex-row", { style: { flexDirection: "row" } }],
    ["flex-col", { style: { flexDirection: "column" } }],
    ["flex-row-reverse", { style: { flexDirection: "row-reverse" } }],
    ["flex-col-reverse", { style: { flexDirection: "column-reverse" } }],
  ]);
});

describe("Flexbox & Grid - Flex Wrap", () => {
  testEachClassName([
    ["flex-wrap", { style: { flexWrap: "wrap" } }],
    ["flex-nowrap", { style: { flexWrap: "nowrap" } }],
    ["flex-wrap-reverse", { style: { flexWrap: "wrap-reverse" } }],
  ]);
});

describe("Flexbox & Grid - Flex", () => {
  testEachClassName([
    ["flex", { style: { display: "flex" } }],
    ["flex-1", { style: { flexBasis: "0%", flexGrow: 1, flexShrink: 1 } }],
    [
      "flex-auto",
      {
        style: { flexGrow: 1, flexShrink: 1 },
      },
      invalidValue({ flex: "auto" }),
    ],
    [
      "flex-initial",
      {
        style: { flexGrow: 0, flexShrink: 1 },
      },
      invalidValue({ flex: "auto" }),
    ],
    [
      "flex-none",
      {
        style: { flexGrow: 0, flexShrink: 0 },
      },
      invalidValue({ flex: "auto" }),
    ],
  ]);
});

describe("Flexbox & Grid - Flex Grow", () => {
  testEachClassName([
    ["grow", { style: { flexGrow: 1 } }],
    ["grow-0", { style: { flexGrow: 0 } }],
    ["grow-[2]", { style: { flexGrow: 2 } }],
  ]);
});

describe("Flexbox & Grid - Flex Shrink", () => {
  testEachClassName([
    ["shrink", { style: { flexShrink: 1 } }],
    ["shrink-0", { style: { flexShrink: 0 } }],
  ]);
});

describe("Flexbox & Grid - Order", () => {
  testEachClassName([
    ["order-1", undefined, invalidProperty("order")],
    ["order-first", undefined, invalidProperty("order")],
    ["order-last", undefined, invalidProperty("order")],
    ["order-none", undefined, invalidProperty("order")],
  ]);
});

describe("Flexbox & Grid - Grid Template Columns", () => {
  testEachClassName([
    ["grid-cols-1", undefined, invalidProperty("grid-template-columns")],
    ["grid-cols-2", undefined, invalidProperty("grid-template-columns")],
    ["grid-cols-none", undefined, invalidProperty("grid-template-columns")],
    [
      "grid-cols-[200px_minmax(900px,_1fr)_100px]",
      undefined,
      invalidProperty("grid-template-columns"),
    ],
  ]);
});

describe("Flexbox & Grid - Grid Column Start / End", () => {
  testEachClassName([
    ["col-auto", undefined, invalidProperty("grid-column")],
    ["col-span-1", undefined, invalidProperty("grid-column")],
    ["col-span-full", undefined, invalidProperty("grid-column")],
    ["col-start-1", undefined, invalidProperty("grid-column-start")],
    ["col-start-auto", undefined, invalidProperty("grid-column-start")],
    ["col-end-1", undefined, invalidProperty("grid-column-end")],
    ["col-end-auto", undefined, invalidProperty("grid-column-end")],
  ]);
});

describe("Flexbox & Grid - Grid Template Rows", () => {
  testEachClassName([
    ["grid-rows-1", undefined, invalidProperty("grid-template-rows")],
    ["grid-rows-2", undefined, invalidProperty("grid-template-rows")],
    ["grid-rows-none", undefined, invalidProperty("grid-template-rows")],
    [
      "grid-rows-[200px_minmax(900px,_1fr)_100px]",
      undefined,
      invalidProperty("grid-template-rows"),
    ],
  ]);
});

describe("Flexbox & Grid - Grid Row Start / End", () => {
  testEachClassName([
    ["row-auto", undefined, invalidProperty("grid-row")],
    ["row-span-1", undefined, invalidProperty("grid-row")],
    ["row-span-full", undefined, invalidProperty("grid-row")],
    ["row-start-1", undefined, invalidProperty("grid-row-start")],
    ["row-start-auto", undefined, invalidProperty("grid-row-start")],
    ["row-end-1", undefined, invalidProperty("grid-row-end")],
    ["row-end-auto", undefined, invalidProperty("grid-row-end")],
  ]);
});

describe("Flexbox & Grid - Grid Auto Flow", () => {
  testEachClassName([
    ["grid-flow-row", undefined, invalidProperty("grid-auto-flow")],
    ["grid-flow-col", undefined, invalidProperty("grid-auto-flow")],
    ["grid-flow-row-dense", undefined, invalidProperty("grid-auto-flow")],
    ["grid-flow-col-dense", undefined, invalidProperty("grid-auto-flow")],
  ]);
});

describe("Flexbox & Grid - Grid Auto Columns", () => {
  testEachClassName([
    ["auto-cols-auto", undefined, invalidProperty("grid-auto-columns")],
    ["auto-cols-min", undefined, invalidProperty("grid-auto-columns")],
    ["auto-cols-max", undefined, invalidProperty("grid-auto-columns")],
    ["auto-cols-fr", undefined, invalidProperty("grid-auto-columns")],
  ]);
});

describe("Flexbox & Grid - Grid Auto Rows", () => {
  testEachClassName([
    ["auto-rows-auto", undefined, invalidProperty("grid-auto-rows")],
    ["auto-rows-min", undefined, invalidProperty("grid-auto-rows")],
    ["auto-rows-max", undefined, invalidProperty("grid-auto-rows")],
    ["auto-rows-fr", undefined, invalidProperty("grid-auto-rows")],
  ]);
});

describe("Flexbox & Grid - Gap", () => {
  testEachClassName([
    ["gap-0", { style: { columnGap: 0, rowGap: 0 } }],
    ["gap-1", { style: { columnGap: 3.5, rowGap: 3.5 } }],
    ["gap-px", { style: { columnGap: 1, rowGap: 1 } }],
    ["gap-x-1", { style: { columnGap: 3.5 } }],
    ["gap-y-1", { style: { rowGap: 3.5 } }],
  ]);
});

describe("Flexbox & Grid - Justify Content", () => {
  testEachClassName([
    ["justify-start", { style: { justifyContent: "flex-start" } }],
    ["justify-end", { style: { justifyContent: "flex-end" } }],
    ["justify-center", { style: { justifyContent: "center" } }],
    ["justify-between", { style: { justifyContent: "space-between" } }],
    ["justify-around", { style: { justifyContent: "space-around" } }],
    ["justify-evenly", { style: { justifyContent: "space-evenly" } }],
  ]);
});

describe("Flexbox & Grid - Justify Items", () => {
  testEachClassName([
    ["justify-items-start", undefined, invalidProperty("justify-items")],
    ["justify-items-end", undefined, invalidProperty("justify-items")],
    ["justify-items-center", undefined, invalidProperty("justify-items")],
    ["justify-items-stretch", undefined, invalidProperty("justify-items")],
  ]);
});

describe("Flexbox & Grid - Justify Self", () => {
  testEachClassName([
    ["justify-self-auto", undefined, invalidProperty("justify-self")],
    ["justify-self-start", undefined, invalidProperty("justify-self")],
    ["justify-self-end", undefined, invalidProperty("justify-self")],
    ["justify-self-center", undefined, invalidProperty("justify-self")],
    ["justify-self-stretch", undefined, invalidProperty("justify-self")],
  ]);
});

describe("Flexbox & Grid - Align Items", () => {
  testEachClassName([
    ["items-center", { style: { alignItems: "center" } }],
    ["items-start", { style: { alignItems: "flex-start" } }],
    ["items-end", { style: { alignItems: "flex-end" } }],
    ["items-baseline", { style: { alignItems: "baseline" } }],
    ["items-stretch", { style: { alignItems: "stretch" } }],
  ]);
});

describe("Flexbox & Grid - Align Self", () => {
  testEachClassName([
    ["self-auto", { style: { alignSelf: "auto" } }],
    ["self-start", { style: { alignSelf: "flex-start" } }],
    ["self-end", { style: { alignSelf: "flex-end" } }],
    ["self-center", { style: { alignSelf: "center" } }],
    ["self-stretch", { style: { alignSelf: "stretch" } }],
    ["self-baseline", { style: { alignSelf: "baseline" } }],
  ]);
});

describe("Flexbox & Grid - Align Content", () => {
  testEachClassName([
    ["content-center", { style: { alignContent: "center" } }],
    ["content-start", { style: { alignContent: "flex-start" } }],
    ["content-end", { style: { alignContent: "flex-end" } }],
    ["content-between", { style: { alignContent: "space-between" } }],
    ["content-around", { style: { alignContent: "space-around" } }],
    [
      "content-evenly",
      undefined,
      invalidValue({ "align-content": "space-evenly" }),
    ],
  ]);
});

describe("Flexbox & Grid - Place Items", () => {
  testEachClassName([
    ["place-items-start", undefined, invalidProperty("place-items")],
    ["place-items-end", undefined, invalidProperty("place-items")],
    ["place-items-center", undefined, invalidProperty("place-items")],
    ["place-items-stretch", undefined, invalidProperty("place-items")],
  ]);
});

describe("Flexbox & Grid - Place Self", () => {
  testEachClassName([
    ["place-self-auto", undefined, invalidProperty("place-self")],
    ["place-self-start", undefined, invalidProperty("place-self")],
    ["place-self-end", undefined, invalidProperty("place-self")],
    ["place-self-center", undefined, invalidProperty("place-self")],
    ["place-self-stretch", undefined, invalidProperty("place-self")],
  ]);
});
