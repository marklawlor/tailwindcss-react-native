# Troubleshooting

## Styles randomly not working

NativeWind adds code to each file which is cached by Webpack/Metro. As each file is cache individually, changes to your `tailwind.config.js` or other files may not be reflected across your project.

To fix this issue, simply clear your project's cache either by `expo start -c` or `react-native start --reset-cache`.

## Native styles not working at all

### Follow the official troubleshooting guide

Please read the [Tailwind content troubleshooting](https://tailwindcss.com/docs/content-configuration#classes-aren-t-generated)

### Verify your configuration

If you are 100% your files are covered by `content`, try running

`npx tailwind -o output.css`

This will generate a `output.css` file with your projects styles written as `css`. Verify that it includes your expected styles (it may include extra styles).

### Using NativeWind with Nx
If you are using Nx, you need to include the path to your lib code.
```diff
// tailwind.config.js

module.exports = {
- content: [],
+ content: [
+   "./App.{js,jsx,ts,tsx}",
+   "./<custom-folder>/**/*.{js,jsx,ts,tsx}"
+   "../../libs/<lib-folder>/<custom-folder>/**/*.{js,jsx,ts,tsx}",
+ ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Manually generate the output

Follow the [Native Tailwind CLI setup guide](https://www.nativewind.dev/guides/cli-native#native) to generate `nativewind-output.js`. This file includes the generated NativeWind styles.
