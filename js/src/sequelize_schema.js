const Sequelize = require("sequelize");
const DataTypes = require("sequelize/lib/data-types");

const validDialects = ["mysql", "postgres", "sqlite", "mariadb", "mssql"];

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
  const sortedModels = sequelize.modelManager.getModelsTopoSortedByForeignKey();
  let sql = "";
  if (sortedModels !== null) {
    for (const model of sortedModels.reverse()) {
      sql += modelToSQL(sequelize, model, dialect);
    }
    return sql;
  }
  // models have circular dependencies, so need to create table without foreign keys first, then add foreign keys
  for (const model of sequelize.modelManager.models) {
    sql += modelToSQL(sequelize, model, dialect, true);
  }
  const queryInterface = sequelize.getQueryInterface();
  for (const model of sequelize.modelManager.models) {
    // loop over the model attributes and find the foreign keys
    for (const key of Object.keys(model.getAttributes())) {
      const attribute = model.getAttributes()[key];
      if (!attribute.references) {
        continue;
      }
      const query = queryInterface.queryGenerator.attributesToSQL(
        {
          [key]: queryInterface.normalizeAttribute(attribute),
        },
        {
          context: "changeColumn",
          table: model.getTableName(),
        },
      );
      sql += queryInterface.queryGenerator.changeColumnQuery(
        model.getTableName(),
        query,
      );
      sql += "\n";
    }
  }
  return sql;
};

// returns DDL string describing single model.
function modelToSQL(sequelize, model, dialect, withOutFKs = false) {
  let sql = "";
  const def = sequelize.modelManager.getModel(model.name);
  const attr = sequelize
    .getQueryInterface()
    .queryGenerator.attributesToSQL(def.getAttributes(), {
      ...def.options,
      withoutForeignKeyConstraints: withOutFKs,
    });
  // create enum types for postgres
  if (dialect === "postgres") {
    for (const key in attr) {
      if (!attr[key].startsWith("ENUM")) {
        continue;
      }
      const enumValues = attr[key].substring(
        attr[key].indexOf("("),
        attr[key].lastIndexOf(")") + 1,
      );
      const enumName = `enum_${def.tableName}_${key}`;
      sql += `CREATE TYPE "${enumName}" AS ENUM${enumValues};\n`;
    }
  }
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
        .queryGenerator.addIndexQuery(def.tableName, index) + ";\n";
  }
  return sql;
}

module.exports = loadSequelizeModels;
