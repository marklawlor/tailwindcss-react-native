import { invalidProperty, testEachClassName } from "../test-utils";

describe("Transforms - Scale", () => {
  testEachClassName(
    [
      [
        "scale-0",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 0 },
              { scaleY: 0 },
            ],
          },
        },
      ],
      [
        "scale-x-0",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 0 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "scale-y-0",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 0 },
            ],
          },
        },
      ],
      [
        "scale-50",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 0.5 },
              { scaleY: 0.5 },
            ],
          },
        },
      ],
      [
        "scale-x-50",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 0.5 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "scale-y-50",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 0.5 },
            ],
          },
        },
      ],
    ],
    { layers: { base: true } },
  );
});

describe("Transforms - Rotate", () => {
  testEachClassName(
    [
      [
        "rotate-0",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "rotate-180",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "180deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "rotate-[30deg]",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "30deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
    ],
    { layers: { base: true } },
  );
});

describe("Transforms - Translate", () => {
  testEachClassName(
    [
      [
        "translate-x-0",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "translate-y-0",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "translate-x-px",
        {
          style: {
            transform: [
              { translateX: 1 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "translate-y-px",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 1 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "translate-x-1",
        {
          style: {
            transform: [
              { translateX: 3.5 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "translate-y-1",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 3.5 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
    ],
    { layers: { base: true } },
  );
});

describe("Transforms - Translate (%)", () => {
  testEachClassName(
    [
      [
        "w-2 translate-x-1/2",
        {
          style: {
            width: 7,
            transform: [
              { translateX: 3.5 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "h-2 translate-y-1/2",
        {
          style: {
            height: 7,
            transform: [
              { translateX: 0 },
              { translateY: 3.5 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "w-2 translate-x-full",
        {
          style: {
            width: 7,
            transform: [
              { translateX: 7 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "h-2 translate-y-full",
        {
          style: {
            height: 7,
            transform: [
              { translateX: 0 },
              { translateY: 7 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
    ],
    { layers: { base: true } },
  );
});

describe("Transforms - Skew", () => {
  testEachClassName(
    [
      [
        "skew-x-0",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "skew-y-0",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "skew-x-1",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "1deg" },
              { skewY: "0deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
      [
        "skew-y-1",
        {
          style: {
            transform: [
              { translateX: 0 },
              { translateY: 0 },
              { rotate: "0deg" },
              { skewX: "0deg" },
              { skewY: "1deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
    ],
    { layers: { base: true } },
  );
});

describe("Transforms - Mixed", () => {
  testEachClassName(
    [
      [
        "rotate-90 skew-y-1 translate-x-1",
        {
          style: {
            transform: [
              { translateX: 3.5 },
              { translateY: 0 },
              { rotate: "90deg" },
              { skewX: "0deg" },
              { skewY: "1deg" },
              { scaleX: 1 },
              { scaleY: 1 },
            ],
          },
        },
      ],
    ],
    { layers: { base: true } },
  );
});

describe("Transforms - Transform Origin", () => {
  testEachClassName(
    [
      ["origin-center", undefined, invalidProperty("transform-origin")],
      ["origin-top", undefined, invalidProperty("transform-origin")],
      ["origin-top-right", undefined, invalidProperty("transform-origin")],
      ["origin-right", undefined, invalidProperty("transform-origin")],
      ["origin-bottom-right", undefined, invalidProperty("transform-origin")],
      ["origin-bottom", undefined, invalidProperty("transform-origin")],
      ["origin-bottom-left", undefined, invalidProperty("transform-origin")],
      ["origin-left", undefined, invalidProperty("transform-origin")],
      ["origin-top-left", undefined, invalidProperty("transform-origin")],
    ],
    {
      layers: { base: true },
    },
  );
});
