module.exports = Object.assign(
  () =>
    process.env.NATIVEWIND_NATIVE === undefined ||
    process.env.NATIVEWIND_NATIVE === "web"
      ? require("./web").default
      : require("./native").default,
  {
    nativewind: true,
  },
);
