/**
 * This is a hack around Tailwind CSS v3, please read tailwind/v3/index.ts for more information.
 */
(async function () {
  const fs = require("fs");

  const fakeOutput = "FAKE_OUTPUT";
  let currentContents = "";

  const originalReadFile = fs.promises.readFile;
  fs.promises.readFile = async (path: string, encoding: string) => {
    if (path === fakeOutput) {
      return currentContents;
    }
    return originalReadFile(path, encoding);
  };

  const originalMkdir = fs.promises.mkdir.bind(fs.promises.mkdir);
  fs.promises.mkdir = async (path: string, ...args: any) => {
    if (path === fakeOutput) {
      return;
    }
    return originalMkdir(path, ...args);
  };

  let previousData = "";
  fs.promises.writeFile = async (
    path: string,
    data: string | Buffer,
    ...args: any
  ) => {
    if (path !== fakeOutput) {
      throw new Error(`Tailwind CLI attempted to write file ${path}`);
    }

    if (!process.send) {
      process.exit(42);
    }

    const newData = data.toString();

    if (previousData !== newData) {
      previousData = newData;
      process.send(newData);
    }

    return;
  };

  const { build } = require("tailwindcss/lib/cli/build");

  await build({
    "--input": process.env.NATIVEWIND_INPUT,
    "--output": fakeOutput,
    "--watch": process.env.NATIVEWIND_WATCH === "true",
  });
})();
