/** @jsxImportSource react-native-css-interop */
import { View } from "react-native";
import { useEffect } from "react";

import { fireEvent, render, registerCSS, setupAllComponents } from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

test("dynamic variables should not unmount children", () => {
  /**
   * The interop changes the render tree and can accidentally unmount components.
   * In this instance, having a variable will force the VariableProvider into the tree
   * Even if this variable is conditional, it shouldn't cause an unmount
   */
  registerCSS(`.my-class:hover { color: var(--color); --color: red; }`);

  const onUnMount = jest.fn();
  const onMount = jest.fn(() => onUnMount);

  const Child = (props: { assertMount: () => () => void; testID?: string }) => {
    useEffect(props.assertMount, []);
    return null;
  };

  const component = render(
    <View testID={testID} className="my-class">
      <Child testID="child" assertMount={onMount} />
    </View>,
  ).getByTestId(testID);

  expect(onUnMount).not.toHaveBeenCalled();
  expect(onMount).toHaveBeenCalledTimes(1);

  fireEvent(component, "hoverIn");

  expect(onUnMount).not.toHaveBeenCalled();
  expect(onMount).toHaveBeenCalledTimes(1);
});

test("empty className", () => {
  const component = render(<View testID={testID} className="" />).getByTestId(
    testID,
  );

  expect(component.props.className).not.toBeDefined();
  expect(component).toHaveStyle(undefined);
});

test("missing className", () => {
  const component = render(<View testID={testID} />).getByTestId(testID);

  expect(component.props.className).not.toBeDefined();
  expect(component.props.style).not.toBeDefined();
});
