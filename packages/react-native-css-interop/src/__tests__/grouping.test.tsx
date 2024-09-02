/** @jsxImportSource react-native-css-interop */
import { View } from "react-native";

import {
  fireEvent,
  render,
  screen,
  registerCSS,
  setupAllComponents,
} from "test-utils";

const grouping = ["^group(/.*)?"];
const parentID = "parent";
const childID = "child";
setupAllComponents();

test("group", async () => {
  registerCSS(
    `.group\\/item .my-class {
      color: red;
    }`,
    {
      grouping,
    },
  );

  const { rerender, getByTestId } = render(
    <View testID={parentID} className="group/item">
      <View testID={childID} className="my-class" />
    </View>,
  );

  expect(getByTestId(childID)).toHaveStyle({ color: "rgba(255, 0, 0, 1)" });

  rerender(
    <View testID={parentID}>
      <View testID={childID} className="my-class" />
    </View>,
  );

  expect(getByTestId(childID)).toHaveStyle(undefined);
});

test("group - active", async () => {
  registerCSS(
    `.group\\/item:active .my-class {
      color: red;
    }`,
    {
      grouping,
    },
  );

  render(
    <View testID={parentID} className="group/item">
      <View testID={childID} className="my-class" />
    </View>,
  );

  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(child).toHaveStyle(undefined);

  fireEvent(parent, "pressIn");

  expect(child).toHaveStyle({ color: "rgba(255, 0, 0, 1)" });
});

test("invalid group", async () => {
  registerCSS(
    `.invalid .my-class {
      color: red;
    }`,
    {
      grouping,
    },
  );

  const { rerender } = render(<View testID={childID} className="my-class" />);
  const componentB = screen.findAllByTestId(childID);

  expect(componentB).toHaveStyle(undefined);

  rerender(
    <View testID={parentID} className="invalid">
      <View testID={childID} className="my-class" />
    </View>,
  );

  expect(componentB).toHaveStyle(undefined);
});

test("group selector", async () => {
  registerCSS(
    `.group.test .my-class {
      color: red;
    }`,
    {
      grouping,
    },
  );

  const { rerender, getByTestId } = render(
    <View className="group test">
      <View testID={childID} className="my-class" />
    </View>,
  );

  expect(getByTestId(childID)).toHaveStyle({ color: "rgba(255, 0, 0, 1)" });

  rerender(
    <View>
      <View testID={childID} className="my-class" />
    </View>,
  );

  expect(getByTestId(childID)).toHaveStyle(undefined);
});
