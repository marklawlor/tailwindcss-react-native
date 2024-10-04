import type { MetroConfig } from "metro-config";
import debugPkg from "debug";
import path from "path";
import {
  withCssInterop,
  WithCssInteropOptions,
} from "react-native-css-interop/metro";

import { cssToReactNativeRuntimeOptions } from "./common.js";
import { tailwindCli, tailwindConfig } from "./tailwind/index.js";
import { setupTypeScript } from "./typescript.js";

const { debug: debugFn } = debugPkg;

interface WithNativeWindOptions extends WithCssInteropOptions {
  input: string;
  unstable_forceVersion?: 3 | 4;
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

  const cli = tailwindCli(debug, options.unstable_forceVersion);

  if (!disableTypeScriptGeneration) {
    debug(`checking TypeScript setup`);
    setupTypeScript(typescriptEnvPath);
  }

  return withCssInterop(config, {
    ...cssToReactNativeRuntimeOptions,
    ...options,
    inlineRem,
    selectorPrefix: typeof important === "string" ? important : undefined,
    debugNamespace: "nativewind",
    input,
    processPROD: async (platform) => {
      debug(`processPROD: ${platform}`);
      const { processPROD } = await cli;
      return processPROD({
        cwd: process.cwd(),
        platform,
        input,
        browserslist,
        browserslistEnv,
      });
    },
    processDEV: async (platform, onChange) => {
      debug(`processDEV: ${platform}`);
      const { processDEV } = await cli;
      return processDEV({
        cwd: process.cwd(),
        platform,
        input,
        browserslist,
        browserslistEnv,
        onChange,
      });
    },
  });
}
