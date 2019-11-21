import { BaseEntity } from "./_BaseEntity";
import { FieldType } from "./FieldType";
import { FieldValue } from "./FieldValue";
import { Association } from "sequelize";

export class Field extends BaseEntity {
    
    public Name!: string;
    public FieldTypeId!: number;
    public FieldValues?: FieldValue[];
    public static associations: {
        FieldValues: Association<Field, FieldValue>,
      };
}