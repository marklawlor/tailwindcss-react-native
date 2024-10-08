/**
 * This file includes React Native type information that might not
 * be released yet. It should be removed once the types are available
 */

import { RuntimeValueDescriptor } from "test";

export type BackgroundImage = GradientValue | string;

export type GradientValue = {
  type: "linearGradient";
  // Angle or direction enums
  direction?: string;
  colorStops: Array<{
    color: string;
    positions?: Array<RuntimeValueDescriptor>;
  }>;
};
