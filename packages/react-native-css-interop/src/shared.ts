export const INTERNAL_RESET: unique symbol = Symbol();
export const INTERNAL_SET: unique symbol = Symbol();
export const INTERNAL_FLAGS: unique symbol = Symbol();

export const DEFAULT_CONTAINER_NAME = "@__";

export const STYLE_SCOPES = {
  /** @description Style is the same globally */
  GLOBAL: 0,
  /** @description Style is the same within a context (variables / containers) */
  CONTEXT: 1,
  /** @description Style can affect other styles (sets variables, uses other styles) */
  SELF: 2,
};

export const transformKeys = new Set([
  "perspective",
  "translateX",
  "translateY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "scale",
  "scaleX",
  "scaleY",
  "skewX",
  "skewY",
]);
