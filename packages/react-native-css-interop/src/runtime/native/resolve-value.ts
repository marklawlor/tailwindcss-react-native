import { PixelRatio, Platform, PlatformColor, StyleSheet } from "react-native";
import type { AnimatableValue } from "react-native-reanimated";
import type { EasingFunction, Time } from "lightningcss";
import type { RuntimeValueDescriptor, RuntimeValueFrame } from "../../types";
import { rem, systemColorScheme, vh, vw } from "./globals";
import { Effect, observable } from "../observable";
import { transformKeys } from "../../shared";
import { ReducerState, ReducerTracking, Refs } from "./types";
import { getUniversalVariable, getVariable } from "./$$styles";

/**
 * Get the final value of a value descriptor
 * A descriptor is a value like 'red', 12 or { name: 'var', arguments: ['--primary'] }
 * They are generated by the compiler.
 * @param state
 * @param descriptor
 * @param style
 * @returns
 */
export function resolveValue(
  state: ReducerState,
  refs: Refs,
  tracking: ReducerTracking,
  descriptor: RuntimeValueDescriptor | string | number | boolean,
  style?: Record<string, any>,
): any {
  switch (typeof descriptor) {
    case "undefined":
      return;
    case "boolean":
    case "number":
    case "function":
      return descriptor;
    case "string":
      return descriptor.endsWith("px") // Inline vars() might set a value with a px suffix
        ? parseInt(descriptor.slice(0, -2), 10)
        : descriptor;
  }

  if (Array.isArray(descriptor)) {
    return descriptor.map((v) => resolveValue(state, refs, tracking, v, style));
  }

  switch (descriptor.name) {
    case "var": {
      let value = resolve(
        state,
        refs,
        tracking,
        descriptor.arguments[0],
        style,
      );
      if (typeof value === "string")
        value = getVar(state, refs, tracking, value, style);
      if (value === undefined && descriptor.arguments[1]) {
        value = resolveValue(
          state,
          refs,
          tracking,
          descriptor.arguments[1],
          style,
        );
      }

      return value;
    }
    case "calc": {
      return calc(state, refs, tracking, descriptor.arguments, style)?.value;
    }
    case "max": {
      let mode;
      let values: number[] = [];

      for (const arg of descriptor.arguments) {
        const result = calc(state, refs, tracking, arg, style);
        if (result) {
          if (!mode) mode = result?.mode;
          if (result.mode === mode) {
            values.push(result.raw);
          }
        }
      }

      const max = Math.max(...values);
      return mode === "percentage" ? `${max}%` : max;
    }
    case "min": {
      let mode;
      let values: number[] = [];

      for (const arg of descriptor.arguments) {
        const result = calc(state, refs, tracking, arg, style);
        if (result) {
          if (!mode) mode = result?.mode;
          if (result.mode === mode) {
            values.push(result.raw);
          }
        }
      }

      const min = Math.min(...values);
      return mode === "percentage" ? `${min}%` : min;
    }
    case "clamp": {
      const min = calc(state, refs, tracking, descriptor.arguments[0], style);
      const val = calc(state, refs, tracking, descriptor.arguments[1], style);
      const max = calc(state, refs, tracking, descriptor.arguments[2], style);

      if (!min || !val || !max) return;
      if (min.mode !== val.mode && max.mode !== val.mode) return;

      const value = Math.max(min.raw, Math.min(val.raw, max.raw));
      return val.mode === "percentage" ? `${value}%` : value;
    }
    case "vh": {
      // 50vh = 50% of the viewport height
      const value = resolve(
        state,
        refs,
        tracking,
        descriptor.arguments[0],
        style,
      );
      const vhValue = vh.get(tracking.effect) / 100;
      if (typeof value === "number") return round(vhValue * value);
    }
    case "vw": {
      const value = resolve(
        state,
        refs,
        tracking,
        descriptor.arguments[0],
        style,
      );
      const vwValue = vw.get(tracking.effect) / 100;
      if (typeof value === "number") return round(vwValue * value);
    }
    case "em": {
      const value = resolve(
        state,
        refs,
        tracking,
        descriptor.arguments[0],
        style,
      );
      const fontSize = style?.fontSize ?? rem.get(tracking.effect);
      if (typeof value === "number") return round(fontSize * value);
    }
    case "rem": {
      const value = resolve(
        state,
        refs,
        tracking,
        descriptor.arguments[0],
        style,
      );
      const remValue = rem.get(tracking.effect);
      if (typeof value === "number") return round(remValue * value);
    }
    case "rnh": {
      const value = resolve(
        state,
        refs,
        tracking,
        descriptor.arguments[0],
        style,
      );
      const height = style?.height ?? getHeight(state, refs, tracking);
      if (typeof value === "number") return round(height * value);
    }
    case "rnw": {
      const value = resolve(
        state,
        refs,
        tracking,
        descriptor.arguments[0],
        style,
      );
      const width = style?.width ?? getWidth(state, refs, tracking);
      if (typeof value === "number") return round(width * value);
    }
    case "hwb":
      const args = resolve(
        state,
        refs,
        tracking,
        descriptor.arguments,
        style,
      ).flat(10);
      return getColorArgs(args, { 3: "hwb" });
    case "rgb":
    case "rgba": {
      const args = resolve(
        state,
        refs,
        tracking,
        descriptor.arguments,
        style,
      ).flat(10);
      return getColorArgs(args, { 3: "rgb", 4: "rgba" });
    }
    case "hsl":
    case "hsla": {
      const args = resolve(
        state,
        refs,
        tracking,
        descriptor.arguments,
        style,
      ).flat(10);
      return getColorArgs(args, { 3: "hsl", 4: "hsla" });
    }
    case "hairlineWidth": {
      return StyleSheet.hairlineWidth;
    }
    case "platformColor": {
      return PlatformColor(
        ...(descriptor.arguments as any[]),
      ) as unknown as string;
    }
    case "platformSelect": {
      return resolve(
        state,
        refs,
        tracking,
        Platform.select(descriptor.arguments[0] as any),
        style,
      );
    }
    case "getPixelSizeForLayoutSize": {
      const v = resolve(state, refs, tracking, descriptor.arguments[0], style);
      if (typeof v === "number") return PixelRatio.getPixelSizeForLayoutSize(v);
    }
    case "fontScale": {
      const value = resolve(
        state,
        refs,
        tracking,
        descriptor.arguments[0],
        style,
      );
      if (typeof value === "number") return PixelRatio.getFontScale() * value;
    }
    case "pixelScale": {
      const value = resolve(
        state,
        refs,
        tracking,
        descriptor.arguments[0],
        style,
      );
      if (typeof value === "number") return PixelRatio.get() * value;
    }
    case "pixelScaleSelect": {
      const specifics = descriptor.arguments[0] as any;
      return resolve(
        state,
        refs,
        tracking,
        specifics[PixelRatio.get()] ?? specifics["default"],
        style,
      );
    }
    case "fontScaleSelect": {
      const specifics = descriptor.arguments[0] as any;
      return resolve(
        state,
        refs,
        tracking,
        specifics[PixelRatio.getFontScale()] ?? specifics["default"],
        style,
      );
    }
    case "roundToNearestPixel": {
      const v = resolve(state, refs, tracking, descriptor.arguments[0], style);
      if (typeof v === "number") return PixelRatio.roundToNearestPixel(v);
    }
    default: {
      if ("name" in descriptor && "arguments" in descriptor) {
        const args = resolve(
          state,
          refs,
          tracking,
          descriptor.arguments,
          style,
        ).join(",");
        return `${descriptor.name}(${args})`;
      } else {
        return descriptor;
      }
    }
  }
}

