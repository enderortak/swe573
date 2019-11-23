import { BaseEntity } from "./base/BaseEntity";
import { FieldType } from "./FieldType";
import { FieldValue, StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue } from "./FieldValue";
import { HasManyGetAssociationsMixin, HasOneGetAssociationMixin } from "sequelize";
import { DataType } from "./DataType";
import { PostType } from "./PostType";

export class Field extends BaseEntity {
    
    // Field
    public name!: string;
    public fieldTypeId!: number;
    public getFieldType!: HasOneGetAssociationMixin<FieldType>;
    public postTypeId!: number;
    public getPostType!: HasOneGetAssociationMixin<PostType>;
    
    private getStringValues!: HasManyGetAssociationsMixin<StringValue>;
    private getIntegerValues!: HasManyGetAssociationsMixin<IntegerValue>;
    private getFloatValues!: HasManyGetAssociationsMixin<FloatValue>;
    private getBooleanValues!: HasManyGetAssociationsMixin<BooleanValue>;
    private getDateTimeValues!: HasManyGetAssociationsMixin<DateTimeValue>;
    private getBlobValues!: HasManyGetAssociationsMixin<BlobValue>;
    public async getFieldValues(): Promise<FieldValue[]> {
      const fieldType = await this.getFieldType();
      return await this[`get${DataType[fieldType.dataType]}Values`]()
    }
}