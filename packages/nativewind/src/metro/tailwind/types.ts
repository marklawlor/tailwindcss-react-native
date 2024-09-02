export interface TailwindCliOptions {
  dev: boolean;
  input: string;
  platform: string;
  browserslist?: string | null;
  browserslistEnv?: string | null;
  onChange: (css: string) => void;
}
