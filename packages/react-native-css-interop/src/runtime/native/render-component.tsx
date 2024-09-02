import { ComponentType, createElement } from "react";
import { Pressable } from "react-native";

import { containerContext } from "./globals";
import { SharedState } from "./types";
import { VariableContext } from "./styles";

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
  props: Record<string, any>,
  variables?: Record<string, any>,
  containers?: Record<string, any>,
) {
  let component = baseComponent;
  const shouldWarn = state.canUpgradeWarn;

  // TODO: We can probably remove this in favor of using `new Pressability()`
  if (state.pressable !== UpgradeState.NONE) {
    component = Pressable;
    props.cssInterop = false;
    if (shouldWarn && state.pressable === UpgradeState.SHOULD_UPGRADE) {
      printUpgradeWarning(
        `Converting View to Pressable should only happen during the initial render otherwise it will remount the View.\n\nTo prevent this warning avoid adding styles which use pseudo-classes (e.g :hover, :active, :focus) to View components after the initial render, or change the View to a Pressable`,
        state.originalProps,
      );
    }
    state.pressable = UpgradeState.UPGRADED;
  }

  if (state.animated !== UpgradeState.NONE) {
    if (shouldWarn && state.animated === UpgradeState.SHOULD_UPGRADE) {
      printUpgradeWarning(
        `Components need to be animated during the initial render otherwise they will remount.\n\nTo prevent this warning avoid dynamically adding animation/transition styles to components after the initial render, or add a default style that sets "animation: none"/"transition-property: none"`,
        state.originalProps,
      );
    }
    state.animated = UpgradeState.UPGRADED;
    component = createAnimatedComponent(component);
  }

  if (state.variables !== UpgradeState.NONE) {
    if (shouldWarn && state.variables === UpgradeState.SHOULD_UPGRADE) {
      printUpgradeWarning(
        `Components need to set a variable during the initial render otherwise they will remount.\n\nTo prevent this warning avoid dynamically adding CSS variables components after the initial render, or ensure it has a default style that sets either a CSS variable`,
        state.originalProps,
      );
    }
    state.variables = UpgradeState.UPGRADED;

    props = {
      value: variables,
      children: createElement(component, props),
    };
    component = VariableContext.Provider;
  }

  if (state.containers !== UpgradeState.NONE) {
    if (shouldWarn && state.containers === UpgradeState.SHOULD_UPGRADE) {
      printUpgradeWarning(
        `Components need to marked as a container during the initial render otherwise they will remount.\n\nTo prevent this warning avoid dynamically container styles to a component after the initial render, or ensure it has a default style that sets "container: none" or "container-type: none"`,
        state.originalProps,
      );
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
  if (component === baseComponent) {
    switch (getComponentType(component)) {
      case "forwardRef": {
        const ref = props.ref;
        delete props.ref;
        return (component as any).render(props, ref);
      }
      case "function":
        return (component as any)(props);
      case "string":
      case "object":
      case "class":
      case "unknown":
        return createElement(component, props);
    }
  } else {
    /*
     * Class/Object/String components are not composable, so they are added to the tree as normal
     */
    return createElement(component, props);
  }
}

function createAnimatedComponent(Component: ComponentType<any>): any {
  if (animatedCache.has(Component)) {
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

  let AnimatedComponent = Animated.createAnimatedComponent(
    Component as React.ComponentClass,
  );

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

const ForwardRefSymbol = Symbol.for("react.forward_ref");
function getComponentType(component: any) {
  switch (typeof component) {
    case "function":
    case "object":
      return "$$typeof" in component && component.$$typeof === ForwardRefSymbol
        ? "forwardRef"
        : component.prototype?.isReactComponent
          ? "class"
          : typeof component;
    default:
      return "unknown";
  }
}
