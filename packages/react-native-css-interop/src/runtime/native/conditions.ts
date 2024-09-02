import type {
  ContainerCondition,
  Declaration,
  MediaFeatureComparison,
  MediaFeatureValue,
  MediaQuery,
  QueryFeatureFor_MediaFeatureId,
} from "lightningcss";
import { I18nManager, Platform } from "react-native";

import {
  AttributeCondition,
  ExtractedContainerQuery,
  PseudoClassesQuery,
  StyleRule,
} from "../../types";
import { DEFAULT_CONTAINER_NAME } from "../../shared";
import { Effect, ReadableObservable } from "../observable";
import { ReducerTracking, Refs, SharedState } from "./types";
import { colorScheme, isReduceMotionEnabled } from "./appearance-observables";
import { vw, vh, rem } from "./unit-observables";

interface ConditionReference {
  width: number | ReadableObservable<number>;
  height: number | ReadableObservable<number>;
}

/**
 * Tests a rule against current component's state
 * @param state
 * @param rule
 * @param props
 * @returns
 */
export function testRule(
  rule: StyleRule,
  refs: Refs,
  tracking: ReducerTracking,
) {
  // Does the rule pass all the pseudo classes, media queries, and container queries?
  if (
    rule.pseudoClasses &&
    !testPseudoClasses(refs.sharedState, rule.pseudoClasses, tracking)
  ) {
    return false;
  }
  if (rule.media && !testMediaQueries(refs.sharedState, tracking, rule.media)) {
    return false;
  }
  if (
    rule.containerQuery &&
    !testContainerQuery(refs, tracking, rule.containerQuery)
  ) {
    return false;
  }
  if (rule.attrs && !testAttributes(refs, tracking, rule.attrs)) {
    return false;
  }

  return true;
}

export function testMediaQueries(
  state: SharedState,
  tracking: ReducerTracking,
  mediaQueries: MediaQuery[],
) {
  return mediaQueries.every((query) => testMediaQuery(tracking, query));
}

/**
 * Test a media query against current conditions
 */
export function testMediaQuery(
  tracking: ReducerTracking,
  mediaQuery: MediaQuery,
  conditionReference: ConditionReference = {
    width: vw,
    height: vh,
  },
) {
  const pass =
    mediaQuery.mediaType !== "print" &&
    testCondition(mediaQuery.condition, conditionReference, tracking);
  return mediaQuery.qualifier === "not" ? !pass : pass;
}

export function testPseudoClasses(
  state: SharedState,
  meta: PseudoClassesQuery,
  tracking?: ReducerTracking,
) {
  /*
   * Fail if any of these conditions fail
   * State should already have hover,active,focus on it.
   *   If not, there was a problem with the compiler
   */
  let passing = true;
  if (meta.hover && state.hover && passing) {
    passing = state.hover.get(tracking?.effect);
  }
  if (meta.active && state.active && passing) {
    passing = state.active.get(tracking?.effect);
  }
  if (meta.focus && state.focus && passing) {
    passing = state.focus.get(tracking?.effect);
  }
  return passing;
}

export function testContainerQuery(
  refs: Refs,
  tracking: ReducerTracking,
  containerQuery: ExtractedContainerQuery[] | undefined,
) {
  // If there is no query, we passed
  if (!containerQuery || containerQuery.length === 0) {
    return true;
  }

  return containerQuery.every((query) => {
    const container = getContainer(query, refs);
    const result = testContainer(query, container, tracking);

    // Track this container
    tracking.guards.push((nextRefs) => {
      const nextContainer = getContainer(query, nextRefs);
      const nextResult = testContainer(query, nextContainer);
      return container !== nextContainer || result !== nextResult;
    });

    return result;
  });
}

function getContainer(
  query: ExtractedContainerQuery,
  refs: Refs,
): SharedState | undefined {
  return query.name
    ? refs.containers[query.name]
    : refs.containers[DEFAULT_CONTAINER_NAME];
}

function testContainer(
  query: ExtractedContainerQuery,
  container?: SharedState,
  tracking?: ReducerTracking,
) {
  if (!container) return false;

  if (
    query.pseudoClasses &&
    !testPseudoClasses(container, query.pseudoClasses, tracking)
  ) {
    return false;
  }

  if (
    query.attrs &&
    !testContainerAttributes(container.originalProps, query.attrs)
  ) {
    return false;
  }

  // If there is no condition, we passed (maybe only named as specified)
  if (!query.condition) return true;

  // Containers will always have a layout interaction
  const layout = container.layout?.get(tracking?.effect);
  if (!layout) return false;

  return testCondition(
    query.condition,
    {
      width: layout[0],
      height: layout[1],
    },
    tracking,
  );
}

function testContainerAttributes(
  props: Record<string, any> | null | undefined,
  conditions: AttributeCondition[],
) {
  for (const condition of conditions) {
    const attrValue =
      condition.type === "data-attribute"
        ? props?.["dataSet"]?.[condition.name]
        : props?.[condition.name];

    if (!testAttribute(attrValue, condition)) {
      return false;
    }
  }

  return true;
}

/**
 * Test a media condition against current conditions
 * This is also used for container queries
 */