function resolve(
  state: ReducerState,
  refs: Refs,
  tracking: ReducerTracking,
  args: RuntimeValueDescriptor,
  style?: Record<string, any>,
): any {
  if (typeof args !== "object") {
    return args;
  }

  if (!Array.isArray(args)) {
    return "arguments" in args
      ? resolveValue(state, refs, tracking, args, style)
      : args;
  }

  let resolved = [];

  for (let value of args) {
    value = resolve(state, refs, tracking, value, style);

    if (value !== undefined) {
      resolved.push(value);
    }
  }

  return resolved;
}

/**
 * Get a CSS variable, it can be
 * - inline (via via a className or via the style prop)
 * - universal (e.g this CSS sets a universal variable `* { --primary: red; }` )
 * - inherited via the parent (either the parent set a variable, or its a :root variable)
 * @param state
 * @param name
 * @param style
 * @returns
 */
function getVar(
  state: ReducerState,
  refs: Refs,
  tracking: ReducerTracking,
  name: string,
  style?: Record<string, any>,
) {
  if (!name) return;
  let value: any = undefined;
  // Get the value from the inline style
  value ??= state.variables?.[name];
  // Get the value from the universal variables
  value ??= getUniversalVariable(name, tracking.effect);

  if (value === undefined) {
    // Get the value from the parent
    value = getVariable(name, refs.variables, tracking.effect);
    // If the parent is :root, these are Observables instead of the raw values
    // So you need to access them with the styleEffect
    if (typeof value === "object" && "get" in value) {
      value = value.get(tracking.effect);
    } else if (value !== undefined) {
      // This is a normal value that came from the context, so we need to track it
      tracking.guards.push(
        (refs) => getVariable(name, refs.variables, tracking.effect) !== value,
      );
    }
  }

  // The value may be another descriptor, so we need to resolve it
  return resolveValue(state, refs, tracking, value, style);
}

