/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SharedValue } from "react-native-reanimated";

import { PLACEHOLDER_SYMBOL } from "../../shared";
import type {
  ContainerRecord,
  ExtractedAnimations,
  ExtractedTransition,
  InteropComponentConfig,
  RuntimeValueDescriptor,
  StyleDeclaration,
} from "../../types";
import type { Effect, Observable } from "../observable";
import { ShorthandSymbol } from "./resolvers/shared";
import type { VariableContextValue } from "./styles";

export type Callback = () => void;
export type GetInteraction = (
  type: "active" | "focus" | "hover",
  effect: Callback,
) => boolean;

export type ReducerAction =
  | { type: "new-declarations"; className: string | undefined | null }
  | { type: "rerender-declarations" }
  | { type: "styles" };

export interface ReducerState {
  className?: string | undefined | null;
  config: InteropComponentConfig;
  normal: StyleDeclaration[];
  important: StyleDeclaration[];
  inline?: Record<string, unknown> | Record<string, unknown>[];
  props: Record<string, any>;
  variables?: Record<string, any>;
  containerNames?: false | string[];
  currentRenderAnimation: ExtractedAnimations;
  previousAnimation?: ExtractedAnimations;
  isWaitingLayout?: boolean;
  transition?: Required<ExtractedTransition>;
  animationInputOutputs?: Map<string, AnimationInputOutput>;
  sharedValues?: Map<string, SharedValue<any>>;
  animationNames?: Set<string>;
  styleTracking: ReducerTracking;
  declarationTracking: ReducerTracking;
}

export type AnimationInputOutput = [
  SharedValue<number>,
  Map<string, [number[], any[]] | undefined>,
];

export type TransitionSharedValue = [string, SharedValue<any>];

export interface ReducerTracking {
  effect: Effect;
  guards: RenderingGuard[];
  previous?: any;
}

export interface Refs {
  sharedState: SharedState;
  variables: VariableContextValue;
  containers: ContainerRecord;
  props: Record<string, any> | null;
}

export interface SharedState {
  initialRender: boolean;
  originalProps: Record<string, any> | null;
  props: Record<string, any> | null;
  animated: number;
  variables: number;
  containers: number;
  pressable: number;
  canUpgradeWarn: boolean;
  layout?: Observable<[number, number]>;
  hover?: Observable<boolean>;
  active?: Observable<boolean>;
  focus?: Observable<boolean>;
}

export type RenderingGuard = (refs: Refs) => boolean;

export type ShorthandResolveFn = (
  resolve: (
    state: ReducerState,
    refs: Refs,
    tracking: ReducerTracking,
    descriptor: RuntimeValueDescriptor | RuntimeValueDescriptor[],
    style?: Record<string, any>,
  ) => any,
  state: ReducerState,
  refs: Refs,
  tracking: ReducerTracking,
  descriptor: RuntimeValueDescriptor | RuntimeValueDescriptor[],
  style?: Record<string, any>,
) => ShorthandResult | undefined;

export type ShorthandResultArray = (readonly [
  string | readonly string[],
  any,
])[];

export type ShorthandResult = ShorthandResultArray & {
  [ShorthandSymbol]: boolean;
};

export interface Placeholder {
  [PLACEHOLDER_SYMBOL]: boolean;
}
