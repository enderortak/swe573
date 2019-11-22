import { AuditableEntity } from "./base/IAuditableEntity";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { Association, HasOneGetAssociationMixin, HasManyGetAssociationsMixin } from "sequelize";
import { FieldValue, StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue } from "./FieldValue";
import { BaseEntity } from "./base/BaseEntity";
import { User } from "./User";
import { Community } from "./Community";
import { FieldType } from "./FieldType";
import { DataType } from "./DataType";

export class Post  extends BaseEntity implements AuditableEntity {

  // AuditableEntity
  public createdAt!: Date;
  public updatedAt!: Date;
  public createdById!: number;
  public updatedById!: number;
  public getOwner!: HasOneGetAssociationMixin<User>;
  public getLastUpdater!: HasOneGetAssociationMixin<User>;
  
  // Post
  public title!: string;
  public communityId!: number;
  public postTypeId!: number;
  public getCommunity!: HasOneGetAssociationMixin<Community>;
  public getPostType!: HasOneGetAssociationMixin<Post>;
  // private getStringValue!: HasManyGetAssociationsMixin<StringValue>;
  // private getIntegerValue!: HasManyGetAssociationsMixin<IntegerValue>;
  // private getFloatValue!: HasManyGetAssociationsMixin<FloatValue>;
  // private getBooleanValue!: HasManyGetAssociationsMixin<BooleanValue>;
  // private getDateTimeValue!: HasManyGetAssociationsMixin<DateTimeValue>;
  // private getBlobValue!: HasManyGetAssociationsMixin<BlobValue>;
  // public getFieldType!: HasOneGetAssociationMixin<FieldType>;
  // public async getFieldValues(): Promise<FieldValue>  {
  //   const fieldType = await this.getFieldType();
  //   return await this[`get${DataType[fieldType.dataType]}Value`]()
  // }

    // public static associations: {
    //     Comments: Association<Post, Comment>,
    //     Likes: Association<Post, Like>,
    //     FieldValues: Association<Post, FieldValue>
    //   };
}