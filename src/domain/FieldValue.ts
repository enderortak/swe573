import { BaseEntity } from "./base/BaseEntity";
import { Integer, Float } from "../types/numberTypes";
import { Post } from "./Post";
import { Field } from "./Field";
import { HasOneGetAssociationMixin } from "sequelize";

export abstract class FieldValue extends BaseEntity{
    
    public fieldId!: number;
    public getField!: HasOneGetAssociationMixin<Field>;
    public postId!: number;
    public getPost!: HasOneGetAssociationMixin<Post>;
    public value!: string | Integer | Float | boolean | Date | Blob;

}

export class StringValue extends FieldValue{    
    public value!: string;
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