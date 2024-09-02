import { fork } from "child_process";
import { TailwindCliOptions } from "../types";

/**
 * Tailwind CLI v3 is not very well suited for programmatic usage.
 * The recommended usage is PostCSS, but then we need to rebuild the plugin array/watcher/etc
 *
 * We also can't invoke the CLI directly as it writes to the file system/process.stdout/console.error
 * in hard to capture ways.
 *
 * Our hack is simply to fork a child process (allows us to capture the terminal output)
 * and override the fs (allows us to capture the output file)
 *
 * This is all a bad idea, but gives us full control over the output
 */

const child_file = __dirname + "/child.js";

export function tailwindCliV3(options: TailwindCliOptions) {
  return new Promise<string>((resolve, reject) => {
    try {
      const env = {
        ...process.env,
        NATIVEWIND_INPUT: options.input,
        NATIVEWIND_WATCH: `${options.dev}`,
        NATIVEWIND_NATIVE: options.platform,
        BROWSERSLIST: options.browserslist ?? undefined,
        BROWSERSLIST_ENV: options.browserslistEnv ?? undefined,
      };

      // Spawn child process
      const child = fork(child_file, { stdio: "pipe", env });

      let initialMessage = true;
      let initialDoneIn = true;

      child.stderr?.on("data", (data) => {
        data = data.toString();
        if (data.includes("Done in")) {
          if (initialDoneIn) {
            initialDoneIn = false;
          } else {
            // console.log(
            //   `Rebuilt NativeWind in ${data.replace("Done in", "").trim()}`,
            // );
          }
          return;
        } else if (data.includes("warn -")) {
          console.warn(data);
        }
      });

      child.stdout?.on("data", (data) => {
        data = data.toString();
      });

      child.on("message", (message) => {
        if (initialMessage) {
          resolve(message.toString());
          initialMessage = false;
        } else {
          options.onChange(message.toString());
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

export function tailwindConfigV3(path: string) {
  const config = require("tailwindcss/loadConfig")(path);

  const hasPreset = config.presets?.some((preset: any) => {
    return preset.nativewind;
  });

  if (!hasPreset) {
    throw new Error(
      "Tailwind CSS has not been configured with the NativeWind preset",
    );
  }

  return config;
}
