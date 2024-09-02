/** @jsxImportSource react-native-css-interop */
import { View } from "react-native";

import {
  registerCSS,
  screen,
  act,
  render,
  native,
  INTERNAL_SET,
  rem,
  setupAllComponents,
} from "test-utils";

const { vw, vh } = native;

const testID = "react-native-css-interop";
setupAllComponents();

test("px", () => {
  registerCSS(`.my-class { width: 10px; }`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    width: 10,
  });
});

test("%", () => {
  registerCSS(`.my-class { width: 10%; }`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({
    width: "10%",
  });
});

test("vw", () => {
  registerCSS(`.my-class { width: 10vw; }`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(vw.get()).toEqual(750);
  expect(component).toHaveStyle({ width: 75 });

  act(() => {
    vw[INTERNAL_SET](100);
  });

  expect(vw.get()).toEqual(100);
  expect(component).toHaveStyle({ width: 10 });
});

test("vh", () => {
  registerCSS(`.my-class { height: 10vh; }`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(vh.get()).toEqual(1334);
  expect(component).toHaveStyle({ height: 133.4 });

  act(() => {
    vh[INTERNAL_SET](100);
  });

  expect(vh.get()).toEqual(100);
  expect(component).toHaveStyle({ height: 10 });
});

test("rem - default", () => {
  registerCSS(`.my-class { font-size: 10rem; }`);

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ fontSize: 140 });
});

test("rem - override", () => {
  registerCSS(`.my-class { font-size: 10rem; }`, {
    inlineRem: 10,
  });

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ fontSize: 100 });
});

test("rem - dynamic", () => {
  registerCSS(`.my-class { font-size: 10rem; }`, {
    inlineRem: false,
  });

  render(<View testID={testID} className="my-class" />);
  const component = screen.getByTestId(testID);

  expect(rem.get()).toEqual(14);
  expect(component).toHaveStyle({ fontSize: 140 });

  act(() => rem.set(10));

  expect(rem.get()).toEqual(10);
  expect(component).toHaveStyle({ fontSize: 100 });
});
