/** @jsxImportSource react-native-css-interop */
import { View } from "react-native";

import { render, screen, registerCSS, setupAllComponents } from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

describe("hsl", () => {
  test("inline", () => {
    registerCSS(`.my-class {
    color: hsl(0 84.2% 60.2%);
  }`);

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({
      color: "rgba(239, 68, 68, 1)",
    });
  });

  test("inline with comma", () => {
    registerCSS(`.my-class {
    color: hsl(0, 84.2%, 60.2%);
  }`);

    const component = render(
      <View testID={testID} className="my-class" />,
    ).getByTestId(testID);

    expect(component).toHaveStyle({
      color: "rgba(239, 68, 68, 1)",
    });
  });

  test("var with spaces", () => {
    registerCSS(`.my-class {
    --primary: 0 84.2% 60.2%;
    color: hsl(var(--primary));
  }`);

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({ color: "hsl(0, 84.2%, 60.2%)" });
  });

  test("var with comma", () => {
    registerCSS(`.my-class {
    --primary: 0, 84.2%, 60.2%;
    color: hsl(var(--primary));
  }`);

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({ color: "hsl(0, 84.2%, 60.2%)" });
  });
});

describe("hsla", () => {
  test("inline with slash", () => {
    registerCSS(`.my-class {
    color: hsla(0 84.2% 60.2% / 60%);
  }`);

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({
      color: "rgba(239, 68, 68, 0.6000000238418579)",
    });
  });

  test("inline with comma", () => {
    registerCSS(`.my-class {
    color: hsla(0, 84.2%, 60.2%, 60%);
  }`);

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({
      color: "rgba(239, 68, 68, 0.6000000238418579)",
    });
  });

  test("function with slash", () => {
    registerCSS(`.my-class {
    --primary: 0 84.2% 60.2% / 60%;
    color: hsla(var(--primary));
  }`);

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({ color: "hsla(0, 84.2%, 60.2%, 60%)" });
  });

  test("function with comma", () => {
    registerCSS(`.my-class {
    --primary: 0, 84.2%, 60.2%, 60%;
    color: hsla(var(--primary));
  }`);

    render(<View testID={testID} className="my-class" />);
    const component = screen.getByTestId(testID);

    expect(component).toHaveStyle({ color: "hsla(0, 84.2%, 60.2%, 60%)" });
  });
});
