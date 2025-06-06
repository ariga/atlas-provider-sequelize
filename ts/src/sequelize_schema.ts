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
      const relPath = path.relative(process.cwd(), mp).replace(/\\/g, "/");
      srcMap.set(name, {
        filePath: relPath,
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
    ?.reverse();
  if (!orderedModels) {
    throw new Error("no models found");
  }
  let sql = "";

  if (srcMap && srcMap.size > 0) {
    for (const model of orderedModels) {
      const def = sequelize.modelManager.getModel(model.name);
      const tableName = def.getTableName();
      const pos = srcMap.get(model.name);
      if (!pos) continue;
      sql += `-- atlas:pos ${tableName}[type=table] ${pos.filePath}:${pos.start}:${pos.end}\n`;
    }
    // Add extra newline to separate comments from SQL definitions
    sql += "\n";
  }

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
        const enumName = `enum_${def.getTableName()}_${key}`;
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
