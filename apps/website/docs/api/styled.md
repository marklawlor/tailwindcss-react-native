---
title: styled()
sidebar_label: styled()
---

## Usage

`styled()` is a [Higher-Order Component](https://reactjs.org/docs/higher-order-components.html) which allows your component to accept either the `tw` or `className` props. These props are compiled into StyleSheet objects and passed to your component via the `style` prop.

There are no differences between `tw` and `className`.

```SnackPlayer name=Styled
import { Text } from "react-native";
import { styled } from "nativewind";

const StyledText = styled(Text);

function App() {
  return (
    <>
      <StyledText tw="font-bold">Hello world.</StyledText>
      <StyledText className="font-bold">Hello world.</StyledText>
    </>
  );
}
```

## Default styles

`styled()` can be used similar to Styled Components, and provide base styling.

```SnackPlayer name=Styled
import { View, Text } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View, 'flex-1 items-center justify-center');
const StyledText = styled(Text, 'font-bold');

function App() {
  return (
    <StyledView>
      <StyledText>Hello world.</StyledText>;
    </StyledView>
  )
}
```

## Styling multiple properties

`styled()` can optionally accept a list of additional props to parse into runtime styles.

```tsx
function Wrapper({ innerStyle, children, ...props }) {
  return (
    <View {...props}>
      <View style={innerStyle}>
        { children }
      </View>
    </View>
  )
}

const StyledWrapper = styled(Wrapper, {
  props: {
    innerStyle: true
  }
})

<StyledWrapper className="h-4" innerStyle="p-4"><Text>Hello, World!</Text></StyledWrapper>
```

## Mixing between inline props and CSS classes

Some components can either accept a value as a prop or be styled by CSS. An example is `react-native-svg` which provides as `fill` prop, but on web can also accept a class providing `fill` styling.

You can flag a components props as `classProps` to ensure the best output is used.

```tsx
import { styled } from "nativewind";
import { Svg, Rect } from "react-native-svg";

const StyledRect = styled(Rect, {
  classProps: ["fill", "stroke"],
});

function MyStyledSvg({ fill, stroke, ...props }) {
  return (
    <Svg height="100" width="100" {...props}>
      <StyledRect
        x="0"
        y="0"
        width="100"
        height="100"
        fill={fill}
        stroke={stroke}
      />
    </Svg>
  );
}

<MyStyledSvg fill="fill-black" stroke="stroke-2 stroke-blue-500" />;
```

## Styling non-style properties

:::danger

Mapping non-style props will not work when outputting CSS. If you need a theme value (e.g. color) consider importing [theme values instead](../guides/theme-values).

:::

`styled()` can also accept a object which maps style properties to component properties.

```tsx
const StyledWrapper = styled(Wrapper, {
  props: {
    placeholderTextColor: "color",
  },
});
```
