import { loadModels } from "../src/sequelize_schema";
import {
  AutoIncrement,
  Column,
  DataType,
  Model as SequelizeModel,
  PrimaryKey,
  Table,
  ForeignKey,
  BelongsTo,
  Index,
  Length,
} from "sequelize-typescript";
import * as fs from "fs";
import * as path from "path";
import { Author } from "./models/Author";
import { Book } from "./models/Book";

import { describe, it, expect } from "@jest/globals";

@Table({ tableName: "email", schema: "public" })
class Email extends SequelizeModel {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;
}

@Table({ tableName: "user" })
class User extends SequelizeModel {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Index({ name: "user_name_idx" })
  @Length({ min: 1, max: 50 })
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.ENUM("admin", "user", "guest"),
    defaultValue: "user",
  })
  role!: string;
}

@Table({ tableName: "post" })
class Post extends SequelizeModel {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  title!: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}

function readExpectedOutput(dialect: string): string {
  const filePath = path.join(__dirname, "expected", `${dialect}.sql`);
  return fs.readFileSync(filePath, "utf-8").trim();
}

const models = [Email, User, Post];
const circularModels = [Author, Book];
const dialects = ["postgres", "mysql", "mariadb", "sqlite", "mssql"];

describe("loadModels", () => {
  describe("all dialects", () => {
    dialects.forEach((dialect) => {
      it(`should generate correct SQL for ${dialect}`, () => {
        const result = replaceCwd(loadModels(dialect, models));
        const expected = readExpectedOutput(dialect);
        expect(result.trim()).toEqual(expected);
      });
    });
  });

  describe("circular foreign key dependencies", () => {
    dialects.forEach((dialect) => {
      it(`should handle circular FK dependencies for ${dialect}`, () => {
        const result = replaceCwd(loadModels(dialect, circularModels));
        const expected = readExpectedOutput(`${dialect}-fk-deps`);
        expect(result.trim()).toEqual(expected);
      });
    });
  });

  describe("Edge cases", () => {
    it("should throw error for unsupported dialect", () => {
      expect(() => {
        loadModels("oracle", [Email]);
      }).toThrow("Invalid dialect oracle");
    });

    it("should throw error for invalid dialect type", () => {
      expect(() => {
        loadModels("", [Email]);
      }).toThrow("Invalid dialect ");
    });
  });
});

function replaceCwd(text: string): string {
  const cwd = path.join(process.cwd(), path.sep);
  // Escape special characters in CWD
  const escapedCwd = cwd.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(escapedCwd, "g"), "");
}
