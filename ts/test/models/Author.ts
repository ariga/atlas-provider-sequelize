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
import { Book } from "./Book";

@Table({ tableName: "author" })
export class Author extends SequelizeModel {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name!: string;

  @ForeignKey(() => Book)
  @Column(DataType.INTEGER)
  favoriteBookId?: number;

  @BelongsTo(() => Book)
  favoriteBook?: Book;
}
