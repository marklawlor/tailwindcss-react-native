/** @jsxImportSource nativewind */
import { View, Platform } from "react-native";
import tailwindcssContainerQueries from "@tailwindcss/container-queries";
import postcss from "postcss";
import tailwind, { Config } from "tailwindcss";

import {
  getWarnings,
  render as interopRender,
  RenderOptions as InteropRenderOptions,
  resetData,
  screen,
  setupAllComponents,
} from "react-native-css-interop/test";
import { cssToReactNativeRuntimeOptions } from "./metro/common.js";

export {
  act,
  createMockComponent,
  screen,
  fireEvent,
  within,
  native,
  INTERNAL_SET,
} from "react-native-css-interop/test";

export * from "./index.js";

const testID = "nativewind";

beforeEach(() => {
  resetData();
  setupAllComponents();
});

// I don't know why I can't use Omit. It narrows the type too much?
export type ConfigWithoutContent = {
  [K in keyof Config as K extends "content" ? never : K]: Config[K];
};

export interface RenderOptions extends InteropRenderOptions {
  debugCompiled?: boolean;
  config?: ConfigWithoutContent;
  css?: string;
  layers?: {
    base?: boolean;
    components?: boolean;
    utilities?: boolean;
  };
}

export type RenderCurrentTestOptions = RenderOptions & {
  className?: string;
};

process.env.NATIVEWIND_OS = Platform.OS;

export async function renderCurrentTest({
  className = expect.getState().currentTestName?.split(/\s+/).at(-1),
  ...options
}: RenderCurrentTestOptions = {}) {
  if (!className) {
    throw new Error(
      "unable to detect className, please manually set a className",
    );
  }

  await render(<View testID={testID} className={className} />, options);
  const component = screen.getByTestId(testID, { hidden: true });

  // Strip the testID and the children
  const { testID: _testID, children, ...props } = component.props;

  const invalid = getInvalid();

  if (invalid) {
    return { props, invalid };
  } else {
    return { props };
  }
}

renderCurrentTest.debug = (options: RenderCurrentTestOptions = {}) => {
  return renderCurrentTest({ ...options, debugCompiled: true });
};

export async function render(
  component: React.ReactElement<any>,
  {
    config,
    css,
    layers = {},
    debugCompiled = process.env.NODE_OPTIONS?.includes("--inspect"),
    ...options
  }: RenderOptions = {},
) {
  // Compile the base CSS, e.g:
  // @tailwind base
  // @tailwind components
  // @tailwind utilities
  css ??= Object.entries({
    base: true,
    components: true,
    utilities: true,
    ...layers,
  }).reduce((acc, [layer, enabled]) => {
    return enabled ? `${acc}@tailwind ${layer};` : acc;
  }, "");

  const content = getClassNames(component);

  if (debugCompiled) {
    const classNames = content.map(({ raw }) => `  ${raw}`);
    console.log(`Detected classNames:\n${classNames.join("\n")}\n\n`);

    if (config?.safelist) {
      console.log(`Detected safelist:\n${config.safelist.join("\n")}\n\n`);
    }
  }

  // Process the TailwindCSS
  let { css: output } = await postcss([
    tailwind({
      theme: {},
      ...config,
      presets: [require("./tailwind")],
      plugins: [tailwindcssContainerQueries, ...(config?.plugins || [])],
      content,
    }),
  ]).process(css, { from: undefined });

  return interopRender(component, {
    ...options,
    css: output,
    cssOptions: cssToReactNativeRuntimeOptions,
    debugCompiled: debugCompiled,
  });
}

render.debug = (
  component: React.ReactElement<any>,
  options: RenderOptions = {},
) => {
  return render(component, { ...options, debugCompiled: true });
};

render.noDebug = (
  component: React.ReactElement<any>,
  options: RenderOptions = {},
) => {
  return render(component, { ...options, debugCompiled: false });
};

function getClassNames(
  component: React.ReactElement<any>,
): Array<{ raw: string; extension?: string }> {
  const classNames: Array<{ raw: string; extension?: string }> = [];

  if (component.props?.className) {
    classNames.push({ raw: component.props.className });
  }

  if (component.props?.children) {
    const children: React.ReactElement<any>[] = Array.isArray(
      component.props.children,
    )
      ? component.props.children
      : [component.props.children];

    classNames.push(...children.flatMap((c) => getClassNames(c)));
  }

  return classNames;
}

function getInvalid() {
  const style: Record<string, any> = {};
  const properties: string[] = [];

  let hasStyles = false;

  for (const warnings of getWarnings().values()) {
    for (const warning of warnings) {
      switch (warning.type) {
        case "IncompatibleNativeProperty":
          properties.push(warning.property);
          break;
        case "IncompatibleNativeValue": {
          hasStyles = true;
          style[warning.property] = warning.value;
          break;
        }
        case "IncompatibleNativeFunctionValue":
        // TODO
      }
    }
  }

  if (properties.length && hasStyles) {
    return {
      style,
      properties,
    };
  } else if (properties.length) {
    return { properties };
  } else if (hasStyles) {
    return { style };
  }
}

export function invalidProperty(...properties: string[]) {
  return properties.map((property) => ({
    type: "IncompatibleNativeProperty",
    property,
  }));
}

export function invalidValue(value: Record<string, string>) {
  return Object.entries(value).map(([property, value]) => ({
    type: "IncompatibleNativeValue",
    property,
    value,
  }));
}
