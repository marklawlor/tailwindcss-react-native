import type { JSXFunction } from "../types";
import { interopComponents } from "./api";
import { maybeHijackSafeAreaProvider } from "./third-party-libs/react-native-safe-area-context";

/**
 * Create a new JSX function that swaps the component type being rendered with
 * the 'interop' version of the component if it exists.
 */
export default function wrapJSX(jsx: JSXFunction): JSXFunction {
  return function (type, props, ...rest) {
    // This is invalid react code. Its used by the doctor to check if the JSX pragma is set correctly
    if ((type as any) === "react-native-css-interop-jsx-pragma-check") {
      return true as any;
    }

    // Load the core React Native components and create the interop versions
    // We avoid this in the test environment as we want more fine-grained control
    // This call also need to be inside the JSX transform to avoid circular dependencies
    if (process.env.NODE_ENV !== "test") require("./components");

    type = maybeHijackSafeAreaProvider(type);

    // You can disable the css interop by setting `cssInterop` to false or pass the `style` prop as a function
    if (props && (props.cssInterop === false || props.style === "function")) {
      delete props.cssInterop;
    } else {
      // Swap the component type with the interop version if it exists
      type = interopComponents.get(type) ?? type;
    }

    // Call the original jsx function with the new type
    return jsx.call(jsx, type, props, ...rest);
  };
}
