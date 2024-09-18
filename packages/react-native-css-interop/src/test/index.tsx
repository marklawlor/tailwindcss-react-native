import {
  ComponentProps,
  ComponentRef,
  ForwardedRef,
  ReactElement,
  forwardRef,
} from "react";
import {
  render as tlRender,
  RenderOptions as TLRenderOptions,
} from "@testing-library/react-native";

import { createInteropElement } from "../runtime";
import { INTERNAL_SET } from "../shared";
import { cssInterop, remapProps, interopComponents } from "../runtime/api";
import { cssToReactNativeRuntime } from "../css-to-rn";
import { injectData } from "../runtime/native/styles";
import { vh, vw } from "../runtime/native/unit-observables";
import {
  CssToReactNativeRuntimeOptions,
  EnableCssInteropOptions,
  ReactComponent,
  Style,
} from "../types";
import { isReduceMotionEnabled } from "../runtime/native/appearance-observables";
import { resetData } from "../runtime/native/styles";
import { warnings } from "../runtime/native/globals";

export * from "../index";
export * from "../runtime/native/styles";
export * from "../types";
export * from "@testing-library/react-native";
export { INTERNAL_SET } from "../shared";

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveStyle(style?: Style | Style[]): R;
      toHaveAnimatedStyle(style?: Style): R;
    }
  }
}

beforeEach(() => {
  resetData();
  vw[INTERNAL_SET](750);
  vw[INTERNAL_SET](750);
});

export const native: {
  vw: typeof vw;
  vh: typeof vh;
  isReduceMotionEnabled: typeof isReduceMotionEnabled;
} = {
  vw,
  vh,
  isReduceMotionEnabled,
};

export interface RenderOptions extends TLRenderOptions {
  css?: string;
  cssOptions?: CssToReactNativeRuntimeOptions;
  logOutput?: boolean;
}

export function render(
  component: ReactElement<any>,
  { css, cssOptions, ...options }: RenderOptions = {},
) {
  if (options.logOutput) {
    if (css) {
      console.log(`Generated css:\n\n${css}`);
    } else {
      console.log(`Generated css:\n\n<empty string>`);
    }
  }

  if (css) {
    registerCSS(css, { ...cssOptions, logOutput: options.logOutput });
  }

  return tlRender(component, {
    ...options,
  });
}

render.debug = (component: ReactElement<any>, options: RenderOptions = {}) => {
  return render(component, { ...options, logOutput: true });
};

export function getWarnings() {
  return warnings;
}

/*
 * Creates a mocked component that renders with the defaultCSSInterop WITHOUT needing
 * set the jsxImportSource.
 */
export function createMockComponent<
  const C extends ReactComponent<any>,
  const M extends EnableCssInteropOptions<C>,
>(Component: C, mapping: M & EnableCssInteropOptions<C>) {
  cssInterop(Component, mapping);

  const mock = jest.fn(
    ({ ...props }: ComponentProps<C>, ref: ForwardedRef<ComponentRef<C>>) => {
      return createInteropElement(Component, { ...props, ref });
    },
  );

  return Object.assign(forwardRef(mock), {
    mock,
  });
}

export function createRemappedComponent<
  const C extends ReactComponent<any>,
  const M extends EnableCssInteropOptions<C>,
>(Component: C, mapping: M & EnableCssInteropOptions<C>) {
  remapProps(Component, mapping);

  const mock = jest.fn(
    ({ ...props }: ComponentProps<C>, ref: ForwardedRef<ComponentRef<C>>) => {
      return createInteropElement(Component, { ...props, ref });
    },
  );

  return Object.assign(forwardRef(mock), {
    mock,
  });
}

export const resetComponents = () => {
  interopComponents.clear();
};

export function registerCSS(
  css: string,
  options: CssToReactNativeRuntimeOptions & { logOutput?: boolean } = {},
) {
  const compiled = cssToReactNativeRuntime(css, options);
  if (options.logOutput) {
    console.log(`Compiled styles:\n\n${JSON.stringify({ compiled }, null, 2)}`);
  }
  injectData(compiled);
}

export function setupAllComponents() {
  require("../runtime/components");
}
