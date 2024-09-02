/** @jsxImportSource nativewind */
import { View, Platform } from "react-native";
import tailwindcssContainerQueries from "@tailwindcss/container-queries";
import postcss from "postcss";
import tailwind, { Config } from "tailwindcss";

import {
  render as interopRender,
  RenderOptions as InteropRenderOptions,
  resetData,
  screen,
  setupAllComponents,
} from "react-native-css-interop/test-utils";
import { cssToReactNativeRuntimeOptions } from "./metro/common";

export {
  createMockComponent,
  screen,
  fireEvent,
} from "react-native-css-interop/test-utils";

export * from "../src/index";

beforeEach(() => {
  resetData();
  setupAllComponents();
});

export interface RenderOptions extends InteropRenderOptions {
  config?: Omit<Config, "content">;
  css?: string;
  layers?: {
    base?: boolean;
    components?: boolean;
    utilities?: boolean;
  };
}

process.env.NATIVEWIND_NATIVE = Platform.OS;

export async function render(
  component: React.ReactElement<any>,
  { config, css, layers = {}, ...options }: RenderOptions = {},
) {
  css ??= Object.entries({
    base: false,
    components: true,
    utilities: true,
    ...layers,
  }).reduce((acc, [layer, enabled]) => {
    return enabled ? `${acc}@tailwind ${layer};` : acc;
  }, "");

  let { css: output } = await postcss([
    tailwind({
      theme: {},
      ...config,
      presets: [require("./tailwind")],
      plugins: [tailwindcssContainerQueries],
      content: getClassNames(component),
    }),
  ]).process(css, { from: undefined });

  return interopRender(component, {
    ...options,
    css: output,
    cssOptions: cssToReactNativeRuntimeOptions,
  });
}

function getClassNames(
  component: React.ReactElement<any>,
): Array<{ raw: string; extension?: string }> {
  const classNames: Array<{ raw: string; extension?: string }> = [];

  if (component.props.className) {
    classNames.push({ raw: component.props.className });
  }

  if (component.props.children) {
    const children: React.ReactElement<any>[] = Array.isArray(
      component.props.children,
    )
      ? component.props.children
      : [component.props.children];

    classNames.push(...children.flatMap((c) => getClassNames(c)));
  }

  return classNames;
}

type ClassNameTestCase =
  | [string, Record<string, any>]
  | [string, Record<string, any> | undefined, Record<string, any>];

/**
 * Test each className
 */
export function testEachClassName(
  tests: ClassNameTestCase[],
  options?: RenderOptions,
) {
  test.each(tests)(
    "%s",
    (
      className: string,
      expectedProps?: Record<string, any>,
      warningOrDone?: Record<string, any> | (() => void),
    ) => {
      const promise = new Promise<void>(async (resolve) => {
        const testID = "nativewind";
        await render(<View testID={testID} className={className} />, options);
        const component = screen.getByTestId(testID, { hidden: true });

        for (const [key, expected] of Object.entries(expectedProps ?? {})) {
          expect(component.props[key]).toEqual(expected);
        }

        resolve();
      });

      if (typeof warningOrDone == "function") {
        warningOrDone();
      } else {
        return promise;
      }
    },
  );
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
