import StartCoding from "../\_start-coding.md"
import Dependencies from "../\_dependencies.mdx"

# Expo

:::tip

A example of an Expo project can be found on [Github](https://github.com/marklawlor/nativewind/tree/next/examples/expo)

:::

## 1. Create the project

Create the project with the Expo CLI

```bash
npx create-expo-app my-app

cd my-app
```

<Dependencies />

## 2. Setup Tailwind CSS

Run `npx tailwindcss init` to create a `tailwind.config.js` file

Add the paths to all of your component files in your tailwind.config.js file. Remember to replace `<custom directory>` with the actual name of your directory e.g. `screens`.

```diff
// tailwind.config.js

module.exports = {
- content: [],
+ content: ["./App.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 3. Add the Babel plugin

Modify your `babel.config.js`

```diff
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
+   plugins: ["nativewind/babel"],
  };
};

```

## 4. Typescript

If your project uses typescript, you'll need to reference the nativewind types in a declaration file in the root of your project folder:

```
/** index.d.ts */

/// <reference types="nativewind/types" />
```

<StartCoding />

## Expo Web

When running on web, NativeWind is a compatability layer between [Tailwind CSS](http://www.tailwindcss.com) and React Native.

You will need follow a [Tailwind CSS installation guide](https://tailwindcss.com/docs/installation) and ensure NativeWind is transpiled.

### Example webpack setup

A complete setup can be found on the [Expo project example](https://github.com/marklawlor/nativewind/tree/next/examples/expo)

:::caution

Expo Web only supports Webpack 4, please ensure you are only installing webpack loaders that that support Webpack 4. For example, The latest version of `postcss-loader` is not compatible with Webpack 4 and instead, `postcss-loader@4.2.0` should be used.

https://github.com/expo/expo-cli/pull/3763

:::

Expo Web uses webpack, so one possible setup is adding `PostCSS` to your `webpack.config.js` and adding [Tailwind CSS as a PostCSS plugin](https://tailwindcss.com/docs/installation/using-postcss).

You can also add `nativewind` to your transpilation list through the `@expo/webpack-config` babel options.

```tsx
// webpack.config.js
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ["nativewind"],
      },
    },
    argv,
  );

  config.module.rules.push({
    test: /\.css$/i,
    use: ["postcss-loader"],
  });

  return config;
};
```

### Expo SDK \<\=45

Expo SDK \<\=45 supports React Native Web \<\=0.17 which cannot output classNames. You need to change the NativeWindStyleSheet output to use `native` for all platforms.

```tsx
// App.js

import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});
```
