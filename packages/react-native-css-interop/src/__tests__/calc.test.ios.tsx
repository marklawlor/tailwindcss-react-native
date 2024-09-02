/** @jsxImportSource react-native-css-interop */
import { View } from "react-native";

import { vars, render, registerCSS, setupAllComponents } from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

describe("css", () => {
  test("calc(10px + 100px)", () => {
    registerCSS(
      `.my-class {
        width: calc(10px + 100px);
      }`,
    );

    const component = render(
      <View testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      width: 110,
    });
  });

  test("calc(100% - 30px)", () => {
    // React Native does not support calc() with a percentage value, so this should be `undefined`
    registerCSS(
      `.my-class {
        width: calc(100% - 30px);
      }`,
    );

    const component = render(
      <View testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle(undefined);
  });

  test("calc(2em * 3)", () => {
    registerCSS(
      `.my-class {
        width: calc(2em * 2);
        font-size: 5px

      }`,
    );

    const component = render(
      <View testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      width: 20,
      fontSize: 5,
    });
  });

  test("calc(2rem * 5)", () => {
    registerCSS(
      `.my-class {
        width: calc(2rem * 5)
      }`,
    );

    const component = render(
      <View testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      width: 140,
    });
  });

  test("calc(var(--variable) + 20px)", () => {
    registerCSS(
      `.my-class {
        width: calc(var(--variable) + 20px)
      }`,
    );

    const component = render(
      <View
        testID={testID}
        className="my-class"
        style={vars({
          "--variable": "100px",
        })}
      />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      width: 120,
    });
  });

  test("calc(var(--percent) + 20%)", () => {
    registerCSS(
      `.my-class {
        width: calc(var(--percent) + 20%)
      }`,
    );

    const component = render(
      <View
        testID={testID}
        className="my-class"
        style={vars({
          "--percent": "10%",
        })}
      />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      width: "30%",
    });
  });
});

test("calc & colors", () => {
  registerCSS(
    `.my-class {
        background-color: hsl(
          calc(var(--H) + 20),
          calc(var(--S) - 10%),
          calc(var(--L) + 30%)
        )
      }`,
  );

  const component = render(
    <View
      testID={testID}
      className="my-class"
      style={vars({
        "--H": 100,
        "--S": "100%",
        "--L": "50%",
      })}
    />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    backgroundColor: "hsl(120, 90%, 80%)",
  });
});