export function resolveAnimation(
  state: ReducerState,
  refs: Refs,
  [initialFrame, ...frames]: RuntimeValueFrame[],
  property: string,
  props: Record<string, any> = {},
  styleLookup: Record<string, any>,
  delay: number,
  totalDuration: number,
  timingFunction: EasingFunction,
): [AnimatableValue, AnimatableValue, ...AnimatableValue[]] {
  const { withDelay, withTiming, Easing } =
    require("react-native-reanimated") as typeof import("react-native-reanimated");

  const initialValue = resolveAnimationValue(
    state,
    refs,
    property,
    initialFrame.value,
  );

  return [
    initialValue,
    ...frames.map((frame) => {
      return withDelay(
        delay,
        withTiming(resolveAnimationValue(state, refs, property, frame.value), {
          duration: totalDuration * frame.progress,
          easing: getEasing(timingFunction, Easing),
        }),
      );
    }),
  ] as [AnimatableValue, AnimatableValue, ...AnimatableValue[]];
}

function resolveAnimationValue(
  state: ReducerState,
  refs: Refs,
  property: string,
  value: RuntimeValueDescriptor,
) {
  if (value === "!INHERIT!") {
    value = state.styleLookup[property] ?? state.props.style[property];
    if (value === undefined) {
      const defaultValueFn = defaultValues[property];
      return typeof defaultValueFn === "function"
        ? defaultValueFn(state.styleTracking.effect)
        : defaultValueFn;
    }
    return value;
  } else {
    return resolve(state, refs, state.styleTracking, value, state.props);
  }
}

export function resolveTransitionValue(state: ReducerState, property: string) {
  const defaultValueFn = defaultValues[property];
  const defaultValue =
    typeof defaultValueFn === "function"
      ? defaultValueFn(state.styleTracking.effect)
      : defaultValueFn;

  return {
    defaultValue,
    value:
      state.styleLookup[property] ??
      state.props[state.config.target]?.[property],
  };
}

export const timeToMS = (time: Time) => {
  return time.type === "milliseconds" ? time.value : time.value * 1000;
};

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

export function getEasing(
  timingFunction: EasingFunction,
  Easing: typeof import("react-native-reanimated")["Easing"],
) {
  switch (timingFunction.type) {
    case "ease":
      return Easing.ease;
    case "ease-in":
      return Easing.in(Easing.quad);
    case "ease-out":
      return Easing.out(Easing.quad);
    case "ease-in-out":
      return Easing.inOut(Easing.quad);
    case "linear":
      return Easing.linear;
    case "cubic-bezier":
      return Easing.bezier(
        timingFunction.x1,
        timingFunction.y1,
        timingFunction.x2,
        timingFunction.y2,
      );
    default:
      return Easing.linear;
  }
}

export function setDeep(
  target: Record<string, any>,
  paths: string[],
  value: any,
) {
  const prop = paths[paths.length - 1];
  for (let i = 0; i < paths.length - 1; i++) {
    const token = paths[i];
    target[token] ??= {};
    target = target[token];
  }
  if (transformKeys.has(prop)) {
    if (target.transform) {
      const existing = target.transform.find(
        (t: any) => Object.keys(t)[0] === prop,
      );
      if (existing) {
        existing[prop] = value;
      } else {
        target.transform.push({ [prop]: value });
      }
    } else {
      target.transform ??= [];
      target.transform.push({ [prop]: value });
    }
  } else {
    target[prop] = value;
  }
}

function getColorArgs(args: any[], config: Record<number, string>) {
  // Do we perfectly match a function?
  if (config[args.length]) return `${config[args.length]}(${args.join(", ")})`;
  // Otherwise, we need to split the args and remove any empty strings
  // e.g ["255 0 0", 1] => ["255", "0", "0", 1]
  args = args.flatMap((arg) => {
    return typeof arg === "string"
      ? arg.split(/[,\s\/]/g).filter(Boolean)
      : arg;
  });
  // Now do we match a function?
  if (config[args.length]) return `${config[args.length]}(${args.join(", ")})`;
}

