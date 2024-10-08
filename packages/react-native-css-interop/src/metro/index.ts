import connect from "connect";
import fs from "fs/promises";
import path from "path";
import { debug as debugFn, Debugger } from "debug";
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
 *  @expo/metro-config provides all the code needed to handle .css files
 *  This is why we can only support Expo for web projects for the time being
 *  The user will import their .css file, we need to catch this in the resolution
 *  and replace it either with the virtual module (development) or the Tailwind output (production)
 *
 * Native:
 *  When the user imports their .css file, we need to swap it out for a JavaScript file
 *  that injects the global styles. In development we swap to a virtual module and in production we
 *  swap to a .js file generated in the node_modules
 *
 * ------------------
 * Notes about CLIs
 * ------------------
 *
 * Depending on the scenario, enhanceMiddleware may not be called so Metro will not be patched
 * enhanceMiddleware is used to patch Metro for our fast-refresh, so we only need it on
 * Metro instances that will be performing the fast refresh. e.g.
 *
 * @expo/cli is run locally and will watch for file updates. It will call enhanceMiddleware
 * eas is used to build clients that can be used to connect to a @expo/cli server.
 *
 * In this instance, even if eas is doing a debug build, we build it like a production app.
 *
 * The @react-native-community/cli is similar. When running locally for a device,
 * it starts 2 instances of Metro. One to build and one to perform fast refreshes.
 *
 * So the App:
 * - starts with the production styles
 * - connects to the fast-refresh server
 * - will receive updates
 *
 * Expo
 * - @expo/cli enhanceMiddleware
 * - eas does not use
 *
 * Metro notes:
 *  - Expo uses a custom Metro server than the community CLI
 *  - @expo/cli and eas use slightly different Metro servers
 *    - eas skips the customMiddleware and the dev server is never started
 *    - expo export also skip the customMiddleware, but the dev server is started
 *  - Metro uses a virtual file system.
 *    - Metro can be configured to only react to ADD events in development
 *    - This means all files need to be present on the file system BEFORE Metro generates the file tree
 *  - Metro is undocumented. Good luck
 *
 * For these reasons we need to take multiple approaches with redundancies to ensure everything goes smoothly
 */

export type WithCssInteropOptions = CssToReactNativeRuntimeOptions & {
  input: string;
  debugNamespace?: string;
  /** Force load styles from the filesystem, used to test production style loading. Disables Fast Refresh of styles. */
  forceWriteFileSystem?: boolean;
  getCSSForPlatform: GetCSSForPlatform;
};

export type GetCSSForPlatform = (
  platform: string,
  onChange?: GetCSSForPlatformOnChange,
) => Promise<string | Buffer>;

export type GetCSSForPlatformOnChange = (platform: string) => void;

let haste: any;
let writeStyles = true;
const virtualModules = new Map<string, Promise<string | Buffer>>();
const outputDirectory = path.resolve(__dirname, "../../.cache");

export function withCssInterop(
  config: MetroConfig,
  { ...options }: WithCssInteropOptions,
): MetroConfig {
  const debug = debugFn(options.debugNamespace || "react-native-css-interop");
  options.debug = debug;
  debug("withCssInterop");
  debug(`outputDirectory ${outputDirectory}`);

  expoColorSchemeWarning();

  const originalResolver = config.resolver?.resolveRequest;
  const originalGetTransformOptions = config.transformer?.getTransformOptions;
  const originalMiddleware = config.server?.enhanceMiddleware;

  /*
   * Ensure the production files exist before Metro starts
   * Metro (or who ever is controlling Metro) will need to get the config before
   * its started, so we can generate these placeholder files to ensure that the
   * production files make it into the virtual file tree
   */
  return {
    ...config,
    transformerPath: require.resolve("./transformer"),
    transformer: {
      ...config.transformer,
      ...{
        cssInterop_transformerPath: config.transformerPath,
        cssInterop_outputDirectory: path.relative(
          process.cwd(),
          outputDirectory,
        ),
      },
      async getTransformOptions(
        entryPoints,
        transformOptions,
        getDependenciesOf,
      ) {
        // We need to write the styles to the file system if we're either building for production, or
        // we're building a standalone client and the watcher isn't enabled
        debug(`getTransformOptions.dev ${transformOptions.dev}`);
        debug(`getTransformOptions.watching ${writeStyles}`);
        debug(`getTransformOptions.writeStyles ${writeStyles}`);

        // We can skip writing to the filesystem if this instance patched Metro
        if (writeStyles) {
          const platform = transformOptions.platform || "native";
          const filePath = platformPath(platform);

          debug(`getTransformOptions.output ${filePath}`);

          const css = await options.getCSSForPlatform(platform);

          const output =
            platform === "web"
              ? css.toString("utf-8")
              : getNativeJS(cssToReactNativeRuntime(css, options), debug);

          await fs.mkdir(outputDirectory, { recursive: true });
          await fs.writeFile(filePath, output);
        }

        return (
          originalGetTransformOptions?.(
            entryPoints,
            transformOptions,
            getDependenciesOf,
          ) || {}
        );
      },
    },
    server: {
      ...config.server,
      enhanceMiddleware: (middleware, metroServer) => {
        debug(`enhanceMiddleware.setup`);
        const server = connect();
        const bundler = metroServer.getBundler().getBundler();

        if (options.forceWriteFileSystem) {
          debug(`forceWriteFileSystem true`);
        } else {
          const initPromise = bundler
            .getDependencyGraph()
            .then(async (graph: any) => {
              haste = graph._haste;
              ensureFileSystemPatched(graph._fileSystem);
              ensureBundlerPatched(bundler);
            });

          // If we patch Metro, we don't need to write the styles
          writeStyles = false;

          server.use(async (_, __, next) => {
            // Wait until the bundler patching has completed
            await initPromise;
            next();
          });
        }

        return originalMiddleware
          ? server.use(originalMiddleware(middleware, metroServer))
          : server.use(middleware);
      },
    },
    resolver: {
      ...config.resolver,
      sourceExts: [...(config?.resolver?.sourceExts || []), "css"],
      resolveRequest: (context, moduleName, platform) => {
        const resolver = originalResolver ?? context.resolveRequest;
        const resolved = resolver(context, moduleName, platform);

        // We only care about the input file, ignore everything else
        if (!("filePath" in resolved && resolved.filePath === options.input)) {
          return resolved;
        }

        platform = platform || "native";
        // Generate a fake name for our virtual module. Make it platform specific
        const filePath = platformPath(platform);

        debug(`resolveRequest.input ${resolved.filePath}`);
        debug(`resolveRequest.resolvedTo: ${filePath}`);

        if (!writeStyles) {
          startCSSProcessor(filePath, platform, options, debug);
        }

        return {
          ...resolved,
          filePath,
        };
      },
    },
  };
}

