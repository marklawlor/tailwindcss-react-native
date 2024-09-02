/** @jsxImportSource nativewind */
import { View } from "react-native";
import { render } from "../test-utils";
import { fireEvent, screen } from "@testing-library/react-native";

const parentID = "parent";
const childID = "child";

test("Unnamed containers", async () => {
  await render(
    <View testID={parentID} className="@container">
      <View testID={childID} className="@sm:text-white" />
    </View>,
  );

  let parent = screen.getByTestId(parentID);
  let child = screen.getByTestId(childID);

  expect(child).toHaveStyle(undefined);

  // Jest does not fire layout events, so we need to manually
  fireEvent(parent, "layout", {
    nativeEvent: {
      layout: {
        width: 500,
        height: 200,
      },
    },
  });

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("Named containers", async () => {
  await render(
    <View testID={parentID} className="@container/main">
      <View testID={childID} className="@sm/main:text-white" />
    </View>,
  );

  let parent = screen.getByTestId(parentID);
  let child = screen.getByTestId(childID);

  expect(child).toHaveStyle(undefined);

  // Jest does not fire layout events, so we need to manually
  fireEvent(parent, "layout", {
    nativeEvent: {
      layout: {
        width: 500,
        height: 200,
      },
    },
  });

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});
