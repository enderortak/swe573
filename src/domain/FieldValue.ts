import { BaseEntity } from "./base/BaseEntity";
import { Integer, Float } from "../types/numberTypes";
import { Post } from "./Post";
import { Field } from "./Field";
import { Association } from "sequelize";

export abstract class FieldValue extends BaseEntity{
    
    public fieldId!: number;
    public postId!: number;

}

export class StringData extends FieldValue{
    
    public value!: string;
    // public static associations: {
    //     Post: Association<StringData, Post>,
    //     Field: Association<StringData, Field>
    //   };
}

export class IntegerData extends FieldValue{

    public value!: Integer;
    // public static associations: {
    //     Post: Association<IntegerData, Post>,
    //     Field: Association<IntegerData, Field>
    //   };
}

export class FloatData extends FieldValue {
    
    public value!: Float;
    // public static associations: {
    //     Post: Association<FloatData, Post>,
    //     Field: Association<FloatData, Field>
    //   };
}

export class BooleanData extends FieldValue {
    
    public value!: boolean;
    // public static associations: {
    //     Post: Association<BooleanData, Post>,
    //     Field: Association<BooleanData, Field>
    //   };
}

export class DateTimeData extends FieldValue {
    
    public value!: Date;
    // public static associations: {
    //     Post: Association<DateTimeData, Post>,
    //     Field: Association<DateTimeData, Field>
    //   };
}

export class BlobData extends FieldValue {

    public value!: Blob;    
    // public static associations: {
    //     Post: Association<BlobData, Post>,
    //     Field: Association<BlobData, Field>
    //   };
}