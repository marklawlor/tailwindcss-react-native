/** @jsxImportSource nativewind */
import { View } from "react-native";
import { render } from "../test-utils";
import { screen } from "@testing-library/react-native";

const testID = "react-native-css-interop";

test("platformModifiers: ios", async () => {
  await render(
    <View
      testID={testID}
      className="ios:text-white android:text-black web:text-red-500"
    />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("platformModifiers: ios native", async () => {
  await render(
    <View
      testID={testID}
      className="ios:text-white native:text-black web:text-red-500"
    />,
  );

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgba(0, 0, 0, 1)" });
});
