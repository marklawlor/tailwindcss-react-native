/** @jsxImportSource react-native-css-interop */
import { View } from "react-native";

import {
  render,
  screen,
  registerCSS,
  resetComponents,
  cssInterop,
} from "test-utils";

const testID = "react-native-css-interop";

beforeEach(() => {
  resetComponents();
});

test("mapping", () => {
  cssInterop(View as any, { className: "differentStyle" });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<View testID={testID} className="bg-black text-white" />);

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    differentStyle: {
      backgroundColor: "rgba(0, 0, 0, 1)",
      color: "rgba(255, 255, 255, 1)",
    },
  });
});

test("multiple mapping", () => {
  cssInterop(View as any, { a: "styleA", b: "styleB" });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<View testID={testID} {...{ a: "bg-black", b: "text-white" }} />);

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    styleA: {
      backgroundColor: "rgba(0, 0, 0, 1)",
    },
    styleB: {
      color: "rgba(255, 255, 255, 1)",
    },
  });
});
