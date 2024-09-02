/** @jsxImportSource react-native-css-interop */
import { View } from "react-native";

import { render, registerCSS, setupAllComponents } from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

test("type prefix", () => {
  registerCSS(`html .my-class { color: red; }`, {
    selectorPrefix: "html",
  });

  const component = render(
    <View testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });
});

test("class prefix", () => {
  registerCSS(`.test .my-class { color: red; }`, {
    selectorPrefix: ".test",
  });

  const component = render(
    <View testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });
});
