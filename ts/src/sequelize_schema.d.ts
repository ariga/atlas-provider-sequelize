import { ModelCtor } from "sequelize-typescript/dist/model/model/model";
import { Sequelize } from "sequelize-typescript";
/**
 * Returns a map of model names to their source code positions.
 * @param modelPaths - The paths to the model files.
 * @param sequelize - The Sequelize instance.
 * @returns A map of model names to their source code positions.
 */
export declare const modelSource: (modelPaths: string[], sequelize: Sequelize) => Map<string, {
    filePath: string;
    start: number;
    end: number;
}>;
export declare const loadModels: (dialect: string, models: ModelCtor[]) => string;
export declare const loadSQL: (sequelize: Sequelize, dialect: string, srcMap?: Map<string, {
    filePath: string;
    start: number;
    end: number;
}>) => string;
