/** @jsxImportSource react-native-css-interop */
import { StyleSheet as RNStyleSheet, View } from "react-native";

import { render, screen, registerCSS, setupAllComponents } from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

test("platformSelect", () => {
  registerCSS(
    `.my-class {
        --test: black;
        color: green;
        color: platformSelect(ios/var(--test), android/blue);
      }`,
  );

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    color: "black",
  });
});

test("hairlineWidth", () => {
  registerCSS(
    `.my-class {
        --test: hairlineWidth();
        width: var(--test);
      }`,
  );

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    width: RNStyleSheet.hairlineWidth,
  });
});

test("max", () => {
  registerCSS(
    `.my-class {
      width: max(var(--test, 1px), 10px)
    }`,
  );

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ width: 10 });
});

test("min", () => {
  registerCSS(
    `.my-class {
      width: min(var(--test, 1px), 10px)
    }`,
  );

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ width: 1 });
});

test("clamp - value", () => {
  registerCSS(
    `.my-class {
      width: clamp(var(--test, 1px), 5px 10px)
    }`,
  );

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ width: 5 });
});

test("clamp - min", () => {
  registerCSS(
    `.my-class {
      width: clamp(var(--test, 1px), 0px 10px)
    }`,
  );

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ width: 1 });
});

test("clamp - max", () => {
  registerCSS(
    `.my-class {
      width: clamp(var(--test, 1px), 20px, 10px)
    }`,
  );

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ width: 10 });
});

test("mixed", () => {
  registerCSS(
    `.my-class {
      color: platformSelect(ios/platformColor(systemRed),android/platformColor(\?android\:colorError),default/red)
    }`,
  );

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    color: {
      semantic: ["systemRed"],
    } as any,
  });
});
