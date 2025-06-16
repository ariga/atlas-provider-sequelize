"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSQL = exports.loadModels = exports.modelSource = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const ts_morph_1 = require("ts-morph");
const path = __importStar(require("path"));
const validDialects = ["mysql", "postgres", "sqlite", "mariadb", "mssql"];
/**
 * Returns a map of model names to their source code positions.
 * @param modelPaths - The paths to the model files.
 * @param sequelize - The Sequelize instance.
 * @returns A map of model names to their source code positions.
 */
const modelSource = (modelPaths, sequelize) => {
    const project = new ts_morph_1.Project();
    const srcMap = new Map();
    for (const mp of modelPaths) {
        const srcFile = project.addSourceFileAtPath(mp);
        for (const cl of srcFile.getClasses()) {
            const name = cl.getName();
            if (!name || !sequelize.modelManager.getModel(name))
                continue;
            srcMap.set(name, {
                filePath: path.resolve(mp),
                start: cl.getStartLineNumber(),
                end: cl.getEndLineNumber(),
            });
        }
    }
    return srcMap;
};
exports.modelSource = modelSource;
const findModelPath = (modelClass) => {
    return Object.keys(require.cache).find((filePath) => {
        const cached = require.cache[filePath];
        if (!cached || typeof cached.exports !== "object" || !cached.exports) {
            return false;
        }
        if (cached.exports === modelClass) {
            return true;
        }
        return Object.values(cached.exports).some((exportedValue) => exportedValue === modelClass);
    });
};
/**
 * Returns a map of model names to their source code positions.
 * @param models - The model classes.
 * @param sequelize - The Sequelize instance.
 * @returns A map of model names to their source code positions.
 */
const modelSourceFromClasses = (models, sequelize) => {
    const paths = new Set();
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
    return (0, exports.modelSource)(Array.from(paths), sequelize);
};
function modelToSQL(sequelize, model, dialect, withoutForeignKeyConstraints = false) {
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
    def.getAttributes(), attributesToSQLOptions);
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
            const enumValues = attr[key].substring(attr[key].indexOf("("), attr[key].lastIndexOf(")") + 1);
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
const loadModels = (dialect, models) => {
    if (!validDialects.includes(dialect)) {
        throw new Error(`Invalid dialect ${dialect}`);
    }
    const sequelize = new sequelize_typescript_1.Sequelize({
        dialect: dialect,
        models: models,
    });
    return (0, exports.loadSQL)(sequelize, dialect, modelSourceFromClasses(models, sequelize));
};
exports.loadModels = loadModels;
const loadSQL = (sequelize, dialect, srcMap) => {
    if (!validDialects.includes(dialect)) {
        throw new Error(`Invalid dialect ${dialect}`);
    }
    const orderedModels = sequelize.modelManager
        .getModelsTopoSortedByForeignKey()
        ?.map((m) => sequelize.modelManager.getModel(m.name))
        .filter((m) => !!m)
        .reverse();
    let sql = "";
    if (srcMap && srcMap.size > 0) {
        const modelsForSrcMap = orderedModels ?? sequelize.modelManager.models;
        for (const model of modelsForSrcMap) {
            const def = sequelize.modelManager.getModel(model.name);
            if (!def)
                continue;
            const tableName = def.getTableName();
            const pos = srcMap.get(model.name);
            if (!pos)
                continue;
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
        for (const model of sequelize.modelManager.models) {
            sql += modelToSQL(sequelize, model, dialect);
        }
        return sql;
    }
    // If there are circular dependencies, first create tables without foreign keys, then add them.
    for (const model of sequelize.modelManager.models) {
        sql += modelToSQL(sequelize, model, dialect, true);
    }
    const queryInterface = sequelize.getQueryInterface();
    for (const model of sequelize.modelManager.models) {
        const attributes = model.getAttributes();
        for (const key of Object.keys(attributes)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const attribute = attributes[key];
            if (!attribute.references) {
                continue;
            }
            // @ts-expect-error - queryGenerator is not in the type definition
            const query = queryInterface.queryGenerator.attributesToSQL({
                // @ts-expect-error - normalizeAttribute is not in the type definition
                [key]: queryInterface.normalizeAttribute(attribute),
            }, {
                context: "changeColumn",
                table: model.getTableName(),
            });
            // @ts-expect-error - queryGenerator is not in the type definition
            sql += queryInterface.queryGenerator.changeColumnQuery(model.getTableName(), query);
            sql += "\n";
        }
    }
    return sql;
};
exports.loadSQL = loadSQL;
