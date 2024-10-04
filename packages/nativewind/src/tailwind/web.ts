import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { darkModeAtRule } from "./dark-mode.cjs";
import { color } from "./color.cjs";
import { verify } from "./verify.cjs";
import { webPropModifierPlugin } from "./prop-modifier.cjs";
import { webSwitch } from "./switch.cjs";
import { allowedColors } from "./common.cjs";

const preset: Config = {
  content: [],
  theme: {
    boxShadow: {
      sm: " 0px 1px 1px rgba(0, 0, 0, 0.35)",
      DEFAULT: "0px 1px 4px rgba(0, 0, 0, 0.35)",
      md: "0px 3px 10px rgba(0, 0, 0, 0.35)",
      lg: "0px 4px 10px rgba(0, 0, 0, 0.35)",
      xl: "0px 6px 19px rgba(0, 0, 0, 0.35)",
      "2xl": "0px 12px 38px rgba(0, 0, 0, 0.35) ",
      none: "0 0 #0000",
    },
    extend: {
      trackColor: allowedColors,
      thumbColor: allowedColors,
    },
  },
  plugins: [
    plugin(({ addVariant }) => addVariant("web", "&")),
    color,
    darkModeAtRule,
    verify,
    webPropModifierPlugin,
    webSwitch,
  ],
};

export default preset;
