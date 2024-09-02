import tailwindPackage from "tailwindcss/package.json";
import { TailwindCliOptions } from "./types";
import { tailwindCliV3, tailwindConfigV3 } from "./v3";

const isV3 = tailwindPackage.version.split(".")[0].includes("3");

export function tailwindCli(options: TailwindCliOptions): Promise<string> {
  if (isV3) {
    return tailwindCliV3(options);
  }

  throw new Error("NativeWind only supports Tailwind CSS v3");
}

export function tailwindConfig(path: string) {
  if (isV3) {
    return tailwindConfigV3(path);
  } else {
    throw new Error("NativeWind only supports Tailwind CSS v3");
  }
}
