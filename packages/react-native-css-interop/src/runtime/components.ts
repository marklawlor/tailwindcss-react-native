"use client";

import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  Switch,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  VirtualizedList,
} from "react-native";

import { cssInterop, remapProps } from "./api";

cssInterop(Image, { className: "style" });
cssInterop(Pressable, { className: "style" });
cssInterop(SafeAreaView, { className: "style" });
cssInterop(Switch, { className: "style" });
cssInterop(Text, { className: "style" });
cssInterop(TouchableHighlight, { className: "style" });
cssInterop(TouchableOpacity, { className: "style" });
cssInterop(TouchableWithoutFeedback, { className: "style" });
cssInterop(View, { className: "style" });
cssInterop(ActivityIndicator, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});
cssInterop(StatusBar, {
  className: { target: false, nativeStyleToProp: { backgroundColor: true } },
});
cssInterop(ScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});
cssInterop(TextInput, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
});

remapProps(FlatList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  columnWrapperClassName: "columnWrapperStyle",
  contentContainerClassName: "contentContainerStyle",
});
remapProps(SectionList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  contentContainerClassName: "contentContainerStyle",
});
remapProps(ImageBackground, {
  className: "style",
  imageClassName: "imageStyle",
});
remapProps(KeyboardAvoidingView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});
remapProps(VirtualizedList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  contentContainerClassName: "contentContainerStyle",
});

try {
  const SafeAreaView = require("react-native-safe-area-context").SafeAreaView;
  cssInterop(SafeAreaView, {
    className: "style",
  });
} catch {}
