const Sequelize = require("sequelize");
const DataTypes = require("sequelize/lib/data-types");

const validDialects = ["mysql", "postgres", "sqlite", "mariadb", "mssql"];

// gets dialect and models that are functions of the form (sequelize, DataTypes) => Model
// returns DDL string describing the models.
const loadSequelizeModels = (dialect, ...models) => {
  if (!validDialects.includes(dialect)) {
    throw new Error("invalid dialect: " + dialect);
  }
  let sequelize = new Sequelize({
    dialect: dialect,
  });
  const db = {};
  for (const model of models) {
    const m = model(sequelize, DataTypes);
    if (m?.name) {
      db[m.name] = m;
    }
  }
  // create associations between models
  for (const modelName of Object.keys(db)) {
    if (db[modelName]?.associate) {
      db[modelName].associate(db);
    }
  }
  const modelsOrdered = sequelize.modelManager
    .getModelsTopoSortedByForeignKey()
    .reverse();
  let sql = "";
  for (const model of modelsOrdered) {
    const def = sequelize.modelManager.getModel(model.name);
    const attr = sequelize
      .getQueryInterface()
      .queryGenerator.attributesToSQL(def.getAttributes(), { ...def.options });
    sql +=
      sequelize
        .getQueryInterface()
        .queryGenerator.createTableQuery(def.tableName, attr, {
          ...def.options,
        }) + "\n";

    for (const index of def.options.indexes) {
      sql +=
        sequelize
          .getQueryInterface()
          .queryGenerator.addIndexQuery(def.tableName, index) + "\n";
    }
  }
  return sql;
};

module.exports = loadSequelizeModels;
