---
sidebar_position: 3
title: StyledComponent
sidebar_label: <StyledComponent />
---

`StyledComponent` is the component version of [`styled`](./styled.md) accepts your component as a prop.

`StyledComponent` will pass all props to your component, except for `tw` and `className` which it will convert into StyledSheet objects and will pass them to your component via the `style` prop.

There is no difference between `tw` and `className`, `tw` exists for users who prefer not to use `className` on non-web projects.

```tsx
import { Text } from "react-native";
import { StyledComponent } from "nativewind";

export function MyComponent() {
  return (
    <>
      <StyledComponent component={Text} tw="font-bold">
        Hello world
      </StyledComponent>
      <StyledComponent component={Text} className="font-bold">
        Hello world
      </StyledComponent>
    </>
  );
}
```
