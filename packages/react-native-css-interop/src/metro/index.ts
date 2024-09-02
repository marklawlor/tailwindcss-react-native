import connect from "connect";
import type { MetroConfig } from "metro-config";
import type MetroServer from "metro/src/Server";
import type { FileSystem } from "metro-file-map";

import { expoColorSchemeWarning } from "./expo";
import { CssToReactNativeRuntimeOptions } from "../types";
import { cssToReactNativeRuntime } from "../css-to-rn";

/**
 * Injects the CSS into the React Native runtime.
 *
 * Web:
 *  - The contexts of the input file are replaced with the result of getPlatformCSS
 *
 * Native:
 *  - The context of the input file are replaced with the compiled version of getPlatfomCSS
 */
export type WithCssInteropOptions = CssToReactNativeRuntimeOptions & {
  input: string;
  getPlatformCSS: GetPlatformCSS;
};

const getNativeJS = (data = {}, dev = false) => {
  let output = `
 "use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __inject_1 = require("react-native-css-interop/dist/runtime/native/styles");
(0, __inject_1.injectData)(${JSON.stringify(data)}); 
`;

  if (dev) {
    output += `
/**
 * This is a hack for Expo Router. It's _layout files export 'unstable_settings' which break Fast Refresh
 * Expo Router only supports Metro as a bundler
 */
if (typeof __METRO_GLOBAL_PREFIX__ !== "undefined" && global[__METRO_GLOBAL_PREFIX__ + "__ReactRefresh"]) {
  const Refresh = global[__METRO_GLOBAL_PREFIX__ + "__ReactRefresh"]
  const isLikelyComponentType = Refresh.isLikelyComponentType
  const expoRouterExports = new WeakSet()
  Object.assign(Refresh, {
    isLikelyComponentType(value) {
      if (typeof value === "object" && "unstable_settings" in value) {
        expoRouterExports.add(value.unstable_settings)
      }

      if (typeof value === "object" && "ErrorBoundary" in value) {
        expoRouterExports.add(value.ErrorBoundary)
      }

      // When ErrorBoundary is exported, the inverse dependency will also include the _ctx file. So we need to account for it as well
      if (typeof value === "object" && "ctx" in value && value.ctx.name === "metroContext") {
        expoRouterExports.add(value.ctx)
      }

      return expoRouterExports.has(value) || isLikelyComponentType(value)
    }
  })
}
`;
  }

  return Buffer.from(output);
};

let haste: any;
const virtualModules = new Map<string, Promise<Buffer>>();

export type GetPlatformCSS = (
  platform: string,
  dev: boolean,
  next: (update: string) => void,
) => Promise<string>;

export function withCssInterop(
  config: MetroConfig,
  options: WithCssInteropOptions,
): MetroConfig {
  expoColorSchemeWarning();
  const originalResolver = config.resolver?.resolveRequest;
  const originalMiddleware = config.server?.enhanceMiddleware;

  return {
    ...config,
    resolver: {
      ...config.resolver,
      sourceExts: [...(config?.resolver?.sourceExts || []), "css"],
      resolveRequest: (context, moduleName, platform) => {
        /**
         * Change the `input` import statements to point to a virtual module
         */
        platform = platform || "native";

        const resolved =
          originalResolver?.(context, moduleName, platform) ||
          context.resolveRequest(context, moduleName, platform);

        // We only care about the input file
        if (!("filePath" in resolved && resolved.filePath === options.input)) {
          return resolved;
        }

        // Generate a fake name for our virtual module. Make it platform specific
        const platformFilePath = `${resolved.filePath}.${platform}.js`;

        // Start the css processor
        initPreprocessedFile(
          platformFilePath,
          platform,
          options,
          (context as any).dev,
        );

        // Make the input file instead resolve to our virtual module
        return {
          ...resolved,
          filePath: platformFilePath,
        };
      },
    },
    server: {
      ...config.server,
      enhanceMiddleware: (middleware, metroServer) => {
        /**
         * We need to patch Metro internals to add virtual modules.
         *
         * The easiest way is through the Metro middleware, where we can
         * access the bundlers.
         */
        const server = connect();
        const bundler = metroServer.getBundler().getBundler();

        const initPromise = bundler
          .getDependencyGraph()
          .then(async (graph: any) => {
            haste = graph._haste;
            ensureFileSystemPatched(graph._fileSystem);
            ensureBundlerPatched(bundler);
          });

        // Patching is async, so we need to delay everything until all patches have been applied
        server.use(async (_, __, next) => {
          await initPromise;
          next();
        });

        return originalMiddleware
          ? server.use(originalMiddleware(middleware, metroServer))
          : server.use(middleware);
      },
    },
  };
}

async function initPreprocessedFile(
  filePath: string,
  platform: string,
  { input, getPlatformCSS, ...options }: WithCssInteropOptions,
  dev: boolean,
) {
  if (virtualModules.has(filePath)) {
    return;
  }

  virtualModules.set(
    filePath,
    getPlatformCSS(
      platform,
      dev,
      // This should only be called in development when a file changes
      (css: string) => {
        virtualModules.set(
          filePath,
          Promise.resolve(
            platform === "web"
              ? Buffer.from(css)
              : getNativeJS(cssToReactNativeRuntime(css, options), dev),
          ),
        );

        haste.emit("change", {
          eventsQueue: [
            {
              filePath,
              metadata: {
                modifiedTime: Date.now(),
                size: 1, // Can be anything
                type: "virtual", // Can be anything
              },
              type: "change",
            },
          ],
        });
      },
    ).then((css) => {
      return platform === "web"
        ? Buffer.from(css)
        : getNativeJS(cssToReactNativeRuntime(css, options), dev);
    }),
  );
}

/**
 * Patch the Metro File system to new cache virtual modules
 */
function ensureFileSystemPatched(
  fs: FileSystem & {
    getSha1: {
      __css_interop_patched?: boolean;
    };
  },
) {
  if (!fs.getSha1.__css_interop_patched) {
    const original_getSha1 = fs.getSha1.bind(fs);
    fs.getSha1 = (filename) => {
      if (virtualModules.has(filename)) {
        // Don't cache this file. It should always be fresh.
        return `${filename}-${Date.now()}`;
      }
      return original_getSha1(filename);
    };
    fs.getSha1.__css_interop_patched = true;
  }

  return fs;
}

/**
 * Patch the bundler to use virtual modules
 */
function ensureBundlerPatched(
  bundler: ReturnType<ReturnType<MetroServer["getBundler"]>["getBundler"]> & {
    transformFile: { __css_interop__patched?: boolean };
  },
) {
  if (bundler.transformFile.__css_interop__patched) {
    return;
  }

  const originalTransformFile = bundler.transformFile.bind(bundler);

  bundler.transformFile = async function (
    filePath,
    transformOptions,
    fileBuffer,
  ) {
    const virtualModule = virtualModules.get(filePath);
    if (virtualModule) {
      fileBuffer = await virtualModule;
    }

    return originalTransformFile(filePath, transformOptions, fileBuffer);
  };
  bundler.transformFile.__css_interop__patched = true;
}
