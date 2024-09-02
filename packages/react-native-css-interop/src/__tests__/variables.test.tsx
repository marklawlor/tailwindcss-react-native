/** @jsxImportSource react-native-css-interop */
import { memo, useEffect } from "react";
import { View, ViewProps } from "react-native";
import {
  render,
  screen,
  registerCSS,
  useUnstableNativeVariable,
  setupAllComponents,
  cssInterop,
} from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

test("inline variable", () => {
  registerCSS(`.my-class { width: var(--my-var); --my-var: 10px; }`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    width: 10,
  });
});

test("combined inline variable", () => {
  registerCSS(`
    .my-class-1 { width: var(--my-var); }
    .my-class-2 { --my-var: 10px; }
    .my-class-3 { --my-var: 20px; }
  `);

  render(<View testID={testID} className="my-class-1 my-class-2" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    width: 10,
  });

  // Prove that the order doesn't matter
  screen.rerender(<View testID={testID} className="my-class-1 my-class-3" />);

  expect(component).toHaveStyle({
    width: 20,
  });
});

test("inherit variables", () => {
  registerCSS(`
    .my-class-1 { width: var(--my-var); }
    .my-class-2 { --my-var: 10px; }
    .my-class-3 { --my-var: 20px; }
  `);

  const effect = jest.fn();
  const Child = (props: ViewProps) => {
    useEffect(effect);
    return <View {...props} />;
  };

  cssInterop(Child, {
    className: "style",
  });

  const { getByTestId } = render(
    <View testID="a" className="my-class-2">
      <Child testID="b" className="my-class-1" />
    </View>,
  );

  const a = getByTestId("a");
  let b = getByTestId("b");

  expect(a).toHaveStyle(undefined);
  expect(b).toHaveStyle({ width: 10 });
  expect(effect).toHaveBeenCalledTimes(1);

  screen.rerender(
    <View testID="a" className="my-class-3">
      <View testID="b" className="my-class-1" />
    </View>,
  );

  b = getByTestId("b");

  // expect(B.mock).toHaveBeenCalledTimes(2);
  expect(a).toHaveStyle(undefined);
  expect(b).toHaveStyle({ width: 20 });
});

test("inherit variables - memo", () => {
  const effect = jest.fn();
  const Child = memo((props: ViewProps) => {
    useEffect(effect);
    return <View {...props} />;
  });

  cssInterop(Child, {
    className: "style",
  });

  registerCSS(`
    .my-class-1 { width: var(--my-var); }
    .my-class-2 { --my-var: 10px; }
    .my-class-3 { --my-var: 20px; }
  `);

  const { getByTestId } = render(
    <View testID="a" className="my-class-2">
      <Child testID="b" className="my-class-1" />
    </View>,
  );

  const a = getByTestId("a");
  let b = getByTestId("b");

  expect(a).toHaveStyle(undefined);
  expect(b).toHaveStyle({ width: 10 });

  screen.rerender(
    <View testID="a" className="my-class-3">
      <Child testID="b" className="my-class-1" />
    </View>,
  );

  b = getByTestId("b");

  expect(a).toHaveStyle(undefined);
  expect(b).toHaveStyle({ width: 20 });
});

test(":root variables", () => {
  registerCSS(`
    :root { --my-var: red; }
    .my-class { color: var(--my-var); }
  `);

  const component = render(
    <View testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({ color: "red" });
});

test("useUnsafeVariable", () => {
  registerCSS(`
    :root { --my-var: red; }
  `);

  let myVar;

  const Component = () => {
    myVar = useUnstableNativeVariable("--my-var");
    return null;
  };

  render(<Component />);

  expect(myVar).toEqual("red");
});
