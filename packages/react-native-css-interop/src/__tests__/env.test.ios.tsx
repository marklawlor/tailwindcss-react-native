/** @jsxImportSource react-native-css-interop */
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, ViewProps } from "react-native";

import {
  registerCSS,
  render,
  setupAllComponents,
  useSafeAreaEnv,
} from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

test("safe-area-inset-*", () => {
  registerCSS(`.my-class {
    margin-top: env(safe-area-inset-top);
    margin-bottom: env(safe-area-inset-bottom);
    margin-left: env(safe-area-inset-left);
    margin-right: env(safe-area-inset-right);
  }`);

  const SafeView = (props: ViewProps) => {
    const safeAreaEnv = useSafeAreaEnv();
    return <View testID={testID} {...props} style={safeAreaEnv} />;
  };

  const component = render(
    <SafeAreaProvider
      initialMetrics={{
        insets: { top: 1, bottom: 2, left: 3, right: 4 },
        frame: { x: 0, y: 0, width: 0, height: 0 },
      }}
    >
      <SafeView className="my-class" />,
    </SafeAreaProvider>,
  ).getByTestId(testID);

  expect(component).toHaveStyle({
    marginTop: 1,
    marginBottom: 2,
    marginLeft: 3,
    marginRight: 4,
  });
});