async function startCSSProcessor(
  filePath: string,
  platform: string,
  { input, getCSSForPlatform, ...options }: WithCssInteropOptions,
  debug: Debugger,
) {
  debug(`virtualModules ${filePath}`);
  debug(`virtualModules.size ${virtualModules.size}`);

  // Ensure that we only start the processor once per file
  if (virtualModules.has(filePath)) {
    return;
  }

  options = {
    cache: {
      keyframes: new Map(),
      rules: new Map(),
      rootVariables: {},
      universalVariables: {},
    },
    ...options,
  };

  virtualModules.set(
    filePath,
    getCSSForPlatform(platform, (css: string) => {
      debug(`virtualStyles.update ${platform}`);
      // Override the virtual module with the new update
      virtualModules.set(
        filePath,
        Promise.resolve(
          platform === "web"
            ? css
            : getNativeJS(cssToReactNativeRuntime(css, options), debug),
        ),
      );

      debug(`virtualStyles.emit ${platform}`);
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
    }).then((css) => {
      debug(`virtualStyles.initial ${platform}`);
      return platform === "web"
        ? css
        : getNativeJS(cssToReactNativeRuntime(css, options), debug);
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

  const transformFile = bundler.transformFile.bind(bundler);

  bundler.transformFile = async function (
    filePath,
    transformOptions,
    fileBuffer,
  ) {
    const virtualModule = virtualModules.get(filePath);

    if (virtualModule) {
      fileBuffer = Buffer.from(await virtualModule);
    }
    return transformFile(filePath, transformOptions, fileBuffer);
  };
  bundler.transformFile.__css_interop__patched = true;
}

/**
 * Convert a data structure to JavaScript.
 * The output should be similar to JSON, but without the extra characters.
 */
function stringify(data: unknown): string {
  switch (typeof data) {
    case "bigint":
    case "symbol":
    case "function":
      throw new Error(`Cannot stringify ${typeof data}`);
    case "string":
      return `"${data}"`;
    case "number":
      // Reduce to 3 decimal places
      return `${Math.round(data * 1000) / 1000}`;
    case "boolean":
      return `${data}`;
    case "undefined":
      // null is processed faster than undefined
      // JSON.stringify also converts undefined to null
      return "null";
    case "object": {
      if (data === null) {
        return "null";
      } else if (Array.isArray(data)) {
        return `[${data
          .map((value) => {
            // These values can be omitted to create a holey array
            // This is slightly slower to parse at runtime, but keeps the
            // file size smaller
            return value === null || value === undefined
              ? ""
              : stringify(value);
          })
          .join(",")}]`;
      } else {
        return `{${Object.entries(data)
          .flatMap(([key, value]) => {
            // If an object's property is undefined or null we can just skip it
            if (value === null || value === undefined) {
              return [];
            }

            // Make sure we quote strings that require quotes
            if (key.match(/[\[\]\-\/]/)) {
              key = `"${key}"`;
            }

            value = stringify(value);

            return [`${key}:${value}`];
          })
          .join(",")}}`;
      }
    }
  }
}

function getNativeJS(data = {}, debug: Debugger): string {
  debug("Start stringify");
  const output = `(${stringify(data)})`;
  debug(`Output size: ${Buffer.byteLength(output, "utf8")} bytes`);
  return output;
}

function platformPath(platform = "native") {
  return `${outputDirectory}/${platform}.${platform === "web" ? "css" : "js"}`;
}
