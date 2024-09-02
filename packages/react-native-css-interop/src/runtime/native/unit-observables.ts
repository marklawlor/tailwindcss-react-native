import { Dimensions } from "react-native";
import { INTERNAL_RESET, INTERNAL_SET } from "../../shared";
import { observable, Effect, ReadableObservable } from "../observable";

/**
 * rem unit value
 */
export const rem = observable(14);

export { INTERNAL_RESET } from "../../shared";

/**
 * Viewport Units
 */
const viewport = observable(Dimensions.get("window"), { name: "viewport" });
let windowEventSubscription: ReturnType<typeof Dimensions.addEventListener>;
const viewportReset = (dimensions: Dimensions) => {
  viewport.set(dimensions.get("window"));
  windowEventSubscription?.remove();
  windowEventSubscription = dimensions.addEventListener("change", (size) => {
    return viewport.set(size.window);
  });
};
viewportReset(Dimensions);

/**
 * vw and vh unit values
 */
type ViewportObservable = ReadableObservable<number> & {
  [INTERNAL_RESET]: typeof viewportReset;
  [INTERNAL_SET]: (value: number) => void;
};

export const vw: ViewportObservable = {
  get: (effect?: Effect) => viewport.get(effect).width,
  [INTERNAL_RESET]: viewportReset,
  [INTERNAL_SET](value: number) {
    const current = viewport.get();
    if (value !== current.width) {
      viewport.set({ ...current, width: value });
    }
  },
};
export const vh: ViewportObservable = {
  get: (effect?: Effect) => viewport.get(effect).height,
  [INTERNAL_RESET]: viewportReset,
  [INTERNAL_SET](value: number) {
    const current = viewport.get();
    if (value !== current.height) {
      viewport.set({ ...current, height: value });
    }
  },
};
