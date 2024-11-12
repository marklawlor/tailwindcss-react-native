import { animationFamily } from "../globals";
import { resolveValue, type ResolveOptions } from "../resolvers";
import type { ConfigReducerState } from "../state/config";
import type { Styles } from "../styles";
import { setBaseValue } from "../utils/properties";
import type { AnimationInterpolation, SharedValueInterpolation } from "./types";

export function applyAnimation(
  state: ConfigReducerState,
  styles: Styles,
  options: ResolveOptions,
): Styles {
  const sharedValues = state.declarations?.sharedValues;
  if (!sharedValues) return styles;

  const animationNames = state.declarations?.animation?.findLast(
    (value) => "name" in value,
  )?.name;

  if (!animationNames) return styles;

  const sharedValueIO: SharedValueInterpolation[] = [];

  for (const name of animationNames) {
    if (name.type === "none") {
      continue;
    }

    const sharedValue = sharedValues.get(name.value);

    const animation = styles.get(animationFamily(name.value));
    if (!animation || !sharedValue) {
      continue;
    }

    const animationInterpolation: AnimationInterpolation[] = [];
    styles.baseStyles ??= {};
    Object.assign(styles.baseStyles, animation.baseStyles);

    for (const interpolation of animation.p) {
      const values = [];
      for (const value of interpolation[2]) {
        values.push(resolveValue(state, value, options));
      }

      animationInterpolation.push([
        interpolation[0],
        interpolation[1],
        values,
        interpolation[3],
      ] as const);
    }

    sharedValueIO.push([sharedValue, animationInterpolation]);
  }

  styles.animationIO = sharedValueIO;

  return styles;
}
