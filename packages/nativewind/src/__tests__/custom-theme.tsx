/** @jsxImportSource nativewind */
import { View } from "react-native";
import { render } from "../test-utils";
import { act, screen } from "@testing-library/react-native";
import { colorScheme } from "react-native-css-interop";

const testID = "react-native-css-interop";

test("Using css variables", async () => {
  // https://tailwindcss.com/docs/customizing-colors#using-css-variables
  await render(<View testID={testID} className="text-primary" />, {
    css: `
      @tailwind base;
      @tailwind components;
      @tailwind utilities;

      @layer base {
        :root {
          --color-primary: 255 115 179;
        }
        .dark:root {
          --color-primary: 155 100 255;
        }
      }
    `,
    config: {
      darkMode: "class",
      theme: {
        colors: {
          primary: "rgb(var(--color-primary) / <alpha-value>)",
        },
      },
    },
  });

  const component = screen.getByTestId(testID);

  expect(component).toHaveStyle({ color: "rgba(255, 115, 179, 1)" });

  act(() => colorScheme.set("dark"));

  expect(component).toHaveStyle({ color: "rgba(155, 100, 255, 1)" });
});
