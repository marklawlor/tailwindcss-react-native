/** @jsxImportSource react-native-css-interop */
import { View } from "react-native";

import { render, screen, registerCSS, setupAllComponents } from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

jest.useFakeTimers();

test("numeric transition", () => {
  registerCSS(`
    .transition {
      transition: width 1s linear;
    }

    .first {
      width: 100px;
    }

    .second {
      width: 200px;
    }
`);

  render(<View testID={testID} className="transition first" />);

  let component = screen.getByTestId(testID);

  // Should have a static width, no matter the time
  expect(component).toHaveAnimatedStyle({
    width: 100,
  });
  jest.advanceTimersByTime(1000);
  expect(component).toHaveAnimatedStyle({
    width: 100,
  });

  screen.rerender(<View testID={testID} className="transition second" />);

  // Directly after rerender, should still have the old width
  expect(component).toHaveAnimatedStyle({
    width: 100,
  });

  // Width should only change after we advance time
  jest.advanceTimersByTime(501);
  expect(component).toHaveAnimatedStyle({
    width: 150,
  });

  // At the end of the transition
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    width: 200,
  });

  // Width should not change after the transition is done
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    width: 200,
  });
});

test("color transition", () => {
  registerCSS(`
    .transition {
      transition: color 1s linear;
    }

    .first {
      color: red;
    }

    .second {
      color: blue;
    }
`);

  const { rerender, getByTestId } = render(
    <View testID={testID} className="transition first" />,
  );

  const component = getByTestId(testID);

  // Should have a static width, no matter the time
  expect(component).toHaveAnimatedStyle({
    color: "rgba(255, 0, 0, 1)",
  });
  jest.advanceTimersByTime(1000);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(255, 0, 0, 1)",
  });

  rerender(<View testID={testID} className="transition second" />);

  // Directly after rerender, should still have the old width
  expect(component).toHaveAnimatedStyle({
    color: "rgba(255, 0, 0, 1)",
  });

  // Width should only change after we advance time
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(186, 0, 186, 1)",
  });

  // At the end of the transition
  jest.advanceTimersByTime(501);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(0, 0, 255, 1)",
  });

  // Width should not change after the transition is done
  jest.advanceTimersByTime(500);
  expect(component).toHaveAnimatedStyle({
    color: "rgba(0, 0, 255, 1)",
  });
});
