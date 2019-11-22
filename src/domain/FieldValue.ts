import { BaseEntity } from "./base/BaseEntity";
import { Integer, Float } from "../types/numberTypes";
import { Post } from "./Post";
import { Field } from "./Field";
import { Association, HasOneGetAssociationMixin } from "sequelize";

export abstract class FieldValue extends BaseEntity{
    
    public fieldId!: number;
    public postId!: number;
    public getField!: HasOneGetAssociationMixin<Field>;
    public getPost!: HasOneGetAssociationMixin<Post>;
    public value!: String | Integer | Float | Boolean | Date | Blob;
}

export class StringValue extends FieldValue{    
    public value!: String;
}
export class IntegerValue extends FieldValue{
    public value!: Integer;
}
export class FloatValue extends FieldValue {
    public value!: Float;
}
export class BooleanValue extends FieldValue {
    public value!: boolean;
}

export class DateTimeValue extends FieldValue {
    public value!: Date;
}
export class BlobValue extends FieldValue {
    public value!: Blob;    
}