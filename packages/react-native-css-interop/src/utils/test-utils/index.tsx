import { ComponentProps, ComponentType, ReactElement, forwardRef } from "react";
import {
  render as tlRender,
  RenderOptions as TLRenderOptions,
} from "@testing-library/react-native";

import { createInteropElement } from "../../runtime";
import { INTERNAL_SET } from "../../shared";
import { cssInterop, remapProps, interopComponents } from "../../runtime/api";
import { cssToReactNativeRuntime } from "../../css-to-rn";
import { injectData } from "../../runtime/native/styles";
import { vh, vw } from "../../runtime/native/unit-observables";
import {
  CssToReactNativeRuntimeOptions,
  EnableCssInteropOptions,
  ReactComponent,
  Style,
  CssInteropGeneratedProps,
} from "../../types";
import { isReduceMotionEnabled } from "../../runtime/native/appearance-observables";
import { resetData } from "../../runtime/native/styles";

export * from "../../index";
export * from "../../runtime/native/styles";
export * from "../../types";
export * from "@testing-library/react-native";
export { INTERNAL_SET } from "../../shared";

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
}

export function render<T>(
  component: ReactElement<T>,
  { css, cssOptions, ...options }: RenderOptions = {},
) {
  if (css) {
    registerCSS(css, cssOptions);
  }

  return tlRender(component, {
    ...options,
  });
}

/*
 * Creates a mocked component that renders with the defaultCSSInterop WITHOUT needing
 * set the jsxImportSource.
 */
export const createMockComponent = <
  const T extends ReactComponent<any>,
  const M extends EnableCssInteropOptions<any> = {
    className: "style";
  },
>(
  Component: T,
  mapping: M = {
    className: "style",
  } as unknown as M,
) => {
  cssInterop(Component, mapping);

  const mock = jest.fn(({ ...props }, ref) => {
    return createInteropElement(Component, { ...props, ref });
  });

  return Object.assign(forwardRef(mock as any), {
    mock,
  }) as unknown as ComponentType<
    ComponentProps<T> & CssInteropGeneratedProps<M>
  > & { mock: typeof mock };
};

export const createRemappedComponent = <
  const T extends ReactComponent<any>,
  const M extends EnableCssInteropOptions<any> = {
    className: "style";
  },
>(
  Component: T,
  mapping: M = {
    className: "style",
  } as unknown as M,
) => {
  remapProps(Component, mapping);

  const mock = jest.fn(({ ...props }, ref) => {
    return createInteropElement(Component, { ...props, ref });
  });

  return Object.assign(forwardRef(mock as any), {
    mock,
  }) as unknown as ComponentType<
    ComponentProps<T> & CssInteropGeneratedProps<M>
  > & { mock: typeof mock };
};

export const resetComponents = () => {
  interopComponents.clear();
};

export function registerCSS(
  css: string,
  options?: CssToReactNativeRuntimeOptions,
) {
  const compiled = cssToReactNativeRuntime(css, options);
  injectData(compiled);
}

export function setupAllComponents() {
  require("../../runtime/components");
}
