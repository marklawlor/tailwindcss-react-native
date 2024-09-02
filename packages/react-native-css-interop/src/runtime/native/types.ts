import { SharedValue } from "react-native-reanimated";
import {
  InteropComponentConfig,
  StyleDeclaration,
  ExtractedAnimations,
  ExtractedTransition,
  ContainerRecord,
} from "../../types";
import { Effect, Observable } from "../observable";
import { VariableContextValue } from "./styles";

export type Callback = () => void;
export type GetInteraction = (
  type: "active" | "focus" | "hover",
  effect: Callback,
) => boolean;

export type ReducerAction =
  | { type: "declarations"; className?: string }
  | { type: "styles" };

export type ReducerState = {
  className?: string;
  config: InteropComponentConfig;
  normal: ProcessedStyleDeclaration[];
  inline?: ProcessedStyleDeclaration | ProcessedStyleDeclaration[];
  important: ProcessedStyleDeclaration[];
  props: Record<string, any>;
  variables?: Record<string, any>;
  containerNames?: false | string[];
  animation?: Required<ExtractedAnimations> & { waitingLayout: boolean };
  transition?: Required<ExtractedTransition>;
  sharedValues?: Map<string, SharedValue<any>>;
  animationNames?: Set<string>;
  styleLookup: Record<string, any>;
  styleTracking: ReducerTracking;
  declarationTracking: ReducerTracking;
};

export type ReducerTracking = {
  effect: Effect;
  guards: RenderingGuard[];
  previous?: any;
};

export type ProcessedStyleDeclaration = StyleDeclaration | Record<string, any>;

export type Refs = {
  sharedState: SharedState;
  variables: VariableContextValue;
  containers: ContainerRecord;
  props: Record<string, any> | null;
};

export type SharedState = {
  originalProps: Record<string, any> | null;
  props: Record<string, any> | null;
  guardsEnabled: boolean;
  animated: number;
  variables: number;
  containers: number;
  pressable: number;
  canUpgradeWarn: boolean;
  layout?: Observable<[number, number]>;
  hover?: Observable<boolean>;
  active?: Observable<boolean>;
  focus?: Observable<boolean>;
};

export type RenderingGuard = (refs: Refs) => boolean;
