import plugin from "tailwindcss/plugin";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import withAlphaVariable from "tailwindcss/lib/util/withAlphaVariable";
import toColorValue from "tailwindcss/lib/util/toColorValue";

export const color = plugin(function ({ matchUtilities, corePlugins, theme }) {
  matchUtilities(
    {
      color: (value) => {
        if (!corePlugins("textOpacity")) {
          return { color: toColorValue(value) };
        }

        return withAlphaVariable({
          color: value,
          property: "color",
          variable: "--tw-text-opacity",
        });
      },
    },
    { values: flattenColorPalette(theme("textColor")), type: ["color", "any"] },
  );
});
