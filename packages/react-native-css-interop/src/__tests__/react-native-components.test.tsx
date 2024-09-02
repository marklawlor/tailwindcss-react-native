/** @jsxImportSource react-native-css-interop */
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StatusBar,
  VirtualizedList,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { screen, registerCSS, render, setupAllComponents } from "test-utils";

const testID = "react-native-css-interop";
setupAllComponents();

test("Component types", () => {
  [
    <Modal className="bg-black" presentationClassName="bg-black" />,
    <Pressable className="bg-black" />,
    <StatusBar className="bg-black" />,
    <Text className="bg-black" />,
    <View className="bg-black" />,
    <ImageBackground
      source={{}}
      className="bg-black"
      imageClassName="bg-black"
    />,
    <TextInput className="bg-black" placeholderClassName="bg-black" />,
    <KeyboardAvoidingView
      className="bg-black"
      contentContainerClassName="bg-black"
    />,
    <ScrollView
      className="bg-black"
      contentContainerClassName="bg-black"
      indicatorClassName="bg-black"
    />,
    <VirtualizedList
      data={[]}
      renderItem={() => null}
      className="bg-black"
      ListHeaderComponentClassName="bg-black"
      ListFooterComponentClassName="bg-black"
      contentContainerClassName="bg-black"
      indicatorClassName="bg-black"
    />,
  ];
});

test("TextInput", () => {
  registerCSS(
    `.text-black { color: black }
     .placeholder\\:text-white {
       @rn-move color placeholderTextColor;
       color: #fff
     }`,
  );

  render(
    <TextInput testID={testID} className="text-black placeholder:text-white" />,
  );

  const component = screen.getByTestId(testID);

  expect(component.props).toEqual(
    expect.objectContaining({
      testID,
      placeholderTextColor: "rgba(255, 255, 255, 1)",
      style: {
        color: "rgba(0, 0, 0, 1)",
      },
    }),
  );
});

test("ActivityIndicator", () => {
  registerCSS(
    `.bg-black { background-color: black } .text-white { color: white }`,
  );

  render(<ActivityIndicator testID={testID} className="bg-black text-white" />);

  const component = screen.getByTestId(testID);

  // These should be removed
  expect(component.props).not.toEqual({
    className: expect.any,
  });

  // ActivityIndicator will not render a backgroundColor
  expect(component.props).toEqual(
    expect.objectContaining({
      testID,
      color: "rgba(255, 255, 255, 1)",
      style: {
        backgroundColor: "rgba(0, 0, 0, 1)",
      },
    }),
  );
});
