module.exports = {
  preset: "jest-expo",
  roots: ["src"],
  setupFiles: ["react-native-css-interop/test-utils/setup"],
  setupFilesAfterEnv: ["react-native-css-interop/test-utils/setupAfterEnv"],
};
