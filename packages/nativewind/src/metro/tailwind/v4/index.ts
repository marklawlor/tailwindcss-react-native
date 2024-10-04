import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "path";

import {
  TailwindCliDevOptions,
  TailwindCliOptions,
  TailwindFactory,
} from "../types.cjs";
import {
  createWatchers,
  watchDirectories,
} from "./vendor/src/commands/build/index.js";
import {
  eprintln,
  formatDuration,
  header,
  highlight,
  relative,
} from "./vendor/src/utils/renderer.js";

export const tailwindCli: TailwindFactory = function (debug) {
  return {
    async processPROD(options) {
      debug("Start production Tailwind CLI");
      return compileCSS(options);
    },
    async processDEV(options) {
      return compileCSS(options);
    },
  };
};

async function compileCSS(options: TailwindCliOptions | TailwindCliDevOptions) {
  const { compile, env } = await import("@tailwindcss/node");
  const { Scanner } = await import("@tailwindcss/oxide");
  const { clearRequireCache } = await import("@tailwindcss/node/require-cache");

  console.log("\n\n\n\n\n1\n\n\n\n");

  env.DEBUG = true;

  /**
   * Setup variables needed for the port
   */
  const args: Record<string, string> = {
    "--cwd": options.cwd,

    "--input": options.input,
  };

  /**
   * Port: https://github.com/tailwindlabs/tailwindcss/blob/0f37845a3df4b53c00d3106d88a1e1fa4a2ebd11/packages/%40tailwindcss-cli/src/commands/build/index.ts#L58-L93
   */
  let base = path.resolve(args["--cwd"]);

  // Resolve the output as an absolute path.
  if (args["--output"]) {
    args["--output"] = path.resolve(base, args["--output"]);
  }

  // Resolve the input as an absolute path. If the input is a `-`, then we don't
  // need to resolve it because this is a flag to indicate that we want to use
  // `stdin` instead.
  if (args["--input"] && args["--input"] !== "-") {
    args["--input"] = path.resolve(base, args["--input"]);

    // Ensure the provided `--input` exists.
    if (!existsSync(args["--input"])) {
      eprintln(header());
      eprintln();
      eprintln(
        `Specified input file ${highlight(relative(args["--input"]))} does not exist.`,
      );
      process.exit(1);
    }
  }

  let start = process.hrtime.bigint();

  let input = args["--input"]
    ? args["--input"] === "-"
      ? await drainStdin()
      : await fs.readFile(args["--input"], "utf-8")
    : css`
        @import "tailwindcss";
      `;

  let previous = {
    css: "",
    optimizedCss: "",
  };

  // Modified version of https://github.com/tailwindlabs/tailwindcss/blob/0f37845a3df4b53c00d3106d88a1e1fa4a2ebd11/packages/%40tailwindcss-cli/src/commands/build/index.ts#L95-L123
  async function write(css: string, args: Record<string, string>) {
    let output = css;

    // Optimize the output
    if (args["--minify"] || args["--optimize"]) {
      if (css !== previous.css) {
        env.DEBUG && console.time("[@tailwindcss/cli] Optimize CSS");
        // let optimizedCss = optimizeCss(css, {
        //   file: args["--input"] ?? "input.css",
        //   minify: args["--minify"] ?? false,
        // });
        env.DEBUG && console.timeEnd("[@tailwindcss/cli] Optimize CSS");
        previous.css = css;
        // previous.optimizedCss = optimizedCss;
        // output = optimizedCss;
      } else {
        output = previous.optimizedCss;
      }
    }

    // Write the output
    env.DEBUG && console.time("[@tailwindcss/cli] Write output");
    if (args["--output"]) {
      // await outputFile(args["--output"], output);
    } else {
      // println(output);
    }
    env.DEBUG && console.timeEnd("[@tailwindcss/cli] Write output");

    return output;
  }

  // https://github.com/tailwindlabs/tailwindcss/blob/0f37845a3df4b53c00d3106d88a1e1fa4a2ebd11/packages/%40tailwindcss-cli/src/commands/build/index.ts#L125-L148
  let inputBasePath =
    args["--input"] && args["--input"] !== "-"
      ? path.dirname(path.resolve(args["--input"]))
      : process.cwd();
  let fullRebuildPaths: string[] = [];

  async function createCompiler(css: string) {
    env.DEBUG && console.time("[@tailwindcss/cli] Setup compiler");
    let compiler = await compile(css, {
      base: inputBasePath,
      onDependency(path) {
        fullRebuildPaths.push(path);
      },
    });
    env.DEBUG && console.timeEnd("[@tailwindcss/cli] Setup compiler");
    return compiler;
  }

  // Compile the input
  let compiler = await createCompiler(input);
  let scanner = new Scanner({
    detectSources: { base },
    sources: compiler.globs,
  });

  if ("onChange" in options) {
    // https://github.com/tailwindlabs/tailwindcss/blob/0f37845a3df4b53c00d3106d88a1e1fa4a2ebd11/packages/%40tailwindcss-cli/src/commands/build/index.ts#L150-L260
    let cleanupWatchers = await createWatchers(
      watchDirectories(base, scanner),
      async function handle(files) {
        try {
          // If the only change happened to the output file, then we don't want to
          // trigger a rebuild because that will result in an infinite loop.
          // if (files.length === 1 && files[0] === args["--output"]) return;
          let changedFiles: ChangedContent[] = [];
          let rebuildStrategy: "incremental" | "full" = "incremental";
          let resolvedFullRebuildPaths = fullRebuildPaths;
          for (let file of files) {
            // If one of the changed files is related to the input CSS or JS
            // config/plugin files, then we need to do a full rebuild because
            // the theme might have changed.
            if (resolvedFullRebuildPaths.includes(file)) {
              rebuildStrategy = "full";
              // No need to check the rest of the events, because we already know we
              // need to do a full rebuild.
              break;
            }
            // Track new and updated files for incremental rebuilds.
            changedFiles.push({
              file,
              extension: path.extname(file).slice(1),
            } satisfies ChangedContent);
          }
          // Re-compile the input
          let start = process.hrtime.bigint();
          // Track the compiled CSS
          let compiledCss = "";
          // Scan the entire `base` directory for full rebuilds.
          if (rebuildStrategy === "full") {
            // Clear all watchers
            cleanupWatchers();
            // Read the new `input`.
            let input = args["--input"]
              ? args["--input"] === "-"
                ? await drainStdin()
                : await fs.readFile(args["--input"], "utf-8")
              : css`
                  @import "tailwindcss";
                `;
            clearRequireCache(resolvedFullRebuildPaths);
            fullRebuildPaths = [];
            // Create a new compiler, given the new `input`
            compiler = await createCompiler(input);
            // Re-scan the directory to get the new `candidates`
            scanner = new Scanner({
              detectSources: { base },
              sources: compiler.globs,
            });
            // Scan the directory for candidates
            env.DEBUG && console.time("[@tailwindcss/cli] Scan for candidates");
            let candidates = scanner.scan();
            env.DEBUG &&
              console.timeEnd("[@tailwindcss/cli] Scan for candidates");
            // Setup new watchers
            cleanupWatchers = await createWatchers(
              watchDirectories(base, scanner),
              handle,
            );
            // Re-compile the CSS
            env.DEBUG && console.time("[@tailwindcss/cli] Build CSS");
            compiledCss = compiler.build(candidates);
            env.DEBUG && console.timeEnd("[@tailwindcss/cli] Build CSS");
          }
          // Scan changed files only for incremental rebuilds.
          else if (rebuildStrategy === "incremental") {
            env.DEBUG && console.time("[@tailwindcss/cli] Scan for candidates");
            let newCandidates = scanner.scanFiles(changedFiles);
            env.DEBUG &&
              console.timeEnd("[@tailwindcss/cli] Scan for candidates");
            // No new candidates found which means we don't need to write to
            // disk, and can return early.
            if (newCandidates.length <= 0) {
              let end = process.hrtime.bigint();
              eprintln(`Done in ${formatDuration(end - start)}`);
              return;
            }
            env.DEBUG && console.time("[@tailwindcss/cli] Build CSS");
            compiledCss = compiler.build(newCandidates);
            env.DEBUG && console.timeEnd("[@tailwindcss/cli] Build CSS");
          }
          const output = await write(compiledCss, args);
          let end = process.hrtime.bigint();
          eprintln(`Done in ${formatDuration(end - start)}`);

          // Call the nativewind callback if the css changed
          if (output !== compiledCss) {
            options.onChange(output);
          }
        } catch (err) {
          // Catch any errors and print them to stderr, but don't exit the process
          // and keep watching.
          if (err instanceof Error) {
            eprintln(err.toString());
          }
        }
      },
    );

    process.on("end", () => {
      cleanupWatchers();
    });
  }

  // https://github.com/tailwindlabs/tailwindcss/blob/0f37845a3df4b53c00d3106d88a1e1fa4a2ebd11/packages/%40tailwindcss-cli/src/commands/build/index.ts#L275-L286
  env.DEBUG && console.time("[@tailwindcss/cli] Scan for candidates");
  let candidates = scanner.scan();
  env.DEBUG && console.timeEnd("[@tailwindcss/cli] Scan for candidates");
  env.DEBUG && console.time("[@tailwindcss/cli] Build CSS");
  let output = compiler.build(candidates);
  env.DEBUG && console.timeEnd("[@tailwindcss/cli] Build CSS");
  output = await write(output, args);

  let end = process.hrtime.bigint();
  eprintln(header());
  eprintln();
  eprintln(`Done in ${formatDuration(end - start)}`);

  console.log("------");
  console.log(output.slice(0, 500));
  console.log("------");

  return output;
}

// https://github.com/tailwindlabs/tailwindcss/blob/0f37845a3df4b53c00d3106d88a1e1fa4a2ebd11/packages/%40tailwindcss-cli/src/commands/build/index.ts#L21C1-L21C23
const css = String.raw;

interface ChangedContent {
  /** File path to the changed file */
  file?: string;
  /** Contents of the changed file */
  content?: string;
  /** File extension */
  extension: string;
}

// Stub function
async function drainStdin() {
  return "";
}
