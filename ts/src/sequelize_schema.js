"use strict";
exports.__esModule = true;
exports.loadModels = void 0;
var sequelize_typescript_1 = require("sequelize-typescript");
var validDialects = ["mysql", "postgres", "sqlite", "mariadb", "mssql"];
// load sql state of sequelize models
var loadModels = function (dialect, models) {
    var _a;
    if (!validDialects.includes(dialect)) {
        throw new Error("Invalid dialect ".concat(dialect));
    }
    var sequelize = new sequelize_typescript_1.Sequelize({
        dialect: dialect,
        models: models
    });
    var orderedModels = (_a = sequelize.modelManager
        .getModelsTopoSortedByForeignKey()) === null || _a === void 0 ? void 0 : _a.reverse();
    if (!orderedModels) {
        throw new Error("no models found");
    }
    var sql = "";
    for (var _i = 0, orderedModels_1 = orderedModels; _i < orderedModels_1.length; _i++) {
        var model = orderedModels_1[_i];
        var def = sequelize.modelManager.getModel(model.name);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        var attr = sequelize.getQueryInterface().queryGenerator.attributesToSQL(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        def.getAttributes(), Object.assign({}, def.options));
        sql +=
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            sequelize
                .getQueryInterface()
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                .queryGenerator.createTableQuery(def.tableName, attr, Object.assign({}, def.options)) + "\n";
    }
    return sql;
};
exports.loadModels = loadModels;
