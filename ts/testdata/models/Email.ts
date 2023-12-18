import {
  Table,
  Column,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  DataType,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  AfterCreate,
  DefaultScope,
  Is,
} from "sequelize-typescript";

import Contact from "./Contact";

const EMAIL_VALIDATION = {
  pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
  nameMaxLength: 64,
  addressMaxLength: 190,
};

enum Subscription {
  FREE = "free",
  BASIC = "basic",
  PREMIUM = "premium",
}

@DefaultScope(() => ({
  attributes: {
    exclude: ["contact_id", "created_at", "updated_at"],
  },
}))
@Table({ tableName: "email" })
class Email extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Is("ValidEmail", (value) => {
    const email = value.split("@");
    if (
      !EMAIL_VALIDATION.pattern.test(value) ||
      email[0].length > EMAIL_VALIDATION.nameMaxLength ||
      email[1].length > EMAIL_VALIDATION.addressMaxLength
    ) {
      throw new Error(`"${value}" is not a valid e-mail.`);
    }
  })
  @Column(DataType.STRING(60))
  email!: string;

  @Column({
    type: DataType.ENUM(...Object.values(Subscription)),
    defaultValue: Subscription.FREE,
  })
  subscription!: Subscription;

  @AllowNull(false)
  @ForeignKey(() => Contact)
  @Column(DataType.INTEGER)
  contact_id!: number;

  @BelongsTo(() => Contact, {
    onDelete: "CASCADE",
  })
  contact!: Contact;

  @CreatedAt
  created_at?: Date;

  @UpdatedAt
  updated_at?: Date;

  @AfterCreate
  static excludeFields(email: Email) {
    const { dataValues } = email;
    delete dataValues.contact_id;
    delete dataValues.created_at;
    delete dataValues.updated_at;
  }
}

export default Email;