function getLayout(state: ReducerState, refs: Refs, tracking: ReducerTracking) {
  refs.sharedState.layout ??= observable([0, 0]);
  return refs.sharedState.layout.get(tracking.effect);
}
export function getWidth(
  state: ReducerState,
  refs: Refs,
  tracking: ReducerTracking,
) {
  return getLayout(state, refs, tracking)[0];
}
export function getHeight(
  state: ReducerState,
  refs: Refs,
  tracking: ReducerTracking,
) {
  return getLayout(state, refs, tracking)[1];
}

export const defaultValues: Record<
  string,
  AnimatableValue | ((effect: Effect) => AnimatableValue)
> = {
  backgroundColor: "transparent",
  borderBottomColor: "transparent",
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderBottomWidth: 0,
  borderColor: "transparent",
  borderLeftColor: "transparent",
  borderLeftWidth: 0,
  borderRadius: 0,
  borderRightColor: "transparent",
  borderRightWidth: 0,
  borderTopColor: "transparent",
  borderTopWidth: 0,
  borderWidth: 0,
  bottom: 0,
  color: (effect) => {
    return systemColorScheme.get(effect) === "dark" ? "white" : "black";
  },
  flex: 1,
  flexBasis: 1,
  flexGrow: 1,
  flexShrink: 0,
  fontSize: 14,
  fontWeight: "400",
  gap: 0,
  left: 0,
  lineHeight: 14,
  margin: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  maxHeight: 99999,
  maxWidth: 99999,
  minHeight: 0,
  minWidth: 0,
  opacity: 1,
  padding: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  perspective: 1,
  right: 0,
  rotate: "0deg",
  rotateX: "0deg",
  rotateY: "0deg",
  rotateZ: "0deg",
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  skewX: "0deg",
  skewY: "0deg",
  top: 0,
  translateX: 0,
  translateY: 0,
  zIndex: 0,
};

const calcPrecedence: Record<string, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
};

function applyCalcOperator(
  operator: string,
  b: number, // These are reversed because we pop them off the stack
  a: number,
  values: number[],
) {
  switch (operator) {
    case "+":
      return values.push(a + b);
    case "-":
      return values.push(a - b);
    case "*":
      return values.push(a * b);
    case "/":
      return values.push(a / b);
  }
}

export function calc(
  state: ReducerState,
  refs: Refs,
  tracking: ReducerTracking,
  expression: RuntimeValueDescriptor,
  style?: Record<string, any>,
) {
  const values: number[] = [];
  const ops: string[] = [];

  let mode;

  if (!Array.isArray(expression)) {
    expression = [expression];
  }

  for (let token of expression) {
    switch (typeof token) {
      case "undefined":
        // Fail on an undefined value
        return;
      case "number":
        if (!mode) mode = "number";
        if (mode !== "number") return;
        values.push(token);
        continue;
      case "object": {
        // All values should resolve to a numerical value
        const value = resolveValue(state, refs, tracking, token, style);
        switch (typeof value) {
          case "number": {
            if (!mode) mode = "number";
            if (mode !== "number") return;
            values.push(value);
            continue;
          }
          case "string": {
            if (!value.endsWith("%")) {
              return;
            }
            if (!mode) mode = "percentage";
            if (mode !== "percentage") return;
            values.push(Number.parseFloat(value.slice(0, -1)));
            continue;
          }
          default:
            return;
        }
      }
      case "string": {
        if (token === "(") {
          ops.push(token);
        } else if (token === ")") {
          // Resolve all values within the brackets
          while (ops.length && ops[ops.length - 1] !== "(") {
            applyCalcOperator(ops.pop()!, values.pop()!, values.pop()!, values);
          }
          ops.pop();
        } else if (token.endsWith("%")) {
          if (!mode) mode = "percentage";
          if (mode !== "percentage") return;
          values.push(Number.parseFloat(token.slice(0, -1)));
        } else {
          // This means we have an operator
          while (
            ops.length &&
            calcPrecedence[ops[ops.length - 1]] >= calcPrecedence[token]
          ) {
            applyCalcOperator(ops.pop()!, values.pop()!, values.pop()!, values);
          }
          ops.push(token);
        }
      }
    }
  }

  while (ops.length) {
    applyCalcOperator(ops.pop()!, values.pop()!, values.pop()!, values);
  }

  if (!mode) return;

  const value = round(values[0]);

  return {
    mode,
    raw: value,
    value: mode === "percentage" ? `${value}%` : value,
  };
}
