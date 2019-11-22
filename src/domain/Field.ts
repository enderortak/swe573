import { BaseEntity } from "./base/BaseEntity";
import { FieldType } from "./FieldType";
import { FieldValue, StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue } from "./FieldValue";
import { Association, HasManyGetAssociationsMixin, HasOneGetAssociationMixin } from "sequelize";
import { DataType } from "./DataType";
import Bluebird = require("bluebird");

export class Field extends BaseEntity {
    
    // Field
    public name!: string;
    public fieldTypeId!: number;

    private getStringValue!: HasManyGetAssociationsMixin<StringValue>;
    private getIntegerValue!: HasManyGetAssociationsMixin<IntegerValue>;
    private getFloatValue!: HasManyGetAssociationsMixin<FloatValue>;
    private getBooleanValue!: HasManyGetAssociationsMixin<BooleanValue>;
    private getDateTimeValue!: HasManyGetAssociationsMixin<DateTimeValue>;
    private getBlobValue!: HasManyGetAssociationsMixin<BlobValue>;
    public getFieldType!: HasOneGetAssociationMixin<FieldType>;
    public async getFieldValues(): Promise<FieldValue[]>  {
      const fieldType = await this.getFieldType();
      return await this["get" + DataType[fieldType.dataType] + "Value"]()
    }
}