import tailwindPackage from "tailwindcss/package.json" with { type: "json" };
import { Debugger } from "debug";

const major = tailwindPackage.version.split(".")[0];
const v3 = major === "3";
const v4 = major === "4";

export async function tailwindCli(debug: Debugger, forceVersion?: number) {
  if ((v3 && !forceVersion) || forceVersion === 3) {
    return (await import("./v3/index.cjs")).tailwindCli(debug);
  } else if ((v4 && !forceVersion) || forceVersion === 4) {
    return (await import("./v4/index.js")).tailwindCli(debug);
  }

  throw new Error("NativeWind only supports Tailwind CSS v3 & v4");
}

export function tailwindConfig(path: string) {
  return {};
  // const config: Config = loadConfig(path);

  // const hasPreset = flattenPresets(config.presets).some((preset) => {
  //   return preset.nativewind;
  // });

  // if (!hasPreset) {
  //   throw new Error(
  //     "Tailwind CSS has not been configured with the NativeWind preset",
  //   );
  // }

  // return config;
}

// const flattenPresets = (configs: Partial<Config>[] = []): Partial<Config>[] => {
//   if (!configs) return [];
//   return configs.flatMap((config) => [
//     config,
//     ...flattenPresets(config.presets),
//   ]);
// };
