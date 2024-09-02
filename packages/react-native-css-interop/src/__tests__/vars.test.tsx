/** @jsxImportSource react-native-css-interop */
import { View } from "react-native";
import {
  render,
  screen,
  registerCSS,
  vars,
  setupAllComponents,
} from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

test("vars", () => {
  registerCSS(
    `.my-class {
        color: var(--test);
      }`,
  );

  render(
    <View
      testID={testID}
      className="my-class"
      style={vars({ test: "black" })}
    />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    color: "black",
  });

  screen.rerender(
    <View
      testID={testID + 1}
      className="my-class"
      style={vars({ test: "blue" })}
    />,
  );

  expect(component).toHaveStyle({
    color: "blue",
  });
});
