/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, createElement } from "react";
import { Pressable } from "react-native";

import { containerContext } from "./globals";
import { defaultValues } from "./resolvers/defaults";
import { VariableContext } from "./styles";
import {
  AnimationInputOutput,
  SharedState,
  TransitionSharedValue,
} from "./types";

const animatedCache = new Map<
  ComponentType<any> | string,
  ComponentType<any>
>();

export const UpgradeState = {
  NONE: 0,
  SHOULD_UPGRADE: 1,
  UPGRADED: 2,
  WARNED: 3,
};

/**
 * Render the baseComponent
 */
export function renderComponent(
  baseComponent: ComponentType<any>,
  state: SharedState,
  { ...props }: Record<string, any>,
  animationInputOutputs?: AnimationInputOutput[],
  transitionSharedValues?: TransitionSharedValue[],
  variables?: Record<string, any>,
  containers?: Record<string, any>,
) {
  let component = baseComponent;
  const shouldWarn = state.canUpgradeWarn;

  if (props?.testID?.startsWith("debugClassName")) {
    console.log(
      `Debugging component.testID '${props?.testID}'\n\n${JSON.stringify(
        {
          originalProps: state.originalProps,
          props,
          variables,
          containers,
        },
        getDebugReplacer(),
        2,
      )}`,
    );
  }

  // TODO: We can probably remove this in favor of using `new Pressability()`
  if (state.pressable !== UpgradeState.NONE) {
    if (process.env.NODE_ENV !== "production") {
      if (shouldWarn && state.pressable === UpgradeState.SHOULD_UPGRADE) {
        printUpgradeWarning(
          `Converting View to Pressable should only happen during the initial render otherwise it will remount the View.\n\nTo prevent this warning avoid adding styles which use pseudo-classes (e.g :hover, :active, :focus) to View components after the initial render, or change the View to a Pressable`,
          state.originalProps,
        );
      }
    }
    component = Pressable;
    state.pressable = UpgradeState.UPGRADED;
    props.cssInterop = false;
  }

  if (state.animated !== UpgradeState.NONE) {
    if (shouldWarn && state.animated === UpgradeState.SHOULD_UPGRADE) {
      if (process.env.NODE_ENV !== "production") {
        printUpgradeWarning(
          `Components need to be animated during the initial render otherwise they will remount.\n\nTo prevent this warning avoid dynamically adding animation/transition styles to components after the initial render, or add a default style that sets "animation: none"/"transition-property: none"`,
          state.originalProps,
        );
      }
    } else {
      state.animated = UpgradeState.UPGRADED;
      component = createAnimatedComponent(component);

      const { useAnimatedStyle, interpolateColor, interpolate } =
        require("react-native-reanimated") as typeof import("react-native-reanimated");

      const originalStyle = { ...props.style };
      props.style = useAnimatedStyle(() => {
        const style: Record<string, any> = { ...originalStyle };

        const seenProperties = new Set<string>();

        function setValue(property: string, value: any) {
          switch (property) {
            case "matrix":
              return;
            case "translateX":
            case "translateY":
            case "scale":
            case "scaleX":
            case "scaleY":
            case "rotate":
            case "rotateX":
            case "rotateY":
            case "rotateZ":
            case "skewX":
            case "skewY":
            case "perspective":
            case "transformOrigin": {
              style.transform ??= [];
              const match = style.transform.find(
                (obj: any) => obj[property] !== undefined,
              );
              if (match && value !== undefined) {
                match[property] = value;
              } else if (!match) {
                style.transform.push({
                  [property]: value ?? defaultValues[property],
                });
              }
              break;
            }
            default:
              style[property] = value;
          }
        }

        if (animationInputOutputs) {
          for (const entry of animationInputOutputs) {
            const progress = entry[0].value;
            const values = entry[1];

            for (const propertyConfig of values) {
              const property = propertyConfig[0];
              const inputOutput = propertyConfig[1];

              seenProperties.add(property);

              let value: any = undefined;
              if (inputOutput) {
                const firstValue = inputOutput[1][0];

                if (typeof firstValue === "number") {
                  value = interpolate(progress, inputOutput[0], inputOutput[1]);
                } else if (typeof firstValue === "string") {
                  const numericValue = parseFloat(firstValue);

                  if (isNaN(numericValue)) {
                    // TODO: Check this is a valid color
                    value = interpolateColor(
                      progress,
                      inputOutput[0],
                      inputOutput[1],
                    );
                  } else {
                    const suffix = firstValue.replace(`${numericValue}`, "");
                    const output = inputOutput[1].map((value) =>
                      parseFloat(value),
                    );
                    value = `${interpolate(progress, inputOutput[0], output)}${suffix}`;
                  }
                }
              }

              setValue(property, value);
            }
          }
        }

        if (transitionSharedValues) {
          for (const entry of transitionSharedValues) {
            // Don't override animations
            if (seenProperties.has(entry[0])) {
              continue;
            }

            setValue(entry[0], entry[1].value);
          }
        }

        return style;
      }, [animationInputOutputs, transitionSharedValues]);
    }
  }

  if (state.variables !== UpgradeState.NONE) {
    if (process.env.NODE_ENV !== "production") {
      if (shouldWarn && state.variables === UpgradeState.SHOULD_UPGRADE) {
        printUpgradeWarning(
          `Components need to set a variable during the initial render otherwise they will remount.\n\nTo prevent this warning avoid dynamically adding CSS variables components after the initial render, or ensure it has a default style that sets either a CSS variable`,
          state.originalProps,
        );
      }
    }
    state.variables = UpgradeState.UPGRADED;

    props = {
      value: variables,
      children: createElement(component, props),
    };
    component = VariableContext.Provider;
  }

  if (state.containers !== UpgradeState.NONE) {
    if (process.env.NODE_ENV !== "production") {
      if (shouldWarn && state.containers === UpgradeState.SHOULD_UPGRADE) {
        printUpgradeWarning(
          `Components need to marked as a container during the initial render otherwise they will remount.\n\nTo prevent this warning avoid dynamically container styles to a component after the initial render, or ensure it has a default style that sets "container: none" or "container-type: none"`,
          state.originalProps,
        );
      }
    }
    state.containers = UpgradeState.UPGRADED;

    props = {
      value: containers,
      children: createElement(component, props),
    };
    component = containerContext.Provider;
  }

  // We cannot warn on the first render, or while in production
  state.canUpgradeWarn = process.env.NODE_ENV !== "production";

  /**
   * A hack to improve performance by avoiding adding duplicate components to the render tree
   *
   * The native interop already substitutes the component with a ForwardRef, so if we render a <View /> it actually renders
   *
   * <ForwardRef>
   *   <ForwardRef>
   *     <View>
   *
   * Instead of rendering the extra ForwardRef, we can compose them together (by directly calling the render function) into the same component, so it renders
   * <ForwardRef>
   *   <View>
   *
   * This improves performance by a meaningful amount.
   *
   * This isn't properly implemented. What we should be doing in the cssInterop function is generating a new component
   * that matches the type of the original component (e.g Function components should just be function components, nof ForwardRefs)
   * and passing a flag down if the component is composable.
   */
  // if (component === baseComponent) {
  //   switch (getComponentType(component)) {
  //     case "forwardRef": {
  //       const ref = props.ref;
  //       delete props.ref;
  //       return (component as any).render(props, ref);
  //     }
  //     case "function":
  //       return (component as any)(props);
  //     case "string":
  //     case "object":
  //     case "class":
  //     case "unknown":
  //       return createElement(component, props);
  //   }
  // } else {
  /*
   * Class/Object/String components are not composable, so they are added to the tree as normal
   */
  return createElement(component, props);
  // }
}

