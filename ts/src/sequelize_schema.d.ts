import { ModelCtor } from "sequelize-typescript/dist/model/model/model";
import { Sequelize } from "sequelize-typescript";
export declare const loadModels: (dialect: string, models: ModelCtor[]) => string;
export declare const loadSQL: (sequelize: Sequelize) => string;
