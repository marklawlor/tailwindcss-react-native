import { pluginTester } from "babel-plugin-tester";
import plugin from "../babel-plugin";

(globalThis as any).describe = describe;
(globalThis as any).it = it;

pluginTester({
  plugin,
  title: "plugin",
  babelOptions: {
    plugins: ["@babel/plugin-syntax-jsx"],
    filename: "/someFile.js",
  },
  tests: {
    "createElement with interopRequire": {
      code: `var _react = _interopRequireDefault(require("react"));
export default function App() {
  return /*#__PURE__*/ _react.default.createElement(_reactNative.Text, {})
}`,
      output: `import { createInteropElement as _createInteropElement } from "react-native-css-interop";
var _react = _interopRequireDefault(require("react"));
export default function App() {
  return /*#__PURE__*/ _createInteropElement(_reactNative.Text, {});
}`,
      babelOptions: { filename: "/someFile.js" },
    },
    "createElement identifier by import": {
      code: `import { createElement } from "react";
export default function App() {
  return createElement("div", {}, "Hello World");
}`,
      output: `import { createInteropElement as _createInteropElement } from "react-native-css-interop";
import { createElement } from "react";
export default function App() {
  return _createInteropElement("div", {}, "Hello World");
}`,

      babelOptions: { filename: "/someFile.js" },
    },
    "createElement identifier by default import": {
      code: `import React from "react";
export default function App() {
  return React.createElement("div", {}, "Hello World");
}`,
      output: `import { createInteropElement as _createInteropElement } from "react-native-css-interop";
import React from "react";
export default function App() {
  return _createInteropElement("div", {}, "Hello World");
}`,

      babelOptions: { filename: "/someFile.js" },
    },

    "createElement identifier by require": {
      code: `const { createElement } = require("react");
export default function App() {
  return createElement("div", {}, "Hello World");
}`,
      output: `import { createInteropElement as _createInteropElement } from "react-native-css-interop";
const { createElement } = require("react");
export default function App() {
  return _createInteropElement("div", {}, "Hello World");
}`,
      babelOptions: { filename: "/someFile.js" },
    },
    "createElement by namespace import": {
      code: `import * as React from "react";
export default function App() {
  return React.createElement("div", {}, "Hello World");
}`,
      output: `import { createInteropElement as _createInteropElement } from "react-native-css-interop";
import * as React from "react";
export default function App() {
  return _createInteropElement("div", {}, "Hello World");
}`,
      babelOptions: { filename: "/someFile.js" },
    },
    "createElement by namespace require (lowercase)": {
      code: `import * as react from "react";
export default function App() {
  return react.createElement("div", {}, "Hello World");
}`,
      output: `import { createInteropElement as _createInteropElement } from "react-native-css-interop";
import * as react from "react";
export default function App() {
  return _createInteropElement("div", {}, "Hello World");
}`,
      babelOptions: { filename: "/someFile.js" },
    },
    "createElement by namespace require": {
      code: `var react = require("react");
export default function App() {
  return react.createElement("div", {}, "Hello World");
}`,
      output: `import { createInteropElement as _createInteropElement } from "react-native-css-interop";
var react = require("react");
export default function App() {
  return _createInteropElement("div", {}, "Hello World");
}`,
      babelOptions: { filename: "/someFile.js" },
    },
    "createElement from 3rd party": {
      code: `import { createElement } from "other-lib";
export default function App() {
  return createElement("div", {}, "Hello World");
}`,
      output: `import { createElement } from "other-lib";
export default function App() {
  return createElement("div", {}, "Hello World");
}`,
      babelOptions: { filename: "/someFile.js" },
    },
    "createElement from denied modules": {
      code: `import { createElement } from "react";
export default function App() {
  return createElement("div", {}, "Hello World");
}`,
      output: `import { createElement } from "react";
export default function App() {
  return createElement("div", {}, "Hello World");
}`,
      babelOptions: {
        filename: "/node_modules/react-native-css-interop/someFile.js",
      },
    },
  },
});