function createAnimatedComponent(Component: ComponentType<any>): any {
  if (animatedCache.has(Component)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return animatedCache.get(Component)!;
  } else if (Component.displayName?.startsWith("AnimatedComponent")) {
    return Component;
  }

  if (
    !(
      typeof Component !== "function" ||
      (Component.prototype && Component.prototype.isReactComponent)
    )
  ) {
    throw new Error(
      `Looks like you're passing an animation style to a function component \`${Component.name}\`. Please wrap your function component with \`React.forwardRef()\` or use a class component instead.`,
    );
  }

  const { default: Animated } =
    require("react-native-reanimated") as typeof import("react-native-reanimated");

  const AnimatedComponent = Animated.createAnimatedComponent(
    Component as React.ComponentClass,
  );
  AnimatedComponent.displayName = `Animated.${Component.displayName || Component.name || "Unknown"}`;

  animatedCache.set(Component, AnimatedComponent);

  return AnimatedComponent;
}

function printUpgradeWarning(
  warning: string,
  originalProps: Record<string, any> | null | undefined,
) {
  console.log(
    `CssInterop upgrade warning.\n\n${warning}.\n\nThis warning was caused by a component with the props:\n${stringify(originalProps)}\n\nIf adding or removing sibling components caused this warning you should add a unique "key" prop to your components. https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key\n`,
  );
}

function stringify(object: any) {
  const seen = new WeakSet();
  return JSON.stringify(
    object,
    function replace(_, value) {
      if (!(value !== null && typeof value === "object")) {
        return value;
      }

      if (seen.has(value)) {
        return "[Circular]";
      }

      seen.add(value);

      const newValue: any = Array.isArray(value) ? [] : {};

      for (const entry of Object.entries(value)) {
        newValue[entry[0]] = replace(entry[0], entry[1]);
      }

      seen.delete(value);

      return newValue;
    },
    2,
  );
}

// const ForwardRefSymbol = Symbol.for("react.forward_ref");
// function getComponentType(component: any) {
//   switch (typeof component) {
//     case "function":
//     case "object":
//       return "$$typeof" in component && component.$$typeof === ForwardRefSymbol
//         ? "forwardRef"
//         : component.prototype?.isReactComponent
//           ? "class"
//           : typeof component;
//     default:
//       return "unknown";
//   }
// }

function getDebugReplacer() {
  const seen = new WeakSet<object>();
  return (_: string, value: unknown) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);

      if ("_isReanimatedSharedValue" in value && "value" in value) {
        return `${value.value} (animated value)`;
      }

      if ("get" in value && typeof value.get === "function") {
        return value.get();
      }
    } else if (typeof value === "function") {
      return value.name ? `[Function ${value.name}]` : "[Function]";
    }

    return value;
  };
}
