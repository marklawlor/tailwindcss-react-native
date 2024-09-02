import { transformKeys } from "../shared";
import {
  RuntimeValueDescriptor,
  StyleDeclaration,
  StyleRule,
  StyleSheetRegisterCompiledOptions,
} from "../types";

export function optimizeRules(
  rules: StyleSheetRegisterCompiledOptions["rules"],
): StyleSheetRegisterCompiledOptions["rules"] {
  return rules?.map(([name, ruleSet]) => {
    let isDynamic = ruleSet.important && ruleSet.important?.length > 0;

    if (isDynamic) {
      return [name, ruleSet];
    }

    if (ruleSet.normal) {
      for (const rule of ruleSet.normal) {
        // Static styles only have $type & declarations
        if (!("declarations" in rule) || Object.keys(rules).length > 2) {
          continue;
        }
        rule.declarations = mergeStaticDeclarations(rule.declarations);
      }
    }

    return [name, ruleSet];
  });
}

/**
 * Merges static declarations into a single object
 * There maybe multiple static object if there are different target props
 * Static declarations only have 2 tokens in the path, so transform/shadows are not counted
 */
function mergeStaticDeclarations(declarations: StyleRule["declarations"]) {
  if (!declarations) {
    return;
  }

  const merged: Record<string, Record<string, any>> = {};
  const newDeclarations: StyleDeclaration[] = [];

  for (const declaration of declarations) {
    // This will never happen, as its this function that creates this type of declaration
    if (declaration.length === 2) continue;

    const [, pathTokens, value] = declaration;

    // This is a complex value
    if (typeof value === "object") {
      let shouldBeDelayed = value.delay;

      if (!shouldBeDelayed && "arguments" in value) {
        shouldBeDelayed = value.arguments.some(shouldValueBeDelayed);
      }

      if (shouldBeDelayed) {
        value.delay = true;
      }
      newDeclarations.push(declaration);
      continue;
    }

    // This is a value for a deeply nested or hoisted prop
    if (pathTokens.length !== 2) {
      newDeclarations.push(declaration);
      continue;
    }

    const [path, prop] = pathTokens;

    // Transform keys need to be set
    if (transformKeys.has(prop)) {
      newDeclarations.push(declaration);
      continue;
    }

    merged[path] ??= {};
    merged[path][prop] = value;
  }

  if (Object.keys(merged).length > 0) {
    newDeclarations.push(...Object.entries(merged));
  }

  return newDeclarations;
}

function shouldValueBeDelayed(value: RuntimeValueDescriptor) {
  if (typeof value !== "object" || !value) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some(shouldValueBeDelayed);
  }

  if (dynamicNames.has(value.name)) {
    return true;
  }

  if (value.delay) {
    return true;
  }

  if ("arguments" in value) {
    return value.arguments.some(shouldValueBeDelayed);
  }

  return value;
}

const dynamicNames = new Set(["vw"]);
