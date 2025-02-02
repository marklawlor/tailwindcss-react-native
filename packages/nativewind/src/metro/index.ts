import path from "path";

import { debug as debugFn } from "debug";
import type { MetroConfig } from "metro-config";
import {
  withCssInterop,
  WithCssInteropOptions,
} from "react-native-css-interop/metro";

import { cssToReactNativeRuntimeOptions } from "./common";
import { tailwindCli, tailwindConfig } from "./tailwind";
import { setupTypeScript } from "./typescript";

interface WithNativeWindOptions extends Partial<WithCssInteropOptions> {
  input: string;
  projectRoot?: string;
  outputDir?: string;
  configPath?: string;
  cliCommand?: string;
  browserslist?: string | null;
  browserslistEnv?: string | null;
  typescriptEnvPath?: string;
  disableTypeScriptGeneration?: boolean;
}

const debug = debugFn("nativewind");

export function withNativeWind(
  config: MetroConfig,
  {
    input,
    inlineRem = 14,
    configPath: tailwindConfigPath = "tailwind.config",
    browserslist = "last 1 version",
    browserslistEnv = "native",
    typescriptEnvPath = "nativewind-env.d.ts",
    disableTypeScriptGeneration = false,
    ...options
  }: WithNativeWindOptions = {} as WithNativeWindOptions,
): MetroConfig {
  if (input) input = path.resolve(input);

  debug(`input: ${input}`);

  const { important } = tailwindConfig(path.resolve(tailwindConfigPath));

  debug(`important: ${important}`);

  const cli = tailwindCli(debug);

  if (!disableTypeScriptGeneration) {
    debug(`checking TypeScript setup`);
    setupTypeScript(typescriptEnvPath);
  }

  return withCssInterop(config, {
    ...cssToReactNativeRuntimeOptions,
    ...options,
    inlineRem,
    selectorPrefix: typeof important === "string" ? important : undefined,
    input,
    parent: {
      name: "nativewind",
      debug: "nativewind",
    },
    getCSSForPlatform: (platform, onChange) => {
      debug(`getCSSForPlatform: ${platform}`);
      return cli.getCSSForPlatform({
        platform,
        input,
        browserslist,
        browserslistEnv,
        onChange,
      });
    },
  });
}
