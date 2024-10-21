// cSpell:ignore rcap,vmin,svmin,lvmin,dvmin,cqmin,vmax,svmax,lvmax,dvmax,cqmax,currentcolor,oklab,oklch,prophoto

import type {
  AlignContent,
  AlignItems,
  AlignSelf,
  Angle,
  BorderSideWidth,
  BorderStyle,
  CssColor,
  Declaration,
  DimensionPercentageFor_LengthValue,
  Display,
  FontFamily,
  FontSize,
  FontStyle,
  FontVariantCaps,
  FontWeight,
  GapValue,
  JustifyContent,
  Length,
  LengthPercentageOrAuto,
  LengthValue,
  LineHeight,
  LineStyle,
  MaxSize,
  NumberOrPercentage,
  OverflowKeyword,
  PropertyId,
  Size,
  TextAlign,
  TextDecorationLine,
  TextDecorationStyle,
  TextShadow,
  TokenOrValue,
  VerticalAlign,
  Token,
  BoxShadow,
  UserSelect,
  SVGPaint,
  ColorOrAuto,
  EnvironmentVariable,
  Translate,
  Scale,
  UnresolvedColor,
  Position,
  PositionComponentFor_HorizontalPositionKeyword,
  PositionComponentFor_VerticalPositionKeyword,
} from "lightningcss";

import type {
  ExtractionWarning,
  RuntimeValueDescriptor,
  RuntimeFunction,
} from "../types";
import { FeatureFlagStatus } from "./feature-flags";
import { isDescriptorArray } from "../shared";
import { toRNProperty } from "./normalize-selectors";

const unparsedPropertyMapping: Record<string, string> = {
  "margin-inline-start": "margin-start",
  "margin-inline-end": "margin-end",
  "padding-inline-start": "padding-start",
  "padding-inline-end": "padding-end",
};

type AddStyleProp = (
  property: string,
  value?: RuntimeValueDescriptor,
  moveTokens?: string[],
) => void;

type HandleStyleShorthand = (
  property: string,
  options: Record<string, RuntimeValueDescriptor>,
) => void;

type AddAnimationDefaultProp = (property: string, value: unknown[]) => void;
type AddContainerProp = (
  declaration: Extract<
    Declaration,
    { property: "container" | "container-name" | "container-type" }
  >,
) => void;
type AddTransitionProp = (
  declaration: Extract<
    Declaration,
    {
      property:
        | "transition-property"
        | "transition-duration"
        | "transition-delay"
        | "transition-timing-function"
        | "transition";
    }
  >,
) => void;
type AddWarning = (warning: ExtractionWarning) => undefined;

const validProperties = [
  "align-content",
  "align-items",
  "align-self",
  "animation",
  "animation-delay",
  "animation-direction",
  "animation-duration",
  "animation-fill-mode",
  "animation-iteration-count",
  "animation-name",
  "animation-play-state",
  "animation-timing-function",
  "aspect-ratio",
  "background-color",
  "block-size",
  "border",
  "border-block",
  "border-block-color",
  "border-block-end",
  "border-block-end-color",
  "border-block-end-width",
  "border-block-start",
  "border-block-start-color",
  "border-block-start-width",
  "border-block-width",
  "border-bottom",
  "border-bottom-color",
  "border-bottom-left-radius",
  "border-bottom-right-radius",
  "border-bottom-width",
  "border-color",
  "border-end-end-radius",
  "border-end-start-radius",
  "border-inline",
  "border-inline-color",
  "border-inline-end",
  "border-inline-end-color",
  "border-inline-end-width",
  "border-inline-start",
  "border-inline-start-color",
  "border-inline-start-width",
  "border-inline-width",
  "border-left",
  "border-left-color",
  "border-left-width",
  "border-radius",
  "border-right",
  "border-right-color",
  "border-right-width",
  "border-start-end-radius",
  "border-start-start-radius",
  "border-style",
  "border-top",
  "border-top-color",
  "border-top-left-radius",
  "border-top-right-radius",
  "border-top-width",
  "border-width",
  "bottom",
  "box-shadow",
  "caret-color",
  "color",
  "column-gap",
  "container",
  "container-name",
  "container-type",
  "display",
  "fill",
  "flex",
  "flex-basis",
  "flex-direction",
  "flex-flow",
  "flex-grow",
  "flex-shrink",
  "flex-wrap",
  "font",
  "font-family",
  "font-size",
  "font-style",
  "font-variant-caps",
  "font-weight",
  "gap",
  "height",
  "inline-size",
  "inset",
  "inset-block",
  "inset-block-end",
  "inset-block-start",
  "inset-inline",
  "inset-inline-end",
  "inset-inline-start",
  "justify-content",
  "left",
  "letter-spacing",
  "line-height",
  "margin",
  "margin-block",
  "margin-block-end",
  "margin-block-start",
  "margin-bottom",
  "margin-inline",
  "margin-inline-end",
  "margin-inline-start",
  "margin-left",
  "margin-right",
  "margin-top",
  "max-block-size",
  "max-height",
  "max-inline-size",
  "max-width",
  "min-block-size",
  "min-height",
  "min-inline-size",
  "min-width",
  "opacity",
  "overflow",
  "padding",
  "padding-block",
  "padding-block-end",
  "padding-block-start",
  "padding-bottom",
  "padding-inline",
  "padding-inline-end",
  "padding-inline-start",
  "padding-left",
  "padding-right",
  "padding-top",
  "pointer-events",
  "position",
  "right",
  "rotate",
  "row-gap",
  "scale",
  "stroke",
  "stroke-width",
  "text-align",
  "text-decoration",
  "text-decoration-color",
  "text-decoration-line",
  "text-decoration-style",
  "text-shadow",
  "text-transform",
  "top",
  "transform",
  "transform-origin",
  "transition",
  "transition-delay",
  "transition-duration",
  "transition-property",
  "transition-timing-function",
  "translate",
  "user-select",
  "vertical-align",
  "width",
  "z-index",
] as const;

const validPropertiesLoose = new Set<string>(validProperties);

export interface ParseDeclarationOptions {
  inlineRem?: number | false;
  addStyleProp: AddStyleProp;
  addTransformProp: AddStyleProp;
  handleStyleShorthand: HandleStyleShorthand;
  handleTransformShorthand: HandleStyleShorthand;
  addAnimationProp: AddAnimationDefaultProp;
  addContainerProp: AddContainerProp;
  addTransitionProp: AddTransitionProp;
  addWarning: AddWarning;
  requiresLayout: (name: string) => void;
  features: FeatureFlagStatus;
}

export interface ParseDeclarationOptionsWithValueWarning
  extends ParseDeclarationOptions {
  addValueWarning: (value: any) => undefined;
  addFunctionValueWarning: (value: any) => undefined;
  allowAuto?: boolean;
}

