import { renderCurrentTest } from "../test";

describe("Transforms - Scale", () => {
  test("scale-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("scale-x-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("scale-y-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("scale-50", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("scale-x-50", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });

  test("scale-y-50", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
});

describe("Transforms - Rotate", () => {
  test("rotate-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("rotate-180", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("rotate-[30deg]", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
});

describe("Transforms - Translate", () => {
  test("translate-x-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("translate-y-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("translate-x-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("translate-y-px", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("translate-x-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("translate-y-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
});

describe("Transforms - Translate (%)", () => {
  test("translate-x-1/2", async () => {
    expect(
      await renderCurrentTest({
        className: "w-2 translate-x-1/2",
      }),
    ).toStrictEqual({
      props: {
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
    });
  });
  test("translate-y-1/2", async () => {
    expect(
      await renderCurrentTest({
        className: "h-2 translate-y-1/2",
      }),
    ).toStrictEqual({
      props: {
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
    });
  });
  test("translate-x-full", async () => {
    expect(
      await renderCurrentTest({
        className: "w-2 translate-x-full",
      }),
    ).toStrictEqual({
      props: {
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
    });
  });
  test("translate-y-full", async () => {
    expect(
      await renderCurrentTest({
        className: "h-2 translate-y-full",
      }),
    ).toStrictEqual({
      props: {
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
    });
  });
});

describe("Transforms - Skew", () => {
  test("skew-x-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("skew-y-0", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("skew-x-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
  test("skew-y-1", async () => {
    expect(await renderCurrentTest()).toStrictEqual({
      props: {
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
    });
  });
});

describe("Transforms - Mixed", () => {
  test("rotate-90 skew-y-1 translate-x-1", async () => {
    expect(
      await renderCurrentTest({
        className: "rotate-90 skew-y-1 translate-x-1",
      }),
    ).toStrictEqual({
      props: {
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
    });
  });

  describe("Transforms - Transform Origin", () => {
    test("origin-center", async () => {
      expect(
        await renderCurrentTest({
          layers: {
            base: false,
          },
        }),
      ).toStrictEqual({
        props: {
          style: {
            transform: [{ transformOrigin: ["50%", "50%"] }],
          },
        },
      });
    });
    test("origin-top", async () => {
      expect(await renderCurrentTest()).toStrictEqual({
        props: {
          style: {
            transform: [{ transformOrigin: ["50%", "0%"] }],
          },
        },
      });
    });
    test("origin-top-right", async () => {
      expect(await renderCurrentTest()).toStrictEqual({
        props: {
          style: {
            transform: [{ transformOrigin: ["100%", "0%"] }],
          },
        },
      });
    });
    test("origin-right", async () => {
      expect(await renderCurrentTest()).toStrictEqual({
        props: {
          style: {
            transform: [{ transformOrigin: ["100%", "50%"] }],
          },
        },
      });
    });
    test("origin-bottom-right", async () => {
      expect(await renderCurrentTest()).toStrictEqual({
        props: {
          style: {
            transform: [{ transformOrigin: ["100%", "100%"] }],
          },
        },
      });
    });
    test("origin-bottom", async () => {
      expect(await renderCurrentTest()).toStrictEqual({
        props: {
          style: {
            transform: [{ transformOrigin: ["50%", "100%"] }],
          },
        },
      });
    });
    test("origin-bottom-left", async () => {
      expect(await renderCurrentTest()).toStrictEqual({
        props: {
          style: {
            transform: [{ transformOrigin: ["0%", "100%"] }],
          },
        },
      });
    });
    test("origin-left", async () => {
      expect(await renderCurrentTest()).toStrictEqual({
        props: {
          style: {
            transform: [{ transformOrigin: ["0%", "50%"] }],
          },
        },
      });
    });
    test("origin-top-left", async () => {
      expect(await renderCurrentTest()).toStrictEqual({
        props: {
          style: {
            transform: [{ transformOrigin: ["0%", "0%"] }],
          },
        },
      });
    });
  });
});
