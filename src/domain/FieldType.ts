import { BaseEntity } from "./base/BaseEntity";
import { DataType } from "./DataType";
import { Field } from "./Field";
import { HasManyGetAssociationsMixin } from "sequelize";

export class FieldType extends BaseEntity {
    
    // FieldType
    public name!: string;
    public dataType: DataType;
    public getFields!: HasManyGetAssociationsMixin<Field>;

}