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
} from "react";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";
import type { Effect } from "./runtime/observable";
import type { SharedValue } from "react-native-reanimated";
import type { SharedState } from "./runtime/native/types";
import type { FeatureFlagStatus } from "./css-to-rn/feature-flags";
import { StyleRuleSetSymbol, StyleRuleSymbol } from "./shared";
import { BackgroundImage } from "./rn-types";

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
  target: string[];
  inlineProp?: string;
  source: string;
  propToRemove?: string;
  nativeStyleToProp?: Array<[string, string[]]>;
};

export type CssToReactNativeRuntimeOptions = {
  debug?: (str: string) => void;
  cache?: {
    rules: Map<string, StyleRule[]>;
    keyframes: Map<string, ExtractedAnimation>;
    rootVariables: StyleSheetRegisterOptions["rootVariables"];
    universalVariables: StyleSheetRegisterOptions["universalVariables"];
  };
  inlineRem?: number | false;
  grouping?: (string | RegExp)[];
  ignorePropertyWarningRegex?: (string | RegExp)[];
  selectorPrefix?: string;
  stylesheetOrder?: number;
  features?: FeatureFlagStatus;
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

export type CssInterop = <
  const C extends ReactComponent<any>,
  const M extends EnableCssInteropOptions<C>,
>(
  component: C,
  mapping: M & EnableCssInteropOptions<C>,
) => ComponentType<
  ComponentProps<C> & {
    [K in keyof M as K extends string
      ? M[K] extends undefined | false
        ? never
        : M[K] extends true | FlattenComponentProps<C>
          ? K
          : M[K] extends
                | {
                    target: FlattenComponentProps<C> | true;
                  }
                | {
                    target: false;
                    nativeStyleToProp: Record<string, unknown>;
                  }
            ? K
            : never
      : never]?: string;
  }
>;

export type EnableCssInteropOptions<C extends ReactComponent<any>> = Record<
  string,
  | boolean
  | FlattenComponentProps<C>
  | {
      target: false;
      nativeStyleToProp: {
        [K in
          | (keyof Style & string)
          | "fill"
          | "stroke"]?: K extends FlattenComponentProps<C>
          ? FlattenComponentProps<C> | true
          : FlattenComponentProps<C>;
      };
    }
  | {
      target: FlattenComponentProps<C> | true;
      nativeStyleToProp?: {
        [K in
          | (keyof Style & string)
          | "fill"
          | "stroke"]?: K extends FlattenComponentProps<C>
          ? FlattenComponentProps<C> | true
          : FlattenComponentProps<C>;
      };
    }
>;

type FlattenComponentProps<C extends ReactComponent<any>> = FlattenObjectKeys<
  ComponentProps<C>
>;

type FlattenObjectKeys<
  T extends Record<string, unknown>,
  Depth extends number[] = [],
  MaxDepth extends number = 10,
  Key = keyof T,
> = Depth["length"] extends MaxDepth
  ? never
  : Key extends string
    ? unknown extends T[Key] // If its unknown or any then allow for freeform string
      ? Key | `${Key}.${string}`
      : NonNullable<T[Key]> extends Record<string, unknown>
        ?
            | Key
            | `${Key}.${FlattenObjectKeys<NonNullable<T[Key]>, [...Depth, 0]>}`
        : Key
    : never;

export type JSXFunction = (
  type: React.ComponentType,
  props: Record<string, any> | undefined | null,
  key?: React.Key,
  isStaticChildren?: boolean,
  __source?: unknown,
  __self?: unknown,
) => React.ReactNode;

type OmitFirstTwo<T extends any[]> = T extends [any, any, ...infer R]
  ? R
  : never;

export type JSXFunctionType = Parameters<JSXFunction>[0];
export type JSXFunctionProps = Parameters<JSXFunction>[1];
export type JSXFunctionRest = OmitFirstTwo<Parameters<JSXFunction>>;

/**
 * Used by the compiler to detail how props should be set on the component
 */
export type StyleAttribute = string;
export type PathTokens = string[];
export type Delayed = boolean;
export type MoveTokenRecord = Record<string, PathTokens>;
export type StyleDeclaration =
  | [Record<string, string | number | boolean>]
  | [Record<string, string | number | boolean>, PathTokens]
  | [RuntimeValueDescriptor, StyleAttribute]
  | [RuntimeValueDescriptor, PathTokens]
  | [RuntimeValueDescriptor, StyleAttribute | PathTokens, 1];

export type StyleDeclarationOrInline =
  | StyleDeclaration
  | Record<string, unknown>;

export type StyleRuleSet = {
  [StyleRuleSetSymbol]: true;
  n?: StyleRule[];
  i?: StyleRule[];
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
  [StyleRuleSetSymbol]: "RemappedClassName";
  classNames: string[];
};

export type RuntimeStyleRule = StyleRule | object;

export type RuntimeStyleRuleSet = {
  normal: RuntimeStyleRule[];
  inline: RuntimeStyleRule[];
  important: RuntimeStyleRule[];
};

export type StyleRule = {
  [StyleRuleSymbol]: true;
  s: Specificity;
  d?: StyleDeclaration[];
  media?: MediaQuery[];
  variables?: Array<[string, RuntimeValueDescriptor]>;
  pseudoClasses?: PseudoClassesQuery;
  animations?: ExtractedAnimations;
  container?: Partial<ExtractedContainer>;
  containerQuery?: ExtractedContainerQuery[];
  transition?: ExtractedTransition;
  requiresLayoutWidth?: boolean;
  requiresLayoutHeight?: boolean;
  attrs?: AttributeCondition[];
  warnings?: ExtractionWarning[];
};

export type ProcessedStyleRules =
  | (StyleRule & Required<Pick<StyleRule, "d">>)
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
  state: PropState;
  target: string[];
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

export type RuntimeStyle = RuntimeValueDescriptor | Record<string, unknown>;

export type RuntimeValueDescriptor =
  | string
  | number
  | boolean
  | undefined
  | RuntimeFunction
  | BackgroundImage
  | RuntimeValueDescriptor[];

export type RuntimeFunction =
  | [
      {},
      string, // string
    ]
  | [
      {},
      string, // string
      undefined | RuntimeValueDescriptor[], // arguments
    ]
  | [
      {},
      string, // string
      undefined | RuntimeValueDescriptor[], // arguments
      1, // Should process after styles have been calculated
    ];

export type RuntimeValue =
  | string
  | number
  | boolean
  | undefined
  | ((acc: PropAccumulator) => RuntimeValue);

export type SpecificityValue = number | undefined;

/**
 * https://drafts.csswg.org/selectors/#specificity-rules
 *
 * This array is sorted by most common values when parsing a StyleSheet
 * @see SpecificityIndex for the order
 */
export type Specificity = SpecificityValue[];

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
export type AnimationEasingFunction =
  | EasingFunction
  | { type: "!PLACEHOLDER!" };

export type AnimationFrame = [AnimationPropertyKey, RuntimeValueFrame[]];

export type ExtractedAnimation = {
  frames: AnimationFrame[];
  /**
   * The easing function for each frame
   */
  easingFunctions?: AnimationEasingFunction[];
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
  rules?: Record<string, StyleRuleSet>;
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
  unstable_hook_onClassName?(callback: (c: string) => void): void;
  register(options: StyleSheetRegisterOptions): void;
  registerCompiled(options: StyleSheetRegisterCompiledOptions): void;
  getFlag(name: string): string | undefined;
  getGlobalStyle(name: string): StyleRuleSet | undefined;
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
