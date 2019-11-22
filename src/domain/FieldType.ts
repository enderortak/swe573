import { BaseEntity } from "./base/BaseEntity";
import { DataType } from "./DataType";
import { Field } from "./Field";
import { Association } from "sequelize";

export class FieldType extends BaseEntity {
    
    public name!: string;
    public dataType: DataType;
    // public static associations: {
    //     Members: Association<FieldType, Field>
    //   };
}