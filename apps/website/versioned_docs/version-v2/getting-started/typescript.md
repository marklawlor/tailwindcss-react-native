# Typescript

NativeWind extends the React Native types via declaration merging. The simplest method to include the types is to create a new `global.d.ts` file and add a [triple-slash directive](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) referencing the types.

```tsx
/// <reference types="nativewind/types" />
```

:::caution
Do not call this file `nativewind.d.ts`, it will cause your Typescript module resolution to fail.
:::
