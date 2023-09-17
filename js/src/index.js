#!/usr/bin/env node

const yargs = require("yargs");
const fs = require("fs");
const { hideBin } = require("yargs/helpers");
const process = require("process");
const { resolve } = require("path");
const loadSequelizeModels = require("./sequelize_schema");

// get sql state of sequelize models
const loadSQL = (relativePath, driver) => {
  if (!fs.existsSync(relativePath)) {
    throw new Error("path does not exist");
  }
  const absolutePath = resolve(relativePath);
  // get all models from files in models folder
  const files = fs.readdirSync(absolutePath);
  const models = [];
  for (const file of files) {
    if (file.match(/\.js$/) !== null && file !== "index.js") {
      const name = file.replace(".js", "");
      const m = require(absolutePath + "/" + name);
      models.push(m);
    }
  }
  return loadSequelizeModels(driver, ...models);
};

yargs(hideBin(process.argv))
  .usage(
    "npx @ariga/atlas-provider-sequelize load --path ./models --dialect mysql",
  )
  .alias("h", "help");
yargs
  .command(
    "load",
    "load sql state of sequelize models",
    {
      path: {
        type: "string",
        demandOption: true,
        describe: "Path to models folder",
      },
      dialect: {
        type: "string",
        choices: ["mysql", "postgres", "sqlite", "mariadb", "mssql"],
        demandOption: true,
        describe: "Dialect of database",
      },
    },
    function (argv) {
      try {
        console.log(loadSQL(argv.path, argv.dialect));
      } catch (e) {
        console.error(e.message);
      }
    },
  )
  .parse();
