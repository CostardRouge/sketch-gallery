#!/usr/bin/env node

const shell = require("child_process").execSync;
const ghpages = require("gh-pages");
const { resolve } = require("path");
const { build } = require("vite");

const [, , action, baseUrl, ...args] = process.argv;
const resolvedSources = args.map((source) => resolve(source));

console.log(`action: ${action}`);
console.log(`baseUrl: ${baseUrl}`);
console.log(`sources:\n${resolvedSources.map((source) => `\t- ${source}\n`).join("")}`);

const viteBuildDistPath = resolve(__dirname, "../dist");

const viteBuildingCommandOptions = {
  root: resolve(__dirname, ".."),
};

if ( "/" !== baseUrl ) {
  viteBuildingCommandOptions.base = `/${baseUrl}/`;
}

const viteBuildingCommand = build(viteBuildingCommandOptions);

viteBuildingCommand
  .then(() => console.log("vite build done"))
  .then(() => {
    console.log("copying sources to dist");
    shell(`cp -r ${resolvedSources.join(" ")} ${viteBuildDistPath}`);
  })
  .then(() => {
    if ( action !== 'deploy' ) {
      return
    }

    ghpages.publish(
      viteBuildDistPath,
      {
        message: "sketch-gallery publish command",
      },
      (error) =>
        error ? console.log(error) : console.log("sketch-gallery publish done")
    );
  });
