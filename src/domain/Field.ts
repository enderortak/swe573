import { BaseEntity } from "./_BaseEntity";
import { FieldType } from "./FieldType";
import { FieldValue, StringData, IntegerData, FloatData, BooleanData, DateTimeData, BlobData } from "./FieldValue";
import { Association, HasManyGetAssociationsMixin, HasOneGetAssociationMixin } from "sequelize";
import { DataType } from "./DataType";
import Bluebird = require("bluebird");

export class Field extends BaseEntity {
    
    public Name!: string;
    public FieldTypeId!: number;
    private getStringData!: HasManyGetAssociationsMixin<StringData>;
    private getIntegerData!: HasManyGetAssociationsMixin<IntegerData>;
    private getFloatData!: HasManyGetAssociationsMixin<FloatData>;
    private getBooleanData!: HasManyGetAssociationsMixin<BooleanData>;
    private getDateTimeData!: HasManyGetAssociationsMixin<DateTimeData>;
    private getBlobData!: HasManyGetAssociationsMixin<BlobData>;
    public getFieldType!: HasOneGetAssociationMixin<FieldType>;
    public async getValues()  {
      const fieldType = await this.getFieldType();
      const fieldValueDataType = fieldType.DataType;
      console.log("I am " + this.Name + " and my data type is" + fieldValueDataType)
      const mapping = {
        [DataType.String]: "String",
        [DataType.Integer]: "Integer",
        [DataType.Float]: "Float",
        [DataType.Boolean]: "Boolean",
        [DataType.DateTime]: "DateTime",
        [DataType.Blob]: "Blob"
      }
      console.log("I will get values using " + "get" + mapping[fieldValueDataType] + "Data" + " method")
      return await this["get" + mapping[fieldValueDataType] + "Data"]()
    }
}