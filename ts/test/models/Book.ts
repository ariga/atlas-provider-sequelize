import {
  AutoIncrement,
  Column,
  DataType,
  Model as SequelizeModel,
  PrimaryKey,
  Table,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Author } from "./Author";

@Table({ tableName: "book" })
export class Book extends SequelizeModel {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  title!: string;

  @ForeignKey(() => Author)
  @Column(DataType.INTEGER)
  authorId!: number;

  @BelongsTo(() => Author)
  author!: Author;
} 