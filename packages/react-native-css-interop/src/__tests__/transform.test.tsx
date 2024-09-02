/** @jsxImportSource react-native-css-interop */
import { View } from "react-native";

import { render, registerCSS, setupAllComponents } from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

test("translateX percentage", () => {
  registerCSS(`.my-class { width: 120px; transform: translateX(10%); }`);

  const component = render(
    <View testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    width: 120,
    transform: [{ translateX: 12 }],
  });
});

test("translateY percentage", () => {
  registerCSS(`.my-class { height: 120px; transform: translateY(10%); }`);

  const component = render(
    <View testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    height: 120,
    transform: [{ translateY: 12 }],
  });
});

test("rotate-180", () => {
  registerCSS(`.my-class { transform: rotate(180deg); }`);

  const component = render(
    <View testID={testID} className="my-class" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    transform: [{ rotate: "180deg" }],
  });
});

test("rotate-45", () => {
  registerCSS(`
* {
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0deg;
  --tw-skew-x: 0deg;
  --tw-skew-y: 0deg;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
}

.rotate-45 {
  --tw-rotate: 45deg;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))
}`);

  const component = render(
    <View testID={testID} className="rotate-45" />,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    transform: [
      { translateX: 0 },
      { translateY: 0 },
      { rotate: "45deg" },
      { skewX: "0deg" },
      { skewY: "0deg" },
      { scaleX: 1 },
      { scaleY: 1 },
    ],
  });
});
