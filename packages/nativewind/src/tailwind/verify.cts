import plugin from "tailwindcss/plugin";
import { isWeb } from "./common.cjs";

export const verify = plugin(function ({ addBase }) {
  if (isWeb) {
    addBase({
      ":root": {
        "--css-interop": "true",
        "--css-interop-nativewind": "true",
      },
    });
  } else {
    addBase({ "@cssInterop set nativewind": "true" });
  }
});
