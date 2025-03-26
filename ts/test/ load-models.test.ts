import {loadModels} from "../src/sequelize_schema";
import {AutoIncrement, Column, DataType, Model, PrimaryKey, Table} from "sequelize-typescript";

@Table({ tableName: "email", schema: "public" })
class Email extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;
}

describe("loadModels", () => {
    it("should load models correctly for schema identifier", () => {
        const expectedOutput =  "CREATE TABLE IF NOT EXISTS `public.email` (`id` INTEGER auto_increment , `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;\n";
        const result = loadModels("mysql", [Email]);
        expect(result).toEqual(expectedOutput);
    });
});