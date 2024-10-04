const isNative = Boolean(process.env.NATIVEWIND_OS);

export const {
  hairlineWidth,
  platformSelect,
  pixelScaleSelect,
  fontScaleSelect,
  pixelScale,
  fontScale,
  roundToNearestPixel,
  platformColor,
  getPixelSizeForLayoutSize,
} = isNative
  ? require("react-native-css-interop/css-to-rn/functions")
  : require("react-native-css-interop/css-to-rn/functions-web");
