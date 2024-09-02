/** @jsxImportSource react-native-css-interop */
import { View } from "react-native";

import { registerCSS, render, setupAllComponents, screen } from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

test("heading", () => {
  registerCSS(`.my-class { font-size: 3rem; line-height: 1; }`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    fontSize: 42,
    lineHeight: 42,
  });
});
