/** @jsxImportSource nativewind */
import { View } from "react-native";
import { render, fireEvent, screen } from "../test-utils";

const grandparentID = "grandparentID";
const parentID = "parent";
const childID = "child";

test("Styling based on parent state (group-{modifier})", async () => {
  await render(
    <View testID={parentID} className="group">
      <View testID={childID} className="group-hover:text-white" />
    </View>,
  );

  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(parent).toHaveStyle(undefined);
  expect(child).toHaveStyle(undefined);

  fireEvent(parent, "hoverIn");

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("Differentiating nested groups", async () => {
  await render(
    <View testID={grandparentID} className="group/grandparent">
      <View testID={parentID} className="group/parent">
        <View className="group-hover/grandparent:text-white" />
        <View testID={childID} className="group-hover/parent:text-white" />
      </View>
    </View>,
  );

  const grandparent = screen.getByTestId(grandparentID);
  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(grandparent).toHaveStyle(undefined);
  expect(parent).toHaveStyle(undefined);
  expect(child).toHaveStyle(undefined);

  fireEvent(grandparent, "hoverIn");

  expect(child).toHaveStyle(undefined);

  fireEvent(parent, "hoverIn");

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("arbitrary groups - single className", async () => {
  const { rerender } = await render(
    <View testID={parentID} className="group">
      <View testID={childID} className="group-[.test]:text-white" />
    </View>,
  );

  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(parent).toHaveStyle(undefined);
  expect(child).toHaveStyle(undefined);

  await rerender(
    <View testID={parentID} className="group test">
      <View testID={childID} className="group-[.test]:text-white" />
    </View>,
  );

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("arbitrary groups - multiple className", async () => {
  const { rerender } = await render(
    <View testID={parentID} className="group">
      <View testID={childID} className="group-[.test.test2]:text-white" />
    </View>,
  );

  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(parent).toHaveStyle(undefined);
  expect(child).toHaveStyle(undefined);

  await rerender(
    <View testID={parentID} className="group test">
      <View testID={childID} className="group-[.test.test2]:text-white" />
    </View>,
  );

  expect(parent).toHaveStyle(undefined);
  expect(child).toHaveStyle(undefined);

  await rerender(
    <View testID={parentID} className="group test test2">
      <View testID={childID} className="group-[.test.test2]:text-white" />
    </View>,
  );

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});

test("arbitrary groups - props", async () => {
  const { rerender } = await render(
    <View testID={parentID} className="group" accessibilityLabel="test">
      <View
        testID={childID}
        className="group-[[accessibilityLabel=works]]:text-white"
      />
    </View>,
  );

  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(parent).toHaveStyle(undefined);
  expect(child).toHaveStyle(undefined);

  await rerender(
    <View testID={parentID} className="group" accessibilityLabel="works">
      <View
        testID={childID}
        className="group-[[accessibilityLabel=works]]:text-white"
      />
    </View>,
  );

  expect(child).toHaveStyle({ color: "rgba(255, 255, 255, 1)" });
});
