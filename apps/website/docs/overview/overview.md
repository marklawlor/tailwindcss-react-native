# Overview

## What is NativeWind?

NativeWind allows you to use [Tailwind CSS](https://tailwindcss.com) to style your components in React Native. Styled components can be shared between all React Native platforms, using the best style engine for that platform; CSS StyleSheet on web and StyleSheet.create for native. Its goals are to provide a consistent styling experience across all platforms, improving Developer UX, component performance and code maintainability.

On native platforms, NativeWind performs two functions. First, at build time, it compiles your Tailwind CSS styles into `StyleSheet.create` objects and determines the conditional logic of styles (e.g. hover, focus, active, etc). Second, it has an efficient runtime system that applies the styles to your components. This means you can use the full power of Tailwind CSS, including media queries, container queries, and custom values, while still having the performance of a native style system.

On web, NativeWind is a small polyfill for adding `className` support to React Native Web.

## Key Features

🌐 **Universal** Uses the best style system for each platform.

🖥️ **DevUX** Plugins for simple setup and improving intellisense support

✨ **Media & Container queries** Use modern mobile styling features like media and container queries [(docs)](../core-concepts/states#hover-focus-and-active)

👪 **Custom values (CSS Variables)** Create themes, sub-themes and dynamic styles using custom values

✨ **Pseudo classes** hover / focus / active on compatible components [(docs)](../core-concepts/states#hover-focus-and-active)

👪 **Parent state styles** automatically style children based upon parent pseudo classes [(docs)](../core-concepts/states#hover-focus-and-active#styling-based-on-parent-state)

🔥 **Lots of other features**

- dark mode
- arbitrary classes
- platform selectors
- plugins

## How is this different StyleSheet.create?

A full featured style system should have

- Static styles
- UI state styles (active, hover, focus, etc)
- Responsive styles (media queries, dynamic units)
- Container queries (styling based upon parent appearance)
- Device state styles (orientation, color scheme)
- Use the best rendering engine available

React Native's StyleSheet system only provides static styles, with other features left for the user to implement. By using NativeWind you can focus on writing your system instead of building your own custom style system.

On the web, it avoids injecting a StyleSheet at runtime by reusing the existing Tailwind CSS stylesheet, allowing you to use Server Side Rendering and much better initial page load performance.

## In action

NativeWind handles both the Tailwind CSS compilation and the runtime styles. It works via a JSX transform, meaning there is no need for custom wrappers/boilerplate.

As all React components are transformed with JSX, it works with 3rd party modules.

```tsx
import { CustomText } from "third-party-text-component";

export function BoldText(props) {
  // You just need to write `className="<your styles>"`
  return <CustomText className="text-bold" {...props} />;
}
```

Styling can by dynamic and you can perform conditional logic and built up complex style objects.

```tsx
import { Text } from "react-native";

export function MyText({ bold, italic, lineThrough, ...props }) {
  const classNames = [];

  if (bold) classNames.push("font-bold");
  if (italic) classNames.push("italic");
  if (lineThrough) classNames.push("line-through");

  return <Text className={classNames.join(" ")} {...props} />;
}
```

By default NativeWind maps `className`->`style`, but it can handle the mapping of complex components.

```tsx
remapProps(FlatList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  columnWrapperClassName: "columnWrapperStyle",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});

<FlatList
  {...}
  className="bg-black"
  ListHeaderComponentClassName="bg-black text-white"
  ListFooterComponentClassName="bg-black text-white"
  columnWrapperClassName="bg-black"
  contentContainerClassName="bg-black"
  indicatorClassName="bg-black"
/>
```

And can even work with components that expect style attributes as props

```tsx
import { Text } from "react-native";
import { cssInterop } from "nativewind";
import { Svg, Circle } from "react-native-svg";

/**
 * Circle uses `height`/`width` props on native and className on web
 */
const StyledSVG = cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
    },
  },
});
/**
 * Circle uses `fill`/`stroke`/`strokeWidth` props on native and className on web
 */
const StyledCircle = cssInterop(Circle, {
  className: {
    target: "style",
    nativeStyleToProp: {
      fill: true,
      stroke: true,
      strokeWidth: true,
    },
  },
});

export function BoldText(props) {
  return (
    <Svg className="w-1/2 h-1/2" viewBox="0 0 100 100">
      <StyledCircle
        className="fill-green-500 stroke-blue-500 stroke-2"
        cx="50"
        cy="50"
        r="45"
      />
    </Svg>
  );
}
```
