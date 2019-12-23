import { IAuditableEntity } from "./base/IAuditableEntity";
import { Comment } from "./Comment";
import { Like } from "./Like";
import { HasOneGetAssociationMixin, HasManyGetAssociationsMixin, Association } from "sequelize";
import { FieldValue, StringValue, IntegerValue, FloatValue, BooleanValue, DateTimeValue, BlobValue } from "./FieldValue";
import { BaseEntity } from "./base/BaseEntity";
import { User } from "./User";
import { Community } from "./Community";
import { PostType } from "./PostType";
import { DataType } from "./DataType";
import { Field } from "./Field";
import { FieldType } from "./FieldType";

export class Post extends BaseEntity implements IAuditableEntity {

  // IAuditableEntity
  public createdAt: Date;
  public updatedAt: Date;
  public createdById: number;
  public updatedById: number;
  public getOwner: HasOneGetAssociationMixin<User>;
  public getLastUpdater: HasOneGetAssociationMixin<User>;

  // Post
  public title!: string;
  public image: string;
  public tags: string;
  public communityId!: number;
  public getCommunity!: HasOneGetAssociationMixin<Community>;
  public postTypeId!: number;
  public getPostType!: HasOneGetAssociationMixin<PostType>;
  // public getFieldValues!: HasManyGetAssociationsMixin<FieldValue>;
  public getComments!: HasManyGetAssociationsMixin<Comment>;
  public getLikes!: HasManyGetAssociationsMixin<Like>;

  private getStringValues!: HasManyGetAssociationsMixin<StringValue>;
  private getIntegerValues!: HasManyGetAssociationsMixin<IntegerValue>;
  private getFloatValues!: HasManyGetAssociationsMixin<FloatValue>;
  private getBooleanValues!: HasManyGetAssociationsMixin<BooleanValue>;
  private getDateTimeValues!: HasManyGetAssociationsMixin<DateTimeValue>;
  private getBlobValues!: HasManyGetAssociationsMixin<BlobValue>;
  public async getFieldValues(): Promise<any[]> {
    const s = await this.getStringValues();
    const i = await this.getIntegerValues();
    const f = await this.getFloatValues();
    const bo = await this.getBooleanValues();
    const d = await this.getDateTimeValues();
    const bl = await this.getBlobValues();
    const fieldValues = [ ...s, ...i, ...f, ...bo, ...d, ...bl ]
    await Promise.all(fieldValues.map(async fieldValue => {
      fieldValue.dataValues.field = (await Field.findByPk(fieldValue.fieldId)).dataValues
      fieldValue.dataValues.field.fieldType = (await FieldType.findByPk(fieldValue.dataValues.field.fieldTypeId)).dataValues
    }))
    return fieldValues
  }
  
}