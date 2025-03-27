import { loadModels } from "../src/sequelize_schema";
import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";

@Table({ tableName: "email", schema: "public" })
class Email extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;
}

describe("loadModels", () => {
  it("should load models correctly for schema identifier", () => {
    const expectedOutput =
      'CREATE TABLE IF NOT EXISTS "public"."email" ("id"  SERIAL , "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, PRIMARY KEY ("id"));\n';
    const result = loadModels("postgres", [Email]);
    expect(result).toEqual(expectedOutput);
  });
});
