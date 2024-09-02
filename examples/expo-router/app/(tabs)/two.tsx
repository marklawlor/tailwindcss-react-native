import { useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <View className="p-2">
      <Text className="text-black-400">Tab two!!</Text>
      <View className="bg-red-500 w-full h-[300] rounded-[40] border-continuous" />
    </View>
  );
}
