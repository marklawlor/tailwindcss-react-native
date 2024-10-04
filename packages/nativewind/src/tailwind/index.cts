module.exports = Object.assign(
  () =>
    process.env.NATIVEWIND_OS === undefined ||
    process.env.NATIVEWIND_OS === "web"
      ? require("./web").default
      : require("./native").default,
  {
    nativewind: true,
  },
);
