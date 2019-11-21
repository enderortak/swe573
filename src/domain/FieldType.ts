import { BaseEntity } from "./_BaseEntity";
import { DataType } from "./DataType";
import { Field } from "./Field";
import { Association } from "sequelize";

export class FieldType extends BaseEntity {
    
    public Name!: string;
    public DataType: DataType;
    public Fields?: Field[];
    public static associations: {
        Members: Association<FieldType, Field>
      };
}