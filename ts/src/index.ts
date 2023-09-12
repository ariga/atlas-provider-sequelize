#! /usr/bin/env ts-node-script

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import path from "path";

// get sql state of sequelize models
const loadSQL = async (
  relativePath: string,
  driver: string,
): Promise<string> => {
  if (!fs.existsSync(relativePath)) {
    throw new Error("path does not exist");
  }
  const absolutePath = path.resolve(relativePath);
  const sequelize = new Sequelize({
    dialect: driver,
    models: [absolutePath + "/*.ts"],
  } as SequelizeOptions);

  const models = sequelize.modelManager
    .getModelsTopoSortedByForeignKey()
    ?.reverse();
  if (!models) {
    throw new Error("no models found");
  }
  let sql = "";
  for (const model of models) {
    const def = sequelize.modelManager.getModel(model.name);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const attr = sequelize.getQueryInterface().queryGenerator.attributesToSQL(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      def.getAttributes(),
      Object.assign({}, def.options),
    );
    sql +=
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      sequelize
        .getQueryInterface()
        .queryGenerator.createTableQuery(
          def.tableName,
          attr,
          Object.assign({}, def.options),
        ) + "\n";
  }
  return sql;
};

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
      loadSQL(argv.path, argv.dialect).then((sql) => {
        console.log(sql);
      });
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error(e);
      }
    }
  },
).parse();