export function testCondition(
  condition: ContainerCondition<Declaration> | null | undefined,
  conditionReference: ConditionReference,
  tracking?: ReducerTracking,
): boolean {
  if (!condition) return true;

  if (condition.type === "operation") {
    if (condition.operator === "and") {
      return condition.conditions.every((c) => {
        return testCondition(c, conditionReference, tracking);
      });
    } else {
      return condition.conditions.some((c) => {
        return testCondition(c, conditionReference, tracking);
      });
    }
  } else if (condition.type === "not") {
    return !testCondition(condition.value, conditionReference, tracking);
  } else if (condition.type === "style") {
    // TODO
    return false;
  }

  return testFeature(condition.value, conditionReference, tracking);
}

function testFeature(
  feature: QueryFeatureFor_MediaFeatureId,
  conditionReference: ConditionReference,
  tracking?: ReducerTracking,
) {
  switch (feature.type) {
    case "plain":
      return testPlainFeature(feature, conditionReference, tracking);
    case "range":
      return testRange(feature, conditionReference, tracking);
    case "boolean":
      return testBoolean(feature, tracking);
    case "interval":
      return false;
    default:
      feature satisfies never;
  }

  return false;
}

function testPlainFeature(
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "plain" }>,
  ref: ConditionReference,
  tracking?: ReducerTracking,
) {
  const value = getMediaFeatureValue(feature.value, tracking);

  if (value === null) {
    return false;
  }

  switch (feature.name) {
    case "display-mode":
      return value === "native" || Platform.OS === value;
    case "prefers-color-scheme":
      return colorScheme.get(tracking?.effect) === value;
    case "width":
      return testComparison("equal", ref.width, value, tracking);
    case "min-width":
      return testComparison("greater-than-equal", ref.width, value, tracking);
    case "max-width":
      return testComparison("less-than-equal", ref.width, value, tracking);
    case "height":
      return testComparison("equal", ref.height, value, tracking);
    case "min-height":
      return testComparison("greater-than-equal", ref.height, value, tracking);
    case "max-height":
      return testComparison("less-than-equal", ref.height, value, tracking);
    case "orientation":
      switch (value) {
        case "landscape":
          return testComparison("less-than", ref.height, ref.width, tracking);
        case "portrait":
          return testComparison(
            "greater-than-equal",
            ref.height,
            ref.width,
            tracking,
          );
      }
    default:
      return false;
  }
}

function getMediaFeatureValue(
  value: MediaFeatureValue,
  tracking?: ReducerTracking,
) {
  if (value.type === "number") {
    return value.value;
  } else if (value.type === "length") {
    if (value.value.type === "value") {
      const length = value.value.value;
      switch (length.unit) {
        case "px":
          return length.value;
        case "rem":
          return length.value * rem.get(tracking?.effect);
        default:
          return null;
      }
    } else {
      return null;
    }
  } else if (value.type === "ident") {
    return value.value;
  }

  return null;
}

function testRange(
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "range" }>,
  ref: ConditionReference,
  tracking?: ReducerTracking,
) {
  const value = getMediaFeatureValue(feature.value, tracking);

  if (value === null || typeof value !== "number") {
    return false;
  }

  switch (feature.name) {
    case "height":
      return testComparison(feature.operator, ref.height, value, tracking);
    case "width":
      return testComparison(feature.operator, ref.width, value, tracking);
    default:
      return false;
  }
}

function testComparison(
  comparison: MediaFeatureComparison,
  ref: number | ReadableObservable<number>,
  value: unknown,
  tracking?: ReducerTracking,
) {
  ref = unwrap(ref, tracking?.effect);
  value = unwrap(value, tracking?.effect);

  if (typeof value !== "number") return false;
  switch (comparison) {
    case "equal":
      return ref === value;
    case "greater-than":
      return ref > value;
    case "greater-than-equal":
      return ref >= value;
    case "less-than":
      return ref < value;
    case "less-than-equal":
      return ref < value;
  }
}

function testBoolean(
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "boolean" }>,
  tracking?: ReducerTracking,
) {
  switch (feature.name) {
    case "prefers-reduced-motion":
      return isReduceMotionEnabled.get(tracking?.effect);
    case "ltr":
      return I18nManager.isRTL === false;
    case "rtl":
      return I18nManager.isRTL;
  }
  return false;
}

function unwrap<T>(value: T | ReadableObservable<T>, effect?: Effect): T {
  return value && typeof value === "object" && "get" in value
    ? value.get(effect)
    : (value as T);
}

function testAttributes(
  refs: Refs,
  tracking: ReducerTracking,
  conditions: AttributeCondition[],
) {
  for (const condition of conditions) {
    const props = refs.props;
    const attrValue =
      condition.type === "data-attribute"
        ? props?.["dataSet"]?.[condition.name]
        : props?.[condition.name];

    tracking.guards.push((nextRefs) => {
      const nextValue =
        condition.type === "data-attribute"
          ? nextRefs.props?.["dataSet"]?.[condition.name]
          : nextRefs.props?.[condition.name];

      return attrValue !== nextValue;
    });

    if (!testAttribute(attrValue, condition)) {
      return false;
    }
  }

  return true;
}

function testAttribute(propValue: any, condition: AttributeCondition) {
  const operation = condition.operation;

  if (operation == null) return propValue != null;

  switch (operation.operator) {
    /* These are non-standard operators */
    case "empty": {
      // Mostly used for detecting empty children
      return propValue == null || propValue == "";
    }
    case "truthy": {
      // Does the attribute exist with a truthy value
      return Boolean(propValue);
    }
    /* These are the standard operators */
    case "dash-match":
    case "prefix":
    case "substring":
    case "suffix":
      return false;
    case "includes":
      return propValue?.toString().includes(operation.value);
    case "equal": {
      return propValue?.toString() == operation.value;
    }
  }
}
