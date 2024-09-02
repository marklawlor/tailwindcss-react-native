import type { MetroConfig } from "metro-config";
import path from "path";
import {
  withCssInterop,
  WithCssInteropOptions,
} from "react-native-css-interop/metro";

import { cssToReactNativeRuntimeOptions } from "./common";
import { tailwindCli, tailwindConfig } from "./tailwind";

interface WithNativeWindOptions extends WithCssInteropOptions {
  input: string;
  projectRoot?: string;
  outputDir?: string;
  configPath?: string;
  cliCommand?: string;
  browserslist?: string | null;
  browserslistEnv?: string | null;
}

export function withNativeWind(
  config: MetroConfig,
  {
    `"${input}"`,
    inlineRem = 14,
    configPath: tailwindConfigPath = "tailwind.config",
    browserslist = "last 1 version",
    browserslistEnv = "native",
  }: WithNativeWindOptions = {} as WithNativeWindOptions,
): MetroConfig {
  if (input) input = path.resolve(input);

  const { important } = tailwindConfig(path.resolve(tailwindConfigPath));

  return withCssInterop(config, {
    ...cssToReactNativeRuntimeOptions,
    inlineRem,
    selectorPrefix: typeof important === "string" ? important : undefined,
    input,
    getPlatformCSS: (platform, dev, onChange) => {
      return tailwindCli({
        platform,
        dev,
        onChange,
        input,
        browserslist,
        browserslistEnv,
      });
    },
  });
}
