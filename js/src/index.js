#!/usr/bin/env node

const Sequelize = require("sequelize");
const DataTypes = require("sequelize/lib/data-types");
const yargs     = require("yargs");
const fs        = require("fs");
const {hideBin} = require("yargs/helpers");
const {resolve} = require("path");

// get sql state of sequelize models
const loadSQL = (relativePath, driver) => {
    sequelize = new Sequelize({
        dialect: driver,
    });
    if (!fs.existsSync(relativePath)) {
        throw new Error("path does not exist");
    }
    const absolutePath = resolve(relativePath)
    // get all models from files in models folder
    const files = fs.readdirSync(absolutePath);
    const db = {};
    for (const file of files) {
        if (file.match(/\.js$/) !== null && file !== 'index.js') {
            const name = file.replace('.js', '');
            const m = require(absolutePath + '/' + name)(sequelize, DataTypes);
            if (m?.name) {
                db[m.name] = m;
            }
        }
    }
    // create associations between models
    for (const modelName of Object.keys(db)) {
        if (db[modelName]?.associate) {
            db[modelName].associate(db);
        }
    }

    const models = sequelize.modelManager.getModelsTopoSortedByForeignKey().reverse();

    let sql = ""
    for (const model of models) {
        const def = sequelize.modelManager.getModel(model.name)
        const attr = sequelize.getQueryInterface().queryGenerator.attributesToSQL(
            def.getAttributes(),
            {...def.options},
        );
        sql += sequelize.getQueryInterface().queryGenerator.createTableQuery(
            def.tableName,
            attr,
            {...def.options},
        ) + "\n";
    }
    return sql
}

yargs(hideBin(process.argv)).
usage("npx @ariga/atlas-provider-sequelize load --path ./models --dialect mysql")
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
                console.log(loadSQL(argv.path, argv.dialect))
            }
            catch (e) {
                console.error(e.message)
            }
        }
    ).parse();