export function parseDeclaration(
  declaration: Declaration,
  options: ParseDeclarationOptions,
) {
  const {
    addStyleProp,
    addTransformProp,
    handleStyleShorthand,
    handleTransformShorthand,
    addAnimationProp,
    addContainerProp,
    addTransitionProp,
    addWarning,
  } = options;

  if ("vendorPrefix" in declaration && declaration.vendorPrefix.length) {
    return;
  }

  if (
    "value" in declaration &&
    typeof declaration.value === "object" &&
    "vendorPrefix" in declaration.value &&
    Array.isArray(declaration.value.vendorPrefix) &&
    declaration.value.vendorPrefix.length
  ) {
    return;
  }

  if (declaration.property === "unparsed") {
    if (!isValid(declaration.value.propertyId)) {
      return addWarning({
        type: "IncompatibleNativeProperty",
        property: declaration.value.propertyId.property,
      });
    }

    const parseOptions = {
      ...options,
      addFunctionValueWarning(value: any) {
        return addWarning({
          type: "IncompatibleNativeFunctionValue",
          property: declaration.value.propertyId.property,
          value,
        });
      },
      addValueWarning(value: any) {
        return addWarning({
          type: "IncompatibleNativeValue",
          property: declaration.value.propertyId.property,
          value,
        });
      },
    };

    let property =
      unparsedPropertyMapping[declaration.value.propertyId.property] ||
      declaration.value.propertyId.property;

    if (unparsedRuntimeFn.has(property)) {
      let args = parseUnparsed(declaration.value.value, parseOptions);
      if (!isDescriptorArray(args)) {
        args = [args];
      }
      return addStyleProp(property, [{}, `@${toRNProperty(property)}`, args]);
    }

    return addStyleProp(
      property,
      parseUnparsed(declaration.value.value, parseOptions),
    );
  } else if (declaration.property === "custom") {
    let property = declaration.value.name;
    if (
      validPropertiesLoose.has(property) ||
      property.startsWith("--") ||
      property.startsWith("-rn-")
    ) {
      return addStyleProp(
        property,
        parseUnparsed(declaration.value.value, {
          ...options,
          allowAuto: allowAuto.has(property),
          addValueWarning(value: any) {
            return addWarning({
              type: "IncompatibleNativeValue",
              property,
              value,
            });
          },
          addFunctionValueWarning(value: any) {
            return addWarning({
              type: "IncompatibleNativeFunctionValue",
              property,
              value,
            });
          },
        }),
      );
    } else {
      return addWarning({
        type: "IncompatibleNativeProperty",
        property: declaration.value.name,
      });
    }
  }

  const parseOptions = {
    ...options,
    addValueWarning(value: any) {
      return addWarning({
        type: "IncompatibleNativeValue",
        property: declaration.property,
        value,
      });
    },
    addFunctionValueWarning(value: any) {
      return addWarning({
        type: "IncompatibleNativeFunctionValue",
        property: declaration.property,
        value,
      });
    },
  };

  const addInvalidProperty = () => {
    return addWarning({
      type: "IncompatibleNativeProperty",
      property: declaration.property,
    });
  };

  if (!isValid(declaration)) {
    return addInvalidProperty();
  }

  switch (declaration.property) {
    case "background-color":
      return addStyleProp(
        declaration.property,
        parseColor(declaration.value, parseOptions),
      );
    case "opacity":
      return addStyleProp(declaration.property, declaration.value);
    case "color":
      return addStyleProp(
        declaration.property,
        parseColor(declaration.value, parseOptions),
      );
    case "display":
      return addStyleProp(
        declaration.property,
        parseDisplay(declaration.value, parseOptions),
      );
    case "width":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "height":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "min-width":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "min-height":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "max-width":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "max-height":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "block-size":
      return addStyleProp("width", parseSize(declaration.value, parseOptions));
    case "inline-size":
      return addStyleProp("height", parseSize(declaration.value, parseOptions));
    case "min-block-size":
      return addStyleProp(
        "min-width",
        parseSize(declaration.value, parseOptions),
      );
    case "min-inline-size":
      return addStyleProp(
        "min-height",
        parseSize(declaration.value, parseOptions),
      );
    case "max-block-size":
      return addStyleProp(
        "max-width",
        parseSize(declaration.value, parseOptions),
      );
    case "max-inline-size":
      return addStyleProp(
        "max-height",
        parseSize(declaration.value, parseOptions),
      );
    case "overflow":
      return addStyleProp(
        declaration.property,
        parseOverflow(declaration.value.x, parseOptions),
      );
    case "position":
      const value: any = (declaration as any).value.type;
      if (value === "absolute" || value === "relative") {
        return addStyleProp(declaration.property, value);
      } else {
        parseOptions.addValueWarning(value);
      }
      return;
    case "top":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "bottom":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "left":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "right":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "inset-block-start":
      return addStyleProp(
        declaration.property,
        parseLengthPercentageOrAuto(declaration.value, parseOptions),
      );
    case "inset-block-end":
      return addStyleProp(
        declaration.property,
        parseLengthPercentageOrAuto(declaration.value, parseOptions),
      );
    case "inset-inline-start":
      return addStyleProp(
        declaration.property,
        parseLengthPercentageOrAuto(declaration.value, parseOptions),
      );
    case "inset-inline-end":
      return addStyleProp(
        declaration.property,
        parseLengthPercentageOrAuto(declaration.value, parseOptions),
      );
    case "inset-block":
      return handleStyleShorthand("inset-block", {
        "inset-block-start": parseLengthPercentageOrAuto(
          declaration.value.blockStart,
          parseOptions,
        ),
        "inset-block-end": parseLengthPercentageOrAuto(
          declaration.value.blockEnd,
          parseOptions,
        ),
      });
    case "inset-inline":
      return handleStyleShorthand("inset-inline", {
        "inset-block-start": parseLengthPercentageOrAuto(
          declaration.value.inlineStart,
          parseOptions,
        ),
        "inset-block-end": parseLengthPercentageOrAuto(
          declaration.value.inlineEnd,
          parseOptions,
        ),
      });
    case "inset":
      handleStyleShorthand("inset", {
        top: parseLengthPercentageOrAuto(declaration.value.top, {
          ...parseOptions,
          addValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeValue",
              property: "top",
              value,
            });
          },
          addFunctionValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeFunctionValue",
              property: "top",
              value,
            });
          },
        }),
        bottom: parseLengthPercentageOrAuto(declaration.value.bottom, {
          ...parseOptions,
          addValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeValue",
              property: "bottom",
              value,
            });
          },
          addFunctionValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeFunctionValue",
              property: "bottom",
              value,
            });
          },
        }),
        left: parseLengthPercentageOrAuto(declaration.value.left, {
          ...parseOptions,
          addValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeValue",
              property: "left",
              value,
            });
          },
          addFunctionValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeFunctionValue",
              property: "left",
              value,
            });
          },
        }),
        right: parseLengthPercentageOrAuto(declaration.value.right, {
          ...parseOptions,
          addValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeValue",
              property: "right",
              value,
            });
          },
          addFunctionValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeFunctionValue",
              property: "right",
              value,
            });
          },
        }),
      });
      return;
    case "border-top-color":
      return addStyleProp(
        declaration.property,
        parseColor(declaration.value, parseOptions),
      );
    case "border-bottom-color":
      return addStyleProp(
        declaration.property,
        parseColor(declaration.value, parseOptions),
      );
    case "border-left-color":
      return addStyleProp(
        declaration.property,
        parseColor(declaration.value, parseOptions),
      );
    case "border-right-color":
      return addStyleProp(
        declaration.property,
        parseColor(declaration.value, parseOptions),
      );
    case "border-block-start-color":
      return addStyleProp(
        "border-top-color",
        parseColor(declaration.value, parseOptions),
      );
    case "border-block-end-color":
      return addStyleProp(
        "border-bottom-color",
        parseColor(declaration.value, parseOptions),
      );
    case "border-inline-start-color":
      return addStyleProp(
        "border-left-color",
        parseColor(declaration.value, parseOptions),
      );
    case "border-inline-end-color":
      return addStyleProp(
        "border-right-color",
        parseColor(declaration.value, parseOptions),
      );
    case "border-top-width":
      return addStyleProp(
        declaration.property,
        parseBorderSideWidth(declaration.value, parseOptions),
      );
    case "border-bottom-width":
      return addStyleProp(
        declaration.property,
        parseBorderSideWidth(declaration.value, parseOptions),
      );
    case "border-left-width":
      return addStyleProp(
        declaration.property,
        parseBorderSideWidth(declaration.value, parseOptions),
      );
    case "border-right-width":
      return addStyleProp(
        declaration.property,
        parseBorderSideWidth(declaration.value, parseOptions),
      );
    case "border-block-start-width":
      return addStyleProp(
        "border-top-width",
        parseBorderSideWidth(declaration.value, parseOptions),
      );
    case "border-block-end-width":
      return addStyleProp(
        "border-bottom-width",
        parseBorderSideWidth(declaration.value, parseOptions),
      );
    case "border-inline-start-width":
      return addStyleProp(
        "border-left-width",
        parseBorderSideWidth(declaration.value, parseOptions),
      );
    case "border-inline-end-width":
      return addStyleProp(
        "border-right-width",
        parseBorderSideWidth(declaration.value, parseOptions),
      );
    case "border-top-left-radius":
      return addStyleProp(
        declaration.property,
        parseLength(declaration.value[0], parseOptions),
      );
    case "border-top-right-radius":
      return addStyleProp(
        declaration.property,
        parseLength(declaration.value[0], parseOptions),
      );
    case "border-bottom-left-radius":
      return addStyleProp(
        declaration.property,
        parseLength(declaration.value[0], parseOptions),
      );
    case "border-bottom-right-radius":
      return addStyleProp(
        declaration.property,
        parseLength(declaration.value[0], parseOptions),
      );
    case "border-start-start-radius":
      return addStyleProp(
        declaration.property,
        parseLength(declaration.value[0], parseOptions),
      );
    case "border-start-end-radius":
      return addStyleProp(
        declaration.property,
        parseLength(declaration.value[0], parseOptions),
      );
    case "border-end-start-radius":
      return addStyleProp(
        declaration.property,
        parseLength(declaration.value[0], parseOptions),
      );
    case "border-end-end-radius":
      return addStyleProp(
        declaration.property,
        parseLength(declaration.value[0], parseOptions),
      );
    case "border-radius":
      handleStyleShorthand("border-radius", {
        "border-bottom-left-radius": parseLength(
          declaration.value.bottomLeft[0],
          parseOptions,
        ),
        "border-bottom-right-radius": parseLength(
          declaration.value.bottomRight[0],
          parseOptions,
        ),
        "border-top-left-radius": parseLength(
          declaration.value.topLeft[0],
          parseOptions,
        ),
        "border-top-right-radius": parseLength(
          declaration.value.topRight[0],
          parseOptions,
        ),
      });
      return;
    case "border-color":
      handleStyleShorthand("border-color", {
        "border-top-color": parseColor(declaration.value.top, {
          ...parseOptions,
          addValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeValue",
              property: "border-top-color",
              value,
            });
          },
          addFunctionValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeFunctionValue",
              property: "border-top-color",
              value,
            });
          },
        }),
        "border-bottom-color": parseColor(declaration.value.bottom, {
          ...parseOptions,
          addValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeValue",
              property: "border-bottom-color",
              value,
            });
          },
          addFunctionValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeFunctionValue",
              property: "border-bottom-color",
              value,
            });
          },
        }),
        "border-left-color": parseColor(declaration.value.left, {
          ...parseOptions,
          addValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeValue",
              property: "border-left-color",
              value,
            });
          },
          addFunctionValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeFunctionValue",
              property: "border-left-color",
              value,
            });
          },
        }),
        "border-right-color": parseColor(declaration.value.right, {
          ...parseOptions,
          addValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeValue",
              property: "border-right-color",
              value,
            });
          },
          addFunctionValueWarning(value: any) {
            addWarning({
              type: "IncompatibleNativeFunctionValue",
              property: "border-right-color",
              value,
            });
          },
        }),
      });
      return;
    case "border-style":
      return addStyleProp(
        declaration.property,
        parseBorderStyle(declaration.value, parseOptions),
      );
    case "border-width":
      handleStyleShorthand("border-width", {
        "border-top-width": parseBorderSideWidth(
          declaration.value.top,
          parseOptions,
        ),
        "border-bottom-width": parseBorderSideWidth(
          declaration.value.bottom,
          parseOptions,
        ),
        "border-left-width": parseBorderSideWidth(
          declaration.value.left,
          parseOptions,
        ),
        "border-right-width": parseBorderSideWidth(
          declaration.value.right,
          parseOptions,
        ),
      });
      return;
    case "border-block-color":
      addStyleProp(
        "border-top-color",
        parseColor(declaration.value.start, parseOptions),
      );
      addStyleProp(
        "border-bottom-color",
        parseColor(declaration.value.end, parseOptions),
      );
      return;
    case "border-block-width":
      addStyleProp(
        "border-top-width",
        parseBorderSideWidth(declaration.value.start, parseOptions),
      );
      addStyleProp(
        "border-bottom-width",
        parseBorderSideWidth(declaration.value.end, parseOptions),
      );
      return;
    case "border-inline-color":
      addStyleProp(
        "border-left-color",
        parseColor(declaration.value.start, parseOptions),
      );
      addStyleProp(
        "border-right-color",
        parseColor(declaration.value.end, parseOptions),
      );
      return;
    case "border-inline-width":
      addStyleProp(
        "border-left-width",
        parseBorderSideWidth(declaration.value.start, parseOptions),
      );
      addStyleProp(
        "border-right-width",
        parseBorderSideWidth(declaration.value.end, parseOptions),
      );
      return;
    case "border":
      handleStyleShorthand("border", {
        "border-width": parseBorderSideWidth(
          declaration.value.width,
          parseOptions,
        ),
        "border-style": parseBorderStyle(declaration.value.style, parseOptions),
      });
      return;
    case "border-top":
      addStyleProp(
        declaration.property + "-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        declaration.property + "-width",
        parseBorderSideWidth(declaration.value.width, parseOptions),
      );
      return;
    case "border-bottom":
      addStyleProp(
        declaration.property + "-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        declaration.property + "-width",
        parseBorderSideWidth(declaration.value.width, parseOptions),
      );
      return;
    case "border-left":
      addStyleProp(
        declaration.property + "-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        declaration.property + "-width",
        parseBorderSideWidth(declaration.value.width, parseOptions),
      );
      return;
    case "border-right":
      addStyleProp(
        declaration.property + "-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        declaration.property + "-width",
        parseBorderSideWidth(declaration.value.width, parseOptions),
      );
      return;
    case "border-block":
      addStyleProp(
        "border-top-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        "border-bottom-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        "border-top-width",
        parseBorderSideWidth(declaration.value.width, parseOptions),
      );
      addStyleProp(
        "border-bottom-width",
        parseBorderSideWidth(declaration.value.width, parseOptions),
      );
      return;
    case "border-block-start":
      addStyleProp(
        "border-top-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        "border-top-width",
        parseBorderSideWidth(declaration.value.width, parseOptions),
      );
      return;
    case "border-block-end":
      addStyleProp(
        "border-bottom-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        "border-bottom-width",
        parseBorderSideWidth(declaration.value.width, parseOptions),
      );
      return;
    case "border-inline":
      addStyleProp(
        "border-left-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        "border-right-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        "border-left-width",
        parseBorderSideWidth(declaration.value.width, parseOptions),
      );
      addStyleProp(
        "border-right-width",
        parseBorderSideWidth(declaration.value.width, parseOptions),
      );
      return;
    case "border-inline-start":
      addStyleProp(
        "border-left-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        "border-left-width",
        parseBorderSideWidth(declaration.value.width, parseOptions),
      );
      return;
    case "border-inline-end":
      addStyleProp(
        "border-right-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        "border-right-width",
        parseBorderSideWidth(declaration.value.width, parseOptions),
      );
      return;
    case "flex-direction":
      return addStyleProp(declaration.property, declaration.value);
    case "flex-wrap":
      return addStyleProp(declaration.property, declaration.value);
    case "flex-flow":
      addStyleProp("flexWrap", declaration.value.wrap);
      addStyleProp("flexDirection", declaration.value.direction);
      break;
    case "flex-grow":
      return addStyleProp(declaration.property, declaration.value);
    case "flex-shrink":
      return addStyleProp(declaration.property, declaration.value);
    case "flex-basis":
      return addStyleProp(
        declaration.property,
        parseLengthPercentageOrAuto(declaration.value, parseOptions),
      );
    case "flex":
      addStyleProp("flex-grow", declaration.value.grow);
      addStyleProp("flex-shrink", declaration.value.shrink);
      addStyleProp(
        "flex-basis",
        parseLengthPercentageOrAuto(declaration.value.basis, parseOptions),
      );
      break;
    case "align-content":
      return addStyleProp(
        declaration.property,
        parseAlignContent(declaration.value, parseOptions),
      );
    case "justify-content":
      return addStyleProp(
        declaration.property,
        parseJustifyContent(declaration.value, parseOptions),
      );
    case "align-self":
      return addStyleProp(
        declaration.property,
        parseAlignSelf(declaration.value, parseOptions),
      );
    case "align-items":
      return addStyleProp(
        declaration.property,
        parseAlignItems(declaration.value, parseOptions),
      );
    case "row-gap":
      return addStyleProp("row-gap", parseGap(declaration.value, parseOptions));
    case "column-gap":
      return addStyleProp(
        "column-gap",
        parseGap(declaration.value, parseOptions),
      );
    case "gap":
      addStyleProp("row-gap", parseGap(declaration.value.row, parseOptions));
      addStyleProp(
        "column-gap",
        parseGap(declaration.value.column, parseOptions),
      );
      return;
    case "margin":
      handleStyleShorthand("margin", {
        "margin-top": parseSize(declaration.value.top, parseOptions, {
          allowAuto: true,
        }),
        "margin-bottom": parseSize(declaration.value.bottom, parseOptions, {
          allowAuto: true,
        }),
        "margin-left": parseSize(declaration.value.left, parseOptions, {
          allowAuto: true,
        }),
        "margin-right": parseSize(declaration.value.right, parseOptions, {
          allowAuto: true,
        }),
      });
      return;
    case "margin-top":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions, {
          allowAuto: true,
        }),
      );
    case "margin-bottom":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions, {
          allowAuto: true,
        }),
      );
    case "margin-left":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions, {
          allowAuto: true,
        }),
      );
    case "margin-right":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions, {
          allowAuto: true,
        }),
      );
    case "margin-block-start":
      return addStyleProp(
        "margin-start",
        parseLengthPercentageOrAuto(declaration.value, parseOptions, {
          allowAuto: true,
        }),
      );
    case "margin-block-end":
      return addStyleProp(
        "margin-end",
        parseLengthPercentageOrAuto(declaration.value, parseOptions, {
          allowAuto: true,
        }),
      );
    case "margin-inline-start":
      return addStyleProp(
        "margin-start",
        parseLengthPercentageOrAuto(declaration.value, parseOptions, {
          allowAuto: true,
        }),
      );
    case "margin-inline-end":
      return addStyleProp(
        "margin-end",
        parseLengthPercentageOrAuto(declaration.value, parseOptions, {
          allowAuto: true,
        }),
      );
    case "margin-block":
      handleStyleShorthand("margin-block", {
        "margin-start": parseLengthPercentageOrAuto(
          declaration.value.blockStart,
          parseOptions,
        ),
        "margin-end": parseLengthPercentageOrAuto(
          declaration.value.blockEnd,
          parseOptions,
        ),
      });
      return;
    case "margin-inline":
      handleStyleShorthand("margin-inline", {
        "margin-start": parseLengthPercentageOrAuto(
          declaration.value.inlineStart,
          parseOptions,
        ),
        "margin-end": parseLengthPercentageOrAuto(
          declaration.value.inlineEnd,
          parseOptions,
        ),
      });
      return;
    case "padding":
      handleStyleShorthand("padding", {
        "padding-top": parseSize(declaration.value.top, parseOptions),
        "padding-left": parseSize(declaration.value.left, parseOptions),
        "padding-right": parseSize(declaration.value.right, parseOptions),
        "padding-bottom": parseSize(declaration.value.bottom, parseOptions),
      });
      break;
    case "padding-top":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "padding-bottom":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "padding-left":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "padding-right":
      return addStyleProp(
        declaration.property,
        parseSize(declaration.value, parseOptions),
      );
    case "padding-block-start":
      return addStyleProp(
        "padding-start",
        parseLengthPercentageOrAuto(declaration.value, parseOptions),
      );
    case "padding-block-end":
      return addStyleProp(
        "padding-end",
        parseLengthPercentageOrAuto(declaration.value, parseOptions),
      );
    case "padding-inline-start":
      return addStyleProp(
        "padding-start",
        parseLengthPercentageOrAuto(declaration.value, parseOptions),
      );
    case "padding-inline-end":
      return addStyleProp(
        "padding-end",
        parseLengthPercentageOrAuto(declaration.value, parseOptions),
      );
    case "padding-block":
      handleStyleShorthand("padding-block", {
        "padding-start": parseLengthPercentageOrAuto(
          declaration.value.blockStart,
          parseOptions,
        ),
        "padding-end": parseLengthPercentageOrAuto(
          declaration.value.blockEnd,
          parseOptions,
        ),
      });
      return;
    case "padding-inline":
      handleStyleShorthand("padding-inline", {
        "padding-start": parseLengthPercentageOrAuto(
          declaration.value.inlineStart,
          parseOptions,
        ),
        "padding-end": parseLengthPercentageOrAuto(
          declaration.value.inlineEnd,
          parseOptions,
        ),
      });
      return;
    case "font-weight":
      return addStyleProp(
        declaration.property,
        parseFontWeight(declaration.value, parseOptions),
      );
    case "font-size":
      return addStyleProp(
        declaration.property,
        parseFontSize(declaration.value, parseOptions),
      );
    case "font-family":
      return addStyleProp(
        declaration.property,
        parseFontFamily(declaration.value),
      );
    case "font-style":
      return addStyleProp(
        declaration.property,
        parseFontStyle(declaration.value, parseOptions),
      );
    case "font-variant-caps":
      return addStyleProp(
        declaration.property,
        parseFontVariantCaps(declaration.value, parseOptions),
      );
    case "line-height":
      return addStyleProp(
        declaration.property,
        parseLineHeight(declaration.value, parseOptions),
      );
    case "font":
      addStyleProp(
        declaration.property + "-family",
        parseFontFamily(declaration.value.family),
      );
      addStyleProp(
        "line-height",
        parseLineHeight(declaration.value.lineHeight, parseOptions),
      );
      addStyleProp(
        declaration.property + "-size",
        parseFontSize(declaration.value.size, parseOptions),
      );
      addStyleProp(
        declaration.property + "-style",
        parseFontStyle(declaration.value.style, parseOptions),
      );
      addStyleProp(
        declaration.property + "-variant",
        parseFontVariantCaps(declaration.value.variantCaps, parseOptions),
      );
      addStyleProp(
        declaration.property + "-weight",
        parseFontWeight(declaration.value.weight, parseOptions),
      );
      return;
    case "vertical-align":
      return addStyleProp(
        declaration.property,
        parseVerticalAlign(declaration.value, parseOptions),
      );
    case "transition-property":
    case "transition-duration":
    case "transition-delay":
    case "transition-timing-function":
    case "transition":
      return addTransitionProp(declaration);
    case "animation-duration":
    case "animation-timing-function":
    case "animation-iteration-count":
    case "animation-direction":
    case "animation-play-state":
    case "animation-delay":
    case "animation-fill-mode":
    case "animation-name":
    case "animation":
      return addAnimationProp(declaration.property, declaration.value);
    case "transform": {
      if (declaration.value.length === 0) {
        addTransformProp("perspective", 1);
        addTransformProp("translateX", 0);
        addTransformProp("translateY", 0);
        addTransformProp("rotate", "0deg");
        addTransformProp("rotateX", "0deg");
        addTransformProp("rotateY", "0deg");
        addTransformProp("rotateZ", "0deg");
        addTransformProp("scale", 1);
        addTransformProp("scaleX", 1);
        addTransformProp("scaleY", 1);
        addTransformProp("skewX", "0deg");
        addTransformProp("skewY", "0deg");
        break;
      }

      for (const transform of declaration.value) {
        switch (transform.type) {
          case "perspective":
            addTransformProp(
              "perspective",
              parseLength(transform.value, parseOptions),
            );
            break;
          case "translate":
            addTransformProp(
              "translateX",
              parseLengthOrCoercePercentageToRuntime(
                transform.value[0],
                "rnw",
                parseOptions,
              ),
            );
            addTransformProp(
              "translateY",
              parseLengthOrCoercePercentageToRuntime(
                transform.value[1],
                "rnh",
                parseOptions,
              ),
            );
            break;
          case "translateX":
            addTransformProp(
              "translateX",
              parseLengthOrCoercePercentageToRuntime(
                transform.value,
                "rnw",
                parseOptions,
              ),
            );
            break;
          case "translateY":
            addTransformProp(
              "translateY",
              parseLengthOrCoercePercentageToRuntime(
                transform.value,
                "rnh",
                parseOptions,
              ),
            );
            break;
          case "rotate":
            addTransformProp(
              "rotate",
              parseAngle(transform.value, parseOptions),
            );
            break;
          case "rotateX":
            addTransformProp(
              "rotateX",
              parseAngle(transform.value, parseOptions),
            );
            break;
          case "rotateY":
            addTransformProp(
              "rotateY",
              parseAngle(transform.value, parseOptions),
            );
            break;
          case "rotateZ":
            addTransformProp(
              "rotateZ",
              parseAngle(transform.value, parseOptions),
            );
            break;
          case "scale":
            handleTransformShorthand("scale", {
              scaleX: parseLength(transform.value[0], parseOptions),
              scaleY: parseLength(transform.value[1], parseOptions),
            });
            break;
          case "scaleX":
            addTransformProp(
              "scaleX",
              parseLength(transform.value, parseOptions),
            );
            break;
          case "scaleY":
            addTransformProp(
              "scaleY",
              parseLength(transform.value, parseOptions),
            );
            break;
          case "skew":
            addTransformProp(
              "skewX",
              parseAngle(transform.value[0], parseOptions),
            );
            addTransformProp(
              "skewY",
              parseAngle(transform.value[1], parseOptions),
            );
            break;
          case "skewX":
            addTransformProp(
              "skewX",
              parseAngle(transform.value, parseOptions),
            );
            break;
          case "skewY":
            addTransformProp(
              "skewY",
              parseAngle(transform.value, parseOptions),
            );
            break;

          case "translateZ":
          case "translate3d":
          case "scaleZ":
          case "scale3d":
          case "rotate3d":
          case "matrix":
          case "matrix3d":
            break;
        }
      }
      return;
    }
    case "transform-origin": {
      return addStyleProp(
        "transform-origin",
        parseTransformOrigin(declaration.value, parseOptions),
      );
    }
    case "translate":
      addStyleProp(
        "translateX",
        parseTranslate(declaration.value, "x", parseOptions),
      );
      addStyleProp(
        "translateX",
        parseTranslate(declaration.value, "y", parseOptions),
      );
      return;
    case "rotate":
      addStyleProp("rotateX", parseAngle(declaration.value.x, parseOptions));
      addStyleProp("rotateY", parseAngle(declaration.value.y, parseOptions));
      addStyleProp("rotateZ", parseAngle(declaration.value.z, parseOptions));
      return;
    case "scale":
      addStyleProp("scaleX", parseScale(declaration.value, "x", parseOptions));
      addStyleProp("scaleY", parseScale(declaration.value, "y", parseOptions));
      return;
    case "text-transform":
      return addStyleProp(declaration.property, declaration.value.case);
    case "letter-spacing":
      if (declaration.value.type !== "normal") {
        return addStyleProp(
          declaration.property,
          parseLength(declaration.value.value, parseOptions),
        );
      }
      return;
    case "text-decoration-line":
      return addStyleProp(
        declaration.property,
        parseTextDecorationLine(declaration.value, parseOptions),
      );
    case "text-decoration-color":
      return addStyleProp(
        declaration.property,
        parseColor(declaration.value, parseOptions),
      );
    case "text-decoration":
      addStyleProp(
        "text-decoration-color",
        parseColor(declaration.value.color, parseOptions),
      );
      addStyleProp(
        "text-decoration-line",
        parseTextDecorationLine(declaration.value.line, parseOptions),
      );
      return;
    case "text-shadow":
      return parseTextShadow(declaration.value, addStyleProp, parseOptions);
    case "z-index":
      if (declaration.value.type === "integer") {
        addStyleProp(
          declaration.property,
          parseLength(declaration.value.value, parseOptions),
        );
      } else {
        addWarning({
          type: "IncompatibleNativeValue",
          property: declaration.property,
          value: declaration.value.type,
        });
      }
      return;
    case "container-type":
    case "container-name":
    case "container":
      return addContainerProp(declaration);
    case "text-decoration-style":
      return addStyleProp(
        declaration.property,
        parseTextDecorationStyle(declaration.value, parseOptions),
      );
    case "text-align":
      return addStyleProp(
        declaration.property,
        parseTextAlign(declaration.value, parseOptions),
      );
    case "box-shadow": {
      parseBoxShadow(declaration.value, parseOptions);
    }
    case "aspect-ratio": {
      return addStyleProp(
        declaration.property,
        parseAspectRatio(declaration.value),
      );
    }
    case "user-select": {
      return addStyleProp(
        declaration.property,
        parseUserSelect(declaration.value, parseOptions),
      );
    }
    case "fill": {
      return addStyleProp(
        declaration.property,
        parseSVGPaint(declaration.value, parseOptions),
      );
    }
    case "stroke": {
      return addStyleProp(
        declaration.property,
        parseSVGPaint(declaration.value, parseOptions),
      );
    }
    case "stroke-width": {
      return addStyleProp(
        declaration.property,
        parseDimensionPercentageFor_LengthValue(
          declaration.value,
          parseOptions,
        ),
      );
    }
    case "caret-color": {
      return addStyleProp(
        declaration.property,
        parseColorOrAuto(declaration.value, parseOptions),
      );
    }
    default: {
      /**
       * This is used to know when lightningcss has added a new property and we need to add it to the
       * switch.
       *
       * If your build fails here, its because you have a newer version of lightningcss installed.
       */
      declaration satisfies never;
    }
  }
}

