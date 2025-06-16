import { ModelCtor } from "sequelize-typescript/dist/model/model/model";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Project } from "ts-morph";
import * as path from "path";

const validDialects = ["mysql", "postgres", "sqlite", "mariadb", "mssql"];

/**
 * Returns a map of model names to their source code positions.
 * @param modelPaths - The paths to the model files.
 * @param sequelize - The Sequelize instance.
 * @returns A map of model names to their source code positions.
 */
export const modelSource = (modelPaths: string[], sequelize: Sequelize) => {
  const project = new Project();
  const srcMap = new Map<
    string,
    { filePath: string; start: number; end: number }
  >();
  for (const mp of modelPaths) {
    const srcFile = project.addSourceFileAtPath(mp);
    for (const cl of srcFile.getClasses()) {
      const name = cl.getName();
      if (!name || !sequelize.modelManager.getModel(name)) continue;
      srcMap.set(name, {
        filePath: path.resolve(mp),
        start: cl.getStartLineNumber(),
        end: cl.getEndLineNumber(),
      });
    }
  }
  return srcMap;
};

const findModelPath = (modelClass: ModelCtor): string | undefined => {
  return Object.keys(require.cache).find((filePath) => {
    const cached = require.cache[filePath];
    if (!cached || typeof cached.exports !== "object" || !cached.exports) {
      return false;
    }
    if (cached.exports === modelClass) {
      return true;
    }
    return Object.values(cached.exports).some(
      (exportedValue) => exportedValue === modelClass,
    );
  });
};

/**
 * Returns a map of model names to their source code positions.
 * @param models - The model classes.
 * @param sequelize - The Sequelize instance.
 * @returns A map of model names to their source code positions.
 */
const modelSourceFromClasses = (models: ModelCtor[], sequelize: Sequelize) => {
  const paths = new Set<string>();
  for (const m of models) {
    let p = findModelPath(m);
    if (!p) {
      if (!require.main || !require.main.filename) {
        return undefined;
      }
      p = require.main?.filename;
    }
    paths.add(p);
  }
  return modelSource(Array.from(paths), sequelize);
};

function modelToSQL(
  sequelize: Sequelize,
  model: ModelCtor,
  dialect: string,
  withoutForeignKeyConstraints = false,
): string {
  const queryGenerator = sequelize.getQueryInterface().queryGenerator;
  const def = sequelize.modelManager.getModel(model.name);
  if (!def) {
    return "";
  }
  const options = { ...def.options };
  const attributesToSQLOptions = { ...options, withoutForeignKeyConstraints };
  let sql = "";
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const attr = queryGenerator.attributesToSQL(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    def.getAttributes(),
    attributesToSQLOptions,
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
      const enumName = `enum_${def.getTableName()}_${key}`;
      sql += `CREATE TYPE "${enumName}" AS ENUM${enumValues};\n`;
    }
  }
  sql +=
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    queryGenerator.createTableQuery(def.getTableName(), attr, options) + "\n";
  for (const index of def.options?.indexes ?? []) {
    sql +=
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      queryGenerator.addIndexQuery(def.getTableName(), index, options) + ";\n";
  }
  return sql;
}

export const loadModels = (dialect: string, models: ModelCtor[]) => {
  if (!validDialects.includes(dialect)) {
    throw new Error(`Invalid dialect ${dialect}`);
  }
  const sequelize = new Sequelize({
    dialect: dialect,
    models: models,
  } as SequelizeOptions);
  return loadSQL(sequelize, dialect, modelSourceFromClasses(models, sequelize));
};

export const loadSQL = (
  sequelize: Sequelize,
  dialect: string,
  srcMap?: Map<string, { filePath: string; start: number; end: number }>,
) => {
  if (!validDialects.includes(dialect)) {
    throw new Error(`Invalid dialect ${dialect}`);
  }
  const orderedModels = sequelize.modelManager
    .getModelsTopoSortedByForeignKey()
    ?.map((m) => sequelize.modelManager.getModel(m.name))
    .filter((m): m is ModelCtor => !!m)
    .reverse();

  let sql = "";

  if (srcMap && srcMap.size > 0) {
    const modelsForSrcMap = orderedModels ?? sequelize.modelManager.models;
    for (const model of modelsForSrcMap) {
      const def = sequelize.modelManager.getModel(model.name);
      if (!def) continue;
      const tableName = def.getTableName();
      const pos = srcMap.get(model.name);
      if (!pos) continue;
      sql += `-- atlas:pos ${tableName}[type=table] ${pos.filePath}:${pos.start}-${pos.end}\n`;
    }
    // Add extra newline to separate comments from SQL definitions
    sql += "\n";
  }

  if (orderedModels) {
    for (const model of orderedModels) {
      sql += modelToSQL(sequelize, model, dialect);
    }
    return sql;
  }

  // In SQLite, foreign key constraints are not enforced by default, so there's no need for special handling of circular dependencies.
  if (dialect === "sqlite") {
    for (const model of sequelize.modelManager.models as ModelCtor[]) {
      sql += modelToSQL(sequelize, model, dialect);
    }
    return sql;
  }
  // If there are circular dependencies, first create tables without foreign keys, then add them.
  for (const model of sequelize.modelManager.models as ModelCtor[]) {
    sql += modelToSQL(sequelize, model, dialect, true);
  }

  const queryInterface = sequelize.getQueryInterface();
  for (const model of sequelize.modelManager.models as ModelCtor[]) {
    const attributes = model.getAttributes();
    for (const key of Object.keys(attributes)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const attribute = (attributes as Record<string, any>)[key];
      if (!attribute.references) {
        continue;
      }
      // @ts-expect-error - queryGenerator is not in the type definition
      const query = queryInterface.queryGenerator.attributesToSQL(
        {
          // @ts-expect-error - normalizeAttribute is not in the type definition
          [key]: queryInterface.normalizeAttribute(attribute),
        },
        {
          context: "changeColumn",
          table: model.getTableName() as string,
        },
      );
      // @ts-expect-error - queryGenerator is not in the type definition
      sql += queryInterface.queryGenerator.changeColumnQuery(
        model.getTableName(),
        query,
      );
      sql += "\n";
    }
  }
  return sql;
};
