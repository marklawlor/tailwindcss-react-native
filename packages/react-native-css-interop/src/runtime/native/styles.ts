import { Appearance } from "react-native";
import { createContext } from "react";
import { Effect, Observable, observable } from "../observable";
import {
  colorScheme,
  cssVariableObservable,
  isReduceMotionEnabled,
} from "./appearance-observables";
import type {
  ExtractedAnimation,
  RemappedClassName,
  StyleRuleSet,
  StyleSheetRegisterCompiledOptions,
} from "../../types";
import { INTERNAL_RESET } from "./unit-observables";

export type InjectedStyleContextValue = {
  styles: Record<string, Observable<StyleRuleSet>>;
  animations: Record<string, ExtractedAnimation>;
  universalVariables: VariableContextValue;
};

export type VariableContextValue =
  | Map<string, ReturnType<typeof cssVariableObservable>>
  | Record<string, ReturnType<typeof cssVariableObservable>>;

declare global {
  var __css_interop: {
    styles: Map<string, Observable<StyleRuleSet | void>>;
    keyframes: Map<string, Observable<ExtractedAnimation | void>>;
    rootVariables: Map<string, ReturnType<typeof cssVariableObservable>>;
    universalVariables: Map<string, ReturnType<typeof cssVariableObservable>>;
  };
}

global.__css_interop ??= {
  styles: new Map(),
  keyframes: new Map(),
  rootVariables: new Map(),
  universalVariables: new Map(),
};

const styles = global.__css_interop.styles;
const keyframes = global.__css_interop.keyframes;
const rootVariables = global.__css_interop.rootVariables;
const universalVariables = global.__css_interop.universalVariables;

export const opaqueStyles = new WeakMap<
  object,
  RemappedClassName | StyleRuleSet
>();

export const VariableContext =
  createContext<VariableContextValue>(rootVariables);

export function getStyle(name: string, effect?: Effect) {
  let obs = styles.get(name);
  if (!obs) styles.set(name, (obs = observable(undefined)));
  return obs.get(effect);
}
export function getOpaqueStyles(
  style: Record<string, any>,
  effect?: Effect,
): (StyleRuleSet | Record<string, any> | void)[] {
  const opaqueStyle = opaqueStyles.get(style);

  if (!opaqueStyle) {
    return [style];
  }

  if (opaqueStyle.$type === "RemappedClassName") {
    return opaqueStyle.classNames.map((className) => {
      return getStyle(className, effect);
    });
  } else if (opaqueStyle.$type === "StyleRuleSet") {
    return [opaqueStyle];
  }

  return [];
}

export function getAnimation(name: string, effect: Effect) {
  let obs = keyframes.get(name);
  if (!obs) keyframes.set(name, (obs = observable(undefined)));
  return obs.get(effect);
}
export function getVariable(
  name: string,
  store?: Record<string, any> | Map<string, any>,
  effect?: Effect,
) {
  if (!store) return;

  let obs = store instanceof Map ? store.get(name) : store[name];
  if (!obs) {
    obs = cssVariableObservable(undefined);
    store instanceof Map ? store.set(name, obs) : (store[name] = obs);
  }
  return obs.get(effect);
}

export const getUniversalVariable = (name: string, effect: Effect) => {
  return getVariable(name, universalVariables, effect);
};

export function resetData() {
  styles.clear();
  keyframes.clear();
  universalVariables.clear();
  rootVariables.clear();
  colorScheme[INTERNAL_RESET](Appearance);
  isReduceMotionEnabled[INTERNAL_RESET]();
}

export function injectData(data: StyleSheetRegisterCompiledOptions) {
  if (data.rules) {
    for (const entry of data.rules) {
      const value = styles.get(entry[0]);
      if (value) {
        value.set(entry[1]);
      } else {
        styles.set(entry[0], observable(entry[1]));
      }
    }
  }

  if (data.keyframes) {
    for (const entry of data.keyframes) {
      const value = keyframes.get(entry[0]);
      if (value) {
        value.set(entry[1]);
      } else {
        keyframes.set(entry[0], observable(entry[1]));
      }
    }
  }

  if (data.rootVariables) {
    for (const entry of Object.entries(data.rootVariables)) {
      const value = rootVariables.get(entry[0]);
      if (value) {
        value.set(entry[1]);
      } else {
        rootVariables.set(entry[0], cssVariableObservable(entry[1]));
      }
    }
  }

  if (data.universalVariables) {
    for (const entry of Object.entries(data.universalVariables)) {
      const value = universalVariables.get(entry[0]);
      if (value) {
        value.set(entry[1]);
      } else {
        universalVariables.set(entry[0], cssVariableObservable(entry[1]));
      }
    }
  }
}
