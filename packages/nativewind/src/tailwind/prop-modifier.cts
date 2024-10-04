import plugin from "tailwindcss/plugin";

export const webPropModifierPlugin = plugin(function ({ matchVariant, e }) {
  matchVariant("prop", () => {
    return `&`;
  });
});
