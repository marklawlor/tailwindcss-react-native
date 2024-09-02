/** @jsxImportSource react-native-css-interop */
import { TextInput } from "react-native";

import {
  fireEvent,
  screen,
  render,
  registerCSS,
  setupAllComponents,
} from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

test("hover", () => {
  registerCSS(`.my-class:hover { width: 10px; }`);

  render(<TextInput testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "hoverIn");
  expect(component).toHaveStyle({ width: 10 });

  fireEvent(component, "hoverOut");
  expect(component).toHaveStyle(undefined);
});

test("active", () => {
  registerCSS(`.my-class:active { width: 10px; }`);

  render(<TextInput testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "pressIn");
  expect(component).toHaveStyle({ width: 10 });

  fireEvent(component, "pressOut");
  expect(component).toHaveStyle(undefined);
});

test("focus", () => {
  registerCSS(`.my-class:focus { width: 10px; }`);

  render(<TextInput testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "focus");
  expect(component).toHaveStyle({ width: 10 });

  fireEvent(component, "blur");
  expect(component).toHaveStyle(undefined);
});

test(":hover:active:focus", () => {
  registerCSS(`.my-class:hover:active:focus { width: 10px; }`);

  render(<TextInput testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle(undefined);

  fireEvent(component, "hoverIn", {});
  expect(component).toHaveStyle(undefined);

  fireEvent(component, "pressIn", {});
  expect(component).toHaveStyle(undefined);

  fireEvent(component, "focus", {});
  expect(component).toHaveStyle({ width: 10 });

  fireEvent(component, "hoverOut", {});
  expect(component).toHaveStyle(undefined);
});
