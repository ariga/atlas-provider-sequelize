#! /usr/bin/env ts-node-script

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import path from "path";
import { loadSQL } from "./sequelize_schema";

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
      const sequelize = new Sequelize({
        dialect: argv.dialect,
        models: [absolutePath + "/*.ts"],
      } as SequelizeOptions);
      console.log(loadSQL(sequelize, argv.dialect));
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(e);
      }
    }
  },
).parse();
