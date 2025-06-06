#! /usr/bin/env ts-node-script

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import path from "path";
import { loadSQL, modelSource } from "./sequelize_schema";

const y = yargs(hideBin(process.argv))
  .usage(
    "npx @ariga/ts-atlas-provider-sequelize load --path ./models --dialect mysql",
  )
  .alias("h", "help");
y.command(
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
  async function (argv) {
    try {
      if (!fs.existsSync(argv.path)) {
        console.error(`path ${argv.path} does not exist`);
        return;
      }
      const absolutePath = path.resolve(argv.path);
      const files = fs.readdirSync(absolutePath);
      const models: string[] = [];
      files.forEach((file) => {
        if (file !== "index.ts" && file.endsWith(".ts"))
          models.push(absolutePath + "/" + file);
      });
      const sequelize = new Sequelize({
        dialect: argv.dialect,
        models: models,
      } as SequelizeOptions);
      const srcMap = modelSource(models, sequelize);
      console.log(loadSQL(sequelize, argv.dialect, srcMap));
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(e);
      }
    }
  },
).parse();
