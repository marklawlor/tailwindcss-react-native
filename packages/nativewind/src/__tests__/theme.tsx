/** @jsxImportSource nativewind */
import {
  PlatformColor,
  PixelRatio,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import { render } from "../test-utils";
import { screen } from "@testing-library/react-native";
import {
  fontScaleSelect,
  getPixelSizeForLayoutSize,
  hairlineWidth,
  pixelScaleSelect,
  platformColor,
  platformSelect,
  roundToNearestPixel,
} from "../theme";

const testA = "a";
const testB = "b";

test("hairlineWidth()", async () => {
  await render(<View testID={testA} className="border-custom" />, {
    config: {
      theme: {
        extend: {
          borderWidth: {
            custom: hairlineWidth(),
          },
        },
      },
    },
  });

  const component = screen.getByTestId(testA);

  expect(component).toHaveStyle({ borderWidth: StyleSheet.hairlineWidth });
});

test("platformSelect()", async () => {
  await render(
    <>
      <View testID={testA} className="text-match" />
      <View testID={testB} className="text-default" />
    </>,
    {
      config: {
        theme: {
          extend: {
            colors: {
              match: platformSelect({
                [Platform.OS]: "black",
                default: "white",
              }),
              default: platformSelect({
                [Platform.OS === "ios" ? "android" : "ios"]: "black",
                default: "white",
              }),
            },
          },
        },
      },
    },
  );

  expect(screen.getByTestId(testA)).toHaveStyle({ color: "black" });
  expect(screen.getByTestId(testB)).toHaveStyle({ color: "white" });
});

test("pixelScaleSelect()", async () => {
  const currentPixelRatio = PixelRatio.get();

  await render(
    <>
      <View testID={testA} className="text-match" />
      <View testID={testB} className="text-default" />
    </>,
    {
      config: {
        theme: {
          extend: {
            colors: {
              match: pixelScaleSelect({
                [currentPixelRatio]: "black",
                default: "white",
              }),
              default: pixelScaleSelect({
                [currentPixelRatio + 1]: "black",
                default: "white",
              }),
            },
          },
        },
      },
    },
  );

  expect(screen.getByTestId(testA)).toHaveStyle({ color: "black" });
  expect(screen.getByTestId(testB)).toHaveStyle({ color: "white" });
});

test("fontScaleSelect()", async () => {
  const fontScale = PixelRatio.getFontScale();

  await render(
    <>
      <View testID={testA} className="text-match" />
      <View testID={testB} className="text-default" />
    </>,
    {
      config: {
        theme: {
          extend: {
            colors: {
              match: fontScaleSelect({
                [fontScale]: "black",
                default: "white",
              }),
              default: fontScaleSelect({
                [fontScale + 1]: "black",
                default: "white",
              }),
            },
          },
        },
      },
    },
  );

  expect(screen.getByTestId(testA)).toHaveStyle({ color: "black" });
  expect(screen.getByTestId(testB)).toHaveStyle({ color: "white" });
});

test("roundToNearestPixel()", async () => {
  await render(<View testID={testA} className="border-custom" />, {
    config: {
      theme: {
        extend: {
          borderWidth: {
            custom: roundToNearestPixel(2.5),
          },
        },
      },
    },
  });

  expect(screen.getByTestId(testA)).toHaveStyle({
    borderWidth: PixelRatio.roundToNearestPixel(2.5),
  });
});

test("getPixelSizeForLayoutSize()", async () => {
  await render(<View testID={testA} className="border-custom" />, {
    config: {
      theme: {
        extend: {
          borderWidth: {
            custom: getPixelSizeForLayoutSize(2),
          },
        },
      },
    },
  });

  expect(screen.getByTestId(testA)).toHaveStyle({
    borderWidth: PixelRatio.getPixelSizeForLayoutSize(2),
  });
});

test("platformColor()", async () => {
  await render(<View testID={testA} className="text-custom" />, {
    config: {
      theme: {
        extend: {
          colors: {
            custom: platformColor(
              "systemTealColor",
              "?android:attr/textColor",
              "blue",
            ),
          },
        },
      },
    },
  });

  expect(screen.getByTestId(testA)).toHaveStyle({
    color: PlatformColor("systemTealColor", "?android:attr/textColor", "blue"),
  });
});

test("nested functions", async () => {
  await render(
    <View testID={testA} className="border-custom [--test:123px]" />,
    {
      config: {
        theme: {
          extend: {
            borderWidth: {
              custom: platformSelect({
                [Platform.OS]: pixelScaleSelect({
                  [PixelRatio.get()]: "var(--test)",
                }),
              }),
            },
          },
        },
      },
    },
  );

  expect(screen.getByTestId(testA)).toHaveStyle({
    borderWidth: 123,
  });
});

test("custom color w/ css variable", async () => {
  await render(
    <View
      testID={testA}
      className="text-primary-50 [--color-primary-50:240,253,250]"
    />,
    {
      config: {
        theme: {
          extend: {
            colors: {
              primary: {
                50: "rgb(var(--color-primary-50) / <alpha-value>)",
              },
            },
          },
        },
      },
    },
  );

  expect(screen.getByTestId(testA)).toHaveStyle({
    color: "rgba(240, 253, 250, 1)",
  });
});
