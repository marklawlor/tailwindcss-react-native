import { isWeb } from "./tailwind/common";

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
} = isWeb
  ? require("react-native-css-interop/css-to-rn/functions-web")
  : require("react-native-css-interop/css-to-rn/functions");
