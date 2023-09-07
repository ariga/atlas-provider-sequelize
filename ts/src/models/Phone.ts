import { Table, Column, Model, PrimaryKey, ForeignKey, BelongsTo, AutoIncrement, DataType, AllowNull, CreatedAt, UpdatedAt, AfterCreate, DefaultScope, Length } from 'sequelize-typescript';

import Contact from './Contact';

@DefaultScope(() => ({
    attributes: {
        exclude: ['contact_id', 'created_at', 'updated_at']
    }
}))
@Table({ tableName: 'phone' })
class Phone extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id!: number;

    @AllowNull(false)
    @Length({ min: 3, max: 20 })
    @Column(DataType.STRING(20))
    phone!: string;

    @AllowNull(false)
    @ForeignKey(() => Contact)
    @Column(DataType.INTEGER)
    contact_id!: number;

    @BelongsTo(() => Contact)
    contact!: Contact;
    
    @CreatedAt
    created_at?: Date;

    @UpdatedAt
    updated_at?: Date;

    @AfterCreate
    static excludeFields(phone: Phone) {
        const { dataValues } = phone;
        delete dataValues.contact_id;
        delete dataValues.created_at;
        delete dataValues.updated_at;
    }
}

export default Phone;
