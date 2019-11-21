import { BaseEntity } from "./_BaseEntity";
import { Integer, Float } from "../types/numberTypes";
import { Post } from "./Post";
import { Field } from "./Field";
import { Association } from "sequelize";

export abstract class FieldValue extends BaseEntity{
    
    public FieldId!: number;
    public PostId!: number;
    public Post: Post;
    public Field: Field;

}

export class StringData extends FieldValue{
    
    public Value!: string;
    public static associations: {
        Post: Association<StringData, Post>,
        Field: Association<StringData, Field>
      };
}

export class IntegerData extends FieldValue{

    public Value!: Integer;
    public static associations: {
        Post: Association<IntegerData, Post>,
        Field: Association<IntegerData, Field>
      };
}

export class FloatData extends FieldValue {
    
    public Value!: Float;
    public static associations: {
        Post: Association<FloatData, Post>,
        Field: Association<FloatData, Field>
      };
}

export class BooleanData extends FieldValue {
    
    public Value!: boolean;
    public static associations: {
        Post: Association<BooleanData, Post>,
        Field: Association<BooleanData, Field>
      };
}

export class DateTimeData extends FieldValue {
    
    public Value!: Date;
    public static associations: {
        Post: Association<DateTimeData, Post>,
        Field: Association<DateTimeData, Field>
      };
}

export class BlobData extends FieldValue {

    public Value!: Blob;    
    public static associations: {
        Post: Association<BlobData, Post>,
        Field: Association<BlobData, Field>
      };
}