function isValid<T extends Declaration | PropertyId>(
  declaration: T,
): declaration is Extract<T, { property: (typeof validProperties)[number] }> {
  return validPropertiesLoose.has(declaration.property);
}

function reduceParseUnparsed(
  tokenOrValues: TokenOrValue[],
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor[] | undefined {
  const result = tokenOrValues
    .map((tokenOrValue) => parseUnparsed(tokenOrValue, options))
    .filter((v) => v !== undefined);

  if (result.length === 0) {
    return undefined;
  } else {
    return result;
  }
}

function unparsedFunction(
  token: Extract<TokenOrValue, { type: "function" }>,
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeFunction {
  const args = reduceParseUnparsed(token.value.arguments, options);
  return [{}, token.value.name, args];
}

/**
 * When the CSS cannot be parsed (often due to a runtime condition like a CSS variable)
 * This function best efforts parsing it into a function that we can evaluate at runtime
 */
function parseUnparsed(
  tokenOrValue:
    | TokenOrValue
    | TokenOrValue[]
    | string
    | number
    | undefined
    | null,
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor {
  if (tokenOrValue === undefined || tokenOrValue === null) {
    return;
  }

  if (typeof tokenOrValue === "string") {
    if (tokenOrValue === "true") {
      return true;
    } else if (tokenOrValue === "false") {
      return false;
    } else {
      return tokenOrValue;
    }
  }

  if (typeof tokenOrValue === "number") {
    return round(tokenOrValue);
  }

  if (Array.isArray(tokenOrValue)) {
    const args = reduceParseUnparsed(tokenOrValue, options);
    if (!args) return;
    if (args.length === 1) return args[0];
    return args;
  }

  switch (tokenOrValue.type) {
    case "unresolved-color": {
      return parseUnresolvedColor(tokenOrValue.value, options);
    }
    case "var": {
      const args: RuntimeValueDescriptor[] = [tokenOrValue.value.name.ident];
      const fallback = parseUnparsed(tokenOrValue.value.fallback, options);
      if (fallback !== undefined) {
        args.push(fallback);
      }

      return [{}, "var", args, 1];
    }
    case "function": {
      switch (tokenOrValue.value.name) {
        case "rgb":
          tokenOrValue.value.name = "rgb";
          return unparsedFunction(tokenOrValue, options);
        case "rgba":
          tokenOrValue.value.name = "rgba";
          return unparsedFunction(tokenOrValue, options);
        case "hsl":
          tokenOrValue.value.name = "hsl";
          return unparsedFunction(tokenOrValue, options);
        case "hsla":
          tokenOrValue.value.name = "hsla";
          return unparsedFunction(tokenOrValue, options);
        case "translate":
        case "rotate":
        case "skewX":
        case "skewY":
        case "scale":
        case "scaleX":
        case "scaleY":
        case "translateX":
        case "translateY":
          return unparsedFunction(tokenOrValue, options);
        case "platformColor":
        case "getPixelSizeForLayoutSize":
        case "roundToNearestPixel":
        case "pixelScale":
        case "fontScale":
        case "shadow":
          return unparsedFunction(tokenOrValue, options);
        case "hairlineWidth":
          return [{}, tokenOrValue.value.name, []];
        case "platformSelect":
        case "fontScaleSelect":
        case "pixelScaleSelect":
          return parseRNRuntimeSpecificsFunction(
            tokenOrValue.value.name,
            tokenOrValue.value.arguments,
            options,
          );
        case "calc":
        case "max":
        case "min":
        case "clamp":
          return parseCalcFn(
            tokenOrValue.value.name,
            tokenOrValue.value.arguments,
            options,
          );
        default: {
          options.addFunctionValueWarning(tokenOrValue.value.name);
          return;
        }
      }
    }
    case "length":
      return parseLength(tokenOrValue.value, options);
    case "angle":
      return parseAngle(tokenOrValue.value, options);
    case "token":
      switch (tokenOrValue.value.type) {
        case "string":
        case "number":
        case "ident": {
          const value = tokenOrValue.value.value;
          if (typeof value === "string") {
            if (!options.allowAuto && value === "auto") {
              return options.addValueWarning(value);
            }

            if (value === "inherit") {
              return options.addValueWarning(value);
            }

            if (value === "true") {
              return true;
            } else if (value === "false") {
              return false;
            } else {
              return value;
            }
          } else {
            return value;
          }
        }
        case "function":
          options.addValueWarning(tokenOrValue.value.value);
          return;
        case "percentage":
          return `${round(tokenOrValue.value.value * 100)}%`;
        case "dimension":
          return parseDimension(tokenOrValue.value, options);
        case "at-keyword":
        case "hash":
        case "id-hash":
        case "unquoted-url":
        case "delim":
        case "white-space":
        case "comment":
        case "colon":
        case "semicolon":
        case "comma":
        case "include-match":
        case "dash-match":
        case "prefix-match":
        case "suffix-match":
        case "substring-match":
        case "cdo":
        case "cdc":
        case "parenthesis-block":
        case "square-bracket-block":
        case "curly-bracket-block":
        case "bad-url":
        case "bad-string":
        case "close-parenthesis":
        case "close-square-bracket":
        case "close-curly-bracket":
          return;
        default: {
          tokenOrValue.value satisfies never;
          return;
        }
      }
    case "color":
      return parseColor(tokenOrValue.value, options);
    case "env":
      return parseEnv(tokenOrValue.value, options);
    case "url":
    case "time":
    case "resolution":
    case "dashed-ident":
    case "animation-name":
      return;
  }

  tokenOrValue satisfies never;
}

export function parseLength(
  length:
    | number
    | Length
    | DimensionPercentageFor_LengthValue
    | NumberOrPercentage
    | LengthValue,
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor {
  const { inlineRem = 14 } = options;

  if (typeof length === "number") {
    return length;
  }

  if ("unit" in length) {
    switch (length.unit) {
      case "px":
        return length.value;
      case "rem":
        if (typeof inlineRem === "number") {
          return length.value * inlineRem;
        } else {
          return [{}, "rem", [length.value]];
        }
      case "vw":
      case "vh":
      case "em":
        return [{}, length.unit, [length.value], 1];
      case "in":
      case "cm":
      case "mm":
      case "q":
      case "pt":
      case "pc":
      case "ex":
      case "rex":
      case "ch":
      case "rch":
      case "cap":
      case "rcap":
      case "ic":
      case "ric":
      case "lh":
      case "rlh":
      case "lvw":
      case "svw":
      case "dvw":
      case "cqw":
      case "lvh":
      case "svh":
      case "dvh":
      case "cqh":
      case "vi":
      case "svi":
      case "lvi":
      case "dvi":
      case "cqi":
      case "vb":
      case "svb":
      case "lvb":
      case "dvb":
      case "cqb":
      case "vmin":
      case "svmin":
      case "lvmin":
      case "dvmin":
      case "cqmin":
      case "vmax":
      case "svmax":
      case "lvmax":
      case "dvmax":
      case "cqmax":
        options.addValueWarning(`${length.value}${length.unit}`);
        return undefined;
    }
    length.unit satisfies never;
  } else {
    switch (length.type) {
      case "calc": {
        // TODO: Add the calc polyfill
        return undefined;
      }
      case "number": {
        return round(length.value);
      }
      case "percentage": {
        return `${round(length.value * 100)}%`;
      }
      case "dimension":
      case "value": {
        return parseLength(length.value, options);
      }
    }
  }
}

function parseAngle(
  angle: Angle | number,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  if (typeof angle === "number") {
    return `${angle}deg`;
  }

  switch (angle.type) {
    case "deg":
    case "rad":
      return `${angle.value}${angle.type}`;
    default:
      options.addValueWarning(angle.value);
      return undefined;
  }
}

function parseSize(
  size: Size | MaxSize,
  options: ParseDeclarationOptionsWithValueWarning,
  { allowAuto = false } = {},
) {
  switch (size.type) {
    case "length-percentage":
      return parseLength(size.value, options);
    case "none":
      return size.type;
    case "auto":
      if (allowAuto) {
        return size.type;
      } else {
        options.addValueWarning(size.type);
        return undefined;
      }
    case "min-content":
    case "max-content":
    case "fit-content":
    case "fit-content-function":
    case "stretch":
    case "contain":
      options.addValueWarning(size.type);
      return undefined;
  }

  size satisfies never;
}

function parseColorOrAuto(
  color: ColorOrAuto,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  if (color.type === "auto") {
    options.addValueWarning(`Invalid color value ${color.type}`);
    return;
  } else {
    return parseColor(color.value, options);
  }
}

function parseColor(
  color: CssColor,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  if (typeof color === "string") {
    // TODO: Could web system colors be mapped to native?
    return;
  }

  switch (color.type) {
    case "rgb": {
      // Hex is smaller than rgb, so we convert it
      const hexValues: string[] = [
        color.r.toString(16).padStart(2, "0"),
        color.g.toString(16).padStart(2, "0"),
        color.b.toString(16).padStart(2, "0"),
      ];

      if (color.alpha !== 1) {
        hexValues.push(
          Math.round(color.alpha * 255)
            .toString(16)
            .padStart(2, "0"),
        );
      }

      return `#${hexValues.join("")}`;
    }
    case "hsl":
      return `hsla(${color.h}, ${color.s}, ${color.l}, ${color.alpha})`;
    case "currentcolor":
      options.addValueWarning(color.type);
      return;
    case "light-dark":
    case "lab":
    case "lch":
    case "oklab":
    case "oklch":
    case "srgb":
    case "srgb-linear":
    case "display-p3":
    case "a98-rgb":
    case "prophoto-rgb":
    case "rec2020":
    case "xyz-d50":
    case "xyz-d65":
    case "hwb":
      options.addValueWarning(`Invalid color unit ${color.type}`);
      return undefined;
  }

  color satisfies never;
}

function parseLengthPercentageOrAuto(
  lengthPercentageOrAuto: LengthPercentageOrAuto,
  options: ParseDeclarationOptionsWithValueWarning,
  { allowAuto = false } = {},
) {
  switch (lengthPercentageOrAuto.type) {
    case "auto":
      if (allowAuto) {
        return lengthPercentageOrAuto.type;
      } else {
        options.addValueWarning(lengthPercentageOrAuto.type);
        return undefined;
      }
    case "length-percentage":
      return parseLength(lengthPercentageOrAuto.value, options);
  }
  lengthPercentageOrAuto satisfies never;
}

function parseJustifyContent(
  justifyContent: JustifyContent,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  const allowed = new Set([
    "flex-start",
    "flex-end",
    "center",
    "space-between",
    "space-around",
    "space-evenly",
  ]);

  let value: string | undefined;

  switch (justifyContent.type) {
    case "normal":
    case "left":
    case "right":
      value = justifyContent.type;
      break;
    case "content-distribution":
    case "content-position":
      value = justifyContent.value;
      break;
    default: {
      justifyContent satisfies never;
    }
  }

  if (value && !allowed.has(value)) {
    options.addValueWarning(value);
    return;
  }

  return value;
}

function parseAlignContent(
  alignContent: AlignContent,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  const allowed = new Set([
    "flex-start",
    "flex-end",
    "center",
    "stretch",
    "space-between",
    "space-around",
  ]);

  let value: string | undefined;

  switch (alignContent.type) {
    case "normal":
    case "baseline-position":
      value = alignContent.type;
      break;
    case "content-distribution":
    case "content-position":
      value = alignContent.value;
      break;
    default: {
      alignContent satisfies never;
    }
  }

  if (value && !allowed.has(value)) {
    options.addValueWarning(value);
    return;
  }

  return value;
}

function parseAlignItems(
  alignItems: AlignItems,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  const allowed = new Set([
    "auto",
    "flex-start",
    "flex-end",
    "center",
    "stretch",
    "baseline",
  ]);

  let value: string | undefined;

  switch (alignItems.type) {
    case "normal":
      value = "auto";
      break;
    case "stretch":
      value = alignItems.type;
      break;
    case "baseline-position":
      value = "baseline";
      break;
    case "self-position":
      value = alignItems.value;
      break;
    default: {
      alignItems satisfies never;
    }
  }

  if (value && !allowed.has(value)) {
    options.addValueWarning(value);
    return;
  }

  return value;
}

function parseAlignSelf(
  alignSelf: AlignSelf,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  const allowed = new Set([
    "auto",
    "flex-start",
    "flex-end",
    "center",
    "stretch",
    "baseline",
  ]);

  let value: string | undefined;

  switch (alignSelf.type) {
    case "normal":
    case "auto":
      value = "auto";
    case "stretch":
      value = alignSelf.type;
      break;
    case "baseline-position":
      value = "baseline";
      break;
    case "self-position":
      value = alignSelf.value;
      break;
    default: {
      alignSelf satisfies never;
    }
  }

  if (value && !allowed.has(value)) {
    options.addValueWarning(value);
    return;
  }

  return value;
}

function parseFontWeight(
  fontWeight: FontWeight,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  switch (fontWeight.type) {
    case "absolute":
      if (fontWeight.value.type === "weight") {
        return fontWeight.value.value.toString();
      } else {
        return fontWeight.value.type;
      }
    case "bolder":
    case "lighter":
      options.addValueWarning(fontWeight.type);
      return;
  }

  fontWeight satisfies never;
}

function parseTextShadow(
  [textShadow]: TextShadow[],
  addStyleProp: AddStyleProp,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  addStyleProp("textShadowColor", parseColor(textShadow.color, options));
  addStyleProp(
    "textShadowOffset.width",
    parseLength(textShadow.xOffset, options),
  );
  addStyleProp(
    "textShadowOffset.height",
    parseLength(textShadow.yOffset, options),
  );
  addStyleProp("textShadowRadius", parseLength(textShadow.blur, options));
}

function parseTextDecorationStyle(
  textDecorationStyle: TextDecorationStyle,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  const allowed = new Set(["solid", "double", "dotted", "dashed"]);

  if (allowed.has(textDecorationStyle)) {
    return textDecorationStyle;
  }

  options.addValueWarning(textDecorationStyle);
  return undefined;
}

function parseTextDecorationLine(
  textDecorationLine: TextDecorationLine,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  if (!Array.isArray(textDecorationLine)) {
    if (textDecorationLine === "none") {
      return textDecorationLine;
    }
    options.addValueWarning(textDecorationLine);
    return;
  }

  const set = new Set(textDecorationLine);

  if (set.has("underline")) {
    if (set.has("line-through")) {
      return "underline line-through";
    } else {
      return "underline";
    }
  } else if (set.has("line-through")) {
    return "line-through";
  }

  options.addValueWarning(textDecorationLine.join(" "));
  return undefined;
}

function parseOverflow(
  overflow: OverflowKeyword,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  const allowed = new Set(["visible", "hidden"]);

  if (allowed.has(overflow)) {
    return overflow;
  }

  options.addValueWarning(overflow);
  return undefined;
}

function parseBorderStyle(
  borderStyle: BorderStyle | LineStyle,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  const allowed = new Set(["solid", "dotted", "dashed"]);

  if (typeof borderStyle === "string") {
    if (allowed.has(borderStyle)) {
      return borderStyle;
    } else {
      options.addValueWarning(borderStyle);
      return undefined;
    }
  } else if (
    borderStyle.top === borderStyle.bottom &&
    borderStyle.top === borderStyle.left &&
    borderStyle.top === borderStyle.right &&
    allowed.has(borderStyle.top)
  ) {
    return borderStyle.top;
  }

  options.addValueWarning(borderStyle.top);

  return undefined;
}

function parseBorderSideWidth(
  borderSideWidth: BorderSideWidth,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  if (borderSideWidth.type === "length") {
    return parseLength(borderSideWidth.value, options);
  }

  options.addValueWarning(borderSideWidth.type);
  return undefined;
}

function parseVerticalAlign(
  verticalAlign: VerticalAlign,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  if (verticalAlign.type === "length") {
    return undefined;
  }

  const allowed = new Set(["auto", "top", "bottom", "middle"]);

  if (allowed.has(verticalAlign.value)) {
    return verticalAlign.value;
  }

  options.addValueWarning(verticalAlign.value);
  return undefined;
}

function parseFontFamily(fontFamily: FontFamily[]) {
  // React Native only allows one font family - better hope this is the right one :)
  return fontFamily[0];
}

function parseLineHeight(
  lineHeight: LineHeight,
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor {
  switch (lineHeight.type) {
    case "normal":
      return undefined;
    case "number":
      return [{}, "em", [lineHeight.value], 1];
    case "length": {
      const length = lineHeight.value;

      switch (length.type) {
        case "dimension":
          return parseLength(length, options);
        case "percentage":
        case "calc":
          options.addValueWarning(length.value);
          return undefined;
      }
      length satisfies never;
    }
  }
  lineHeight satisfies never;
}

function parseFontSize(
  fontSize: FontSize,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  switch (fontSize.type) {
    case "length":
      return parseLength(fontSize.value, options);
    case "absolute":
    case "relative":
      options.addValueWarning(fontSize.value);
      return undefined;
  }
  fontSize satisfies never;
}

function parseFontStyle(
  fontStyle: FontStyle,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  switch (fontStyle.type) {
    case "normal":
    case "italic":
      return fontStyle.type;
    case "oblique":
      options.addValueWarning(fontStyle.type);
      return undefined;
  }

  fontStyle satisfies never;
}

function parseFontVariantCaps(
  fontVariantCaps: FontVariantCaps,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  const allowed = new Set([
    "small-caps",
    "oldstyle-nums",
    "lining-nums",
    "tabular-nums",
    "proportional-nums",
  ]);
  if (allowed.has(fontVariantCaps)) {
    return fontVariantCaps;
  }

  options.addValueWarning(fontVariantCaps);
  return undefined;
}

function parseLengthOrCoercePercentageToRuntime(
  value: Length | DimensionPercentageFor_LengthValue | NumberOrPercentage,
  runtimeName: string,
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor {
  if (
    options.features.transformPercentagePolyfill &&
    value.type === "percentage"
  ) {
    options.requiresLayout(runtimeName);
    return [{}, runtimeName, [value.value], 1];
  } else {
    return parseLength(value, options);
  }
}

function parseGap(
  value: GapValue,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  if (value.type === "normal") {
    options.addValueWarning(value.type);
    return;
  }

  return parseLength(value.value, options);
}

function parseRNRuntimeSpecificsFunction(
  name: string,
  args: TokenOrValue[],
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor {
  let key: string | undefined;
  const runtimeArgs: Record<string, RuntimeValueDescriptor> = {};

  for (const token of args) {
    if (!key) {
      if (
        token.type === "token" &&
        (token.value.type === "ident" || token.value.type === "number")
      ) {
        key = token.value.value.toString();
        continue;
      }
    } else {
      if (token.type !== "token") {
        const value = parseUnparsed(token, options);
        if (value === undefined) {
          return;
        }
        runtimeArgs[key] = value;
        key = undefined;
      } else {
        switch (token.value.type) {
          case "string":
          case "number":
          case "ident": {
            if (key) {
              runtimeArgs[key] = parseUnparsed(token, options);
              key = undefined;
            } else {
              return;
            }
          }
          case "delim":
          case "comma":
            continue;
          case "function":
          case "at-keyword":
          case "hash":
          case "id-hash":
          case "unquoted-url":
          case "percentage":
          case "dimension":
          case "white-space":
          case "comment":
          case "colon":
          case "semicolon":
          case "include-match":
          case "dash-match":
          case "prefix-match":
          case "suffix-match":
          case "substring-match":
          case "cdo":
          case "cdc":
          case "parenthesis-block":
          case "square-bracket-block":
          case "curly-bracket-block":
          case "bad-url":
          case "bad-string":
          case "close-parenthesis":
          case "close-square-bracket":
          case "close-curly-bracket":
            return undefined;
        }
      }
    }
  }

  return [{}, name, Object.entries(runtimeArgs)];
}

function parseTextAlign(
  textAlign: TextAlign,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  const allowed = new Set(["auto", "left", "right", "center", "justify"]);
  if (allowed.has(textAlign)) {
    return textAlign;
  }

  options.addValueWarning(textAlign);
  return undefined;
}

function parseBoxShadow(
  boxShadows: BoxShadow[],
  options: ParseDeclarationOptionsWithValueWarning,
) {
  if (boxShadows.length > 1) {
    options.addValueWarning("multiple box shadows");
    return;
  }

  const boxShadow = boxShadows[0];

  options.addStyleProp("shadowColor", parseColor(boxShadow.color, options));
  options.addStyleProp("shadowRadius", parseLength(boxShadow.spread, options));
  // options.addStyleProp(
  //   ["shadowOffsetWidth"],
  //   parseLength(boxShadow.xOffset, options, ["", ""),
  // );
  // options.addStyleProp(
  //   ["shadowOffset", "height"],
  //   parseLength(boxShadow.yOffset, options),
  // );
}

function parseDisplay(
  display: Display,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  if (display.type === "keyword") {
    if (display.value === "none") {
      return display.value;
    } else {
      return options.addValueWarning(display.value);
    }
  } else if (display.type === "pair") {
    if (display.outside === "block") {
      switch (display.inside.type) {
        case "flow":
          if (display.isListItem) {
            return options.addValueWarning("list-item");
          } else {
            return options.addValueWarning("block");
          }
        case "flow-root":
          return options.addValueWarning("flow-root");
        case "table":
          return options.addValueWarning(display.inside.type);
        case "flex":
          return display.inside.type;
        case "box":
        case "grid":
        case "ruby":
          return options.addValueWarning(display.inside.type);
      }
    } else {
      switch (display.inside.type) {
        case "flow":
          return options.addValueWarning("inline");
        case "flow-root":
          return options.addValueWarning("inline-block");
        case "table":
          return options.addValueWarning("inline-table");
        case "flex":
          return options.addValueWarning("inline-flex");
        case "box":
        case "grid":
          return options.addValueWarning("inline-grid");
        case "ruby":
          return options.addValueWarning(display.inside.type);
      }
    }
  }
}

function parseAspectRatio(
  // This is missing types
  aspectRatio: any,
): RuntimeValueDescriptor {
  if (aspectRatio.auto) {
    return "auto";
  } else {
    if (aspectRatio.ratio[0] === aspectRatio.ratio[1]) {
      return 1;
    } else {
      return aspectRatio.ratio.join(" / ");
    }
  }
}

function parseDimension(
  { unit, value }: Extract<Token, { type: "dimension" }>,
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor {
  switch (unit) {
    case "px":
      return value;
    case "%":
      return `${value}%`;
    case "rnh":
    case "rnw":
      return [{}, unit, [value / 100], 1];
    default: {
      return options.addValueWarning(`${value}${unit}`);
    }
  }
}

function parseUserSelect(
  value: UserSelect,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  const allowed = ["auto", "text", "none", "contain", "all"];
  if (allowed.includes(value)) {
    return value;
  } else {
    return options.addValueWarning(value);
  }
}

function parseSVGPaint(
  value: SVGPaint,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  if (value.type === "none") {
    return "transparent";
  } else if (value.type === "color") {
    return parseColor(value.value, options);
  }
}

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

function parseDimensionPercentageFor_LengthValue(
  value: DimensionPercentageFor_LengthValue,
  options: ParseDeclarationOptionsWithValueWarning,
) {
  if (value.type === "calc") {
    return undefined;
  } else if (value.type === "percentage") {
    return `${value.value}%`;
  } else {
    return parseLength(value.value, options);
  }
}

const allowAuto = new Set(["pointer-events"]);

function parseEnv(
  value: EnvironmentVariable,
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeFunction | undefined {
  switch (value.name.type) {
    case "ua":
      switch (value.name.value) {
        case "safe-area-inset-top":
        case "safe-area-inset-right":
        case "safe-area-inset-bottom":
        case "safe-area-inset-left":
          return [
            {},
            "var",
            [
              `--___css-interop___${value.name.value}`,
              parseUnparsed(value.fallback, options),
            ],
            1,
          ];
        case "viewport-segment-width":
        case "viewport-segment-height":
        case "viewport-segment-top":
        case "viewport-segment-left":
        case "viewport-segment-bottom":
        case "viewport-segment-right":
      }
      break;
    case "custom":
    case "unknown":
  }
}

function parseCalcFn(
  name: string,
  tokens: TokenOrValue[],
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor {
  const args = parseCalcArguments(tokens, options);
  if (args) {
    return [{}, name, args];
  }
}

function parseCalcArguments(
  [...args]: TokenOrValue[],
  options: ParseDeclarationOptionsWithValueWarning,
) {
  const parsed: RuntimeValueDescriptor[] = [];

  let mode: "number" | "percentage" | undefined;

  for (const [currentIndex, arg] of args.entries()) {
    switch (arg.type) {
      case "env": {
        parsed.push(parseEnv(arg.value, options));
        break;
      }
      case "var":
      case "function":
      case "unresolved-color": {
        const value = parseUnparsed(arg, options);

        if (value === undefined) {
          return undefined;
        }

        parsed.push(value);
        break;
      }
      case "length": {
        const value = parseLength(arg.value, options);

        if (value !== undefined) {
          parsed.push(value);
        }

        break;
      }
      case "color":
      case "url":
      case "angle":
      case "time":
      case "resolution":
      case "dashed-ident":
        break;
      case "token":
        switch (arg.value.type) {
          case "delim":
            switch (arg.value.value) {
              case "+":
              case "-":
              case "*":
              case "/":
                parsed.push(arg.value.value);
                break;
            }
            break;
          case "percentage":
            if (!mode) mode = "percentage";
            if (mode !== "percentage") return;
            parsed.push(`${arg.value.value * 100}%`);
            break;
          case "number": {
            if (!mode) mode = "number";
            if (mode !== "number") return;
            parsed.push(arg.value.value);
            break;
          }
          case "parenthesis-block": {
            /**
             * If we have a parenthesis block, we just treat it as a nested calc function
             * Because there could be multiple parenthesis blocks, this is recursive
             */
            const closeParenthesisIndex = args.findLastIndex((value) => {
              return (
                value.type === "token" &&
                value.value.type === "close-parenthesis"
              );
            });

            if (closeParenthesisIndex === -1) {
              return;
            }

            const innerCalcArgs = args
              // Extract the inner calcArgs including the parenthesis. This mutates args
              .splice(currentIndex, closeParenthesisIndex - currentIndex + 1)
              // Then drop the surrounding parenthesis
              .slice(1, -1);

            parsed.push(parseCalcFn("calc", innerCalcArgs, options));

            break;
          }
          case "close-parenthesis":
          case "string":
          case "function":
          case "ident":
          case "at-keyword":
          case "hash":
          case "id-hash":
          case "unquoted-url":
          case "dimension":
          case "white-space":
          case "comment":
          case "colon":
          case "semicolon":
          case "comma":
          case "include-match":
          case "dash-match":
          case "prefix-match":
          case "suffix-match":
          case "substring-match":
          case "cdo":
          case "cdc":
          case "square-bracket-block":
          case "curly-bracket-block":
          case "bad-url":
          case "bad-string":
          case "close-square-bracket":
          case "close-curly-bracket":
        }
    }
  }

  return parsed;
}

export function parseTranslate(
  translate: Translate,
  prop: keyof Extract<Translate, object>,
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor {
  if (translate === "none") {
    return 0;
  }

  return parseLength(translate[prop], options);
}

export function parseScale(
  translate: Scale,
  prop: keyof Extract<Scale, object>,
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor {
  if (translate === "none") {
    return 0;
  }

  return parseLength(translate[prop], options);
}

export function parseUnresolvedColor(
  color: UnresolvedColor,
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor {
  switch (color.type) {
    case "rgb":
      return [
        {},
        "rgba",
        [
          round(color.r * 255),
          round(color.g * 255),
          round(color.b * 255),
          parseUnparsed(color.alpha, options),
        ],
      ];
    case "hsl":
      return [
        {},
        color.type,
        [color.h, color.s, color.l, parseUnparsed(color.alpha, options)],
      ];
    case "light-dark":
      return undefined;
    default:
      color satisfies never;
  }
}

const unparsedRuntimeFn = new Set(["text-shadow"]);

function parseTransformOrigin(
  position: Position,
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor {
  /**
   * NOTE: transform-origin supports a third Z value, but lightningcss does not parse it correctly
   */
  const x = parsePositionComponentFor_PositionKeyword(position.x, options);
  const y = parsePositionComponentFor_PositionKeyword(position.y, options);
  return [x, y];
}

function parsePositionComponentFor_PositionKeyword(
  position:
    | PositionComponentFor_HorizontalPositionKeyword
    | PositionComponentFor_VerticalPositionKeyword,
  options: ParseDeclarationOptionsWithValueWarning,
): RuntimeValueDescriptor {
  switch (position.type) {
    case "center":
      return "50%";
    case "side":
      if (position.offset) {
        return parseLength(position.offset, options);
      }

      switch (position.side) {
        case "left":
          return "0%";
        case "right":
          return "100%";
        case "top":
          return "0%";
        case "bottom":
          return "100%";
        default:
          position satisfies never;
      }
    case "length":
      return parseLength(position.value, options);
    default:
      position satisfies never;
  }
}
