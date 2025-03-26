import { ModelCtor } from "sequelize-typescript/dist/model/model/model";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";

const validDialects = ["mysql", "postgres", "sqlite", "mariadb", "mssql"];

// load sql state of sequelize models
export const loadModels = (dialect: string, models: ModelCtor[]) => {
  if (!validDialects.includes(dialect)) {
    throw new Error(`Invalid dialect ${dialect}`);
  }
  const sequelize = new Sequelize({
    dialect: dialect,
    models: models,
  } as SequelizeOptions);
  return loadSQL(sequelize, dialect);
};

export const loadSQL = (sequelize: Sequelize, dialect: string) => {
  if (!validDialects.includes(dialect)) {
    throw new Error(`Invalid dialect ${dialect}`);
  }
  const orderedModels = sequelize.modelManager
    .getModelsTopoSortedByForeignKey()
    ?.reverse();
  if (!orderedModels) {
    throw new Error("no models found");
  }
  let sql = "";
  const queryGenerator = sequelize.getQueryInterface().queryGenerator;
  for (const model of orderedModels) {
    const def = sequelize.modelManager.getModel(model.name);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const attr = queryGenerator.attributesToSQL(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      def.getAttributes(),
      Object.assign({}, def.options),
    );
    // Remove from attr all the fields that have 'VIRTUAL' type
    // https://sequelize.org/docs/v6/core-concepts/getters-setters-virtuals/#virtual-fields
    for (const key in attr) {
      if (attr[key].startsWith("VIRTUAL")) {
        delete attr[key];
      }
    }
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      queryGenerator.createTableQuery(
        def.getTableName(),
        attr,
        Object.assign({}, def.options),
      ) + "\n";
    for (const index of def.options?.indexes ?? []) {
      sql +=
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        queryGenerator.addIndexQuery(
          def.getTableName(),
          index,
          Object.assign({}, def.options),
        ) + ";\n";
    }
  }
  return sql;
};
