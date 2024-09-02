import type {
  MediaQuery,
  Animation,
  ContainerType,
  Time,
  EasingFunction,
  ContainerCondition,
  Declaration,
  SelectorComponent,
} from "lightningcss";
import type {
  ClassicComponentClass,
  ComponentClass,
  ComponentProps,
  ComponentType,
  ForwardRefExoticComponent,
  FunctionComponent,
  JSXElementConstructor,
} from "react";
import type {
  Appearance,
  Dimensions,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native";
import type { INTERNAL_FLAGS, INTERNAL_RESET } from "./shared";
import type { Effect, Observable } from "./runtime/observable";
import type { SharedValue } from "react-native-reanimated";
import { SharedState } from "./runtime/native/types";

export interface Effect2 {
  update: () => void;
  dependencies: Set<() => void>;
}

export type ReactComponent<P = any> =
  | ClassicComponentClass<P>
  | ComponentClass<P>
  | FunctionComponent<P>
  | ForwardRefExoticComponent<P>;

export type InteropComponentConfig = {
  target: string;
  source: string;
  nativeStyleToProp?: NativeStyleToProp<any>;
};

export type CssToReactNativeRuntimeOptions = {
  inlineRem?: number | false;
  grouping?: (string | RegExp)[];
  ignorePropertyWarningRegex?: (string | RegExp)[];
  selectorPrefix?: string;
  stylesheetOrder?: number;
};

export interface ExtractRuleOptions extends CssToReactNativeRuntimeOptions {
  rules: Map<string, StyleRule[]>;
  keyframes: Map<string, ExtractedAnimation>;
  grouping: RegExp[];
  darkMode?: DarkMode;
  rootVariables: StyleSheetRegisterOptions["rootVariables"];
  universalVariables: StyleSheetRegisterOptions["universalVariables"];
  flags: Record<string, unknown>;
  selectorPrefix?: string;
  appearanceOrder: number;
  rem?: StyleSheetRegisterOptions["rem"];
}

export type EnableCssInteropOptions<
  T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
> = Record<string, CSSInteropClassNamePropConfig<ComponentProps<T>>>;

export type CssInterop = <
  const T extends ReactComponent<any>,
  const M extends EnableCssInteropOptions<any>,
>(
  component: T,
  mapping: EnableCssInteropOptions<T> & M,
) => ComponentType<ComponentProps<T> & CssInteropGeneratedProps<M>>;

export type CSSInteropClassNamePropConfig<P> =
  | undefined
  | boolean
  | (keyof P & string)
  | {
      target: (keyof P & string) | boolean;
      nativeStyleToProp?: NativeStyleToProp<P>;
    };

export type CssInteropGeneratedProps<T extends EnableCssInteropOptions<any>> = {
  [K in keyof T as K extends string
    ? T[K] extends undefined | false
      ? never
      : T[K] extends true | string
        ? K
        : T extends {
              target: string | boolean;
            }
          ? T["target"] extends true | string
            ? K
            : never
          : never
    : never]?: string;
};

export type NativeStyleToProp<P> = {
  [K in keyof Style & string]?: K extends keyof P
    ? (keyof P & string) | true
    : keyof P & string;
};

export type JSXFunction = (
  type: React.ComponentType,
  props: Record<string, any> | undefined | null,
  key?: React.Key,
  isStaticChildren?: boolean,
  __source?: unknown,
  __self?: unknown,
) => React.ElementType;

type OmitFirstTwo<T extends any[]> = T extends [any, any, ...infer R]
  ? R
  : never;

export type JSXFunctionType = Parameters<JSXFunction>[0];
export type JSXFunctionProps = Parameters<JSXFunction>[1];
export type JSXFunctionRest = OmitFirstTwo<Parameters<JSXFunction>>;

/**
 * Used by the compiler to detail how props should be set on the component
 */
export type PathTokens = string[];
export type MoveTokenRecord = Record<string, PathTokens>;
export type StyleDeclaration =
  | [string, object] // [Prop, Styles]
  | [string, string | number] // [Prop, value]
  | [
      AnimationPropertyKey,
      PathTokens,
      Exclude<RuntimeValueDescriptor, Array<any> | undefined>,
    ] // Set a value
  | [
      AnimationPropertyKey,
      PathTokens,
      Exclude<RuntimeValueDescriptor, Array<any> | undefined>,
      true,
    ]; // Set a delayed value

export type StyleRuleSet = {
  $type: "StyleRuleSet";
  normal?: StyleRule[];
  important?: StyleRule[];
  warnings?: ExtractionWarning[];
  classNames?: string;
  variables?: boolean;
  container?: boolean;
  animation?: boolean;
  active?: boolean;
  hover?: boolean;
  focus?: boolean;
};

export type RemappedClassName = {
  $type: "RemappedClassName";
  classNames: string[];
};

export type RuntimeStyleRule = StyleRule | object;

export type RuntimeStyleRuleSet = {
  normal: RuntimeStyleRule[];
  inline: RuntimeStyleRule[];
  important: RuntimeStyleRule[];
};

export type StyleRule = {
  $type: "StyleRule";
  specificity: Specificity;
  media?: MediaQuery[];
  variables?: Array<[string, RuntimeValueDescriptor]>;
  pseudoClasses?: PseudoClassesQuery;
  animations?: ExtractedAnimations;
  container?: Partial<ExtractedContainer>;
  containerQuery?: ExtractedContainerQuery[];
  transition?: ExtractedTransition;
  requiresLayoutWidth?: boolean;
  requiresLayoutHeight?: boolean;
  declarations?: StyleDeclaration[];
  attrs?: AttributeCondition[];
  warnings?: ExtractionWarning[];
};

export type ProcessedStyleRules =
  | (StyleRule & Required<Pick<StyleRule, "declarations">>)
  | Record<string, any>;

export type PropState = Effect & {
  initialRender: boolean;
  resetContext: boolean;
  isAnimated: boolean;
  sharedValues: Map<string, SharedValue<any>>;
  animationNames: Set<string>;
  animationWaitingOnLayout: boolean;
};

export type PropAccumulator = {
  props: Record<string, any>;
  transformLookup: Record<string, string>;
  state: PropState;
  target: string;
  resetContext: boolean;
  requiresLayout: boolean;
  delayedDeclarations: Extract<StyleDeclaration, Array<any>>[];
  variables: Map<string, RuntimeValueDescriptor>;
  isAnimated: boolean;
  animation?: Required<ExtractedAnimations>;
  transition?: Required<ExtractedTransition>;
  containerNames: string[] | null;
  getWidth(): number;
  getHeight(): number;
  getFontSize(): number;
  getVariable(name?: string): RuntimeValueDescriptor;
};

export type RuntimeValueDescriptor =
  | string
  | number
  | boolean
  | undefined
  | RuntimeValueDescriptor[]
  | {
      name: string;
      arguments: RuntimeValueDescriptor[];
      delay?: boolean;
    };

export type RuntimeValue =
  | string
  | number
  | boolean
  | undefined
  | ((acc: PropAccumulator) => RuntimeValue);

export type Specificity = {
  /** IDs - https://drafts.csswg.org/selectors/#specificity-rules */
  A?: number;
  /** Classes, Attributes, Pseudo-Classes - https://drafts.csswg.org/selectors/#specificity-rules */
  B?: number;
  /** Elements, Pseudo-Elements - https://drafts.csswg.org/selectors/#specificity-rules */
  C?: number;
  /** Importance - https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade#cascading_order */
  I?: number;
  /** StyleSheet Order */
  S?: number;
  /** Appearance Order */
  O?: number;
  /** Inline */
  inline?: number;
};

export type ExtractedContainer = {
  names?: string[] | false;
  type?: ContainerType;
};

export type ExtractedContainerQuery = {
  name?: string | null;
  condition?: ContainerCondition<Declaration>;
  pseudoClasses?: PseudoClassesQuery;
  attrs?: AttributeCondition[];
};

export type ExtractedAnimations = {
  [K in keyof Animation]?: Animation[K][];
};

export type ExtractedTransition = {
  /**
   * The delay before the transition starts.
   */
  delay?: Time[];
  /**
   * The duration of the transition.
   */
  duration?: Time[];
  /**
   * The property to transition.
   */
  property?: (AnimatableCSSProperty | "none")[];
  /**
   * The easing function for the transition.
   */
  timingFunction?: EasingFunction[];
};

type AnimationPropertyKey = string;
export type ExtractedAnimation = {
  frames: [
    AnimationPropertyKey,
    { values: RuntimeValueFrame[]; pathTokens: PathTokens },
  ][];
  requiresLayoutWidth?: boolean;
  requiresLayoutHeight?: boolean;
};

export type RuntimeValueFrame = {
  progress: number;
  value: RuntimeValueDescriptor;
};

export type PseudoClassesQuery = {
  hover?: boolean;
  active?: boolean;
  focus?: boolean;
};

export type StyleSheetRegisterCompiledOptions = {
  $compiled: true;
  rules?: [string, StyleRuleSet][];
  keyframes?: [string, ExtractedAnimation][];
  rootVariables?: VariableRecord;
  universalVariables?: VariableRecord;
  rem?: number;
  flags?: Record<string, unknown>;
};

export type StyleSheetRegisterOptions = {
  declarations?: Record<string, any | any[]>;
  keyframes?: Record<string, ExtractedAnimation>;
  rootVariables?: VariableRecord;
  universalVariables?: VariableRecord;
  rem?: number;
  flags?: Record<string, unknown>;
};

export type ColorSchemeVariableValue = {
  light?: RuntimeValueDescriptor;
  dark?: RuntimeValueDescriptor;
};
export type VariableRecord = Record<string, ColorSchemeVariableValue>;
export type ContainerRecord = Record<string, SharedState>;

export type Style = ViewStyle & TextStyle & ImageStyle;
export type StyleProp = Style | StyleProp[] | undefined;

export type KebabToCamelCase<S extends string> =
  S extends `${infer P1}-${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${KebabToCamelCase<P3>}`
    : Lowercase<S>;

export type ExtractionWarning =
  | ExtractionWarningProperty
  | ExtractionWarningValue
  | ExtractionWarningFunctionValue;

export type ExtractionWarningProperty = {
  type: "IncompatibleNativeProperty";
  property: string;
};

export type ExtractionWarningValue = {
  type: "IncompatibleNativeValue";
  property: string;
  value: any;
};

export type ExtractionWarningFunctionValue = {
  type: "IncompatibleNativeFunctionValue";
  property: string;
  value: any;
};

export type DarkMode =
  | { type: "media" }
  | { type: "class"; value: string }
  | { type: "attribute"; value: string };

export interface CssInteropStyleSheet {
  [INTERNAL_RESET](options?: {
    dimensions?: Dimensions;
    appearance?: typeof Appearance;
  }): void;
  [INTERNAL_FLAGS]: Record<string, string>;
  unstable_hook_onClassName?(callback: (c: string) => void): void;
  register(options: StyleSheetRegisterOptions): void;
  registerCompiled(options: StyleSheetRegisterCompiledOptions): void;
  getFlag(name: string): string | undefined;
  getGlobalStyle(name: string): Observable<StyleRuleSet> | undefined;
}

type AttributeSelectorComponent = Extract<
  SelectorComponent,
  { type: "attribute" }
>;
export type AttributeCondition = PropCondition | DataAttributeCondition;

export type PropCondition = Omit<AttributeSelectorComponent, "operation"> & {
  operation?:
    | AttributeSelectorComponent["operation"]
    | {
        operator: "empty" | "truthy";
      };
};

export type DataAttributeCondition = Omit<PropCondition, "type"> & {
  type: "data-attribute";
};

export type TransformProperty =
  | "perspective"
  | "translateX"
  | "translateY"
  | "translateZ"
  | "scale"
  | "scaleX"
  | "scaleY"
  | "scaleZ"
  | "rotate"
  | "rotateX"
  | "rotateY"
  | "rotateZ"
  | "skewX"
  | "skewY"
  | "skewZ"
  | "matrix"
  | "matrix3d";

/*
 * This is a list of all the CSS properties that can be animated
 * Source: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties
 */
export type AnimatableCSSProperty = (keyof Style | "fill" | "stroke") &
  KebabToCamelCase<
    | "background-color"
    | "border-bottom-color"
    | "border-bottom-left-radius"
    | "border-bottom-right-radius"
    | "border-bottom-width"
    | "border-color"
    | "border-left-color"
    | "border-left-width"
    | "border-radius"
    | "border-right-color"
    | "border-right-width"
    | "border-top-color"
    | "border-top-width"
    | "border-width"
    | "bottom"
    | "color"
    | "fill"
    | "flex"
    | "flex-basis"
    | "flex-grow"
    | "flex-shrink"
    | "font-size"
    | "font-weight"
    | "gap"
    | "height"
    | "left"
    | "letter-spacing"
    | "line-height"
    | "margin"
    | "margin-bottom"
    | "margin-left"
    | "margin-right"
    | "margin-top"
    | "max-height"
    | "max-width"
    | "min-height"
    | "min-width"
    | "object-position"
    | "opacity"
    | "order"
    | "padding"
    | "padding-bottom"
    | "padding-left"
    | "padding-right"
    | "padding-top"
    | "right"
    | "rotate"
    | "scale"
    | "stroke"
    | "text-decoration"
    | "text-decoration-color"
    | "top"
    | "transform"
    | "transform-origin"
    | "translate"
    | "vertical-align"
    | "visibility"
    | "width"
    | "word-spacing"
    | "z-index"
  >;
