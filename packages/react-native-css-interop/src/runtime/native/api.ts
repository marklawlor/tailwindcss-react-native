import { createElement, forwardRef, useContext, useState } from "react";
import type {
  CssInterop,
  JSXFunction,
  RuntimeValueDescriptor,
} from "../../types";
import { getNormalizeConfig } from "../config";
import { Effect, cleanupEffect } from "../observable";
import { interop } from "./native-interop";
import { getComponentType } from "./unwrap-components";
import { VariableContext, getVariable, opaqueStyles } from "./styles";
import { colorScheme } from "./appearance-observables";

export { StyleSheet } from "./stylesheet";
export { colorScheme } from "./appearance-observables";
export { rem } from "./unit-observables";

export const interopComponents = new Map<
  object | string,
  Parameters<JSXFunction>[0]
>();

/**
 * Generates a new Higher-Order component the wraps the base component and applies the styles.
 * This is added to the `interopComponents` map so that it can be used in the `wrapJSX` function
 * @param baseComponent
 * @param mapping
 */
export const cssInterop: CssInterop = (baseComponent, mapping): any => {
  const configs = getNormalizeConfig(mapping);

  let component: any;
  const type = getComponentType(baseComponent);

  /**
   * This is a work-in-progress. We should be generating a new component that matches the
   * type of the previous component. E.g ForwardRef should be a ForwardRef, Memo should be Memo
   */
  if (type === "function") {
    component = (props: Record<string, any>) => {
      return interop(baseComponent, configs, props, undefined);
    };
  } else {
    component = forwardRef((props, ref) => {
      // This function will change className->style, add the extra props and do the "magic"
      return interop(baseComponent, configs, props, ref);
      // `interop` will return createElement(baseComponent, propsWithStylesAppliedAndEventHandlersAdded);
    });
  }

  const name = baseComponent.displayName ?? baseComponent.name ?? "unknown";
  component.displayName = `CssInterop.${name}`;
  interopComponents.set(baseComponent, component);
  return component;
};

export const remapProps: CssInterop = (component: any, mapping): any => {
  const configs = getNormalizeConfig(mapping);

  const interopComponent = forwardRef(function RemapPropsComponent(
    { ...props }: Record<string, any>,
    ref: any,
  ) {
    for (const config of configs) {
      const source = props?.[config.source];

      // If the source is not a string or is empty, skip this config
      if (typeof source !== "string" || !source) continue;

      const placeholder = {};
      opaqueStyles.set(placeholder, {
        $type: "RemappedClassName",
        classNames: source.split(/\s+/),
      });

      delete props[config.source];

      let target = props[config.target];

      if (Array.isArray(target)) {
        target.push(placeholder);
      } else if (target) {
        target = [target, placeholder];
      } else {
        target = placeholder;
      }

      props[config.target] = target;
    }

    props.ref = ref;
    return createElement(component as any, props, props.children);
  });

  interopComponents.set(component as any, interopComponent);
  return interopComponent;
};

export function useColorScheme() {
  const [effect, setEffect] = useState<Effect>(() => ({
    run: () => setEffect((s) => ({ ...s })),
    dependencies: new Set(),
  }));

  return {
    colorScheme: colorScheme.get(effect),
    setColorScheme: colorScheme.set,
    toggleColorScheme: colorScheme.toggle,
  };
}

export function vars(variables: Record<string, RuntimeValueDescriptor>) {
  const style: Record<string, any> = {};
  opaqueStyles.set(style, {
    $type: "StyleRuleSet",
    variables: true,
    normal: [
      {
        $type: "StyleRule",
        specificity: { inline: 1 },
        variables: Object.entries(variables).map(([name, value]) => {
          return [name.startsWith("--") ? name : `--${name}`, value];
        }),
      },
    ],
  });
  return style;
}

export const useUnstableNativeVariable = (name: string) => {
  const context = useContext(VariableContext);

  const [effect, setState] = useState<Effect>(() => ({
    run: () => setState((s) => ({ ...s })),
    dependencies: new Set(),
  }));

  let value: any = getVariable(name, context, effect);
  if (typeof value === "object" && "get" in value) {
    cleanupEffect(effect);
    value = value.get(effect);
  }

  return value;
};

export const useSafeAreaEnv = () => {
  try {
    const insets =
      require("react-native-safe-area-context").useSafeAreaInsets() as import("react-native-safe-area-context").EdgeInsets;

    return vars({
      "--___css-interop___safe-area-inset-bottom": insets.bottom,
      "--___css-interop___safe-area-inset-left": insets.left,
      "--___css-interop___safe-area-inset-right": insets.right,
      "--___css-interop___safe-area-inset-top": insets.top,
    });
  } catch {
    console.error("react-native-safe-area-context is not installed");
  }
};
