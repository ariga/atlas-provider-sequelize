import { ModelCtor } from "sequelize-typescript/dist/model/model/model";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";

const validDialects = ["mysql", "postgres", "sqlite", "mariadb", "mssql"];

// load sql state of sequelize models
export const loadSequelizeModels = (dialect: string, models: ModelCtor[]) => {
  if (!validDialects.includes(dialect)) {
    throw new Error(`Invalid dialect ${dialect}`);
  }
  const sequelize = new Sequelize({
    dialect: dialect,
    models: models,
  } as SequelizeOptions);
  const orderedModels = sequelize.modelManager
    .getModelsTopoSortedByForeignKey()
    ?.reverse();
  if (!orderedModels) {
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