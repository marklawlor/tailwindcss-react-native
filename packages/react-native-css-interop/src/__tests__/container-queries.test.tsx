/** @jsxImportSource react-native-css-interop */
import { View } from "react-native";

import {
  fireEvent,
  render,
  screen,
  registerCSS,
  setupAllComponents,
} from "test-utils";

const parentID = "parent";
const childID = "child";
setupAllComponents();

test("container query width", () => {
  registerCSS(`
      .container {
        container-name: my-container;
        width: 200px;
      }

      .child {
        color: red;
      }

      @container (width > 400px) {
        .child {
          color: blue;
        }
      }
    `);

  render(
    <View testID={parentID} className="container">
      <View testID={childID} className="child" />
    </View>,
  );

  const parent = screen.getByTestId(parentID);
  const child = screen.getByTestId(childID);

  expect(parent).toHaveStyle({
    width: 200,
  });

  expect(child).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });

  fireEvent(parent, "layout", {
    nativeEvent: {
      layout: {
        width: 200,
        height: 200,
      },
    },
  });

  expect(child).toHaveStyle({
    color: "rgba(255, 0, 0, 1)",
  });

  screen.rerender(
    <View testID={parentID} className="container" style={{ width: 500 }}>
      <View testID={childID} className="child" />
    </View>,
  );

  fireEvent(parent, "layout", {
    nativeEvent: {
      layout: {
        width: 500,
        height: 200,
      },
    },
  });

  expect(parent).toHaveStyle({
    width: 500,
  });

  expect(child).toHaveStyle({
    color: "rgba(0, 0, 255, 1)",
  });
});
