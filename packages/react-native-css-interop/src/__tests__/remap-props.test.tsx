/** @jsxImportSource react-native-css-interop */
import { FlatList, View } from "react-native";

import { RefObject, useRef } from "react";
import {
  render,
  screen,
  registerCSS,
  resetComponents,
  remapProps,
  getOpaqueStyles,
} from "test-utils";

const testID = "react-native-css-interop";

beforeEach(() => {
  resetComponents();
});

test("mapping", () => {
  remapProps(View as any, { className: "differentStyle" });

  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<View testID={testID} className="bg-black text-white" />);

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual({
    testID,
    differentStyle: {},
  });

  expect(getOpaqueStyles(component.props.differentStyle)).toEqual([
    {
      $type: "StyleRuleSet",
      normal: [
        {
          $type: "StyleRule",
          attrs: undefined,
          declarations: [
            [
              "style",
              {
                backgroundColor: "rgba(0, 0, 0, 1)",
              },
            ],
          ],
          pseudoClasses: undefined,
          specificity: {
            A: 0,
            B: 1,
            C: 0,
            I: 0,
            O: 1,
            S: 1,
          },
        },
      ],
    },
    {
      $type: "StyleRuleSet",
      normal: [
        {
          $type: "StyleRule",
          attrs: undefined,
          declarations: [
            [
              "style",
              {
                color: "rgba(255, 255, 255, 1)",
              },
            ],
          ],
          pseudoClasses: undefined,
          specificity: {
            A: 0,
            B: 1,
            C: 0,
            I: 0,
            O: 2,
            S: 1,
          },
        },
      ],
    },
  ]);
});

test("works with ref", () => {
  remapProps(FlatList, {});
  let listRef: RefObject<FlatList<any>> = { current: null };
  const items = Array.from(Array(100).keys());

  const Component = () => {
    listRef = useRef<FlatList>(null);
    return (
      <FlatList
        ref={listRef}
        data={items}
        keyExtractor={(_, i) => i.toString()}
        renderItem={(_) => <View />}
      />
    );
  };

  render(<Component />);

  expect(listRef.current).toBeInstanceOf(FlatList);
});
