"use strict";
exports.__esModule = true;
exports.loadSQL = exports.loadModels = void 0;
var sequelize_typescript_1 = require("sequelize-typescript");
var validDialects = ["mysql", "postgres", "sqlite", "mariadb", "mssql"];
// load sql state of sequelize models
var loadModels = function (dialect, models) {
    if (!validDialects.includes(dialect)) {
        throw new Error("Invalid dialect ".concat(dialect));
    }
    var sequelize = new sequelize_typescript_1.Sequelize({
        dialect: dialect,
        models: models
    });
    return (0, exports.loadSQL)(sequelize, dialect);
};
exports.loadModels = loadModels;
var loadSQL = function (sequelize, dialect) {
    var _a, _b, _c;
    if (!validDialects.includes(dialect)) {
        throw new Error("Invalid dialect ".concat(dialect));
    }
    var orderedModels = (_a = sequelize.modelManager
        .getModelsTopoSortedByForeignKey()) === null || _a === void 0 ? void 0 : _a.reverse();
    if (!orderedModels) {
        throw new Error("no models found");
    }
    var sql = "";
    var queryGenerator = sequelize.getQueryInterface().queryGenerator;
    for (var _i = 0, orderedModels_1 = orderedModels; _i < orderedModels_1.length; _i++) {
        var model = orderedModels_1[_i];
        var def = sequelize.modelManager.getModel(model.name);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        var attr = queryGenerator.attributesToSQL(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        def.getAttributes(), Object.assign({}, def.options));
        // Remove from attr all the fields that have 'VIRTUAL' type
        // https://sequelize.org/docs/v6/core-concepts/getters-setters-virtuals/#virtual-fields
        for (var key in attr) {
            if (attr[key].startsWith("VIRTUAL")) {
                delete attr[key];
            }
        }
        // create enum types for postgres
        if (dialect === "postgres") {
            for (var key in attr) {
                if (!attr[key].startsWith("ENUM")) {
                    continue;
                }
                var enumValues = attr[key].substring(attr[key].indexOf("("), attr[key].lastIndexOf(")") + 1);
                var enumName = "enum_".concat(def.getTableName(), "_").concat(key);
                sql += "CREATE TYPE \"".concat(enumName, "\" AS ENUM").concat(enumValues, ";\n");
            }
        }
        sql +=
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            queryGenerator.createTableQuery(def.getTableName(), attr, Object.assign({}, def.options)) + "\n";
        for (var _d = 0, _e = (_c = (_b = def.options) === null || _b === void 0 ? void 0 : _b.indexes) !== null && _c !== void 0 ? _c : []; _d < _e.length; _d++) {
            var index = _e[_d];
            sql +=
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                queryGenerator.addIndexQuery(def.getTableName(), index, Object.assign({}, def.options)) + ";\n";
        }
    }
    return sql;
};
exports.loadSQL = loadSQL;
