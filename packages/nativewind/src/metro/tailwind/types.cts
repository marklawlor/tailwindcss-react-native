import type { Debugger } from "debug";
import { Config } from "tailwindcss";

export type TailwindCliOptions = {
  cwd: string;
  input: string;
  platform: string;
  browserslist?: string | null;
  browserslistEnv?: string | null;
};

export type TailwindCliDevOptions = TailwindCliOptions & {
  onChange: (css: string) => void;
};

export type TailwindFactory = (debug: Debugger) => {
  processPROD(options: TailwindCliOptions): Promise<Buffer | string>;
  processDEV(options: TailwindCliDevOptions): Promise<Buffer | string>;
};

export type GetTailwindConfig = (path: string) => Config;
