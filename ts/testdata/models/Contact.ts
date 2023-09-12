import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DefaultScope,
  AfterCreate,
  HasMany,
  Length,
} from "sequelize-typescript";
import Phone from "./Phone";
import Email from "./Email";

@DefaultScope(() => ({
  include: [
    {
      model: Phone,
      as: Phone.tableName,
    },
    {
      model: Email,
      as: Email.tableName,
    },
  ],
  attributes: {
    exclude: ["created_at", "updated_at"],
  },
}))
@Table({ tableName: "contact" })
class Contact extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Length({ min: 3, max: 45 })
  @Column(DataType.STRING(45))
  name!: string;

  @AllowNull(false)
  @Length({ min: 3, max: 45 })
  @Column(DataType.STRING(45))
  alias!: string;

  @HasMany(() => Phone, { onDelete: "CASCADE" })
  phone!: Phone[];

  @HasMany(() => Email, { onDelete: "CASCADE" })
  email!: Email[];

  @CreatedAt
  created_at?: Date;

  @UpdatedAt
  updated_at?: Date;

  @AfterCreate
  static excludeFields(contact: Contact) {
    const { dataValues } = contact;
    delete dataValues.created_at;
    delete dataValues.updated_at;
  }
}

export default Contact;
