/** @jsxImportSource react-native-css-interop */
import { Text } from "react-native";

import { render, screen, registerCSS, setupAllComponents } from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

test(":disabled", () => {
  registerCSS(`.test:disabled { width: 10px; }`);
  render(
    <Text testID={testID} className="test">
      Test
    </Text>,
  );

  const component = screen.getByTestId(testID);
  expect(component).toHaveStyle(undefined);

  screen.rerender(<Text testID={testID} className="test" disabled />);

  expect(component).toHaveStyle({ width: 10 });
});

test(":empty", () => {
  registerCSS(`.test:empty { width: 10px; }`);
  render(
    <Text testID={testID} className="test">
      Test
    </Text>,
  );

  const component = screen.getByTestId(testID);
  expect(component).toHaveStyle(undefined);

  screen.rerender(<Text testID={testID} className="test" disabled />);

  expect(component).toHaveStyle({ width: 10 });
});

describe("dataSet attribute selector", () => {
  test("truthy", () => {
    registerCSS(`.test[data-test] { width: 10px; }`);

    render(
      <Text testID={testID} className="test">
        Test
      </Text>,
    );

    const component = screen.getByTestId(testID);
    expect(component).toHaveStyle(undefined);

    screen.rerender(
      <Text
        testID={testID}
        className="test"
        {...{ dataSet: { test: true } }}
      />,
    );

    expect(component).toHaveStyle({
      width: 10,
    });
  });

  test("equals", () => {
    registerCSS(`.test[data-test='1'] { width: 10px; }`);

    render(
      <Text testID={testID} className="test">
        Test
      </Text>,
    );

    const component = screen.getByTestId(testID);
    expect(component).toHaveStyle(undefined);

    screen.rerender(
      <Text testID={testID} className="test" {...{ dataSet: { test: 2 } }} />,
    );

    expect(component).toHaveStyle(undefined);

    screen.rerender(
      <Text testID={testID} className="test" {...{ dataSet: { test: 1 } }} />,
    );

    expect(component).toHaveStyle({
      width: 10,
    });
  });
});
